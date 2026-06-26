/* ============================================================
   ColorSpark — shop.js
   Product filter, quick preview modal, wishlist display
   ============================================================ */
(function () {
  'use strict';

  /* ── Product Filter ─────────────────────────────────────── */
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products   = document.querySelectorAll('.product-card[data-category]');
    const collections = document.querySelectorAll('.collection-card[data-category]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat    = btn.dataset.filter;
        const format = btn.dataset.format;
        const age    = btn.dataset.age;

        if (products.length) {
          products.forEach(card => {
            let show = true;
            if (cat    && cat    !== 'all' && card.dataset.category !== cat)    show = false;
            if (format && format !== 'all' && card.dataset.format   !== format) show = false;
            if (age    && age    !== 'all' && card.dataset.age      !== age)    show = false;

            card.style.display = show ? '' : 'none';
            if (show) {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.88)';
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              });
            }
          });
        }

        if (collections.length) {
          collections.forEach(card => {
            let show = true;
            if (cat && cat !== 'all' && card.dataset.category !== cat) show = false;

            card.style.display = show ? '' : 'none';
            if (show) {
              card.style.opacity = '0';
              card.style.transform = 'scale(0.88)';
              requestAnimationFrame(() => {
                card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
              });
            }
          });
        }
      });
    });
  }

  /* ── Price Range ────────────────────────────────────────── */
  function initPriceRange() {
    const range  = document.getElementById('price-range');
    const output = document.getElementById('price-output');
    if (!range || !output) return;
    range.addEventListener('input', () => {
      output.textContent = `$0 – $${range.value}`;
      const products = document.querySelectorAll('.product-card[data-price]');
      products.forEach(card => {
        const price = parseFloat(card.dataset.price || '0');
        card.style.display = price <= parseFloat(range.value) ? '' : 'none';
      });
    });
  }

  /* ── Sort ───────────────────────────────────────────────── */
  function initSort() {
    const sortSelect = document.getElementById('sort-select');
    const grid = document.querySelector('.products-grid');
    if (!sortSelect || !grid) return;
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const cards = [...grid.querySelectorAll('.product-card')];
      cards.sort((a, b) => {
        if (val === 'price-low')  return parseFloat(a.dataset.price||0) - parseFloat(b.dataset.price||0);
        if (val === 'price-high') return parseFloat(b.dataset.price||0) - parseFloat(a.dataset.price||0);
        if (val === 'newest')     return (b.dataset.new||0) - (a.dataset.new||0);
        if (val === 'popular')    return parseFloat(b.dataset.rating||0) - parseFloat(a.dataset.rating||0);
        return 0;
      });
      cards.forEach(card => grid.appendChild(card));
    });
  }

  /* ── Quick Preview Modal ────────────────────────────────── */
  function buildModal() {
    if (document.getElementById('quick-preview-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'quick-preview-modal';
    modal.style.cssText = `
      position:fixed;inset:0;z-index:3000;
      display:flex;align-items:center;justify-content:center;
      background:rgba(0,0,0,0.55);backdrop-filter:blur(8px);
      opacity:0;pointer-events:none;transition:opacity 0.3s;
    `;
    modal.innerHTML = `
      <div id="qp-content" style="
        background:var(--bg-card);border-radius:var(--radius-xl);
        max-width:800px;width:95%;max-height:92vh;overflow-y:auto;
        position:relative;transform:scale(0.9);transition:transform 0.35s var(--ease-bounce);
        box-shadow:var(--shadow-lg);
      ">
        <button id="qp-close" style="
          position:absolute;top:16px;right:16px;
          width:36px;height:36px;border-radius:50%;
          background:var(--bg-soft);border:1px solid var(--border);
          font-size:1.1rem;cursor:pointer;z-index:1;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;
        ">✕</button>
        <div id="qp-body" style="padding:2rem;display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
          <div id="qp-img-wrap" style="background:var(--bg-soft);border-radius:var(--radius-lg);aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:6rem;"></div>
          <div id="qp-info"></div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Close
    modal.addEventListener('click', e => {
      if (e.target === modal || e.target.id === 'qp-close') closeModal();
    });
  }

  function openModal(data) {
    const modal = document.getElementById('quick-preview-modal');
    if (!modal) return;
    document.getElementById('qp-img-wrap').textContent = data.emoji || '📚';
    document.getElementById('qp-info').innerHTML = `
      <span class="section-label label-blue" style="margin-bottom:.5rem">${data.type || 'Digital PDF'}</span>
      <h3 style="font-family:var(--font-heading);font-weight:900;margin-bottom:.5rem">${data.name}</h3>
      <div style="display:flex;gap:.35rem;margin-bottom:.75rem">
        <span style="color:var(--yellow);font-size:.9rem">★★★★★</span>
        <span style="font-size:.8rem;color:var(--text-muted)">(${data.reviews || '0'} reviews)</span>
      </div>
      <p style="font-size:.9rem;color:var(--text-secondary);margin-bottom:1.25rem;line-height:1.7">${data.desc || 'A premium activity book packed with fun, engaging content for all ages.'}</p>
      <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.25rem">
        <span style="background:var(--sky-blue-light);color:var(--sky-blue-dark);padding:.2rem .75rem;border-radius:999px;font-size:.78rem;font-weight:700">📖 ${data.pages || '32'} Pages</span>
        <span style="background:var(--yellow-light);color:var(--yellow-dark);padding:.2rem .75rem;border-radius:999px;font-size:.78rem;font-weight:700">👶 Ages ${data.age || '4–8'}</span>
        <span style="background:var(--coral-light);color:var(--coral-dark);padding:.2rem .75rem;border-radius:999px;font-size:.78rem;font-weight:700">📏 ${data.size || 'A4 / Letter'}</span>
      </div>
      <div style="margin-bottom:1.25rem">
        <span style="font-family:var(--font-heading);font-weight:900;font-size:2rem;color:var(--coral)">$${parseFloat(data.price||9.99).toFixed(2)}</span>
        ${data.original ? `<span style="font-size:.9rem;color:var(--text-muted);text-decoration:line-through;margin-left:.5rem">$${data.original}</span>` : ''}
      </div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap">
        <button class="btn btn-primary btn-lg product-add-btn"
          data-id="${data.id}" data-name="${data.name}" data-price="${data.price||9.99}"
          data-emoji="${data.emoji||'📚'}" data-type="${data.type||'Digital PDF'}">
          🛒 Add to Cart
        </button>
        <button class="btn btn-outline wishlist-btn" data-id="${data.id}">🤍 Wishlist</button>
        <a href="book-detail.html" class="btn btn-outline">👁️ View Details</a>
      </div>`;
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'all';
    document.getElementById('qp-content').style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('quick-preview-modal');
    if (!modal) return;
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    document.getElementById('qp-content').style.transform = 'scale(0.9)';
    document.body.style.overflow = '';
  }

  // Quick preview trigger
  document.addEventListener('click', e => {
    const btn = e.target.closest('.quick-preview-btn');
    if (!btn) return;
    const card = btn.closest('.product-card');
    if (!card) return;
    openModal({
      id:       card.dataset.id,
      name:     card.dataset.name,
      price:    card.dataset.price,
      original: card.dataset.original,
      emoji:    card.dataset.emoji,
      type:     card.dataset.type,
      pages:    card.dataset.pages,
      age:      card.dataset.age,
      size:     card.dataset.size,
      desc:     card.dataset.desc,
      reviews:  card.dataset.reviews,
    });
  });

  /* ── Gallery Lightbox ───────────────────────────────────── */
  function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightbox';
      lightbox.style.cssText = `
        position:fixed;inset:0;z-index:4000;
        background:rgba(0,0,0,0.88);
        display:flex;align-items:center;justify-content:center;
        opacity:0;pointer-events:none;transition:opacity 0.3s;
      `;
      lightbox.innerHTML = `
        <button id="lb-close" style="position:absolute;top:20px;right:24px;color:#fff;font-size:2rem;background:none;border:none;cursor:pointer;line-height:1;">✕</button>
        <div id="lb-content" style="text-align:center;max-width:90vw;">
          <div id="lb-emoji" style="font-size:8rem;margin-bottom:1rem;"></div>
          <div id="lb-label" style="color:#fff;font-family:'Nunito',sans-serif;font-weight:700;font-size:1.2rem;"></div>
        </div>`;
      document.body.appendChild(lightbox);
      lightbox.querySelector('#lb-close').addEventListener('click', () => {
        lightbox.style.opacity = '0';
        lightbox.style.pointerEvents = 'none';
        document.body.style.overflow = '';
      });
      lightbox.addEventListener('click', e => {
        if (e.target === lightbox) {
          lightbox.style.opacity = '0';
          lightbox.style.pointerEvents = 'none';
          document.body.style.overflow = '';
        }
      });
    }

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const emoji = item.querySelector('.gallery-item-emoji')?.textContent || '🎨';
        const label = item.querySelector('.gallery-label')?.textContent || '';
        lightbox.querySelector('#lb-emoji').textContent = emoji;
        lightbox.querySelector('#lb-label').textContent = label;
        lightbox.style.opacity = '1';
        lightbox.style.pointerEvents = 'all';
        document.body.style.overflow = 'hidden';
      });
    });
  }

  /* ── Image gallery carousel (book detail) ───────────────── */
  function initBookCarousel() {
    const carousel = document.querySelector('.book-sample-carousel');
    if (!carousel) return;
    const items = carousel.querySelectorAll('.sample-item');
    const prevBtn = document.querySelector('.sample-prev');
    const nextBtn = document.querySelector('.sample-next');
    const mainDisplay = document.querySelector('.sample-main-display') || document.querySelector('#sampleMain');
    if (!items.length || !mainDisplay) return;
    let current = 0;

    function showSample(i) {
      current = (i + items.length) % items.length;
      const emoji = items[current].querySelector('.gallery-item-emoji')?.textContent || '📖';
      mainDisplay.textContent = emoji;
      items.forEach((item, idx) => item.classList.toggle('active-sample', idx === current));
    }

    prevBtn?.addEventListener('click', () => showSample(current - 1));
    nextBtn?.addEventListener('click', () => showSample(current + 1));
    items.forEach((item, i) => item.addEventListener('click', () => showSample(i)));
    showSample(0);
  }

  /* ── Search ─────────────────────────────────────────────── */
  function initSearch() {
    const searchInput = document.getElementById('product-search');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.product-card[data-name]').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        card.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  /* ── Init ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildModal();
    initFilters();
    initPriceRange();
    initSort();
    initLightbox();
    initBookCarousel();
    initSearch();
  });
})();
