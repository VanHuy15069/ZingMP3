/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        logo: "url('http://localhost:5173/src/Image/logo-dark.svg')",
      },
      colors: {
        'bg-primary': '#170f23',
        'purple-primary': '#9b4de0',
        'border-primary': 'hsla(0,0%,100%,0.1)',
        alpha: 'hsla(0,0%,100%,0.5)',
        'purple-hover': '#c273ed',
        'overlay-hover': 'hsla(0, 0%, 100%, 0.3);',
        'alpha-primary': '#34224f',
        'second-text': 'rgba(254, 255, 255, 0.6)',
        'text-err': '#ff4d4f',
      },
      padding: {
        full45: 'calc(100% + 45px)',
      },
    },
  },
  plugins: [],
};
