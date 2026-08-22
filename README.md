# BroScience Eduservices — Premium Website

Award-calibre educational website built with Next.js, GSAP, and React Three Fiber.

## Tech Stack

- **Next.js 16** (App Router, JavaScript only)
- **Tailwind CSS 4**
- **GSAP + ScrollTrigger** — cinematic scroll storytelling
- **Lenis** — smooth scroll (integrated with GSAP)
- **React Three Fiber + Three.js** — interactive 3D book hero
- **Blender MCP** — purpose-built 3D book asset (`public/models/broscience-book.glb`)

## Getting Started

```bash
cd code
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
code/
├── app/                  # Pages (App Router)
│   ├── page.js           # Homepage narrative
│   ├── courses/          # Course listing + [slug]
│   ├── doubts/           # Doubt-solving
│   ├── library/          # Digital library
│   ├── marketplace/      # Educational store + cart
│   ├── blogs/            # Blog listing + [slug]
│   └── contact/          # Contact + counselling
├── components/
│   ├── home/             # Homepage sections + 3D book
│   ├── layout/           # Navbar, Footer, Theme, SmoothScroll
│   ├── ui/               # Button, GlassCard, Reveal, etc.
│   └── [feature]/        # Page-specific components
├── data/                 # Placeholder content (clearly marked)
├── lib/                  # GSAP, book animation, utilities
└── public/models/        # 3D assets (GLB)
```

## Features

- Light / dark themes with persistence
- Interactive 3D book with scroll-driven cinematic phases
- WebGL fallback (CSS/SVG book) when 3D unavailable
- `prefers-reduced-motion` support throughout
- Responsive, mobile-first compositions
- Marketplace cart (visual, client-side)
- Form validation states (visual only)
- 28 statically generated pages

## 3D Book Asset

Created in Blender via MCP with:
- Hardcover geometry (front, back, spine, page block)
- Gold foil and maroon brand materials
- Optimized GLB export (~54 KB)

## Placeholder Data

All business data in `data/` is clearly marked as placeholder. Replace with real content before production launch.

## Build

```bash
npm run build
npm start
```
