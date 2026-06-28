// ============================================================
//  script.js — data binding + futuristic FX
// ============================================================

// Personal details — embedded so the page works even when opened
// directly from disk (file://), where fetch() is blocked by browsers.
// On a real server it still tries personal.json so edits there win.
const PERSONAL = {
  name: "Raj Priyadarshi",
  email: "rajpcrj@gmail.com",
  linkedin: "https://linkedin.com/in/raj-priyadarshi-abcd",
  github: "https://github.com/rajpcrj",
  website: "https://rajpcrj.github.io",
  bio: "Passionate software engineer specializing in AI, robotics, and full-stack development."
};

function populatePersonal(data) {
  if (!document.title.includes('Project')) {
    document.title = `${data.name} — Portfolio`;
  }
  const setText = (cls, val) =>
    document.querySelectorAll(cls).forEach(el => (el.textContent = val));
  const setLink = (cls, href) =>
    document.querySelectorAll(cls).forEach(el => { el.href = href; el.textContent = href; });

  setText('.personal-name', data.name);
  setText('.personal-email', data.email);
  setText('.personal-bio', data.bio);
  setLink('.personal-linkedin', data.linkedin);
  setLink('.personal-github', data.github);
}

// 1) Populate immediately from embedded data (always works).
populatePersonal(PERSONAL);

// 2) If served over http(s), try personal.json so external edits override.
if (location.protocol.startsWith('http')) {
  const dataURL = location.pathname.includes('/projects/') ? '../personal.json' : 'personal.json';
  fetch(dataURL)
    .then(r => r.json())
    .then(populatePersonal)
    .catch(() => { /* keep embedded data */ });
}

// ------------------------------------------------------------
//  Particle constellation background
// ------------------------------------------------------------
(function particles() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'fx-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let w, h, pts;
  const COUNT = () => Math.min(90, Math.floor(window.innerWidth / 16));
  const mouse = { x: -999, y: -999 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    pts = Array.from({ length: COUNT() }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 234, 255, 0.55)';
      ctx.fill();
    }
    // link nearby points + mouse
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.strokeStyle = `rgba(120, 160, 255, ${0.14 * (1 - d / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
      if (dm < 160) {
        ctx.strokeStyle = `rgba(157, 107, 255, ${0.35 * (1 - dm / 160)})`;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

// ------------------------------------------------------------
//  Scroll reveal + project hover spotlight
// ------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // Auto-number project cards by their position (1, 2, 3, ...)
  document.querySelectorAll('.projects .project h3').forEach((h3, i) => {
    h3.textContent = `Project ${i + 1}: ${h3.textContent}`;
  });

  document.querySelectorAll('section, .project').forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
});
