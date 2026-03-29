# GUIDE ME — AI Roadmap Generator

An AI-powered learning roadmap generator with chatbot interface.

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env and fill in your MongoDB URI and JWT secret
```

3. **Run in development**
```bash
npm run dev
```

4. **Run in production**
```bash
npm start
```

The server runs on `http://localhost:5000`.
Open `http://localhost:5000/index.html` in your browser.

## Project Structure

```
├── server.js           # Entry point
├── app.js              # Express app setup
├── config/
│   ├── appConfig.js    # Middleware + static files
│   └── dbConfig.js     # MongoDB connection
├── controllers/        # Route handlers
├── middleware/
│   └── authMiddleware.js  # JWT auth
├── models/             # Mongoose schemas
├── routes/             # Express routers
├── services/
│   └── aiService.js    # AI integration (to implement)
└── project/            # Frontend (HTML/CSS/JS)
    ├── index.html      # Landing page
    ├── login.html
    ├── register.html
    └── app/            # Protected app pages
```

## API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/user/register | ❌ | Register |
| POST | /api/user/login | ❌ | Login |
| GET | /api/user/profile | ✅ | Get current user |
| PUT | /api/user/update | ✅ | Update profile |
| PUT | /api/user/changePassword | ✅ | Change password |
| DELETE | /api/user/delete | ✅ | Delete account |
| POST | /api/roadmap/create | ✅ | Create roadmap |
| GET | /api/roadmap/getAll | ✅ | Get all user roadmaps |
| GET | /api/roadmap/get/:id | ✅ | Get roadmap by ID |
| PUT | /api/roadmap/updateChapter/:id/:chapterId | ✅ | Mark chapter complete |
| PUT | /api/roadmap/update/:id | ✅ | Update roadmap |
| DELETE | /api/roadmap/delete/:id | ✅ | Delete roadmap |
| GET | /stats/userStats | ✅ | User statistics |
| GET | /stats/generalStats | ❌ | Global statistics |
