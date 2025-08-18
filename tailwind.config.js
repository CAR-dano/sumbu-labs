/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			roboto: [
  				'var(--font-roboto)',
  				'sans-serif'
  			],
  			rubik: [
  				'var(--font-rubik)',
  				'sans-serif'
  			]
  		},
  		colors: {
  			backgroundprimary: '#010A17',
  			backgroundsecondary: '#0A1320',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		animation: {
  			'gradient-shift': 'gradientShift 3s ease-in-out infinite',
  			'text-pulse': 'textPulse 2s ease-in-out infinite',
  			'float-slow': 'floatSlow 6s ease-in-out infinite',
  			'slide-in-up': 'slideInUp 0.6s ease-out',
  			'fade-in-scale': 'fadeInScale 0.8s ease-out',
  			'enhanced-bounce': 'enhancedBounce 1.4s infinite'
  		},
  		keyframes: {
  			gradientShift: {
  				'0%, 100%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				}
  			},
  			textPulse: {
  				'0%, 100%': {
  					filter: 'brightness(1) drop-shadow(0 0 10px rgba(170, 106, 254, 0.3))'
  				},
  				'50%': {
  					filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(170, 106, 254, 0.6))'
  				}
  			},
  			floatSlow: {
  				'0%, 100%': {
  					transform: 'translateY(0px) translateX(0px)',
  					opacity: '0.3'
  				},
  				'25%': {
  					transform: 'translateY(-10px) translateX(5px)',
  					opacity: '0.6'
  				},
  				'50%': {
  					transform: 'translateY(-5px) translateX(-3px)',
  					opacity: '0.4'
  				},
  				'75%': {
  					transform: 'translateY(-15px) translateX(8px)',
  					opacity: '0.7'
  				}
  			},
  			slideInUp: {
  				from: {
  					transform: 'translateY(30px)',
  					opacity: '0'
  				},
  				to: {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			fadeInScale: {
  				from: {
  					transform: 'scale(0.9)',
  					opacity: '0'
  				},
  				to: {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			enhancedBounce: {
  				'0%, 20%, 53%, 80%, 100%': {
  					transform: 'translateY(0) scale(1)'
  				},
  				'40%, 43%': {
  					transform: 'translateY(-15px) scale(1.1)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
