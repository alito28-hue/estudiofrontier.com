// ---- footer year ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- mobile menu ----
const navToggle = document.getElementById('nav-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

const openMobileMenu = () => {
  mobileMenu.classList.add('is-open');
  navToggle.setAttribute('aria-expanded', 'true');
};
const closeMobileMenu = () => {
  mobileMenu.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', openMobileMenu);
  mobileMenuClose.addEventListener('click', closeMobileMenu);
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// ---- header solid state + scroll progress + parallax ----
const header = document.getElementById('site-header');
const progress = document.getElementById('scroll-progress');
const parallaxEls = [...document.querySelectorAll('[data-parallax]')].map((el) => ({
  el,
  speed: parseFloat(el.getAttribute('data-parallax')) || 0,
}));

let scrollRaf = null;
const onScrollTick = () => {
  scrollRaf = null;
  const y = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = (docHeight > 0 ? (y / docHeight) * 100 : 0) + '%';
  if (header) header.classList.toggle('is-solid', y > 60);

  const vh = window.innerHeight;
  parallaxEls.forEach(({ el, speed }) => {
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2 - vh / 2;
    el.style.transform = `translateY(${(center * speed).toFixed(1)}px)`;
  });
};

window.addEventListener(
  'scroll',
  () => {
    if (scrollRaf == null) scrollRaf = requestAnimationFrame(onScrollTick);
  },
  { passive: true }
);
window.addEventListener('resize', onScrollTick, { passive: true });
onScrollTick();

// ---- scroll reveals ----
// Probe whether the page can actually scroll before hiding below-the-fold
// elements — in non-scrolling embeds this guards against content getting
// stuck invisible with no scroll event to ever reveal it.
const revealEls = [...document.querySelectorAll('[data-reveal]')];
const startY = window.scrollY || 0;
window.scrollTo(0, startY + 14);
requestAnimationFrame(() => {
  const moved = Math.abs((window.scrollY || 0) - startY) > 2;
  window.scrollTo(0, startY);
  if (!moved) return;

  const vh = window.innerHeight;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('is-pending');
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0, rootMargin: '0px 0px -15% 0px' }
  );

  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
    if (delay) el.style.transitionDelay = delay + 'ms';
    if (rect.top >= vh * 0.85) {
      el.classList.add('is-pending');
      observer.observe(el);
    } else {
      el.classList.add('is-visible');
    }
  });
});

// ---- contact form: send via serverless API ----
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const defaultLabel = submitBtn ? submitBtn.textContent : '';

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!submitBtn) return;

    const data = Object.fromEntries(new FormData(contactForm).entries());
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('request failed');
      submitBtn.textContent = 'Mensaje enviado ✓';
      contactForm.reset();
    } catch (err) {
      submitBtn.textContent = 'Error, intente de nuevo';
    } finally {
      setTimeout(() => {
        submitBtn.textContent = defaultLabel;
        submitBtn.disabled = false;
      }, 3500);
    }
  });
}
