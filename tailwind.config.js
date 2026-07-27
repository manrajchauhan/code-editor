/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Dark IDE Shell ──────────────────────────────────────────
        bg: {
          main: 'var(--bg-main)',
          sidebar: 'var(--bg-sidebar)',
          surface: 'var(--bg-surface)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent-primary)',
          hover: 'var(--accent-hover)',
        },
        text: {
          main: 'var(--text-main)',
          muted: 'var(--text-muted)',
          subtle: 'var(--text-subtle)',
        },

        // ── Monad Design System ─────────────────────────────────────
        parchment: 'var(--color-parchment)',
        'lake-blue': 'var(--color-lake-blue)',
        'periwinkle-mist': 'var(--color-periwinkle-mist)',
        'sky-blue': 'var(--color-sky-blue)',
        mint: 'var(--color-mint)',
        coral: 'var(--color-coral)',
        gold: 'var(--color-gold)',
        crimson: 'var(--color-crimson)',
        'off-black': 'var(--color-off-black)',
        ink: 'var(--color-ink)',
        graphite: 'var(--color-graphite)',
        smoke: 'var(--color-smoke)',
        ash: 'var(--color-ash)',
      },
      fontFamily: {
        // Dark IDE fonts
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
        // Monad editorial fonts
        'diatype-mono': ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        'editorial-serif': ['Georgia', 'ui-serif', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      },
      fontSize: {
        // Monad type scale
        'monad-caption': ['12px', { lineHeight: '1.2', letterSpacing: '-0.4px' }],
        'monad-body-sm': ['14px', { lineHeight: '1.35', letterSpacing: '-0.28px' }],
        'monad-body': ['16px', { lineHeight: '1.35', letterSpacing: '-0.4px' }],
        'monad-label': ['18px', { lineHeight: '1.2', letterSpacing: '-0.4px' }],
        'monad-body-lg': ['20px', { lineHeight: '1.35', letterSpacing: '-0.4px' }],
        'monad-subheading': ['24px', { lineHeight: '1.2', letterSpacing: '-0.48px' }],
        'monad-heading-sm': ['32px', { lineHeight: '1.2', letterSpacing: '-0.64px' }],
        'monad-heading': ['40px', { lineHeight: '1.2', letterSpacing: '-0.8px' }],
        'monad-heading-lg': ['48px', { lineHeight: '1.2', letterSpacing: '-0.96px' }],
        'monad-display': ['80px', { lineHeight: '1.2', letterSpacing: '-1.6px' }],
      },
      borderRadius: {
        // Monad shapes
        'monad-tag': '9999px',
        'monad-card': '40px',
        'monad-pill': '9999px',
        'monad-btn': '100px',
      },
      spacing: {
        // Monad spacing scale
        'monad-8': '8px',
        'monad-16': '16px',
        'monad-24': '24px',
        'monad-32': '32px',
        'monad-40': '40px',
        'monad-64': '64px',
        'monad-72': '72px',
        'monad-80': '80px',
        'monad-200': '200px',
        'monad-216': '216px',
      },
      boxShadow: {
        'monad-md': 'rgba(0, 0, 0, 0.1) 0px 0px 10px 0px',
      },
      maxWidth: {
        'monad-page': '1432px',
      },
    },
  },
  plugins: [],
};
