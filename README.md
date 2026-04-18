# Recipe App

A full-featured vegan recipe web app built with Vue 3 and TypeScript.

## Features

- **Browse & Search** — Find recipes by title, ingredient, or tag
- **Recipe Management** — Add, edit, and delete your own recipes
- **Meal Planner** — Plan breakfast, lunch, and dinner for the week
- **Shopping List** — Manual list or auto-generated from your meal plan
- **AI Chef** — Powered by Claude: chat, recipe suggestions from pantry ingredients, ingredient substitutions, and recipe generation

## Tech Stack

- [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/) — state management
- [Vue Router](https://router.vuejs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Anthropic API](https://www.anthropic.com/) — AI features

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## AI Features

To use the AI Chef, you need an [Anthropic API key](https://console.anthropic.com/). Open the **AI Chef** page in the app and enter your key — it's stored locally in your browser and never sent anywhere except the Anthropic API.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run type-check` | Run TypeScript type checking |
| `npm run test` | Run unit tests (Vitest, watch mode) |
| `npm run test:run` | Run unit tests once |
| `npm run coverage` | Run unit tests with coverage report |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npm run test:e2e:ui` | Open Playwright interactive UI |

## Testing

The project has two layers of tests:

**Unit tests** (Vitest) — cover all Pinia stores and the AI composable:
```bash
npm run test:run
```

**End-to-end tests** (Playwright) — cover navigation, recipes, meal planner, and shopping list in a real browser:
```bash
npm run test:e2e
```

## Data Storage

All data (recipes, meal plan, shopping list) is stored in browser `localStorage`. No backend or account required.
