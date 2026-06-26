/* ============================================================
   ColorSpark — animations.js
   IntersectionObserver scroll reveals + floating shapes
   ============================================================ */
(function () {
  'use strict';

  /* ── Scroll Reveal ──────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  function initReveal() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => revealObserver.observe(el));
  }

  /* ── Counter Animation ──────────────────────────────────── */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count || el.textContent.replace(/[^0-9.]/g, ''));
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const step = 16;
    const steps = duration / step;
    let current = 0;
    const increment = target / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + (isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString()) + suffix;
    }, step);
  }

  function initCounters() {
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
      counterObserver.observe(el);
    });
  }

  /* ── Progress Bars ──────────────────────────────────────── */
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        if (fill) fill.style.width = fill.dataset.width || '80%';
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  function initProgressBars() {
    document.querySelectorAll('.progress-bar').forEach(bar => {
      progressObserver.observe(bar);
    });
  }

  /* ── Floating Shapes ────────────────────────────────────── */
  const SHAPES = ['🎨', '✏️', '📚', '🖍️', '⭐', '🌈', '🦋', '🖌️', '📖', '✂️', '🎭', '💡'];

  function createFloatingShapes(container) {
    if (!container) return;
    const count = parseInt(container.dataset.shapeCount || '8');
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const shape = document.createElement('span');
      shape.className = 'shape';
      shape.textContent = SHAPES[i % SHAPES.length];
      shape.style.cssText = `
        top: ${Math.random() * 90}%;
        left: ${Math.random() * 90}%;
        animation-delay: ${(Math.random() * 4).toFixed(1)}s;
        animation-duration: ${(5 + Math.random() * 4).toFixed(1)}s;
        font-size: ${(1.4 + Math.random() * 1.8).toFixed(1)}rem;
      `;
      container.appendChild(shape);
    }
  }

  /* ── Confetti Burst ─────────────────────────────────────── */
  const CONFETTI_COLORS = ['#29B6F6', '#FFD600', '#FF6B47', '#9B59B6', '#4CAF50'];

  function triggerConfetti(originEl) {
    const rect = originEl.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.cssText = `
        left: ${rect.left + rect.width / 2 + (Math.random() - 0.5) * 120}px;
        top: ${rect.top}px;
        background: ${CONFETTI_COLORS[i % CONFETTI_COLORS.length]};
        animation-delay: ${(Math.random() * 0.3).toFixed(2)}s;
        animation-duration: ${(2 + Math.random() * 1.5).toFixed(1)}s;
        transform: rotate(${Math.random() * 360}deg);
      `;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  }

  /* ── Stagger children ───────────────────────────────────── */
  function staggerChildren(parent, baseClass = 'reveal', delayStep = 100) {
    if (!parent) return;
    parent.querySelectorAll(':scope > *').forEach((child, i) => {
      child.classList.add(baseClass);
      child.style.transitionDelay = `${i * delayStep}ms`;
      revealObserver.observe(child);
    });
  }

  /* ── Parallax Shapes ────────────────────────────────────── */
  function initParallax() {
    const shapes = document.querySelectorAll('.parallax-shape');
    if (!shapes.length) return;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.forEach(shape => {
        const speed = parseFloat(shape.dataset.speed || '0.1');
        shape.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, { passive: true });
  }

  /* ── Book Page Flip Effect ──────────────────────────────── */
  function initPageFlipDemo() {
    const flipDemos = document.querySelectorAll('.page-flip-demo');
    flipDemos.forEach(demo => {
      let flipping = false;
      setInterval(() => {
        if (!flipping) {
          flipping = true;
          demo.style.animation = 'pageFlip 0.8s ease-in-out';
          setTimeout(() => { demo.style.animation = ''; flipping = false; }, 800);
        }
      }, 3500);
    });
  }

  /* ── Scroll progress bar ────────────────────────────────── */
  function initScrollProgress() {
    // Disabled scroll progress bar
    return;
  }

  /* ── Typewriter effect ──────────────────────────────────── */
  function initTypewriter() {
    document.querySelectorAll('.typewriter').forEach(el => {
      const words = (el.dataset.words || el.textContent).split('|');
      let wordIdx = 0, charIdx = 0, deleting = false;
      el.textContent = '';
      el.classList.add('typing-cursor');

      function tick() {
        const word = words[wordIdx];
        if (!deleting) {
          el.textContent = word.slice(0, ++charIdx);
          if (charIdx === word.length) {
            deleting = true;
            setTimeout(tick, 1800);
            return;
          }
        } else {
          el.textContent = word.slice(0, --charIdx);
          if (charIdx === 0) {
            deleting = false;
            wordIdx = (wordIdx + 1) % words.length;
          }
        }
        setTimeout(tick, deleting ? 60 : 90);
      }
      tick();
    });
  }

  /* ── Hover tilt ─────────────────────────────────────────── */
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
        card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Image lazy load placeholder ───────────────────────── */
  function initLazyLoad() {
    const imgs = document.querySelectorAll('img[data-src]');
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imgObserver.unobserve(img);
        }
      });
    });
    imgs.forEach(img => imgObserver.observe(img));
  }

  /* ── Confetti on CTA click ──────────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.confetti-btn');
    if (btn) triggerConfetti(btn);
  });

  /* ── Init all ───────────────────────────────────────────── */
  function init() {
    initReveal();
    initCounters();
    initProgressBars();
    initParallax();
    initPageFlipDemo();
    initScrollProgress();
    initTypewriter();
    initTilt();
    initLazyLoad();

    // Init floating shapes containers
    document.querySelectorAll('.floating-shapes').forEach(container => {
      if (!container.children.length) createFloatingShapes(container);
    });

    // Stagger product grids
    document.querySelectorAll('.stagger-grid').forEach(grid => {
      staggerChildren(grid, 'reveal-scale', 80);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
