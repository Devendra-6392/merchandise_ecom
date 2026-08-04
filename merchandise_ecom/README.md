# Merch Studio - Complete E-commerce Solution

Welcome to Merch Studio! This repository contains the complete stack for your E-commerce platform, including a robust backend API, a Next.js storefront, and a React Admin Panel.

## Project Structure

This repository is organized into three main directories:

1. **`backend/`**: Node.js & Express API connected to MongoDB.
2. **`website/`**: Next.js React storefront for customers.
3. **Root Directory**: Vite React Admin Panel for managing products, orders, and users.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)
- **MongoDB** (Local instance or MongoDB Atlas URI)

---

## Step 1: Setting up the Backend

The backend is responsible for all database operations, authentication, and payments.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Ensure your `.env` file is properly configured. You should have a `.env` file in the `backend/` folder with variables like your `MONGODB_URI`, `JWT_SECRET`, and `PORT` (usually `5000`).
4. Start the backend server:
   ```bash
   npm run dev
   ```
   *(The server should now be running on `http://localhost:5000`)*

---

## Step 2: Setting up the Admin Panel

The Admin panel is a Vite-powered React application located in the root of the project.

1. Open a **new** terminal and navigate to the root directory (if not already there):
   ```bash
   cd merchandise_ecom
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The admin panel should now be accessible at `http://localhost:5173`)*

---

## Step 3: Setting up the Storefront Website

The customer-facing website is a Next.js application located in the `website/` folder.

1. Open a **new** terminal and navigate to the website folder:
   ```bash
   cd website
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   *(The storefront should now be accessible at `http://localhost:3000`)*

---

## Deployment (Vercel & Render)

**Frontend Deployment (Vercel):**
Both the Admin Panel (Root) and the Website (`website/`) can be seamlessly deployed on Vercel. 
- During Vercel setup, point the **Root Directory** to the root for the Admin Panel, or `website/` for the storefront.
- Make sure to add your environment variables (`NEXT_PUBLIC_API_URL` and `VITE_API_URL`) directly in the Vercel dashboard.

**Backend Deployment (Render/Railway):**
You can deploy your `backend/` directory as a Web Service on platforms like Render or Railway. After deploying, update your frontend environment variables to point to the live backend URL.
