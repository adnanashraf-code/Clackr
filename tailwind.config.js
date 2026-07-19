/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        clackr: {
          bg: 'var(--bg-color)',
          fg: 'var(--fg-color)',
          muted: 'var(--fg-muted)',
          correct: 'var(--correct)',
          error: 'var(--error)',
          accent: 'var(--accent)',
          untyped: 'var(--untyped)',
        }
      }
    },
  },
  plugins: [],
}
