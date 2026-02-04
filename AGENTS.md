# AGENTS.md - Coding Guidelines for This Repository

## Project Overview

React 19 + Vite 7 + Tailwind CSS v4 + TanStack Query bootcamp platform frontend.

## Build/Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

**Note:** No test framework is configured. If you add one, update this section with single test commands.

## Code Style Guidelines

### Import Order
1. Third-party libraries (React, axios, yup, etc.)
2. Internal aliases: `@/apis/*`, `@/assets/*`, `@/components/*`, `@/contexts/*`, `@/lib/*`, `@/validations/*`
3. Relative imports (avoid if possible, use `@/` alias)

### File Naming Conventions
- **Components**: PascalCase + `.jsx` (e.g., `Login.jsx`, `SearchBar.jsx`)
- **Utilities/Libs**: camelCase + `.js` (e.g., `formDataToJson.js`)
- **APIs**: `[name].api.js` (e.g., `auth.api.js`)
- **Contexts**: Folder with `index.js` + `[Name]Provider.jsx`

### Component Patterns
- Use functional components with default exports
- Use `export default function ComponentName()` syntax
- Destructure props with defaults in function parameters
- Use React hooks directly (useState, useEffect, etc.)

### Error Handling
- Wrap API calls in try-catch blocks
- Use `AxiosError` for HTTP error handling
- Use `ValidationError` for form validation errors
- Log errors in development: `if (import.meta.env.VITE_ENV == "development") console.error(err)`

### Styling (Tailwind v4)
- Use `@layer` and `@apply` in CSS for custom components
- Use arbitrary values sparingly: `min-w-140`, `h-svh`
- Use CSS variables for theme colors: `var(--surface)`, `var(--primary)`
- Responsive prefixes: `max-md:`, `md:`, `lg:`, `xl:`, `2xl:`

### Validation (Yup)
- Use `yup` schemas in `/src/validations/[feature].validation.js`
- Use `*.validateSync()` for synchronous validation
- User-facing messages in Indonesian language

### API Patterns
- Create API objects with named methods in `/src/apis/[name].api.js`
- Use `api.post()`, `api.get()` from client
- Default export the API object

### ESLint Rules
- No unused variables (except capitalized: `varsIgnorePattern: '^[A-Z_]'`)
- React Hooks rules enforced
- React Refresh enabled
- ES2020 syntax

### Project Aliases
- `@/` maps to `./src/` (configured in vite.config.js and jsconfig.json)
- Always use `@/` for internal imports

### Language
- User-facing UI text: Indonesian (e.g., "Password wajib diisi")
- Code comments: English
- Variable/function names: English
