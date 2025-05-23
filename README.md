# React + Vite

## Login details:

### Admin User
- ⁠Email: admin@example.com
- ⁠Password: admin123
- ⁠Role: ADMIN

### Regular User
- ⁠Email: user@example.com
- ⁠Password: user123
- ⁠Role: USER

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Empora Admin

A clean, modern employee management dashboard built with React, Tailwind CSS, and Apollo Client.

## Theme Guidelines

The **Empora Admin** theme follows these styling guidelines:

### Colors
- **Primary**: `emerald-600` (#059669)
- **Secondary**: `gray-100` (#f9fafb) background with `gray-700` (#374151) text
- **Accent**: `emerald-400` (#34d399) for hover and focus states
- **Error**: `red-500` (#ef4444)
- **Success**: `green-500` (#10b981)
- **Background**: `bg-white` for cards, `bg-gray-50` for app background

### Typography
- **Font**: `Inter` or `sans-serif`
- **Headings**: `text-xl` or `text-2xl` bold for sections
- **Body**: `text-sm` to `text-base` for content

### Components
- **Buttons**: Base classes with `rounded-xl px-4 py-2 font-medium` and color variations
- **Cards**: `rounded-2xl shadow-md bg-white p-4 space-y-2` with hover effects
- **Grid Layouts**: Responsive grids using Tailwind's grid system
- **Modals**: Clean, centered dialogs with subtle transitions

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

- Employee management dashboard
- Grid and tile views
- Responsive design
- Apollo GraphQL integration
- Role-based access control
