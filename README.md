# Sumbu Labs 🚀

**Aligning Your Ideas Across Every Axis**

A modern, interactive web experience showcasing Sumbu Labs' comprehensive technology services. Built with cutting-edge web technologies and featuring immersive 3D animations, interactive components, and responsive design.

## 🌟 Overview

Sumbu Labs is a technology company that aligns **vision**, **technology**, and **execution** on the same plane. Our website demonstrates our expertise through an engaging, interactive portfolio that showcases our services in Web2-Web3 integration, AI solutions, mobile development, and more.

## ✨ Features

### 🎨 Interactive UI Components

- **Animated Splash Screen** - Smooth entry experience with loading animations
- **Dynamic Gradient Blinds** - Interactive background effects that respond to mouse movement
- **Magic Bento Grid** - Interactive service cards with particle effects and hover animations
- **3D Lanyard System** - Draggable team member cards with physics-based interactions
- **MetaBalls Animation** - Organic flowing background animations
- **Responsive Carousel** - Mobile-optimized team showcase

### 🛠 Technical Features

- **Next.js 15** with App Router architecture
- **React 19** with modern hooks and concurrent features
- **TypeScript** for type-safe development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Three.js & React Three Fiber** for 3D graphics
- **GSAP** for advanced animations
- **Responsive Design** optimized for all devices

## 🏗 Project Structure

```
sumbu-labs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── LandingPage/       # Landing page sections
│   │   │   ├── Hero.tsx       # Hero section with gradient blinds
│   │   │   ├── Services.tsx   # Services showcase
│   │   │   ├── Team.tsx       # Team section with lanyards
│   │   │   ├── Navigation.tsx # Navigation bar
│   │   │   ├── Partner.tsx    # Partners section
│   │   │   ├── Slogan.tsx     # Company slogan
│   │   │   └── Footer.tsx     # Footer
│   │   ├── ReactBits/         # Interactive components
│   │   │   ├── Cubes/         # 3D cube animations
│   │   │   ├── DarkVeil/      # Dark overlay effects
│   │   │   ├── GradientBlinds/# Interactive gradient backgrounds
│   │   │   ├── Lanyard/       # Draggable team cards
│   │   │   ├── MagicBento/    # Interactive service grid
│   │   │   ├── MetaBalls/     # Organic animations
│   │   │   └── RollingGallery/# Image gallery
│   │   └── ui/                # UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── assets/                # Static assets
├── public/                    # Public assets
│   └── assets/               # Images, logos, 3D models
└── cache/                    # Build cache
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CAR-dano/sumbu-labs.git
   cd sumbu-labs
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Our Services

### 🌐 Web2-Web3 Integration

Connect traditional systems with blockchain wallets, smart contracts, and on-chain data for seamless hybrid experiences.

### 💻 Custom Web Development

Build scalable, secure web applications tailored to your business needs with modern frameworks and best practices.

### 📱 Custom Mobile App Development

Develop cross-platform mobile applications with native performance and exceptional user experience.

### 🤖 AI & Data Solutions

Implement large language models, computer vision, forecasting systems, and MLOps for production-ready AI solutions.

### ⚙️ System Integration & Automation

Create robust APIs, orchestration systems, and CI/CD pipelines to streamline operations and improve efficiency.

### 🎨 UI/UX Design

Design research-driven interfaces and maintain consistent design systems that enhance user engagement.

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Animations & Graphics

- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber
- **React Three Rapier** - Physics engine integration
- **Framer Motion** - Animation library
- **GSAP** - Professional animation library

### UI Components

- **Lucide React** - Icon library
- **React Icons** - Icon collection
- **Tabler Icons** - Additional icons
- **Class Variance Authority** - Component variants
- **Tailwind Merge** - Merge Tailwind classes

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📱 Responsive Design

The application is fully responsive and optimized for:

- **Desktop** (1200px+) - Full interactive experience
- **Tablet** (768px-1199px) - Adapted layouts
- **Mobile** (320px-767px) - Touch-optimized interface

## 🐳 Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build the Docker image
docker build -t sumbu-labs .

# Run with Docker Compose
docker-compose up
```

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code analysis

## 🎨 Design System

### Colors

- **Primary**: Purple gradient (`#FF9FFC` to `#5227FF`)
- **Background**: Deep dark (`#060010`)
- **Accent**: Purple (`#8400FF`)
- **Text**: White with opacity variations

### Typography

- **Primary Font**: Roboto
- **Secondary Font**: Rubik
- **Responsive sizing** with clamp functions

### Animations

- **Hover effects** on interactive elements
- **Smooth transitions** between states
- **Physics-based** interactions
- **Particle systems** for visual enhancement

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Connect your GitHub repository
2. Configure build settings (auto-detected)
3. Deploy with automatic CI/CD

### Other Platforms

- **Netlify** - Static site deployment
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerized deployment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [sumbu-labs.com](https://sumbu-labs.com)
- **Repository**: [github.com/CAR-dano/sumbu-labs](https://github.com/CAR-dano/sumbu-labs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

## 📞 Contact

**Sumbu Labs** - Aligning Your Ideas Across Every Axis

For inquiries about our services or collaboration opportunities, reach out through our website contact form.

---

Made with ❤️ by the Sumbu Labs Team
