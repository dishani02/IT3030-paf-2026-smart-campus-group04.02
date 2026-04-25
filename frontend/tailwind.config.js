/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                primary: '#519dd2',
                secondary: '#ad9ddf',
                'brand-blue': {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                'brand-black': '#000000',
                'brand-white': '#ffffff',
                campus: {
                    dark: '#000000',
                    card: '#ffffff',
                    border: '#e2e8f0',
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'floatSlow 8s ease-in-out infinite',
                'slide-up-slow': 'slideUpSlow 0.8s ease-out',
            },
            keyframes: {
                fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
                slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
                slideIn: { from: { opacity: 0, transform: 'translateX(-10px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
                float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
                floatSlow: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
                slideUpSlow: { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-app': 'linear-gradient(45deg, #519dd2 0.000%, #50a0d6 5.000%, #50a3da 10.000%, #51a6dd 15.000%, #52a8e1 20.000%, #55aae4 25.000%, #58ace6 30.000%, #5bade9 35.000%, #60aeeb 40.000%, #65afec 45.000%, #6aafed 50.000%, #70afee 55.000%, #76aeee 60.000%, #7daded 65.000%, #84aced 70.000%, #8baaeb 75.000%, #92a8ea 80.000%, #99a5e7 85.000%, #a0a3e5 90.000%, #a7a0e2 95.000%, #ad9ddf 100.000%)',
            },
            boxShadow: {
                'glow': '0 0 20px rgba(160, 175, 224, 0.35)',
                'glow-lg': '0 0 40px rgba(99,102,241,0.3)',
                'card': '0 1px 3px rgba(52, 42, 109, 0.12), 0 1px 2px rgba(0,0,0,0.08)',
                'card-hover': '0 10px 40px rgba(0,0,0,0.2)',
            },
        },
    },
    plugins: [],
}
