# clackr ⌨️ — Minimal Distraction-Free Typing Speed Test

<div align="center">

  <img src="public/og.png" alt="clackr Typing Test Preview" width="800" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);" />

  <br/><br/>

  [![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

  <br/>

  ### 🌐 [Live Demo: clackr-plum.vercel.app](https://clackr-plum.vercel.app)

</div>

---

## 🌟 Overview

**clackr** is a state-of-the-art, distraction-free typing speed test application designed for speed typists, developers, and mechanical keyboard enthusiasts. Built with **Next.js 15**, **TypeScript**, **Redux Toolkit**, and **Tailwind CSS**, it features a fully-interactive 75% mechanical virtual keyboard, Web Audio API mechanical key sounds, real-time WPM & accuracy analytics, customizable test modes, and 6 curated themes.

---

## ✨ Features

### 1. ⚡ Core Typing Engine
* **5 Test Modes**:
  * `Time`: Standard timed speed tests (`15s`, `30s`, `60s`, `120s`).
  * `Words`: Target word count challenges (`10`, `25`, `50`, `100` words).
  * `Quotes`: Real-world quotes practice across varying lengths.
  * `Zen`: Free-form practice mode without timer or word limits.
  * `Code`: Code syntax practice featuring real programming snippets.
* **Modifiers**: Toggle **Punctuation**, **Numbers**, and **Capitals** into any word pool.
* **Difficulty Levels**:
  * `Easy`: Common English vocabulary.
  * `Hard`: Advanced, complex, and rare vocabulary words.
* **Custom Test Setup**:
  * Launch custom minute/second tests up to `3600s` (1 hour) via the toolbar.

### 2. ⌨️ Interactive 75% Mechanical Virtual Keyboard
* **Dynamic Key Lighting**: Real-time visual feedback showing target and pressed keycaps.
* **3D Tactile Keycaps**: Custom rendered keycaps with simulated mechanical depth and smooth animations.
* **Layout Scaling**: Toggle between `Normal`, `Compact`, and `Wide` keyboard sizes.

### 3. 🔊 Audio Feedback & Sound Engine
* **Web Audio API Synthesizer**: Low-latency mechanical key sounds with zero audio lag (`<3ms` scheduling buffer).
* **Multiple Sound Profiles**: Choose between `Clack` (mechanical switch), `Bubble` (soft pop), or `None` (silent).
* **Visual Polish**: Spring-animated restart button and canvas confetti celebration on test completion.

### 4. 📊 Performance Analytics & Practice
* **Interactive Charts**: Recharts-powered WPM and Raw WPM second-by-second performance curves.
* **Personal Bests (PB)**: History logging with local storage persistence.
* **Word Review & Practice**: Review missed words and launch instant practice sessions targeting mistyped words.
* **Social Share Cards**: Custom 1200x630 OpenGraph card generation for sharing on Twitter/X, Discord, and LinkedIn.

### 5. 🎨 Multi-Theme System
Includes 6 curated color themes:
* 🌑 **Midnight** (Default space blue & electric purple)
* ⚙️ **Carbon** (Graphite & warm cream)
* 💛 **Serika** (Warm sand & gold)
* ❄️ **Nord** (Cool polar slate)
* 🌸 **Sakura** (Cherry pink & mahogany)
* ⚡ **Monokai** (Neon hacker grey & magenta)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Tab` | Quick restart test / Generate new word pool |
| `Esc` | Toggle Settings Modal (when not actively typing) |
| `K` | Toggle Virtual Keyboard visibility |

---

## 📁 Project Architecture

```
Typing Master/
├── public/                 # Static assets, OG cards, favicons & audio files
├── src/
│   ├── app/                # Next.js App Router (Layouts, Pages, Routes, SEO Metadata)
│   │   ├── api/og/         # OpenGraph dynamic route
│   │   ├── share/          # Share landing page with smooth auto-redirect
│   │   ├── globals.css     # CSS Variables for all 6 themes
│   │   ├── layout.tsx      # Root Layout with JSON-LD SEO Schemas & Metadata
│   │   ├── manifest.ts     # Web Application Manifest (PWA)
│   │   ├── robots.ts       # Search Engine Crawling Rules
│   │   └── sitemap.ts      # Dynamic XML Sitemap
│   ├── components/         # Reusable Modular Components
│   │   ├── CustomTestModal # Custom duration modal
│   │   ├── HistoryModal    # High scores & statistics modal
│   │   ├── Layout          # Application shell & header navigation
│   │   ├── ResultsPanel    # Results screen, charts, Share & Practice modals
│   │   ├── SettingsModal   # Theme switcher, sound settings & live visitor counter
│   │   ├── TestConfig      # Test configuration sub-navbar toolbar
│   │   ├── TypingArea      # Core typing caret tracking engine
│   │   └── VirtualKeyboard # Interactive 75% mechanical keyboard
│   ├── hooks/              # Custom React Hooks (useTypingEngine)
│   ├── lib/                # Audio engines, stats math, word generators & confetti
│   └── store/              # Redux Toolkit State Management
├── next.config.js          # Next.js optimization config
└── tailwind.config.js      # Custom theme token mapping
```

---

## 🛠️ Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/adnanashraf-code/Clackr.git
cd Clackr
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 👤 Author

<div align="center">
  <br/>
  <a href="https://github.com/adnanashraf-code" target="_blank">
    <img src="https://github.com/adnanashraf-code.png" width="90" style="border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" alt="Adnan Ashraf" />
  </a>
  <h3><b>Adnan Ashraf</b></h3>
  <p>Full Stack Engineer & Creative Web Developer</p>

  <a href="https://github.com/adnanashraf-code" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Badge" />
  </a>

  <br/><br/>
  <p>Crafting high-performance, distraction-free, and visually stunning web experiences. ❤️</p>
  <p>Star this repository if you find it helpful! 🌟</p>
</div>
