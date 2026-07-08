/* ============================================================
   UTAH WATER WELL ALLIANCE — Main JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mainNav   = document.querySelector('.main-nav');
  const navCta    = document.querySelector('.nav-cta');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      if (navCta) navCta.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  /* Close nav on link click */
  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav) mainNav.classList.remove('open');
      if (navCta) navCta.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ── Active Nav Link ── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath) link.classList.add('active');
  });

  /* ── Sticky Header Shadow ── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.25)'
      : '0 2px 8px rgba(0,0,0,0.15)';
  }, { passive: true });

  /* ── Scroll Animations ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.service-card, .why-card, .tech-item, .process-step, .guide-step, .testimonial-card, .area-pill').forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });

  /* ── Contact Form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const success = document.getElementById('formSuccess');
      const original = btn.textContent;

      btn.textContent = 'Sending…';
      btn.disabled = true;

      /* Netlify Forms handles submission automatically when action="" */
      try {
        const data = new FormData(form);
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
        form.reset();
        if (success) success.style.display = 'block';
      } catch {
        btn.textContent = 'Error — Please Call Us';
        btn.disabled = false;
        return;
      }

      btn.textContent = '✓ Sent!';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 4000);
    });
  }

  /* ── Guide TOC Active State ── */
  const tocLinks = document.querySelectorAll('.guide-toc a');
  if (tocLinks.length) {
    const sectionIds = [...tocLinks].map(a => a.getAttribute('href').replace('#', ''));
    const sections   = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

    const tocObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.guide-toc a[href="#${entry.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px' });

    sections.forEach(s => tocObserver.observe(s));
  }

  /* ── Phone Number Tracking Placeholder ── */
  /* Replace with CallRail swap tag when ready */
  const PHONE_DISPLAY = '(435) 500-2479';
  const PHONE_HREF    = 'tel:+14355002479';
  document.querySelectorAll('[data-phone]').forEach(el => {
    el.textContent = PHONE_DISPLAY;
    if (el.tagName === 'A') el.href = PHONE_HREF;
  });

});

/* ── CSS Animation Helpers ── */
const style = document.createElement('style');
style.textContent = `
  .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
