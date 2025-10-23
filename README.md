# Supply Chain Planning Dashboard

[![CI/CD Pipeline](https://github.com/patrik/supply-chain-dashboard/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/patrik/supply-chain-dashboard/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_BADGE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_SITE_NAME/deploys)

A responsive React TypeScript dashboard for inventory planning and supply chain analytics, built with shadcn/ui components and Recharts visualizations.

<img width="1304" height="678" alt="Screenshot 2025-09-27 at 19 01 23" src="https://github.com/user-attachments/assets/34043b41-5152-4124-b411-d66dc56841e8" />

## 🚀 Features

- **Interactive KPI Cards** - Display key metrics including total orders value, current stock level, projected stockouts, and service level
- **Dynamic Stock vs Demand Chart** - Visualize 12 months of stock and demand data with real-time demand adjustments
- **Demand Adjustment Controls** - Interactive slider to simulate demand changes from -50% to +150%
- **Sortable Orders Table** - View and sort planned orders by date and quantity with status indicators
- **Responsive Design** - Mobile-first approach with seamless desktop experience
- **Real-time Updates** - Live calculations and timestamp updates when demand adjustments are made

## 🛠️ Technology Stack

- **React 18** with TypeScript for type-safe component development
- **shadcn/ui** for consistent, accessible UI components
- **Recharts** for interactive data visualizations
- **Tailwind CSS** for responsive styling and theming
- **Lucide React** for consistent iconography
- **Vite** for fast development and building

## 📋 Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

## 🏃‍♂️ Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd supply-chain-dashboard
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up shadcn/ui
Initialize shadcn/ui components (if not already configured):
```bash
npx shadcn-ui@latest init
```

Install required shadcn/ui components:
```bash
npx shadcn-ui@latest add table card badge button slider input label
```

### 4. Add Mock Data
Ensure the mock data file is in the public directory:
```bash
# The file should be at: public/data.json
# (This file contains 12 months of stock data, orders, and KPI metrics)
```

### 5. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── dashboard/
│   │   ├── DashboardCardGrid.tsx  # KPI cards display
│   │   ├── DashBoardChart.tsx     # Stock vs demand chart
│   │   └── DashboardTable.tsx     # Orders table
├── utils/
│   ├── kpiCalculations.ts     # Business logic calculations
│   └── dataProcessing.ts      # Data loading utilities
├── types/
│   └── dashboard.ts           # TypeScript interfaces
└── public/
    └── data.json             # Mock JSON data file
```

## 🎯 Design choices

The design has aims for a clean architecture with maintanable components. The project aims to have a clean, professional looking UI with easy to use action for changing the demand and easily recognizable changes and clear data table.





