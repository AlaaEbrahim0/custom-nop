/** @type {import('tailwindcss').Config} */

// Brand colors read from the design-system.css :root tokens (RGB triplets),
// so rebranding only requires editing that one file. Opacity modifiers work
// because each token is consumed as "rgb(<triplet> / <alpha>)".
const brandVar = (shade) => `rgb(var(--color-brand-${shade}-rgb) / <alpha-value>)`;

module.exports = {
  // Scan all Razor views, JS, and theme files
  content: [
    './Views/**/*.cshtml',
    './Themes/**/*.cshtml',
    './Areas/**/*.cshtml',
    './wwwroot/js/public.*.js',
  ],

  // Don't reset - we layer on top of existing styles.css
  corePlugins: {
    preflight: false,
  },

  theme: {
    extend: {
      colors: {
        brand: {
          50:  brandVar(50),
          100: brandVar(100),
          200: brandVar(200),
          300: brandVar(300),
          400: brandVar(400),
          500: brandVar(500),  // primary accent
          600: brandVar(600),  // primary active
          700: brandVar(700),
          800: brandVar(800),
          900: brandVar(900),
        },
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        success: 'rgb(var(--color-success-rgb) / <alpha-value>)',
        danger:  'rgb(var(--color-danger-rgb) / <alpha-value>)',
        warning: 'rgb(var(--color-warning-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1rem' }],
        'sm':   ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem',     { lineHeight: '1.5rem' }],
        'lg':   ['1.125rem', { lineHeight: '1.75rem' }],
        'xl':   ['1.25rem',  { lineHeight: '1.75rem' }],
        '2xl':  ['1.5rem',   { lineHeight: '2rem' }],
        '3xl':  ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl':  ['2.25rem',  { lineHeight: '2.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'page':  '1280px',
        'prose': '72ch',
      },
      borderRadius: {
        'sm':  '0.25rem',
        DEFAULT: '0.375rem',
        'md':  '0.5rem',
        'lg':  '0.75rem',
        'xl':  '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'card':   '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.12), 0 2px 6px -1px rgba(0,0,0,0.08)',
        'header': '0 1px 0 0 rgba(0,0,0,0.08)',
        'dropdown': '0 4px 16px rgba(0,0,0,0.12)',
        'focus': '0 0 0 3px rgba(14,165,233,0.3)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      zIndex: {
        'header': '100',
        'dropdown': '200',
        'modal': '300',
        'toast': '400',
      },
    },
  },

  plugins: [],
};
