require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Rate limiter for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many requests. Please wait 15 minutes.' }
});

// Serve static frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ─── Helper ───────────────────────────────────────────────────────────────────
const readData = (file) => {
  const filePath = path.join(__dirname, 'data', file);
  // Check if file exists before reading
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
    const { category, featured } = req.query;

    let filtered = projects;
    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }
    if (featured === 'true') {
      filtered = filtered.filter(p => p.featured);
    }

    res.json({ success: true, data: filtered, total: filtered.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/blogs
app.get('/api/blogs', (req, res) => {
  try {
    const blogs = readData('blogs.json');
    const { category } = req.query;

    let filtered = blogs;
    if (category && category !== 'All') {
      filtered = filtered.filter(b => b.category === category);
    }

    const preview = filtered.map(({ content, ...rest }) => rest);
    res.json({ success: true, data: preview, total: preview.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:slug
app.get('/api/blogs/:slug', (req, res) => {
  try {
    const blogs = readData('blogs.json');
    const blog = blogs.find(b => b.slug === req.params.slug);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog' });
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

// POST /api/contact - AB YE DATA SAVE KAREGA
app.post('/api/contact', contactLimiter, (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    // Logic to save message in messages.json
    const messagesPath = path.join(__dirname, 'data', 'messages.json');
    let messages = [];

    if (fs.existsSync(messagesPath)) {
      const fileData = fs.readFileSync(messagesPath, 'utf-8');
      messages = JSON.parse(fileData || '[]');
    }

    const newMessage = {
      id: Date.now(),
      name,
      email,
      subject: subject || 'N/A',
      message,
      time: new Date().toISOString()
    };

    messages.push(newMessage);
    fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2));

    console.log(`\n✅ Message Saved from: ${name}`);

    res.json({
      success: true,
      message: 'Message received! I\'ll get back to you within 24 hours. 🚀'
    });
  } catch (err) {
    console.error('Contact error:', err);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

// GET /api/resume
app.get('/api/resume', (req, res) => {
  const resumePath = path.join(__dirname, 'data', 'resume.pdf');
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ error: 'Resume not found.' });
  }
  res.sendFile(resumePath);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
});