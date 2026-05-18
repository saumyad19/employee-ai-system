# ⚡ Employee AI Analytics System
### AI-Powered MERN Stack Employee Performance Management

---

## 📁 Project Structure
```
employee-ai-system/
├── backend/
│   ├── controllers/      # Business logic
│   ├── middleware/        # JWT auth middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── .env               # ⚠️ CHANGE THIS FILE
│   ├── package.json
│   └── server.js          # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # Navbar
    │   ├── context/       # Auth context
    │   ├── pages/         # All pages
    │   └── utils/         # API helpers
    ├── index.html
    └── package.json
```

---

## 🔧 STEP 1: MANDATORY CHANGES (Ye zaroor karo)

### 1. MongoDB Setup
1. Jao: https://cloud.mongodb.com
2. Sign Up / Login karo
3. Free cluster banao (M0 - Free)
4. "Connect" → "Drivers" select karo
5. Connection string copy karo
6. `backend/.env` file mein paste karo:
```
MONGO_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/employeeDB?retryWrites=true&w=majority
```

### 2. OpenRouter API Key (AI ke liye)
1. Jao: https://openrouter.ai
2. Sign Up karo (free hai)
3. "API Keys" section mein jao
4. New key banao
5. `backend/.env` mein paste karo:
```
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
```

### 3. JWT Secret
```
JWT_SECRET=koi_bhi_random_string_likho_yahan_jaise_myapp123secret
```

---

## 🚀 STEP 2: Local Setup Karo

### Backend Start Karo
```bash
cd employee-ai-system/backend
npm install
npm run dev
```
Backend chalega: http://localhost:5000

### Frontend Start Karo (New Terminal)
```bash
cd employee-ai-system/frontend
npm install
npm run dev
```
Frontend chalega: http://localhost:5173

---

## 🌐 STEP 3: Render pe Deploy Karo

### Backend Deploy
1. GitHub pe push karo
2. render.com pe jao → "New Web Service"
3. GitHub repo connect karo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Environment Variables add karo (sab wahi jo .env mein hain)
6. Deploy karo → URL milega (e.g. https://yourapp-api.onrender.com)

### Frontend Deploy
1. render.com → "New Static Site"
2. Same repo connect karo
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
4. Environment Variable:
   - `VITE_API_URL` = your backend render URL
5. **IMPORTANT**: `frontend/src/utils/api.js` mein change karo:
   - `axios.defaults.baseURL` = your backend URL

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/employees | Add employee |
| GET | /api/employees | Get all |
| GET | /api/employees/search | Search/filter |
| PUT | /api/employees/:id | Update |
| DELETE | /api/employees/:id | Delete |
| POST | /api/ai/recommend | AI recommendation |
| POST | /api/ai/rank | Rank all employees |
| POST | /api/ai/training | Training suggestions |

---

## 🔐 Test Accounts
Pehle signup karo website pe ya Postman se:
```json
POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "admin123",
  "role": "admin"
}
```

---

## ⚠️ Common Issues

**MongoDB connection fail?**
- IP Address whitelist karo MongoDB Atlas mein: 0.0.0.0/0 (Allow from anywhere)
- Username/password sahi check karo

**AI API not working?**
- OpenRouter key sahi hai? Credits hain?
- Model name check karo: `mistralai/mistral-7b-instruct`

**CORS error frontend se?**
- `backend/.env` mein FRONTEND_URL sahi daalo
- Development: `http://localhost:5173`
- Production: apna Render frontend URL

---

## 📊 Features
- ✅ JWT Authentication (Login/Signup)
- ✅ Employee CRUD (Add, View, Edit, Delete)
- ✅ Search & Filter by Department/Name
- ✅ AI Recommendations (OpenRouter)
- ✅ AI Employee Ranking
- ✅ AI Training Suggestions
- ✅ Dashboard with Charts (Recharts)
- ✅ Responsive Dark UI
- ✅ Protected Routes
- ✅ bcrypt Password Hashing
