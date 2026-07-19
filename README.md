# Clackr ⌨️

Clackr is a premium, high-fidelity typing test application designed for mechanical keyboard enthusiasts and speed typists. Built with **Next.js 15**, **Redux Toolkit**, and **Tailwind CSS**, it features a fully-interactive 75% mechanical virtual keyboard, live audio feedback, rich visual analytics, and a fully customisable typing experience.

---

## ✨ Features

### 1. Core Typing Engine
* **Multiple Test Modes**:
  * `Time`: Standard timed tests (15s, 30s, 60s, 120s).
  * `Words`: Target word counts (10, 25, 50, 100).
  * `Quotes`: Practice with real-world quotes of varying lengths.
  * `Zen`: Free typing without timer constraints.
  * `Code`: Code syntax typing practice with code snippets.
* **Modifiers**: Easily toggle **Punctuation**, **Numbers**, and **Capitals** into the word pool.
* **Dual Difficulty Modes**: Switch between `Easy` and `Hard` word list pools.

### 2. Interactive 75% Mechanical Keyboard
* **Dynamic Key Highlights**: Real-time visual feedback showing pressed keycaps and targeted letters.
* **3D Tactile Keycaps**: Beautifully styled keycaps with simulated depth, margins, and smooth hover states.
* **Adaptive Scaling**: Resize the keyboard to fit your preference (`Normal`, `Compact`, or `Wide`).

### 3. Sound & Animations
* **Web Audio API Sound Engine**: High-performance audio synthesizer and buffer system with distinct sound profiles:
  * `Clack`: Tap of mechanical key switches.
  * `Bubble`: Soft pop sound.
  * `None`: Silent mode.
* **Configurable Volume & Error Sound**: Adjustable master volume and custom error sound feedback.
* **Confetti Celebration**: Smooth canvas-based confetti explosion upon completing a typing test.

### 4. Advanced Analytics & History
* **Live Graphing**: Recharts-powered performance curve graphing both WPM and Raw WPM second-by-second.
* **Personal Bests (PB)**: Tracks and stores high scores and history logs (capped at 50 results) in local storage.
* **Word Review**: In-depth analysis highlighting which words were correctly typed, missed, or mistyped.
* **Practice Weak Words**: Launch practice sessions specifically composed of words you mistyped during the test.
* **Custom Share Cards**: Export beautiful screenshot cards directly as PNG downloads to share your achievements.

### 5. Multi-Theme Engine
Clackr features **6 pre-configured themes** with smooth CSS variable transitions:
1. **Carbon (Default)**: Mechanical warm graphite & cream
2. **Serika**: Warm light sand, dark charcoal, and gold yellow
3. **Nord**: Cool slate blue, frost snow, and polar blue
4. **Sakura**: Soft cherry pink and deep mahogany
5. **Midnight**: Pitch space blue-black and electric purple
6. **Monokai**: Classic neon hacker grey, magenta, and cyan

---

## 📂 Project Structure

```bash
Typing Master/
├── public/                 # Static assets (favicons, images)
├── src/
│   ├── app/                # Next.js App Router (Layouts, pages, styles)
│   │   ├── globals.css     # CSS Variables for all 6 themes & animation rules
│   │   └── page.tsx        # App Orchestrator & Global Event Listeners
│   ├── components/         # Reusable UI Components
│   │   ├── HistoryModal    # High Score, History Log, and Statistics Modals
│   │   ├── Layout          # Layout Shell (Header, Navigation, Footer, Toolbar)
│   │   ├── ResultsPanel    # Results screen, charts, Share and Practice modals
│   │   ├── SettingsModal   # User customizations (Themes, Sounds, Layout)
│   │   ├── TestConfig      # Interactive test configuration toolbar
│   │   ├── TypingArea      # Core caret tracking, active word pool rendering
│   │   ├── VirtualKeyboard # 75% mechanical interactive virtual keyboard
│   │   └── Word            # Dynamic word & character styling
│   ├── hooks/              # Custom React Hooks
│   │   └── useTypingEngine # Centralized typing logic, keypress hooks, and timers
│   ├── lib/                # Utility Functions and Engines
│   │   ├── confetti.ts     # Canvas confetti trigger module
│   │   ├── soundManager.ts # Web Audio API engine & synthesizer fallback
│   │   ├── statsCalculator.ts # WPM, Accuracy, and Consistency math helpers
│   │   ├── wordGenerator.ts  # Dynamic word pool generator based on modifiers
│   │   └── wordLists.ts    # Easy/Hard word lists, Quotes, and Code pools
│   └── store/              # Redux State Management
│       ├── provider.tsx    # Settings hydration & global sound-click listeners
│       ├── store.ts        # Redux store setup
│       ├── settingsSlice.ts# User preferences store (local storage synchronized)
│       ├── resultsSlice.ts # History & High-scores store (local storage synchronized)
│       └── testSlice.ts    # Active test metrics, timers, and typed arrays
├── next.config.js          # Next.js custom configurations
├── tailwind.config.js      # Custom theme token mapping
└── tsconfig.json           # TypeScript configuration with `@/*` mapping
```

---

## 🛠️ Getting Started

To run Clackr locally on your machine, follow these steps:

### 1. Install Dependencies
Make sure you have Node.js installed. In the root directory, run:
```bash
npm install
```

### 2. Start the Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
To create a production-optimized build of the project:
```bash
npm run build
```
Start the production server:
```bash
npm start
```

---

## 👤 Developer

Designed and developed with ❤️ by **Adnan Ashraf**.
* GitHub: [@adnanashraf-code](https://github.com/adnanashraf-code)
* Focuses on building high-performance, premium, and visually stunning web applications.

Feel free to check out my other repositories or star this project if you like it! 🌟
