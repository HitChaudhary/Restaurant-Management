# 🍽️ Nilkanth Kitchen + Cafe — Management System

A full-stack POS and order management system that handles both a 
sit-down restaurant and a self-order cafe under one roof.

## ✨ Features

### 🍛 Restaurant Side
- Table grid with live occupied/free status
- Staff take & edit orders per table
- Automatic GST billing with Cash / UPI / Card payment
- Kitchen view with real-time order polling

### ☕ Cafe Side  
- Customer self-order menu (no staff needed)
- Order token system (C-001, C-002...)
- Kanban kitchen board — New → Preparing → Ready
- Payment recording per order

### 🛠️ Admin Panel
- Combined revenue dashboard (restaurant + cafe)
- Add menu items to restaurant or cafe separately
- Toggle item availability live
- Top-selling items per section

## 🔧 Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT (role-based: admin / staff) |
| Charts | Chart.js + react-chartjs-2 |
