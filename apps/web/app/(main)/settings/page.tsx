'use client';

import { useState } from 'react';
import { Button, Card, Chip, PageHeader, Section, Segmented, Toggle } from '@/components/ui';
import { companies } from '@/lib/content';
import {
  DEFAULT_SETTINGS,
  deleteSession,
  listSessions,
  useProfile,
  useSettings,
} from '@/lib/store';
import { useCapabilities } from '@/lib/use-capabilities';

export default function SettingsPage() {
  const [profile, setProfile] = useProfile();
  const [s, set] = useSettings();
  const { caps } = useCapabilities();
  const [cleared, setCleared] = useState(false);
  return (
    <div className="mx-auto max-w-[720px]">
      <PageHeader eyebrow="Settings" title="Make it yours." />

      <Section title="You">
        <Card className="space-y-4 p-6">
          <label className="block">
            <span className="t-caption text-ink-3">First name</span>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ name: e.target.value, onboarded: true })}
              className="mt-1 w-full rounded-md border hairline bg-surface-2 px-4 py-3 text-[17px] outline-none focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="t-caption text-ink-3">Company</span>
            <select
              value={profile.companyId}
              onChange={(e) => setProfile({ companyId: e.target.value })}
              className="mt-1 w-full rounded-md border hairline bg-surface-2 py-3 pr-10 pl-4 text-[17px]"
            >
              {companies().map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <div>
            <span className="t-caption mb-2 block text-ink-3">View</span>
            <Segmented
              value={profile.role}
              onChange={(role) => setProfile({ role })}
              options={[
                { value: 'tech', label: 'Tech' },
                { value: 'manager', label: 'Manager' },
                { value: 'owner', label: 'Owner' },
              ]}
            />
          </div>
        </Card>
      </Section>

      <Section title="The call">
        <Card className="divide-y divide-line px-6">
          <Toggle
            checked={s.captions}
            onChange={(v) => set({ captions: v })}
            label="Captions"
            hint="Turn off for the most realistic practice."
          />
          <Toggle
            checked={s.inputMode === 'hands-free'}
            onChange={(v) => set({ inputMode: v ? 'hands-free' : 'push' })}
            label="Hands-free"
            hint="Listens automatically. Off means tap the mic to talk."
          />
          <Toggle
            checked={s.bargeIn}
            onChange={(v) => set({ bargeIn: v })}
            label="Let me interrupt"
            hint="Tap the mic while the customer talks to cut in. Best with headphones."
          />
          <div className="py-4">
            <div className="flex items-center justify-between">
              <span className="t-body text-ink">Pause before your turn ends</span>
              <span className="t-callout tabular-nums text-ink-3">
                {(s.endpointMs / 1000).toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min={700}
              max={2200}
              step={100}
              value={s.endpointMs}
              onChange={(e) => set({ endpointMs: Number(e.target.value) })}
              className="mt-3 w-full accent-[var(--sc-color-accent)]"
              aria-label="Pause before your turn ends"
            />
            <p className="t-caption mt-1 text-ink-3">
              Longer gives you room to think mid-sentence. Shorter feels snappier.
            </p>
          </div>
        </Card>
      </Section>

      <Section title="Voices and brains">
        <Card className="divide-y divide-line px-6">
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="t-body text-ink">Customer brain</p>
              <p className="t-caption text-ink-3">
                {caps?.brain
                  ? `Claude is on (${caps.preset}).`
                  : 'Demo engine. Add a Claude key to turn on Claude.'}
              </p>
            </div>
            <Segmented
              size="sm"
              value={s.brain}
              onChange={(v) => set({ brain: v })}
              options={[
                { value: 'auto', label: 'Best' },
                { value: 'demo', label: 'Demo' },
              ]}
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="t-body text-ink">Customer voice</p>
              <p className="t-caption text-ink-3">
                {caps?.voice
                  ? 'ElevenLabs voices are on.'
                  : 'Browser voices. Add an ElevenLabs key for real ones.'}
              </p>
            </div>
            <Segmented
              size="sm"
              value={s.voice}
              onChange={(v) => set({ voice: v })}
              options={[
                { value: 'auto', label: 'Best' },
                { value: 'browser', label: 'Browser' },
              ]}
            />
          </div>
          <div className="flex flex-wrap gap-2 py-4">
            <Chip tone={caps?.brain ? 'positive' : undefined}>
              Claude {caps?.brain ? 'on' : 'off'}
            </Chip>
            <Chip tone={caps?.voice ? 'positive' : undefined}>
              Voices {caps?.voice ? 'on' : 'off'}
            </Chip>
            {caps?.models && <Chip>Listens: {caps.models.listen}</Chip>}
            {caps?.models && <Chip>Speaks: {caps.models.speak}</Chip>}
            {caps?.models && <Chip>Coach: {caps.models.coach}</Chip>}
          </div>
        </Card>
      </Section>

      <Section title="Appearance">
        <Card className="p-6">
          <Segmented
            value={s.theme === 'dark' || s.theme === 'device' ? s.theme : 'light'}
            onChange={(theme) => set({ theme })}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'device', label: 'Match device' },
            ]}
          />
        </Card>
      </Section>

      <Section title="Your data">
        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="t-callout max-w-md text-ink-3">
            Practice calls are stored on this device. Clearing removes every call and score here.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm" onClick={() => set(DEFAULT_SETTINGS)}>
              Reset settings
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (!window.confirm('Delete every practice call on this device?')) return;
                for (const x of await listSessions()) await deleteSession(x.id);
                setCleared(true);
              }}
            >
              {cleared ? 'Cleared' : 'Clear history'}
            </Button>
          </div>
        </Card>
      </Section>
    </div>
  );
}
