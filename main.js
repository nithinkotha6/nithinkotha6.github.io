/**
 * Nithin Kotha — Portfolio
 * main.js — extracted from inline script for cacheability & CSP compliance
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Reveal Observer ─────────────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => revObs.observe(el));

  // ── Stagger Hero Animations ──────────────────────────────────────────────
  // Use DOMContentLoaded (not window.load) so animations fire before images finish loading
  [1, 2, 3, 4, 5].forEach(n =>
    setTimeout(() =>
      document.querySelectorAll(`.stagger-${n}`).forEach(el => el.classList.add('in')),
      n * 140
    )
  );

  // ── Navbar Scroll Effect ─────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 48);
  }, { passive: true });

  // ── Mobile Menu ──────────────────────────────────────────────────────────
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobileMenu');

  function openMenu() {
    menu.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    burger.focus(); // return focus to trigger on close
  }

  burger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close menu on Escape (keyboard accessibility — WCAG 2.1 SC 2.1.2)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu when a nav link is clicked (auto-close on navigation)
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Active Nav Link on Scroll ──────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => secObs.observe(s));

});
