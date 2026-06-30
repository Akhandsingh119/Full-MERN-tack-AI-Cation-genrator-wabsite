# 🖥️ Backend — AI Caption Generator API

This is the **RESTful backend API** for the AI Caption Generator application. Built with **Node.js** and **Express.js**, it handles user authentication, image uploads, AI caption generation via **Google Gemini**, and real-time notifications.

---

## 🛠️ Tech Stack

| Technology               | Purpose                                  |
|--------------------------|------------------------------------------|
| **Node.js + Express 5**  | Web server & routing framework           |
| **MongoDB + Mongoose 9** | Database & data modeling                 |
| **Redis**                | Rate limiting & caching                  |
| **Google Gemini AI**     | AI-powered caption generation            |
| **ImageKit**             | Image upload, storage & CDN delivery     |
| **JWT + bcrypt**         | Authentication & password hashing        |
| **Multer**               | Multipart form-data (image uploads)      |
| **dotenv**               | Environment variable management          |

---

## 📁 Directory Structure

```
Backend/
├── server.js           # Entry point — initializes DB, Redis, and starts server
└── src/
    ├── App/            # Express app setup, CORS, and middleware registration
    ├── Database/
    │   ├── Db.js       # MongoDB connection
    │   └── Redis.js    # Redis connection (for rate limiting)
    ├── Model/
    │   ├── user.model.js          # User schema (name, email, password hash)
    │   ├── Post.model.js          # Post/Caption schema (image URL, caption, owner)
    │   └── Notification.model.js  # Notification schema
    ├── Routes/
    │   ├── auth.routes.js         # /api/auth — register, login, logout
    │   ├── post.routes.js         # /api/post — create & fetch caption posts
    │   └── notification.routes.js # /api/notification — fetch & mark as read
    ├── controler/      # Business logic for each route
    ├── Service/        # Gemini AI & ImageKit service wrappers
    └── middleware1/    # JWT auth guard, rate limiter
```

---

## ⚙️ Setup and Installation

### 1. Navigate to the backend directory

```bash
cd Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `Backend/` root directory:

```env
# Server
PORT=3000

# MongoDB Atlas
Mongo_Db=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_token=your_super_secret_jwt_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# ImageKit
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_SECREAT_KEY=your_imagekit_private_key

# Rate Limiting (Redis)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=20
```

> ⚠️ **Never commit your `.env` file to version control.** It is already listed in `.gitignore`.

### 4. Start the Server

```bash
# Development
node server.js

# With auto-reload (install nodemon globally first: npm i -g nodemon)
nodemon server.js
```

The server runs at **`http://localhost:3000`**.

---

## 🔌 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint             | Description                     | Auth Required |
|--------|----------------------|---------------------------------|---------------|
| `POST` | `/api/auth/register` | Register a new user             | ❌            |
| `POST` | `/api/auth/login`    | Login and receive a JWT cookie  | ❌            |
| `POST` | `/api/auth/logout`   | Clear session cookie            | ✅            |

### Posts / Captions (`/api/post`)

| Method | Endpoint         | Description                              | Auth Required |
|--------|------------------|------------------------------------------|---------------|
| `POST` | `/api/post`      | Upload image, generate & save AI caption | ✅            |
| `GET`  | `/api/post`      | Fetch all caption posts for current user | ✅            |

### Notifications (`/api/notification`)

| Method  | Endpoint                     | Description                       | Auth Required |
|---------|------------------------------|-----------------------------------|---------------|
| `GET`   | `/api/notification`          | Fetch all notifications for user  | ✅            |
| `PATCH` | `/api/notification/:id/read` | Mark a notification as read       | ✅            |

---

## 🔒 Rate Limiting

All API routes are protected by a **Redis-backed rate limiter**:
- **Window**: `60,000 ms` (1 minute) — configurable via `RATE_LIMIT_WINDOW_MS`
- **Max Requests**: `20` per window — configurable via `RATE_LIMIT_MAX_REQUESTS`

Exceeding the limit returns a `429 Too Many Requests` response.
