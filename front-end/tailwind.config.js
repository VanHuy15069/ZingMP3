/** @type {import('tailwindcss').Config} */
import logoLg from './src/Image/MusicStudioLG.png';
import logoIcon from './src/Image/MAINLOGO.png';
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        // 'logo-lg': "url('http://localhost:5173/src/Image/MusicStudioLG.png')",
        // logo: "url('http://localhost:5173/src/Image/MAINLOGO.png')",
        'logo-lg': `url('${logoLg}')`,
        logo: `url('${logoIcon}')`,
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
        full45: 'calc(100% + 54px)',
      },
    },
    screens: {
      tablet: '640px',
      laptop: '1130px',
    },
  },
  plugins: [],
};
