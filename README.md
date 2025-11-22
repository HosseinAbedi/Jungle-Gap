# Jungle Gap 🌲⚔️

**Jungle Gap** is a next-generation League of Legends strategic analysis tool powered by **Google Gemini 2.5 Flash** and **DuckDB WASM**. It provides real-time, high-ELO matchup advice for junglers, grounded in the latest Season 15 data and patch notes.

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-2.6.0-green)
![Patch](https://img.shields.io/badge/patch-Live-red)

## 🚀 Features

-   **AI-Powered Analysis**: Uses Gemini 2.5 Flash with Google Search Grounding to fetch live win rates, high-elo guides, and specific interaction tips.
-   **Patch Aware**: Automatically detects the current LoL patch via Riot's DDragon API to ensure advice is never outdated.
-   **Smart Caching**: Implements an in-browser SQL database using **DuckDB WASM** to cache expensive AI queries. Cache invalidates automatically when the LoL patch version changes.
-   **Interactive UI**: A "Gamer-aesthetic" interface built with React, Tailwind CSS, and framer-motion-like CSS animations.
-   **Visual Data**: Radar charts for invade decisions, dynamic bar graphs for objective control, and specialized badges for power spikes.

## 🛠 Architecture & Quality

The application is built with a focus on performance, maintainability, and scalability.

### Tech Stack
-   **Frontend**: React 19, TypeScript, Tailwind CSS.
-   **AI Integration**: `@google/genai` SDK (Gemini 2.5 Flash).
-   **Data Layer**: DuckDB WASM (Client-side SQL caching), DDragon API (Assets & Versions).

### Key Components
-   **`geminiService.ts`**: Handles prompt engineering, JSON enforcement, and integration with the search tool.
-   **`dbService.ts`**: Manages the persistent DuckDB instance, handling schema migration and patch-version keyed lookups.
-   **`riotService.ts`**: Fetches static data and version numbers from Riot Games.

### Code Quality Standards
-   **Type Safety**: Full TypeScript coverage for all data models (`MatchupAdvice`, `Champion`, etc.).
-   **Error Handling**: Robust try-catch blocks around AI and DB operations with user-friendly fallback UI.
-   **Performance**: 
    -   `React.memo` and `useMemo` for expensive lists.
    -   WASM-based caching to reduce API latency and costs.
    -   CSS-based animations (performant on the GPU).

## 📚 Documentation

### How it Works

1.  **Select Champions**: The user selects their champion and the enemy jungler.
2.  **Patch Check**: The app queries Riot's endpoint to get the current patch (e.g., `15.1.1`).
3.  **Cache Lookup**: DuckDB checks if valid advice exists for this specific matchup **AND** patch version.
4.  **AI Generation**: 
    -   If not cached, Gemini 2.5 Flash is invoked with the `googleSearch` tool.
    -   The prompt forces a strict JSON schema response.
    -   Gemini searches specifically for "Season 15 [Champ A] vs [Champ B] jungle matchup guide".
5.  **Rendering**: The result is parsed, validated, and rendered into modular cards (Pathing, Invading, Scaling, etc.).

### Coverage

-   **Champions**: Includes a curated list of 70+ Meta and Off-Meta junglers (e.g., Lee Sin, Viego, Zaahen).
-   **Phases**: 
    -   First Clear (Red/Blue/Invade).
    -   Objectives (Grub/Dragon control).
    -   Mid/Late Game (Teamfight role).
-   **Mechanics**: Specific 1v1 interaction tips and counter-itemization.

## 📦 Examples

### Sample JSON Output (Internal)

```json
{
  "summary": "Lee Sin dominates early but falls off; Viego outscales if he survives the first 15 minutes.",
  "invadeDecision": "invade",
  "invadeExplanation": "Lee Sin's level 3 is significantly stronger than Viego's.",
  "firstClearPath": "Red -> Blue -> Gromp -> Invade",
  "earlyGameAdvantage": "me",
  "objectiveControl": "even",
  "powerSpikes": "Level 3, Serrated Dirk",
  "counterItems": [
    { "name": "Steelcaps", "explanation": "Reduces Viego's auto-attack damage." }
  ]
}
```

## 🎨 UX/UI Design

The interface uses a "Hextech-inspired" dark mode palette:
-   **Slate 900** backgrounds for contrast.
-   **Cyan 500** for player/ally accents.
-   **Amber 500** for warnings and highlights.
-   **Red 500** for enemy threats.

---

*Built with ❤️ by the AI Engineering Team.*