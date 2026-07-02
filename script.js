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

// 2) On the HOMEPAGE only, served over http(s), try personal.json so external
//    edits override. Project pages are self-contained: they render entirely from
//    the embedded PERSONAL data above and never fetch a shared root file (so no
//    404s from inside /projects/<name>/).
const isProjectPage = location.pathname.includes('/projects/');
if (location.protocol.startsWith('http') && !isProjectPage) {
  fetch('personal.json')
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
// Default ordering — mirrors project_index_list.json so reordering works on
// file:// too (where fetch is blocked). Lower 'order' first; ties → A→Z by title.
const PROJECT_ORDER = {
  go2:            1,
  space_robotics: 2,
  shm_fanout:     3,
  sprout:         4,
  home_safety_fall_detection_smart_stove_control: 5,
  breez_bipap_ventilator: 6
};

// Reorder the homepage cards by an {id: order} map, then (re)apply the
// "Project N:" numbering to match the new visual order.
function applyProjectOrder(orderMap) {
  const grid = document.querySelector('.projects');
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.project'));
  if (!cards.length) return;

  const baseTitle = (card) => {
    const h3 = card.querySelector('h3');
    // strip any existing "Project N: " prefix so sorting/relabel is stable
    return h3 ? h3.textContent.replace(/^Project\s+\d+:\s*/, '') : '';
  };

  cards
    .map((card, i) => ({ card, i, title: baseTitle(card) }))
    .sort((a, b) => {
      const oa = orderMap[a.card.dataset.id] ?? 999;
      const ob = orderMap[b.card.dataset.id] ?? 999;
      if (oa !== ob) return oa - ob;                 // by manual number
      const t = a.title.localeCompare(b.title);      // ties: alphabetical
      return t !== 0 ? t : a.i - b.i;
    })
    .forEach(({ card }) => grid.appendChild(card));   // re-insert in new order

  // Renumber after reordering
  grid.querySelectorAll('.project h3').forEach((h3, i) => {
    h3.textContent = `Project ${i + 1}: ${baseTitle(h3.closest('.project'))}`;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // 1) Order immediately from embedded defaults (always works, incl. file://).
  applyProjectOrder(PROJECT_ORDER);

  // 2) On the HOMEPAGE only, over http(s), load project_index_list.json so manual
  //    edits take effect. Project pages have no card grid, so they skip this fetch
  //    entirely and stay fully self-contained (no 404 for the shared root file).
  if (location.protocol.startsWith('http') && !location.pathname.includes('/projects/')) {
    fetch('project_index_list.json')
      .then(r => r.json())
      .then(cfg => {
        const map = {};
        (cfg.projects || []).forEach(p => { map[p.id] = p.order; });
        applyProjectOrder(map);
      })
      .catch(() => { /* keep embedded order */ });
  }

  const revealEls = document.querySelectorAll('section, .project');
  revealEls.forEach(el => el.classList.add('reveal'));

  const showAll = () => revealEls.forEach(el => el.classList.add('visible'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));

    // Fail-safe: immediately reveal anything already on/near screen at load
    // (e.g. a project page whose only <section> sits below a tall header and
    // never scrolls, so the observer would otherwise never fire).
    requestAnimationFrame(() => {
      revealEls.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.25) el.classList.add('visible');
      });
    });
    // Absolute backstop: after 1.2s, reveal everything no matter what.
    setTimeout(showAll, 1200);
  } else {
    // No IntersectionObserver support → just show everything.
    showAll();
  }

  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
});
