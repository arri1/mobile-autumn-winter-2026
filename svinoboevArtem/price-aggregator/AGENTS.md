This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npm run lint                # ESLint + Prettier
npm run typecheck           # generates Expo Router types, then tsc --noEmit
npm test                    # Jest (jest-expo + React Native Testing Library)
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint, typecheck and tests before declaring any task done.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.config.ts` and config plugins.
- Expo Go only includes its bundled native modules. This project already depends on native modules outside Expo Go (MapLibre), so it always runs in a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md

## Project conventions

Product spec: price aggregator with a store map, catalog with nutrition (КБЖУ), receipt/barcode scanner and cart route optimization. Backend is FastAPI. See README.md for the full picture.

- `src/app/` holds thin screens only; domain code goes to `src/features/<domain>/` (`types.ts`, `api.ts`, `hooks.ts`, stores, `components/`). Shared UI primitives live in `src/components/ui/`, infrastructure in `src/lib/`. Never put tests in `src/app/`.
- Server state: TanStack Query with a query key factory per feature. User-scoped queries go under the `['me']` key so sign-out can clear them.
- Client state: Zustand. Persist non-secret data with `persistStorage` (`src/lib/storage.ts`). Tokens go to SecureStore only (`src/lib/auth/token-storage.ts`).
- HTTP: always use `apiRequest` from `src/lib/api/client.ts` — it handles the bearer token, refresh on 401 and FastAPI errors. Pass `signal` from the query function context.
- DTO types mirror FastAPI JSON (snake_case) and are checked against the backend's `/openapi.json`. Re-check there before changing `features/*/api.ts`.
- Styling: colors come from `useTheme()` (`src/theme`, shared palette with the web client), text goes through `Text` variants (Manrope — weight is set by font family, not `fontWeight`). Screens sit on `canvas`, cards on `background`.
- City and price queries must include the selected city (`useCityStore`) and stay disabled until a city is chosen.
- Icons: use `Icon` from `src/components/ui/icon.tsx` (SF Symbols on iOS, Material Symbols on Android). Add new icons to its map.
- UI copy is in Russian. Keep code comments sparse and in Russian, matching the existing code.
- Tests are colocated as `*.test.ts(x)`. React Native Testing Library 14: `render` and `fireEvent` are async — always `await` them.
