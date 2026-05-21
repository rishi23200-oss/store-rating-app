# Store Rating App

A full-stack web application where users can browse and rate stores. Built with **Express.js**, **MySQL**, and **React**.

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Backend   | Express.js (Node.js)    |
| Database  | MySQL                   |
| Frontend  | React (Create React App)|
| Auth      | JWT (jsonwebtoken)      |
| Styling   | Custom CSS (no UI lib)  |

---

## User Roles

| Role          | Access                                          |
|---------------|-------------------------------------------------|
| Admin         | Dashboard stats, manage users & stores          |
| Normal User   | Browse stores, submit/update ratings            |
| Store Owner   | View own store's ratings and average score      |

---

## Prerequisites

- Node.js >= 16
- MySQL >= 8.0
- npm

---

## Setup Instructions

### 1. Clone / Extract the project

```bash
cd store-rating-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_db
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=7d
```

Run the database migration (creates DB, tables, and a default admin):

```bash
npm run migrate
```

Start the backend server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The app runs at `http://localhost:3000`

---

## Default Admin Credentials

After running `npm run migrate`:

| Field    | Value                    |
|----------|--------------------------|
| Email    | admin@storerating.com    |
| Password | Admin@123                |

---

## API Endpoints

### Auth
| Method | Endpoint          | Access   | Description        |
|--------|-------------------|----------|--------------------|
| POST   | /api/auth/register| Public   | Register new user  |
| POST   | /api/auth/login   | Public   | Login              |
| PUT    | /api/auth/password| Any auth | Change password    |

### Admin
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/admin/dashboard  | Stats (users/stores/ratings) |
| GET    | /api/admin/users      | List users (filterable)  |
| GET    | /api/admin/users/:id  | User detail              |
| POST   | /api/admin/users      | Create user              |
| GET    | /api/admin/stores     | List stores (filterable) |
| POST   | /api/admin/stores     | Create store             |

### User
| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/stores               | List all stores          |
| POST   | /api/stores/:id/rate      | Submit / update rating   |

### Store Owner
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/owner/dashboard  | Store ratings dashboard  |

---

## Form Validation Rules

| Field    | Rule                                                 |
|----------|------------------------------------------------------|
| Name     | Min 20 chars, Max 60 chars                           |
| Email    | Valid email format                                   |
| Password | 8–16 chars, at least 1 uppercase, 1 special char    |
| Address  | Max 400 chars                                        |
| Rating   | Integer between 1 and 5                              |

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # MySQL connection pool
│   │   │   └── migrate.js       # DB setup + seed
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── adminController.js
│   │   │   ├── storeController.js
│   │   │   └── ownerController.js
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT middleware
│   │   │   └── validate.js      # express-validator rules
│   │   ├── routes/
│   │   │   └── index.js         # All API routes
│   │   └── index.js             # Express app entry
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── common/
    │   │       ├── Navbar.jsx
    │   │       ├── ProtectedRoute.jsx
    │   │       └── StarRating.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ChangePassword.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AdminUsers.jsx
    │   │   ├── AdminUserDetail.jsx
    │   │   ├── AdminAddUser.jsx
    │   │   ├── AdminStores.jsx
    │   │   ├── AdminAddStore.jsx
    │   │   ├── Stores.jsx
    │   │   └── OwnerDashboard.jsx
    │   ├── utils/
    │   │   ├── api.js            # Axios instance
    │   │   └── validators.js     # Client-side validation
    │   ├── App.jsx               # Router + routes
    │   ├── index.js
    │   └── index.css             # Global styles
    └── package.json
```
