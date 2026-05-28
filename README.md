# Nilkanth Kitchen + Cafe — Management System

## Project Structure
```
project/
├── server/          ← Node.js + Express + MongoDB backend
│   ├── models/
│   │   ├── dish.js       (restaurant + cafe dishes, section field)
│   │   ├── order.js      (restaurant table orders)
│   │   └── cafeOrder.js  (cafe orders)
│   ├── controllers/
│   │   ├── adminController.js       (login, combined stats)
│   │   ├── menuController.js        (CRUD with section filter)
│   │   ├── orderController.js       (restaurant orders)
│   │   └── cafeOrderController.js   (cafe orders)
│   ├── routes/
│   │   ├── adminRoutes.js    /api/admin
│   │   ├── menuRoutes.js     /api/menu
│   │   ├── orderRoutes.js    /api/order
│   │   └── cafeRoutes.js     /api/cafe
│   ├── middleware/auth.js     (JWT Bearer token)
│   ├── configs/db.js
│   ├── server.js
│   └── seed.js        ← Run once to fill DB
│
└── client/          ← React + Vite + Tailwind frontend
    └── src/
        ├── Context/
        │   ├── HotelContext.jsx   (restaurant auth + data)
        │   └── CafeContext.jsx    (cafe menu + orders)
        └── Pages/
            ├── Auth/Login.jsx
            ├── Staff/            (restaurant staff)
            ├── Admin/            (admin dashboard)
            └── Cafe/             (cafeteria + kitchen)
```

## Setup Instructions

### 1. Configure environment
Edit `server/.env`:
- Set your MongoDB Atlas URI
- Change ADMIN_PASSWORD and STAFF_PASSWORD
- Set a strong JWT_SECRET (64+ char random string)

### 2. Install & seed backend
```bash
cd server
npm install
npm run seed     # populates DB with all menu items + sample orders
npm run server   # starts server on port 7000
```

### 3. Install & run frontend
```bash
cd client
npm install
npm run dev      # starts on http://localhost:5173
```

## Login Credentials (from .env)
| Role  | Username | Password   | Redirects to |
|-------|----------|------------|-------------|
| Admin | HIT      | HIT@9328   | /admin       |
| Staff | STAFF    | staff2525  | /staff       |

## Routes & Screens

### Public (no login)
- `/cafeteria` — customer self-order cafe menu
- `/login`     — staff/admin login

### Staff (login required)
- `/staff`                  — restaurant table grid
- `/staff/order/:tableId`   — take/edit order for a table
- `/staff/bill/:tableId`    — billing with GST + payment
- `/kitchen`                — cafe kitchen Kanban board

### Admin (admin login required)
- `/admin`            — combined restaurant + cafe dashboard
- `/admin/menulist`   — manage both restaurant & cafe menus
- `/admin/additem`    — add dish to restaurant or cafe

## API Endpoints

### Auth
- POST `/api/admin/login`

### Menu (public read, admin write)
- GET  `/api/menu?section=restaurant|cafe`
- POST `/api/menu/add`
- DELETE `/api/menu/:id`
- PATCH  `/api/menu/:id/toggle`

### Restaurant Orders
- POST  `/api/order/save`
- GET   `/api/order/active`
- PATCH `/api/order/finalize/:tableNumber`

### Cafe Orders
- POST   `/api/cafe/order`           (public — customer)
- GET    `/api/cafe/orders`          (kitchen staff)
- PATCH  `/api/cafe/order/:id/status`
- PATCH  `/api/cafe/order/:id/pay`
- DELETE `/api/cafe/order/:id`

## Key Fixes from Original
1. JWT secret moved to .env — use a strong random value
2. Bearer token parsed correctly in auth middleware
3. corder.js rewritten as cafeOrder.js in full ESM
4. Cafe menu now fetched from DB (not hardcoded static file)
5. Dashboard stats combine restaurant + cafe revenue
6. Environment variable VITE_API_URL replaces hardcoded localhost
7. All routes protected with auth guards (incl. /kitchen)
8. Cafe orders include GST + payment tracking
9. Restaurant tables poll every 15s (was single fetch on mount)
10. .env added to .gitignore
