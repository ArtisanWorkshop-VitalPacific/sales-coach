/* Generated from packages/design/tokens.json. Do not edit by hand. */
export const tokens = {
  "$description": "Sales Coach design tokens. Source of truth for web today and iOS/Android later. Run `pnpm design:build` after editing.",
  "brand": {
    "name": "Sales Coach",
    "status": "placeholder brand, pending SRV LAB review"
  },
  "color": {
    "light": {
      "bg": "#F5F5F7",
      "bg-elevated": "#FFFFFF",
      "surface": "#FFFFFF",
      "surface-2": "#FBFBFD",
      "surface-3": "#E8E8ED",
      "ink": "#1D1D1F",
      "ink-2": "#424245",
      "ink-3": "#6E6E73",
      "ink-4": "#86868B",
      "line": "rgba(0, 0, 0, 0.08)",
      "line-strong": "rgba(0, 0, 0, 0.16)",
      "accent": "#0071E3",
      "accent-hover": "#0077ED",
      "accent-ink": "#FFFFFF",
      "accent-soft": "rgba(0, 113, 227, 0.10)",
      "positive": "#248A3D",
      "positive-fill": "#34C759",
      "positive-soft": "rgba(52, 199, 89, 0.14)",
      "caution": "#B25000",
      "caution-fill": "#FF9F0A",
      "caution-soft": "rgba(255, 159, 10, 0.16)",
      "negative": "#D70015",
      "negative-fill": "#FF3B30",
      "negative-soft": "rgba(255, 59, 48, 0.12)",
      "glass": "rgba(255, 255, 255, 0.72)",
      "scrim": "rgba(0, 0, 0, 0.40)"
    },
    "dark": {
      "bg": "#000000",
      "bg-elevated": "#161617",
      "surface": "#1D1D1F",
      "surface-2": "#2C2C2E",
      "surface-3": "#3A3A3C",
      "ink": "#F5F5F7",
      "ink-2": "#D2D2D7",
      "ink-3": "#A1A1A6",
      "ink-4": "#86868B",
      "line": "rgba(255, 255, 255, 0.10)",
      "line-strong": "rgba(255, 255, 255, 0.20)",
      "accent": "#2997FF",
      "accent-hover": "#47A6FF",
      "accent-ink": "#FFFFFF",
      "accent-soft": "rgba(41, 151, 255, 0.16)",
      "positive": "#30D158",
      "positive-fill": "#30D158",
      "positive-soft": "rgba(48, 209, 88, 0.16)",
      "caution": "#FFB340",
      "caution-fill": "#FF9F0A",
      "caution-soft": "rgba(255, 159, 10, 0.18)",
      "negative": "#FF6961",
      "negative-fill": "#FF453A",
      "negative-soft": "rgba(255, 69, 58, 0.16)",
      "glass": "rgba(22, 22, 23, 0.72)",
      "scrim": "rgba(0, 0, 0, 0.60)"
    }
  },
  "gradient": {
    "voice": "linear-gradient(90deg, #F1CEFF 0%, #C8A0FF 33%, #9B7EFF 66%, #7AB8FF 100%)",
    "voice-radial": "radial-gradient(circle at 30% 30%, #F1CEFF 0%, #C8A0FF 30%, #9B7EFF 60%, #7AB8FF 100%)",
    "coach": "linear-gradient(90deg, #FFD7A8 0%, #FFB37A 50%, #FF8A65 100%)"
  },
  "font": {
    "display": "-apple-system, BlinkMacSystemFont, \"SF Pro Display\", \"Segoe UI Variable Display\", system-ui, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "text": "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI Variable Text\", system-ui, \"Helvetica Neue\", Helvetica, Arial, sans-serif",
    "mono": "ui-monospace, \"SF Mono\", SFMono-Regular, Menlo, Consolas, monospace"
  },
  "type": {
    "hero": {
      "size": "clamp(44px, 7vw, 80px)",
      "line": "1.05",
      "tracking": "-0.035em",
      "weight": "700"
    },
    "display": {
      "size": "clamp(32px, 4.6vw, 56px)",
      "line": "1.07",
      "tracking": "-0.028em",
      "weight": "700"
    },
    "title": {
      "size": "clamp(24px, 2.6vw, 32px)",
      "line": "1.12",
      "tracking": "-0.02em",
      "weight": "650"
    },
    "headline": {
      "size": "21px",
      "line": "1.24",
      "tracking": "-0.012em",
      "weight": "600"
    },
    "body-lg": {
      "size": "19px",
      "line": "1.42",
      "tracking": "-0.006em",
      "weight": "400"
    },
    "body": {
      "size": "17px",
      "line": "1.47",
      "tracking": "-0.022em",
      "weight": "400"
    },
    "callout": {
      "size": "15px",
      "line": "1.4",
      "tracking": "-0.01em",
      "weight": "400"
    },
    "caption": {
      "size": "13px",
      "line": "1.38",
      "tracking": "-0.005em",
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
    "sm": "10px",
    "md": "14px",
    "lg": "22px",
    "xl": "28px",
    "pill": "980px"
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
    "card": "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 28px rgba(0, 0, 0, 0.06)",
    "float": "0 2px 6px rgba(0, 0, 0, 0.06), 0 24px 60px rgba(0, 0, 0, 0.14)"
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
    "nav-height": "52px"
  }
} as const;
export type Tokens = typeof tokens;
