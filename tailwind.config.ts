import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        wedding: {
          white: 'hsl(var(--wedding-white))',
          pink: 'hsl(var(--wedding-pink))',
          blush: 'hsl(var(--wedding-blush))',
          rose: 'hsl(var(--wedding-rose))',
          green: 'hsl(var(--wedding-green))',
          sage: 'hsl(var(--wedding-sage))',
          charcoal: 'hsl(var(--wedding-charcoal))',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fly-right': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'translate(40vw, -20vh) rotate(-15deg)', opacity: '0.8' },
          '100%': { transform: 'translate(100vw, -40vh) rotate(-30deg)', opacity: '0' },
        },
        'fly-left': {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'translate(-40vw, -25vh) rotate(15deg)', opacity: '0.8' },
          '100%': { transform: 'translate(-100vw, -50vh) rotate(30deg)', opacity: '0' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'seal-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 20px rgba(200, 175, 120, 0.25)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 6px 30px rgba(200, 175, 120, 0.4)' },
        },
        'envelope-open': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-180deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'garland-sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fly-right': 'fly-right 2s ease-in-out forwards',
        'fly-left': 'fly-left 2s ease-in-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in': 'fade-in 1s ease-out forwards',
        'seal-pulse': 'seal-pulse 3s ease-in-out infinite',
        'envelope-open': 'envelope-open 1s ease-in-out forwards',
        'slide-up': 'slide-up 1s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'garland-sway': 'garland-sway 4s ease-in-out infinite',
      },
    },
  },
  plugins: [
    ...(function () {
      try {
        return [require('tailwindcss-animate')]
      } catch {
        return []
      }
    })(),
  ],
}
export default config
