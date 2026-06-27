/* ============================================================
   ColorSpark — main.js
   Core: Navigation, Dark Mode, RTL, Scroll, Toast, Modals
   ============================================================ */
(function () {
  'use strict';

  /* ── Theme ─────────────────────────────────────────────── */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('cs-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('cs-theme', next);
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = next === 'dark' ? '☀️' : '🌙';
      btn.title = next === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.theme-toggle-btn')) toggleTheme();
  });

  // Set initial icons
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = html.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    });
    const currentDir = html.getAttribute('dir') || 'ltr';
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.textContent = '↔️';
      btn.title = currentDir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    });
  });

  /* ── RTL ────────────────────────────────────────────────── */
  const savedDir = localStorage.getItem('cs-dir') || 'ltr';
  html.setAttribute('dir', savedDir);

  function toggleRTL() {
    const current = html.getAttribute('dir');
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    html.setAttribute('dir', next);
    localStorage.setItem('cs-dir', next);
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.title = next === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
      btn.textContent = '↔️';
    });
  }

  document.addEventListener('click', e => {
    if (e.target.closest('.rtl-toggle-btn')) toggleRTL();
  });

  /* ── Navbar Scroll ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  /* ── Mobile Nav Toggle ──────────────────────────────────── */
  document.addEventListener('click', e => {
    const hamburger = e.target.closest('.nav-hamburger');
    const mobileNav  = document.querySelector('.mobile-nav');
    if (!mobileNav) return;
    if (hamburger) {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      return;
    }
    // Close on outside click
    if (!e.target.closest('.mobile-nav') && !e.target.closest('#navbar')) {
      mobileNav.classList.remove('open');
      document.querySelector('.nav-hamburger')?.classList.remove('open');
    }
  });

  /* ── Active Nav Link ────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-link, .mobile-nav .nav-link');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  });

  /* ── Scroll-to-Top ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    const scrollBtn = document.querySelector('.scroll-top');
    if (!scrollBtn) return;
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  /* ── Accordion ──────────────────────────────────────────── */
  document.addEventListener('click', e => {
    const header = e.target.closest('.accordion-header');
    if (!header) return;
    const item = header.closest('.accordion-item');
    const parent = item.closest('.accordion-group');
    // Close siblings
    if (parent) {
      parent.querySelectorAll('.accordion-item.open').forEach(open => {
        if (open !== item) open.classList.remove('open');
      });
    }
    item.classList.toggle('open');
  });

  /* ── Tab Switching ──────────────────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const wrap = btn.closest('.tab-group');
    if (!wrap) return;
    const target = btn.dataset.tab;
    wrap.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    wrap.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.panel === target);
    });
  });

  /* ── Cart ───────────────────────────────────────────────── */
  let cart = JSON.parse(localStorage.getItem('cs-cart') || '[]');

  function saveCart() { localStorage.setItem('cs-cart', JSON.stringify(cart)); }

  function updateCartCount() {
    const total = cart.reduce((s, i) => s + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  }

  function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total-price');
    if (!container) return;
    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <span class="empty-icon">🛒</span>
          <p>Your cart is empty!</p>
          <a href="shop.html" class="btn btn-secondary btn-sm" style="margin-top:1rem;">Browse Books</a>
        </div>`;
    } else {
      container.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">${item.emoji || '📚'}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem;">${item.type || 'Digital'}</div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-remove" data-id="${item.id}">✕ Remove</div>
          </div>
        </div>`).join('');
    }
    if (totalEl) {
      const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
      totalEl.textContent = `$${total.toFixed(2)}`;
    }
    updateCartCount();
  }

  function addToCart(product) {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    saveCart();
    renderCart();
    openCart();
    showToast(`🛒 "${product.name}" added to cart!`);
  }

  function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    renderCart();
  }

  function openCart() {
    document.getElementById('cart-drawer')?.classList.add('open');
    document.getElementById('cart-overlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    document.getElementById('cart-drawer')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.addEventListener('click', e => {
    // Open cart
    if (e.target.closest('.open-cart-btn')) { openCart(); return; }
    // Close cart
    if (e.target.closest('.cart-close') || e.target.id === 'cart-overlay') { closeCart(); return; }
    // Remove item
    if (e.target.closest('.cart-item-remove')) {
      removeFromCart(e.target.closest('.cart-item-remove').dataset.id);
      return;
    }
    // Add to cart
    if (e.target.closest('.product-add-btn') || e.target.closest('.product-add-btn-split')) {
      const btn = e.target.closest('.product-add-btn') || e.target.closest('.product-add-btn-split');
      const id   = btn.dataset.id   || 'book-' + Math.random().toString(36).substr(2,6);
      const name = btn.dataset.name || 'ColorSpark Book';
      const price= parseFloat(btn.dataset.price) || 9.99;
      const emoji= btn.dataset.emoji || '📚';
      const type = btn.dataset.type || 'Digital PDF';
      addToCart({ id, name, price, emoji, type });
      return;
    }
  });

  /* ── Wishlist ────────────────────────────────────────────── */
  let wishlist = JSON.parse(localStorage.getItem('cs-wishlist') || '[]');
  function saveWishlist() { localStorage.setItem('cs-wishlist', JSON.stringify(wishlist)); }

  function updateWishlistBtns() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      const id = btn.dataset.id;
      const isWished = wishlist.includes(id);
      btn.classList.toggle('wishlisted', isWished);
      btn.textContent = isWished ? '❤️' : '🤍';
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    if (wishlist.includes(id)) {
      wishlist = wishlist.filter(i => i !== id);
      showToast('💔 Removed from wishlist');
    } else {
      wishlist.push(id);
      showToast('❤️ Added to wishlist!');
    }
    saveWishlist();
    updateWishlistBtns();
  });

  /* ── Toast ───────────────────────────────────────────────── */
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  /* ── Slider ──────────────────────────────────────────────── */
  document.querySelectorAll('.slider-wrap').forEach(wrap => {
    const track = wrap.querySelector('.slider-track');
    const dots = wrap.querySelectorAll('.slider-dot');
    const prevBtn = wrap.querySelector('.slider-btn-prev');
    const nextBtn = wrap.querySelector('.slider-btn-next');
    if (!track) return;
    const slides = track.querySelectorAll('.slider-slide');
    let current = 0;

    function goTo(i) {
      current = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Auto-play
    let autoPlay = setInterval(() => goTo(current + 1), 4500);
    wrap.addEventListener('mouseenter', () => clearInterval(autoPlay));
    wrap.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => goTo(current + 1), 4500);
    });
    // Touch support
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
    });
  });

  /* ── Newsletter ──────────────────────────────────────────── */
  document.addEventListener('submit', e => {
    const form = e.target.closest('.newsletter-form-el');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input[type=email]');
    if (input?.value) {
      showToast('🎉 Subscribed! Check your email for a free download!');
      input.value = '';
    }
  });

  /* ── Contact / Quote forms ───────────────────────────────── */
  document.addEventListener('submit', e => {
    const form = e.target.closest('.contact-form-el, .quote-form-el');
    if (!form) return;
    e.preventDefault();
    showToast('✅ Message sent! We\'ll be in touch soon.');
    form.reset();
  });

  /* ── Download form gate ──────────────────────────────────── */
  document.addEventListener('submit', e => {
    const form = e.target.closest('.download-gate-form');
    if (!form) return;
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    if (btn) { btn.textContent = '✅ Downloading...'; btn.disabled = true; }
    setTimeout(() => {
      showToast('📥 Your free download is ready!');
      if (btn) { btn.textContent = '⬇️ Download Again'; btn.disabled = false; }
    }, 1500);
  });

  /* ── Category Scroll Row Buttons ─────────────────────────── */
  document.addEventListener('click', e => {
    const btn = e.target.closest('.cat-scroll-btn');
    if (!btn) return;
    const wrapper = btn.closest('.cat-scroll-wrapper');
    const row = wrapper?.querySelector('.cat-scroll-row');
    if (!row) return;
    const isPrev = btn.classList.contains('prev-btn');
    const scrollAmount = isPrev ? -280 : 280;
    row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  /* ── DOMContentLoaded init ───────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount();
    updateWishlistBtns();
    handleNavScroll();
    // init first tabs
    document.querySelectorAll('.tab-group').forEach(group => {
      const firstBtn = group.querySelector('.tab-btn');
      const firstPanel = group.querySelector('.tab-panel');
      firstBtn?.classList.add('active');
      firstPanel?.classList.add('active');
    });
  });
})();
