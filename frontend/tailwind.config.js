/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        'base': {
          purple: {
            DEFAULT: '#8B5CF6',
            light: '#A78BFA',
            dark: '#6D28D9',
          },
          blue: {
            DEFAULT: '#3B82F6',
            light: '#60A5FA',
            dark: '#1E40AF',
          },
          dark: {
            DEFAULT: '#000000',
            card: '#0D1117',
            lighter: '#161B22',
          },
          accent: {
            purple: '#B392F0',
            blue: '#79C0FF',
            cyan: '#56D4DD',
          },
        },
      },
      backgroundImage: {
        'gradient-purple-blue': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #6D28D9 100%)',
        'gradient-blue-purple': 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 30%, #8B5CF6 70%, #6D28D9 100%)',
        'glow-radial': 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 70%)',
      },
      boxShadow: {
        'glow-blue': '0 0 40px rgba(59, 130, 246, 0.4), 0 0 80px rgba(59, 130, 246, 0.2)',
        'glow-purple': '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.2)',
        'glow-mixed': '0 0 40px rgba(59, 130, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.3)',
      },
    },
  },
  plugins: [],
}