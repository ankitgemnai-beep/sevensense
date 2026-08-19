# Seven Sense - Backend API

This is the backend server for the Seven Sense AI Wardrobe Concierge app. It is built using **NestJS**, **MongoDB (Mongoose)**, and integrates with **Google Gemini AI** for outfit recommendations.

## Tech Stack
- **Framework:** NestJS (Node.js)
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Authentication:** JWT & bcrypt
- **AI Engine:** Google Gemini (Generative Language API)
- **Image Storage:** Cloudinary

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root of the `backend` folder (next to this README) and add the following keys. **(Do not commit the `.env` file to GitHub)**:

```env
APP_ENV=development

# Database
MONGODB_URI=your_mongodb_atlas_uri
MONGODB_DB_NAME=ankitgemnai_db_user

# Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Cloudinary (Images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=seven-sense

# AI (Google Gemini)
AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent
AI_API_KEY=your_gemini_api_key
```

### 3. Start the Server
To start the server in watch mode (auto-restarts when you save files):
```bash
npm run start:dev
```
The server will run on `http://localhost:3000`.

*(Note: If testing on a physical mobile device, the mobile app needs to point to your computer's local Wi-Fi IP address, not localhost).*

---

## ☁️ Deployment (Render)

This backend is optimized to be deployed on [Render.com](https://render.com).

1. Push this folder to a GitHub repository.
2. Create a **New Web Service** on Render and link your repository.
3. Use the following settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
4. Copy your keys from your `.env` file into Render's **Environment Variables** section.

---

## 📁 Architecture
- `/src/auth` - JWT login and registration.
- `/src/users` - User profile data model and logic.
- `/src/wardrobe` - CRUD operations for clothing items.
- `/src/recommendations` - Google Gemini AI integration and prompt engineering for generating daily outfit looks.
- `/src/commerce` - Shopping intelligence.
