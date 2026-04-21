/* ═══════════════════════════════════════════════════════════════════
   AXOLOTOL751 — script.js
   Scroll Reveal · Theme Toggle · Language Toggle · Nav Shrink
═══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────
   1. SCROLL REVEAL — Intersection Observer API
      Animates .reveal (sections) and .reveal-child (gallery cards)
      CSS easing: cubic-bezier(0.16, 1, 0.3, 1) — defined in --ease-organic
───────────────────────────────────────────────────────────────── */

/**
 * Creates an observer that adds .is-visible once an element enters
 * the viewport, then immediately unobserves it (one-shot reveal).
 */
function createRevealObserver(options = {}) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // fire once → better perf
      }
    });
  }, options);
}

// Observer for top-level bento cards (.reveal)
const sectionObserver = createRevealObserver({
  threshold:   0.08,
  rootMargin: '0px 0px -40px 0px',
});

// Observer for gallery project cards (.reveal-child) — fires earlier
const cardObserver = createRevealObserver({
  threshold:   0.04,
  rootMargin: '0px 0px -20px 0px',
});

// Attach observers
document.querySelectorAll('.reveal').forEach(el => sectionObserver.observe(el));
document.querySelectorAll('.reveal-child').forEach(el => cardObserver.observe(el));

// Hero card is always visible — mark immediately so reveal-child
// stagger delays still apply when gallery scrolls into view
const heroCard = document.querySelector('.bento-card--hero');
if (heroCard) heroCard.classList.add('is-visible');


/* ─────────────────────────────────────────────────────────────────
   2. THEME TOGGLE  (dark ↔ light)
   Persisted in localStorage
───────────────────────────────────────────────────────────────── */

const themeBtn  = document.getElementById('themeToggle');
const htmlEl    = document.documentElement;
const THEME_KEY = 'ax_theme';

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);

  const label = themeBtn.querySelector('.theme-label');
  const icon  = themeBtn.querySelector('.theme-icon');
  if (theme === 'dark') {
    if (label) label.textContent = 'LIGHT';
    if (icon)  icon.textContent  = '◐';
  } else {
    if (label) label.textContent = 'DARK';
    if (icon)  icon.textContent  = '●';
  }
}

// Load saved preference (default: dark)
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


/* ─────────────────────────────────────────────────────────────────
   3. LANGUAGE TOGGLE (RU ↔ EN)
   Swaps text for data-i18n-keyed elements
───────────────────────────────────────────────────────────────── */

const langBtn = document.getElementById('langToggle');

const i18n = {
  ru: {
    available:       'Доступен для работы',
    role:            '3D Artist',
    bio:             'Minecraft 3D Artist & Blender энтузиаст.\nСоздаю атмосферные миры из блоков.',
    about_title:     'Обо мне',
    about_text:      'Начинающий 3D-художник, специализирующийся на кинематографичных визуализациях Minecraft. Фокус на освещении и композиции.',
    status_value:    'Open to Work',
    status_sub:      'Коммерческие проекты',
    portfolio_btn:   'Портфолио',
    portfolio_count: '9 проектов',
    gallery_title:   'Избранные работы',
    contact_title:   'Давайте работать вместе',
    contact_sub:     'Открыт для коммерческих предложений и коллабораций',
    footer_love:     'Сделано с {heart} и много кофеина',
  },
  en: {
    available:       'Available for work',
    role:            '3D Artist',
    bio:             'Minecraft 3D Artist & Blender enthusiast.\nI craft atmospheric worlds from blocks.',
    about_title:     'About me',
    about_text:      'An emerging 3D artist specialising in cinematic Minecraft visualisations. Focus on lighting and composition.',
    status_value:    'Open to Work',
    status_sub:      'Commercial projects',
    portfolio_btn:   'Portfolio',
    portfolio_count: '9 projects',
    gallery_title:   'Featured works',
    contact_title:   "Let's work together",
    contact_sub:     'Open to commercial offers and collaborations',
    footer_love:     'Made with {heart} and lots of caffeine',
  },
};

let currentLang = 'ru';

function applyTranslations(lang) {
  const t = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!t[key]) return;

    // Special handling for footer heart HTML
    if (key === 'footer_love') {
      el.innerHTML = t[key].replace(
        '{heart}',
        '<span class="footer__heart" aria-hidden="true">♥</span>'
      );
      return;
    }

    // Bio keeps <br> line break
    if (key === 'bio') {
      el.innerHTML = t[key].replace('\n', '<br>');
      return;
    }

    // Portfolio button keeps arrow span
    if (key === 'portfolio_btn') {
      const arrow = el.closest('.plink__btn')?.querySelector('.plink__arrow');
      el.textContent = t[key];
      if (arrow) el.closest('.plink__btn').appendChild(arrow); // re-attach
      return;
    }

    el.textContent = t[key];
  });

  // Status badge: rebuild inner HTML to keep dot alive
  const badge = document.querySelector('.status-badge');
  if (badge) {
    badge.innerHTML = `<span class="status-dot"></span><span data-i18n="available">${t.available}</span>`;
  }
}

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  langBtn.textContent = currentLang.toUpperCase();
  applyTranslations(currentLang);
});


/* ─────────────────────────────────────────────────────────────────
   4. NAV SHRINK on scroll
───────────────────────────────────────────────────────────────── */

const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.style.padding = '10px var(--pad)';
  } else {
    nav.style.padding = '14px var(--pad)';
  }
}, { passive: true });


/* ─────────────────────────────────────────────────────────────────
   5. PROJECT CARD — cursor-tracked radial glow
      Sets CSS custom props --mx / --my that drive a
      background-image radial-gradient in CSS (optional enhancement).
      Cards look great even without this; it's a subtle layer.
───────────────────────────────────────────────────────────────── */

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width)  * 100;
    const y = ((e.clientY - top)  / height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mx', '50%');
    card.style.setProperty('--my', '50%');
  });
});


/* ─────────────────────────────────────────────────────────────────
   6. SMOOTH ANCHOR SCROLL with offset for sticky nav
───────────────────────────────────────────────────────────────── */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id     = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const navHeight = nav?.offsetHeight ?? 64;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});
