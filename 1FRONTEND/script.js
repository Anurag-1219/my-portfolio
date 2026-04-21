

console.log("script loaded");
  
  /* ══════════════════════════════════════════════════════
   script.js — Anurag Yadav Portfolio
   ══════════════════════════════════════════════════════ */

const API = 'http://localhost:5000/api';

/* 2. CANVAS PARTICLE ANIMATION */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if(!canvas) return;
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.r     = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${0.08 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* 3. TYPEWRITER ANIMATION */
(function typewriter() {
  const roles = ['Web Developer', 'DSA Enthusiast', 'ML Engineer', 'Problem Solver'];
  let ri = 0, ci = 0, deleting = false;
  const el = document.getElementById('role-text');
  if(!el) return;

  function tick() {
    const word = roles[ri];
    if (deleting) {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      setTimeout(tick, 60);
    } else {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(tick, 1800); }
      else setTimeout(tick, 90);
    }
  }
  tick();
})();

/* 4. COUNTER ANIMATION */
function animateCounters() {
  document.querySelectorAll('[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '+';
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 60));

    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.textContent = count + (count === target ? suffix : '');
      if (count >= target) clearInterval(timer);
    }, 25);
  });
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounters();
      statsObs.disconnect();
    }
  });
}, { threshold: 0.5 });
const statsBar = document.querySelector('.stats-bar');
if(statsBar) statsObs.observe(statsBar);

/* 5. SCROLL FADE-IN OBSERVER */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

function refreshFadeObservers() {
    document.querySelectorAll('.fade-in').forEach(el => fadeObs.observe(el));
}

/* 6. SKILL BAR OBSERVER (FIXED) */
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const bars = e.target.querySelectorAll('.skill-fill');
      // Sirf tab animate karo jab API data se bars render ho chuki hon
      if (bars.length > 0) {
        bars.forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        skillObs.unobserve(e.target);
      }
    }
  });
}, { threshold: 0.2 });

/* 7. PROJECTS — LOAD & RENDER (FIXED) */
let allProjects = []; 

async function loadProjects(filter = 'All') {
  const grid = document.getElementById('projects-grid');
  if(!grid) return;

  if (!allProjects.length) {
    grid.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>';
    try {
      const r = await fetch(`${API}/projects`);
      const d = await r.json();
      allProjects = d.data;
    } catch {
      allProjects = [
        { id: 1, title: 'NeuralNet Visualizer', description: 'Interactive DL visualization.', tags: ['Python', 'D3.js'], category: 'AI/ML', github: '#', live: '#' },
        { id: 2, title: 'AlgoArena', description: 'Competitive DSA platform.', tags: ['React', 'Docker'], category: 'DSA', github: '#', live: '#' },
        { id: 3, title: 'DevFlow', description: 'Productivity dashboard.', tags: ['Next.js', 'OpenAI'], category: 'Web', github: '#', live: '#' },
        { id: 4, title: 'ChatMind', description: 'RAG knowledge base.', tags: ['LangChain', 'React'], category: 'AI/ML', github: '#', live: '' },
        { id: 5, title: 'Graph Pathfinder', description: 'Graph algorithm playground.', tags: ['JS', 'Canvas'], category: 'DSA', github: '#', live: '#' },
        { id: 6, title: 'SentimentStream', description: 'Sentiment analysis pipeline.', tags: ['Python', 'BERT'], category: 'AI/ML', github: '#', live: '' }
      ];
    }
  }

  const filtered = filter === 'All' ? allProjects : allProjects.filter(p => p.category === filter);
  const catClass = { Web: 'cat-web', DSA: 'cat-dsa', 'AI/ML': 'cat-aiml' };

  grid.innerHTML = filtered.map(p => `
    <div class="project-card fade-in">
      <div class="project-top">
        <span class="project-cat ${catClass[p.category] || ''}">${p.category}</span>
        <div class="project-links">
          ${p.github ? `<a href="${p.github}" target="_blank">⌥</a>` : ''}
          ${p.live   ? `<a href="${p.live}"   target="_blank">↗</a>` : ''}
        </div>
      </div>
      <div class="project-title">${p.title}</div>
      <div class="project-desc">${p.description}</div>
      <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>
  `).join('');

  // Sync Fix: Naye injected cards ko observe karo
  refreshFadeObservers();
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadProjects(btn.dataset.filter);
  });
});

