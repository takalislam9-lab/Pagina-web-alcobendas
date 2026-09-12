/* ==========================================================================
   Joyería Bruno — main.js
   Carga el contenido del CMS (ajustes, catálogo, opiniones), filtros,
   buscador, menú móvil y formulario de opinión. El cliente edita en /admin.
   ========================================================================== */
(function () {
  'use strict';

  const WA_DEFAULT = '34620936722';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const escapeHTML = (str = '') => String(str).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    if (isNaN(num)) return escapeHTML(value);
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);
  };

  const getJSON = async (url) => {
    try { const r = await fetch(url, { cache: 'no-cache' }); if (!r.ok) throw new Error(r.status); return await r.json(); }
    catch (e) { console.warn('No se pudo cargar', url, e); return null; }
  };

  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  const toggle = $('#menu-toggle'); const mobileMenu = $('#mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => {
      mobileMenu.classList.add('hidden'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- Formulario de opinión ---------- */
  const opinionBtn = $('#abrir-opinion'); const opinionForm = $('#form-opinion');
  if (opinionBtn && opinionForm) {
    opinionBtn.addEventListener('click', () => {
      const open = opinionForm.classList.toggle('hidden') === false;
      opinionBtn.setAttribute('aria-expanded', String(open));
      opinionBtn.textContent = open ? 'Cerrar formulario' : 'Escribir opinión aquí';
      if (open) opinionForm.querySelector('input, textarea')?.focus();
    });
  }

  /* ---------- Header al hacer scroll ---------- */
  const header = $('#site-header');
  const onScroll = () => { if (header) header.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Ajustes del sitio ---------- */
  const applySettings = (cfg) => {
    if (!cfg) return;
    if (cfg.telefono) {
      const tel = '+34' + String(cfg.telefono).replace(/\D/g, '').replace(/^34/, '');
      $$('[data-tel-link]').forEach((el) => { if (el.tagName === 'A') el.setAttribute('href', 'tel:' + tel); });
      $$('[data-phone-display]').forEach((el) => (el.textContent = cfg.telefono));
    }
    if (cfg.whatsapp) {
      const wa = String(cfg.whatsapp).replace(/\D/g, '');
      $$('[data-whatsapp-link]').forEach((el) => {
        const cur = el.getAttribute('href') || ''; const q = cur.includes('?') ? cur.slice(cur.indexOf('?')) : '';
        el.setAttribute('href', 'https://wa.me/' + wa + q);
      });
    }
    if (cfg.direccion) $$('[data-address]').forEach((el) => { el.innerHTML = escapeHTML(cfg.direccion).replace(/\n/g, '<br/>'); });
    if (Array.isArray(cfg.horario) && cfg.horario.length) {
      $$('[data-hours]').forEach((el) => { el.innerHTML = cfg.horario.map((l) => `<p>${escapeHTML(l.linea || l)}</p>`).join(''); });
    }
    const hero = $('#inicio');
    if (cfg.hero_imagen && hero) { hero.style.setProperty('--hero-image', `url("${encodeURI(cfg.hero_imagen)}")`); hero.classList.add('has-image'); }
  };

  /* ---------- Catálogo ---------- */
  const state = { items: [], category: 'Todas', query: '' };
  const grid = $('#catalogo-grid'); const filtersWrap = $('#filtros');
  const emptyMsg = $('#catalogo-empty'); const searchInput = $('#buscador');

  const emojiFor = (cat = '') => {
    const c = cat.toLowerCase();
    if (c.includes('reloj')) return '⌚';
    if (c.includes('anillo')) return '💍';
    if (c.includes('alianza')) return '💑';
    if (c.includes('pendiente')) return '✨';
    if (c.includes('collar') || c.includes('colgante')) return '📿';
    return '💎';
  };

  const productCard = (p) => {
    const price = formatPrice(p.precio);
    const disabled = p.disponible === false;
    const img = p.imagen
      ? `<img src="${encodeURI(p.imagen)}" alt="${escapeHTML(p.nombre)}" loading="lazy" />`
      : `<span class="placeholder">${emojiFor(p.categoria)}</span>`;
    return `
      <article class="product-card">
        <div class="product-media">
          ${img}
          ${p.destacado ? '<span class="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-widest uppercase bg-gold text-onyx-900">Destacada</span>' : ''}
          ${disabled ? '<span class="absolute inset-0 bg-cream/70 grid place-items-center text-sm tracking-wide text-onyx-700">Reservada</span>' : ''}
        </div>
        <div class="p-5 flex flex-col flex-1">
          <span class="text-[11px] tracking-[0.15em] uppercase text-gold-deep">${escapeHTML(p.categoria || '')}</span>
          <h3 class="mt-1 font-display text-xl text-onyx-900 leading-snug">${escapeHTML(p.nombre || '')}</h3>
          ${p.descripcion ? `<p class="mt-1 text-sm text-onyx-600 font-light line-clamp-2">${escapeHTML(p.descripcion)}</p>` : ''}
          <div class="mt-4 pt-4 border-t border-gold/15 flex items-center justify-between gap-2">
            <span class="font-display text-xl text-onyx-900">${price || '<span class="text-sm text-onyx-600">Consultar</span>'}</span>
            <a href="https://wa.me/${WA_DEFAULT}?text=${encodeURIComponent('Hola, me interesa: ' + (p.nombre || ''))}" target="_blank" rel="noopener" class="btn-gold-sm" data-whatsapp-link>Consultar</a>
          </div>
        </div>
      </article>`;
  };

  const render = () => {
    if (!grid) return;
    const q = state.query.trim().toLowerCase();
    const filtered = state.items.filter((p) => {
      const matchCat = state.category === 'Todas' || p.categoria === state.category;
      const matchQ = !q || [p.nombre, p.descripcion, p.categoria].filter(Boolean).join(' ').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    grid.innerHTML = filtered.map(productCard).join('');
    if (emptyMsg) emptyMsg.classList.toggle('hidden', filtered.length !== 0);
  };

  const renderFilters = () => {
    if (!filtersWrap) return;
    const cats = ['Todas', ...Array.from(new Set(state.items.map((p) => p.categoria).filter(Boolean)))];
    filtersWrap.innerHTML = cats.map((c) => `<button type="button" class="filter-btn${c === state.category ? ' is-active' : ''}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join('');
    $$('.filter-btn', filtersWrap).forEach((btn) => btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      $$('.filter-btn', filtersWrap).forEach((b) => b.classList.toggle('is-active', b === btn));
      render();
    }));
  };

  if (searchInput) searchInput.addEventListener('input', (e) => { state.query = e.target.value; render(); });

  /* ---------- Testimonios ---------- */
  const stars = (n) => { const c = Math.max(0, Math.min(5, parseInt(n, 10) || 5)); return '★'.repeat(c) + '☆'.repeat(5 - c); };
  const renderTestimonials = (list) => {
    const wrap = $('#testimonios-grid');
    if (!wrap || !Array.isArray(list) || !list.length) return;
    wrap.innerHTML = list.map((t) => `
      <figure class="testimonial-card">
        <div class="text-gold text-lg" aria-label="${t.valoracion || 5} de 5">${stars(t.valoracion)}</div>
        <blockquote class="mt-3 text-cream/85 font-light leading-relaxed">“${escapeHTML(t.texto || '')}”</blockquote>
        <figcaption class="mt-4 text-sm tracking-wide text-gold">${escapeHTML(t.nombre || 'Cliente')}</figcaption>
      </figure>`).join('');
  };

  /* ---------- Arranque ---------- */
  (async function init() {
    const [settings, productos, testimonios] = await Promise.all([
      getJSON('content/ajustes.json'),
      getJSON('content/productos.json'),
      getJSON('content/testimonios.json'),
    ]);
    applySettings(settings);
    state.items = (productos && Array.isArray(productos.productos)) ? productos.productos : [];
    renderFilters(); render();
    renderTestimonials((testimonios && Array.isArray(testimonios.testimonios)) ? testimonios.testimonios : []);
  })();
})();
