# 🎓 Online Quiz System - Frontend

A modern, production-grade frontend for the Online Quiz System, built with **React**, **TypeScript**, and **Material UI**. This project features a robust architecture with professional design patterns, strict type safety, and efficient state management.

## 🚀 Tech Stack

- **Core:** [React 18](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
- **UI Framework:** [Material UI (MUI v5)](https://mui.com/) with a custom design system
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) (Auth/User state)
- **Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest) (Server state)
- **Routing:** [React Router v6](https://reactrouter.com/) (Data APIs, Loaders)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup)
- **HTTP Client:** [Axios](https://axios-http.com/) with interceptors for JWT handling
- **Icons:** [MUI Icons](https://mui.com/material-ui/material-icons/) + SVG components
- **Motion:** [Framer Motion](https://www.framer.com/motion/) for animations

## ✨ Key Features

### 🔐 Authentication & Security
- **JWT Authentication:** Secure access/refresh token rotation.
- **Route Protection:** Higher-order component guards + Router loaders.
- **Auto-Refresh:** Seamless token refresh logic in API interceptors.
- **Role-Based Access Control (RBAC):** Admin vs. User routing and UI.
- **Secure Storage:** Tokens managed via localStorage with sync logic.

### 🎨 UI/UX Design
- **Modern Aesthetic:** "Deep Purple & Teal" SaaS-inspired theme.
- **Split-Screen Auth:** Professional login/register pages with branding panel.
- **Responsive Layout:** Mobile-friendly dashboard and quiz interfaces.
- **Feedback:** Toast notifications (Notistack) and skeleton loading states.

### 🧩 Architecture
- **Feature-Based Structure:** Code organized by domain features.
- **Strict Typing:** comprehensive TypeScript interfaces for all API responses.
- **Centralized API:** Repository pattern for all backend endpoints.
- **Design Tokens:** Centralized color/spacing/typography tokens.

## 📂 Project Structure

```bash
src/
├── api/            # API definition and axios client configuration
├── components/     # Reusable UI components
│   ├── auth/       # Authentication specific components
│   ├── layout/     # Main app layout (Sidebar, Navbar)
│   └── ui/         # Generic UI kit (Cards, Badges, Inputs)
├── lib/            # Utilities (Validators, Auth guards)
├── pages/          # Application views/routes
│   ├── admin/      # Admin specific pages
│   ├── attempt/    # Key quiz taking flows
│   ├── auth/       # Login/Register/Password pages
│   ├── dashboard/  # User & Admin dashboards
│   └── quiz/       # Quiz management pages
├── routes/         # Router configuration (Private/Public)
├── store/          # Redux slices and store config
├── theme/          # MUI Theme customization & Tokens
└── types/          # TypeScript interfaces
```

## 🛠️ Setup & Installation

1. **Prerequisites**
   - Node.js (v18+)
   - Backend API running on port `8000`

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🔌 API Integration

The frontend uses a centralized `apiClient` (`src/api/client.ts`) that handles:
- **Base URL configuration**
- **Auth Headers:** Automatically attaches `Bearer` tokens.
- **Error Handling:** Standardized error parsing.
- **Token Refresh:** Intercepts 401s to refresh tokens silently.

## ✅ Coding Standards

- **Naming:** PascalCase for components/pages, camelCase for functions/vars.
- **Files:** `Page.tsx` suffix for route components.
- **Imports:** Absolute imports configured via `@/` alias.
- **Validation:** All forms must use Yup schemas located in `src/lib/validators.ts`.

---

### 📝 Notes for Reviewers
- Check `src/lib/auth-guards.ts` for the implementation of secure route loaders.
- `src/theme/theme.ts` contains the global MUI theme overrides.