/* 8. BLOG — LOAD & RENDER */
async function loadBlogs() {
  const blogGrid = document.getElementById('blogs-grid');
  if(!blogGrid) return;
  try {
    const r = await fetch(`${API}/blogs`);
    const d = await r.json();
    renderBlogs(d.data);
  } catch {
    renderBlogs([
      { id: 1, title: 'Graph Visualizer', excerpt: 'Canvas API tricks.', tags: ['DSA'], date: '2024-11-15', readTime: '8 min', slug: 'graph-viz' },
      { id: 2, title: 'RAG Architecture', excerpt: 'Building ChatMind.', tags: ['AI/ML'], date: '2024-10-02', readTime: '12 min', slug: 'rag-chatmind' }
    ]);
  }
}

function renderBlogs(blogs) {
  const blogGrid = document.getElementById('blogs-grid');
  blogGrid.innerHTML = blogs.map(b => `
    <div class="blog-card fade-in" onclick="openBlog('${b.slug}')">
      <div class="blog-meta">
        <span>${new Date(b.date).toLocaleDateString()}</span>
        <span>${b.readTime}</span>
      </div>
      <div class="blog-title">${b.title}</div>
      <div class="blog-excerpt">${b.excerpt}</div>
      <div class="blog-arrow">Read more →</div>
    </div>
  `).join('');
  refreshFadeObservers();
}

function openBlog(slug) { showToast('Blog reader coming soon! 🚀'); }

/* 9. SKILLS — LOAD & RENDER */
async function loadSkills() {
  try {
    const r = await fetch(`${API}/skills`);
    const d = await r.json();
    renderSkills(d.data);
  } catch {
    renderSkills({
      categories: [
        { name: 'Web Dev', icon: '🌐', skills: [{ name: 'React', level: 72 }, { name: 'Node.js', level: 70 }] },
        { name: 'DSA', icon: '⚡', skills: [{ name: 'DP', level: 70 }, { name: 'Graphs', level: 68 }] }
      ],
      achievements: [
        { label: 'LeetCode', value: '50+', icon: '🏆' },
        { label: 'GitHub', value: '5+', icon: '📦' }
      ]
    });
  }
}

function renderSkills(data) {
  const achRow = document.getElementById('achievements-row');
  const skillGrid = document.getElementById('skills-grid');
  
  if(achRow) achRow.innerHTML = data.achievements.map(a => `
    <div class="achievement-card">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-val">${a.value}</div>
      <div class="ach-label">${a.label}</div>
    </div>
  `).join('');

  if(skillGrid) skillGrid.innerHTML = data.categories.map(cat => `
    <div class="skill-category fade-in">
      <div class="skill-cat-header"><span>${cat.icon}</span> <span>${cat.name}</span></div>
      ${cat.skills.map(s => `
        <div class="skill-item">
          <div class="skill-meta"><span>${s.name}</span> <span>${s.level}%</span></div>
          <div class="skill-bar"><div class="skill-fill" data-width="${s.level}" style="width:0"></div></div>
        </div>
      `).join('')}
    </div>
  `).join('');

  document.querySelectorAll('.skill-category').forEach(el => {
    skillObs.observe(el);
    fadeObs.observe(el);
  });
}

/* 10. CONTACT FORM */
async function sendMessage() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const btn = document.getElementById('submit-btn');

  if (!name || !email || !message) {
    showStatus('error', '⚠️ Fill all fields.');
    return;
  }

  btn.disabled = true; btn.textContent = 'SENDING...';

  try {
    const r = await fetch(`${API}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    showStatus('success', '✅ Sent!');
  } catch {
    showStatus('success', '✅ Message received (Demo)!');
  } finally {
    btn.disabled = false; btn.textContent = 'SEND MESSAGE →';
  }
}

function showStatus(type, msg) {
  const el = document.getElementById('form-status');
  if(el) { el.textContent = msg; el.className = 'form-status ' + type; }
}

/* 11-13. UTILS */
function downloadResume() {
  fetch(`${API}/resume`).then(r => r.blob()).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'Resume.pdf'; a.click();
  }).catch(() => showToast('📄 Add resume.pdf to backend.'));
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if(t) { t.textContent = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3500); }
}

function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  if(nav) nav.classList.toggle('open');
}

/* 14. INIT (FIXED SYNC) */
document.addEventListener("DOMContentLoaded", async () => {
  // Static observers initialize karo
  refreshFadeObservers();

  // API Data fetch karo aur DOM hydrate hone ka wait karo
  await Promise.all([
    loadProjects(),
    loadSkills(),
    loadBlogs()
  ]);
  
  console.log("All data loaded and UI hydrated correctly.");
});