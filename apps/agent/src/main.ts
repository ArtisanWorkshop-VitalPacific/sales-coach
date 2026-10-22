/**
 * Live mode worker. A LiveKit agent that plays the customer over WebRTC.
 *
 *   pnpm agent:dev      (needs LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET,
 *                        DEEPGRAM_API_KEY, ELEVENLABS_API_KEY, ANTHROPIC_API_KEY)
 *
 * Pipeline: Silero VAD + LiveKit turn detector + Deepgram nova-3 hear the tech. The engine
 * (Claude perceiver and writer, standard preset) decides and words the customer's reply.
 * ElevenLabs speaks it. There is no LLM node in the voice pipeline.
 */
import { fileURLToPath } from 'node:url';
import {
  cli,
  defineAgent,
  type JobContext,
  type JobProcess,
  type VAD,
  voice,
  WorkerOptions,
} from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as elevenlabs from '@livekit/agents-plugin-elevenlabs';
import * as livekit from '@livekit/agents-plugin-livekit';
import * as silero from '@livekit/agents-plugin-silero';
import { contentIndex } from '@sales-coach/content';
import {
  CustomerSession,
  HeuristicPerceiver,
  type LineWriter,
  type Perceiver,
  ScriptedWriter,
} from '@sales-coach/engine';
import { CustomerAgent, CustomerBridge } from './customer';
import { readRequest } from './request';

const DEFAULT_MODEL = 'eleven_v4_turbo';
/** ElevenLabs premade voices, used until a persona has its own voice id. */
const DEFAULT_VOICES = {
  female: process.env.ELEVENLABS_DEFAULT_VOICE_FEMALE || '21m00Tcm4TlvDq8ikWAM',
  male: process.env.ELEVENLABS_DEFAULT_VOICE_MALE || 'pNInz6obpgDQGcFmaJgB',
} as const;

type ProcData = { vad?: VAD };

/** Claude when a key is present; otherwise the scripted engine, so a call never goes silent. */
async function adapters(): Promise<{
  perceiver: Perceiver;
  writer: LineWriter;
  perceiveBudgetMs?: number;
}> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[agent] ANTHROPIC_API_KEY is not set. Using the scripted customer.');
    return { perceiver: new HeuristicPerceiver(), writer: new ScriptedWriter() };
  }
  const { claudeAdapters, presetFromEnv, PERCEIVE_BUDGET_MS } = await import(
    '@sales-coach/engine/claude'
  );
  const claude = claudeAdapters({
    preset: presetFromEnv(process.env.SALES_COACH_PRESET ?? process.env.CLAUDE_PRESET),
  });
  return {
    perceiver: claude.perceiver,
    writer: claude.writer,
    perceiveBudgetMs: PERCEIVE_BUDGET_MS,
  };
}

export default defineAgent({
  prewarm: async (proc: JobProcess<ProcData>) => {
    proc.userData.vad = await silero.VAD.load();
  },

  entry: async (ctx: JobContext<ProcData>) => {
    await ctx.connect();
    const participant = await ctx.waitForParticipant();
    const index = contentIndex();
    const request = readRequest([ctx.job.metadata, ctx.room.metadata, participant.metadata], index);

    const engine = new CustomerSession(request, { index, ...(await adapters()) });
    const persona = engine.spec.persona;
    const model = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL;
    const language = persona.language === 'es' ? 'es' : 'en';

    const customerTts = new elevenlabs.TTS({
      model,
      voiceId: persona.voice.elevenlabsVoiceId || DEFAULT_VOICES[persona.voice.gender],
      language,
    });
    const secondary = persona.secondary;
    const secondaryTts = secondary
      ? new elevenlabs.TTS({
          model,
          voiceId: secondary.voice.elevenlabsVoiceId || DEFAULT_VOICES[secondary.voice.gender],
          language,
        })
      : null;

    const bridge = new CustomerBridge({
      engine,
      ctx,
      ttsSupportsTags: /^eleven_v[3-9]/.test(model),
      secondaryTts,
      appSessionId: request.appSessionId,
    });

    const session = new voice.AgentSession({
      vad: ctx.proc.userData.vad ?? (await silero.VAD.load()),
      // Spanish-speaking personas often get Spanish and English in the same call.
      stt: new deepgram.STT({
        model: 'nova-3',
        language: persona.language === 'es' ? 'multi' : 'en-US',
      }),
      tts: customerTts,
      turnHandling: { turnDetection: new livekit.turnDetector.MultilingualModel() },
      // The tech going quiet is part of the practice (holding silence). Never mark them away.
      userAwayTimeout: null,
    });
    bridge.attach(session);
    // The web client ends the call with a 'control' message, then waits for the record.
    const decoder = new TextDecoder();
    ctx.room.on(
      'dataReceived',
      (payload: Uint8Array, _from?: unknown, _kind?: unknown, topic?: string) => {
        if (topic !== 'control') return;
        try {
          const msg = JSON.parse(decoder.decode(payload)) as { type?: string };
          if (msg.type === 'end') void bridge.finish('tech-ended');
        } catch {
          // Ignore anything that is not ours.
        }
      },
    );
    ctx.addShutdownCallback(async () => {
      await bridge.finish('shutdown');
    });

    await session.start({ agent: new CustomerAgent(bridge), room: ctx.room });
    console.log(
      `[agent] ${engine.id}: ${engine.spec.scenario.id} with ${persona.id} at difficulty ${engine.spec.difficulty}`,
    );
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
