# KLU Fresh — React + Vite

A client-side grocery shopping demo with customer and admin modules.

## Requirements
- Node.js 18 or later
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL shown by Vite (normally http://localhost:5173).

## Demo admin login
- Email: `admin@klufresh.com`
- Password: `admin123`

A second admin account is also available:
- Email: `admin123@klufresh.in`
- Password: `admin11`

Customers can create an account using Sign up.

## Features
- Customer signup/login and admin login using localStorage
- Role-based admin dashboard
- Product search, category filter and sorting
- Cart, wishlist, checkout and order history
- Admin product create/edit/delete and stock updates
- Admin order status management and registered user list
- Responsive layout

## Deploy to Vercel
1. Push this project to a GitHub repository.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Click **Deploy**.

`vercel.json` is included for SPA route fallback.

## Important demo limitation
This project uses browser localStorage. Data is stored only in the current browser/device and is not shared between customers/admins on different devices. Client-side demo credentials and localStorage are not secure for a real production store. For production, use a backend API, database, and server-side authentication.
