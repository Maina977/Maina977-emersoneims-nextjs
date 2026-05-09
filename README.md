# EmersonEIMS - Energy Infrastructure Management System

**Awwwards 9.8/10 Website** - Production Ready

A modern Next.js application for energy infrastructure management with WordPress integration capabilities.

## 🚀 Features

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Three.js/React Three Fiber** for 3D visualizations
- **WordPress REST API** integration
- **Tailwind CSS 4** for styling
- **GSAP** for animations
- **Chart.js** for data visualization
- **Fully responsive** design
- **SEO optimized** with metadata and structured data
- **Awwwards-level** design and animations

## 📋 Prerequisites

- Node.js 18+
- npm 9+ or yarn/pnpm
- WordPress site (for integration)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maina977/Maina977-emersoneims-nextjs.git
   cd Maina977-emersoneims-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### **Deploy to Vercel (Recommended)**

1. Push to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import project
4. Deploy

### **Static Export to WordPress**

```bash
npm run export:static
```

Upload `out/` folder to WordPress server.

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── about-us/          # About page
│   ├── service/           # Services page
│   ├── solution/          # Solutions page
│   ├── solar/             # Solar page
│   ├── generators/        # Generators page
│   ├── diagnostics/       # Diagnostics cockpit
│   └── contact/           # Contact page
├── components/            # React components
├── lib/                   # Utilities
├── public/                # Static assets
└── styles/                # Global styles
```

## 🎨 Design Features

- **Awwwards-winning** design
- **Hollywood 4K** color grading
- **3D WebGL** visualizations
- **Premium animations** (Framer Motion, GSAP)
- **Touch interactions** (Apple-level)
- **WCAG AAA** accessibility
- **Fast loading** (optimized images/videos)

## 🔗 WordPress Integration

- Connects to WordPress REST API
- Fetches content from WordPress
- Images/videos from WordPress work automatically
- API endpoint: `/api/wordpress`

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run export:static` - Static export for WordPress
- `npm run deploy:prod` - Deploy to Vercel (production)

## 🌐 Live Site

- **Production:** https://emersoneims-nextjs.vercel.app
- **WordPress:** https://www.emersoneims.com

## 📄 License

MIT

## 👤 Author

EmersonEIMS

---

**Built with ❤️ for Awwwards SOTD**
