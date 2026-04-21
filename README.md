# 🚀 Portfolio — Full Stack (Frontend + Backend)

A sleek dark-themed portfolio for Web Dev · DSA · AI/ML engineers.

---

## 📁 Project Structure

```
portfolio/
├── frontend/
│   └── index.html          # Complete single-page portfolio
├── backend/
│   ├── server.js           # Express API server
│   ├── package.json
│   └── data/
│       ├── projects.json   # Your projects
│       ├── blogs.json      # Your blog posts
│       ├── skills.json     # Your skills & achievements
│       └── resume.pdf      # ← Add your resume here!
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
# Server runs at http://localhost:5000
# Frontend served at http://localhost:5000
```

Open your browser → **http://localhost:5000**

---

## 🛠️ Customization Guide

### Personal Info (frontend/index.html)
Search and replace these placeholders:
- `YOUR NAME` → Your display name (hero heading)
- `Your Name` → Your full name (terminal, footer, contact)
- `you@email.com` → Your email
- `yourusername` → Your GitHub username
- `yourprofile` → Your LinkedIn/LeetCode handle
- `yourhandle` → Your Twitter handle

### Projects (backend/data/projects.json)
Edit the JSON array with your own projects. Fields:
```json
{
  "title": "Project Name",
  "description": "What it does",
  "tags": ["Tech1", "Tech2"],
  "category": "Web" | "DSA" | "AI/ML",
  "github": "https://github.com/...",
  "live": "https://live-demo.com",
  "featured": true
}
```

### Skills (backend/data/skills.json)
Update skill levels (0–100) and achievement numbers.

### Blog Posts (backend/data/blogs.json)
Add your blog posts. Host full content externally (Medium, Hashnode, Dev.to) and link via the `slug`.

### Resume
Drop your `resume.pdf` into `backend/data/resume.pdf`. The download button will work automatically.

---

## 📧 Enable Real Email (Contact Form)

In `backend/server.js`, uncomment the nodemailer section and set:

```bash
# Create a .env file in /backend
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password
CONTACT_EMAIL=where-to-receive@email.com
```

Install dotenv: `npm install dotenv` and add `require('dotenv').config()` at the top of server.js.

---

## 🌐 Deployment

### Frontend only (Netlify / Vercel)
- Deploy the `frontend/` folder
- Set `API` variable in index.html to your deployed backend URL

### Full Stack (Railway / Render / Fly.io)
1. Push entire project to GitHub
2. Connect to Railway/Render
3. Set build command: `cd backend && npm install`
4. Set start command: `node backend/server.js`

### Environment Variables
```
PORT=5000
FRONTEND_URL=https://yourportfolio.com
EMAIL_USER=...
EMAIL_PASS=...
CONTACT_EMAIL=...
```

---

## 🎨 Theming

All colors are CSS variables in `frontend/index.html`:
```css
:root {
  --bg: #060810;       /* Main background */
  --cyan: #00d4ff;     /* Primary accent */
  --green: #00ff88;    /* Secondary accent */
  --purple: #a855f7;   /* Tertiary accent */
}
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/projects?category=DSA` | List projects (filterable) |
| GET | `/api/blogs?category=AI/ML` | List blog previews |
| GET | `/api/blogs/:slug` | Single blog post |
| GET | `/api/skills` | Skills & achievements |
| POST | `/api/contact` | Send contact message |
| GET | `/api/resume` | Download resume PDF |

---

Built with ❤️ using HTML/CSS/JS + Node.js + Express
