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

## Extended Guidelines

### Form Handling
- Use `formDataToJson()` to convert FormData to plain object
- Use `parseYupErrors()` to convert Yup errors to field-level errors
- Use `ObjectReducer` for form error state management
- Validate with `schema.validateSync(data, { abortEarly: false })`

### Context Pattern
- Create context folder: `/src/contexts/[name]/`
- Files: `index.js`, `[Name]Context.js`, `[Name]Provider.jsx`, `use[Name].js`
- Export provider from `index.js` for clean imports
- Use `use[Name]()` hook to consume context

### Schema Objects
- Define default objects in `/src/schemas/[name].js`
- Use for initializing form state
- Contains empty/default values for all fields

### Reducer Patterns
- `ObjectReducer`: For managing object state (form errors, data)
- `ArrayReducer`: For managing array state (lists, selections)
- Actions: `{ type: "set", field: "name", value: "John" }` or `{ type: "clear" }`

### Icon Components
- Store in `/src/assets/icons/`
- Use PascalCase naming
- Return SVG elements directly
- Accept standard props (className, onClick, etc.)

### State Management
- Use React hooks (useState, useReducer) for local state
- Use Context API for shared state (auth, theme, class data)
- Use TanStack Query (React Query) for server state

### Async Patterns
- Use async/await for API calls
- Always handle loading states with Throbber component
- Handle errors with try-catch and appropriate user feedback
- Use finally block for cleanup (setLoading(false))

### Routing
- Use React Router v7
- Route files in `/src/routes/`
- Protected routes use `ProtectedRoute` layout component
- Lazy load routes when appropriate

### CSS Organization
- Global styles in `/src/assets/css/`
- Theme variables in `/src/assets/css/themes/`
- Component-specific styles in `/src/assets/css/components/`
- Use Tailwind's `@layer` for custom utilities

### Git Workflow
- Never commit secrets or .env files
- Run `npm run lint` before committing
- Test changes with `npm run build` before pushing
- Never use git commit --amend after pushing
