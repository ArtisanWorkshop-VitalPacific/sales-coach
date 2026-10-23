/* Generated from packages/design/tokens.json. Do not edit by hand. */
export const tokens = {
  "$description": "Sales Coach design tokens. Source of truth for web today and iOS/Android later. Run `pnpm design:build` after editing.",
  "brand": {
    "name": "Sales Coach",
    "status": "placeholder brand, pending SRV LAB review",
    "direction": "White, grey, and white glass. Palette, type sizes, radii, and shadows taken from elevenlabs.io (October 2026). Black means action. Every customer is a pearl."
  },
  "color": {
    "light": {
      "bg": "#FDFCFC",
      "bg-elevated": "#FFFFFF",
      "surface": "#FFFFFF",
      "surface-2": "#F5F3F1",
      "surface-3": "#EBE8E4",
      "ink": "#000000",
      "ink-2": "#44403B",
      "ink-3": "#777169",
      "ink-4": "#A59F97",
      "line": "rgba(0, 0, 0, 0.075)",
      "line-strong": "rgba(0, 0, 0, 0.125)",
      "accent": "#000000",
      "accent-hover": "#44403B",
      "accent-ink": "#FFFFFF",
      "accent-soft": "rgba(0, 0, 0, 0.05)",
      "positive": "#000000",
      "positive-fill": "#000000",
      "positive-soft": "rgba(0, 0, 0, 0.05)",
      "caution": "#44403B",
      "caution-fill": "#FF4704",
      "caution-soft": "rgba(255, 71, 4, 0.10)",
      "negative": "#F41A2F",
      "negative-fill": "#F41A2F",
      "negative-soft": "rgba(244, 26, 47, 0.08)",
      "glass": "rgba(255, 255, 255, 0.62)",
      "glass-strong": "rgba(253, 252, 252, 0.80)",
      "glass-edge": "rgba(255, 255, 255, 0.60)",
      "scrim": "rgba(0, 0, 0, 0.30)"
    },
    "dark": {
      "bg": "#000000",
      "bg-elevated": "#1A1917",
      "surface": "#1A1917",
      "surface-2": "#22201E",
      "surface-3": "#2E2B28",
      "ink": "#FDFCFC",
      "ink-2": "#EBE8E4",
      "ink-3": "#A59F97",
      "ink-4": "#777169",
      "line": "rgba(255, 255, 255, 0.10)",
      "line-strong": "rgba(255, 255, 255, 0.18)",
      "accent": "#FFFFFF",
      "accent-hover": "#EBE8E4",
      "accent-ink": "#000000",
      "accent-soft": "rgba(255, 255, 255, 0.10)",
      "positive": "#FFFFFF",
      "positive-fill": "#FFFFFF",
      "positive-soft": "rgba(255, 255, 255, 0.08)",
      "caution": "#EBE8E4",
      "caution-fill": "#FF4704",
      "caution-soft": "rgba(255, 71, 4, 0.16)",
      "negative": "#F41A2F",
      "negative-fill": "#F41A2F",
      "negative-soft": "rgba(244, 26, 47, 0.16)",
      "glass": "rgba(34, 32, 30, 0.58)",
      "glass-strong": "rgba(26, 25, 23, 0.80)",
      "glass-edge": "rgba(255, 255, 255, 0.08)",
      "scrim": "rgba(0, 0, 0, 0.60)"
    }
  },
  "gradient": {
    "voice": "linear-gradient(90deg, #000000 0%, #44403B 55%, #777169 100%)",
    "pearl": "radial-gradient(circle at 34% 28%, #FFFFFF 0%, #FFFFFF 8%, #F5F3F1 28%, #EBE8E4 50%, #D7D2CC 74%, #A59F97 95%, #777169 100%)",
    "sheen": "conic-gradient(from 210deg, rgba(255, 255, 255, 0) 0deg, rgba(255, 255, 255, 0.85) 60deg, rgba(215, 210, 204, 0.5) 140deg, rgba(255, 255, 255, 0) 220deg, rgba(255, 255, 255, 0.6) 300deg, rgba(255, 255, 255, 0) 360deg)",
    "ambient": "radial-gradient(60vmax 60vmax at 8% -12%, rgba(235, 232, 228, 0.95), rgba(235, 232, 228, 0) 62%), radial-gradient(50vmax 50vmax at 104% 18%, rgba(215, 210, 204, 0.55), rgba(215, 210, 204, 0) 60%), radial-gradient(70vmax 50vmax at 50% 112%, rgba(245, 243, 241, 1), rgba(245, 243, 241, 0) 62%)",
    "ambient-dark": "radial-gradient(60vmax 60vmax at 8% -12%, rgba(68, 64, 59, 0.45), rgba(68, 64, 59, 0) 62%), radial-gradient(50vmax 50vmax at 104% 18%, rgba(119, 113, 105, 0.22), rgba(119, 113, 105, 0) 60%)"
  },
  "font": {
    "display": "\"Inter Variable\", Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif",
    "text": "\"Inter Variable\", Inter, -apple-system, BlinkMacSystemFont, \"Segoe UI\", system-ui, sans-serif",
    "mono": "ui-monospace, \"SF Mono\", SFMono-Regular, Menlo, Consolas, monospace"
  },
  "type": {
    "hero": {
      "size": "clamp(42px, 6.4vw, 76px)",
      "line": "1.06",
      "tracking": "-0.022em",
      "weight": "300"
    },
    "display": {
      "size": "clamp(32px, 4.4vw, 52px)",
      "line": "1.08",
      "tracking": "-0.02em",
      "weight": "300"
    },
    "title": {
      "size": "clamp(24px, 2.4vw, 30px)",
      "line": "1.16",
      "tracking": "-0.016em",
      "weight": "400"
    },
    "headline": {
      "size": "19px",
      "line": "1.3",
      "tracking": "-0.011em",
      "weight": "500"
    },
    "body-lg": {
      "size": "19px",
      "line": "1.45",
      "tracking": "-0.011em",
      "weight": "400"
    },
    "body": {
      "size": "17px",
      "line": "1.4",
      "tracking": "-0.008em",
      "weight": "400"
    },
    "callout": {
      "size": "15px",
      "line": "1.4",
      "tracking": "-0.004em",
      "weight": "400"
    },
    "caption": {
      "size": "13px",
      "line": "1.4",
      "tracking": "0",
      "weight": "400"
    },
    "micro": {
      "size": "12px",
      "line": "1.33",
      "tracking": "0",
      "weight": "500"
    }
  },
  "radius": {
    "sm": "12px",
    "md": "16px",
    "lg": "20px",
    "xl": "28px",
    "pill": "9999px"
  },
  "space": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px",
    "20": "80px",
    "24": "96px"
  },
  "shadow": {
    "ring": "0 0 0 0.5px rgba(0, 0, 0, 0.125), 0 1px 1px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.04)",
    "card": "0 0 0 0.5px rgba(0, 0, 0, 0.075), 0 2px 4px rgba(0, 0, 0, 0.04), 0 6px 16px rgba(0, 0, 0, 0.04)",
    "float": "0 0 0 0.5px rgba(0, 0, 0, 0.075), 0 2px 4px rgba(0, 0, 0, 0.04), 0 16px 40px rgba(0, 0, 0, 0.08)",
    "edge": "inset 0 0 0 1px rgba(255, 255, 255, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.9)"
  },
  "blur": {
    "glass": "blur(24px) saturate(160%)",
    "glass-strong": "blur(32px) saturate(180%)"
  },
  "motion": {
    "ease-out": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    "ease-in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
    "fast": "180ms",
    "base": "320ms",
    "reveal": "900ms"
  },
  "layout": {
    "content": "980px",
    "wide": "1200px",
    "full": "1440px",
    "nav-height": "56px"
  }
} as const;
export type Tokens = typeof tokens;
