require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000; // Render use 10000

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: '*', // Production ke liye easy rakhte hain
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: { error: 'Too many requests. Please wait 15 minutes.' }
});

// ✅ SAHI PATH: '../1FRONTEND' use kiya hai kyunki tera folder ka naam wahi hai
app.use(express.static(path.join(__dirname, '../1FRONTEND')));

// ─── Helper ───────────────────────────────────────────────────────────────────
const readData = (file) => {
  const filePath = path.join(__dirname, 'data', file);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/projects
app.get('/api/projects', (req, res) => {
  try {
    const projects = readData('projects.json');
    res.json({ success: true, data: projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/skills
app.get('/api/skills', (req, res) => {
  try {
    const skills = readData('skills.json');
    res.json({ success: true, data: skills });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// POST /api/contact
app.post('/api/contact', contactLimiter, (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    // Data save karne ka logic (Render par temporary rahega)
    const messagesPath = path.join(__dirname, 'data', 'messages.json');
    if (!fs.existsSync(path.join(__dirname, 'data'))) {
        fs.mkdirSync(path.join(__dirname, 'data'));
    }
    
    let messages = [];
    if (fs.existsSync(messagesPath)) {
      messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8') || '[]');
    }
    messages.push({ name, email, message, time: new Date() });
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    res.json({ success: true, message: 'Message saved!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ SAHI PATH: Yahan bhi 1FRONTEND kar diya hai
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../1FRONTEND', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});