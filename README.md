# Token Management System

A web application for managing tokens, built with React + TypeScript + Mantine + Redux Toolkit.

## Tech Stack

| Layer             | Technology                      | Version  |
|-------------------|---------------------------------|----------|
| Framework         | React                           | 19.3.0   |
| Language          | TypeScript                      | 7.0.2    |
| UI Library        | Mantine                         | 9.6.3    |
| State Management  | Redux Toolkit + React-Redux     | 2.13.0 / 9.3.0 |
| Build Tool        | Vite                            | 8.3.1    |
| Package Manager   | npm                             |          |
| Linting           | ESLint 10 (flat config)         | 10.11.0  |
| Formatting        | Prettier                        | 3.9.9    |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

## Available Scripts

| Script              | Description                              |
|---------------------|------------------------------------------|
| `npm run dev`       | Start development server (Vite HMR)      |
| `npm run build`     | Type-check then bundle for production    |
| `npm run preview`   | Preview production build locally         |
| `npm run lint`      | Lint `src/` (zero warnings allowed)      |
| `npm run lint:fix`  | Auto-fix lint issues                     |
| `npm run format`    | Format source files with Prettier        |
| `npm run format:check` | Check formatting without writing      |
| `npm run type-check`| Run TypeScript compiler (no emit)        |

## Project Structure

```
src/
├── components/     # Shared/reusable UI components
├── features/       # Feature slices (Redux + components co-located)
├── hooks/          # Custom React hooks
├── pages/          # Top-level page components
├── store/          # Redux store, typed hooks
│   ├── index.ts
│   └── hooks.ts
├── types/          # Shared TypeScript type definitions
├── utils/          # Pure utility functions
├── App.tsx         # Root component with AppShell layout
├── main.tsx        # Entry point (React + Redux + Mantine providers)
├── theme.ts        # Mantine theme customization
└── vite-env.d.ts   # Vite client type declarations
```

## Adding a Feature Slice

Create a directory under `src/features/<feature-name>/` containing:

- `<feature-name>Slice.ts` — RTK `createSlice` (state + reducers + actions)
- `index.ts` — barrel export
- Components alongside the slice (co-location pattern)

Register the slice reducer in `src/store/index.ts`:

```ts
import featureReducer from '@/features/<feature-name>'

export const store = configureStore({
  reducer: {
    feature: featureReducer,
  },
})
```

## Security Audit

Run `npm audit` before each release. Findings at time of scaffold:

<!-- npm audit output will be recorded here after install -->

## License

Private.
