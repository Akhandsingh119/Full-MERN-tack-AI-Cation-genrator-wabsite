# 🎨 Frontend — AI Caption Generator

This is the **React frontend** for the AI Caption Generator application. Built with **React 19**, **Vite 7**, and **Tailwind CSS 4**, it provides a beautiful, responsive UI for uploading images, generating AI captions, and managing caption history.

---

## 🛠️ Tech Stack

| Technology               | Purpose                                          |
|--------------------------|--------------------------------------------------|
| **React 19**             | Core UI library                                  |
| **Vite 7**               | Lightning-fast build tool & dev server           |
| **Tailwind CSS 4**       | Utility-first styling                            |
| **Framer Motion**        | Smooth animations and transitions                |
| **React Router v7**      | Client-side routing & navigation                 |
| **Axios**                | HTTP client for API communication                |
| **ESLint**               | Code linting & quality enforcement               |

---

## 📁 Directory Structure

```
Frontend/
├── index.html            # App shell & Vite entry point
├── vite.config.js        # Vite configuration
└── src/
    ├── main.jsx          # React root renderer
    ├── App.jsx           # Root component — routing & layout logic
    ├── index.css         # Global styles & Tailwind base
    ├── pages/
    │   ├── LandingPage.jsx    # Public home/hero page
    │   ├── LoginPage.jsx      # User login form
    │   ├── RegisterPage.jsx   # User registration form
    │   ├── DashboardPage.jsx  # Main app — image upload & caption generation
    │   └── HistoryPage.jsx    # View all past generated captions
    ├── components/
    │   ├── Navbar.jsx          # Top navigation bar (public pages)
    │   ├── Sidebar.jsx         # Side navigation (authenticated pages)
    │   ├── MobileHeader.jsx    # Mobile top bar with hamburger menu
    │   ├── Footer.jsx          # App footer
    │   ├── Modal.jsx           # Reusable modal component
    │   ├── NotificationBell.jsx   # Bell icon with unread count
    │   ├── NotificationToast.jsx  # Toast notification display
    │   ├── Button.jsx          # Reusable button component
    │   ├── Card.jsx            # Reusable card container
    │   ├── InputField.jsx      # Styled form input
    │   ├── LoadingSpinner.jsx  # Loading state indicator
    │   └── TopNavbar.jsx       # Secondary top navigation bar
    ├── context/
    │   ├── AuthContext.jsx        # Global authentication state
    │   └── NotificationContext.jsx # Global notification state
    ├── hooks/                  # Custom React hooks
    ├── api/                    # Axios instance & API call helpers
    └── utils/
        └── ProtectedRoute.jsx  # Route guard for authenticated pages
```

---

## 🗺️ Application Routes

| Path          | Page              | Access        |
|---------------|-------------------|---------------|
| `/`           | Landing Page      | Public        |
| `/login`      | Login Page        | Public        |
| `/register`   | Register Page     | Public        |
| `/dashboard`  | Dashboard         | 🔒 Protected  |
| `/history`    | Caption History   | 🔒 Protected  |

---

## ⚙️ Setup and Installation

### 1. Navigate to the frontend directory

```bash
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Frontend/` root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

> The `VITE_` prefix is required for Vite to expose environment variables to the browser.

### 4. Start the Development Server

```bash
npm run dev
```

The app will be running at **`http://localhost:5173`**.

---

## 📦 Available Scripts

| Script           | Description                                        |
|------------------|----------------------------------------------------|
| `npm run dev`    | Start the Vite development server with HMR         |
| `npm run build`  | Create an optimized production build in `dist/`    |
| `npm run preview`| Preview the production build locally               |
| `npm run lint`   | Run ESLint to check for code quality issues        |
