/* ==========================================================================
   Centro Técnico Telefonía & Ordenadores — main.js
   - Menú móvil y header dinámico
   - Carga de AJUSTES, CATÁLOGO y TESTIMONIOS desde el CMS (archivos JSON)
   - Filtrado y búsqueda del catálogo en vivo
   El contenido lo edita el cliente desde /admin (Decap CMS); aquí solo se lee.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Utilidades ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const escapeHTML = (str = '') =>
    String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  const formatPrice = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(',', '.'));
    if (isNaN(num)) return escapeHTML(value); // texto libre (ej.: "Desde 49€")
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(num);
  };

  const getJSON = async (url) => {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(res.status);
      return await res.json();
    } catch (e) {
      console.warn('No se pudo cargar', url, e);
      return null;
    }
  };

  /* ---------- Año del footer ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  const toggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('hidden') === false;
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('a', mobileMenu).forEach((a) =>
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- Header al hacer scroll ---------- */
  const header = $('#site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ======================================================================
     AJUSTES DEL SITIO (teléfono, WhatsApp, dirección, horario, hero)
     ====================================================================== */
  const applySettings = (cfg) => {
    if (!cfg) return;

    // Teléfono
    if (cfg.telefono) {
      const telDigits = '+34' + String(cfg.telefono).replace(/\D/g, '').replace(/^34/, '');
      $$('[data-tel-link]').forEach((el) => {
        if (el.tagName === 'A') el.setAttribute('href', 'tel:' + telDigits);
      });
      $$('[data-phone-display]').forEach((el) => (el.textContent = cfg.telefono));
    }

    // WhatsApp
    if (cfg.whatsapp) {
      const waDigits = String(cfg.whatsapp).replace(/\D/g, '');
      $$('[data-whatsapp-link]').forEach((el) => {
        const current = el.getAttribute('href') || '';
        const query = current.includes('?') ? current.slice(current.indexOf('?')) : '';
        el.setAttribute('href', 'https://wa.me/' + waDigits + query);
      });
    }

    // Dirección
    if (cfg.direccion) {
      $$('[data-address]').forEach((el) => {
        el.innerHTML = escapeHTML(cfg.direccion).replace(/\n/g, '<br/>');
      });
    }

    // Horario (array de líneas)
    if (Array.isArray(cfg.horario) && cfg.horario.length) {
      $$('[data-hours]').forEach((el) => {
        el.innerHTML = cfg.horario.map((l) => `<p>${escapeHTML(l.linea || l)}</p>`).join('');
      });
    }

    // Imagen de hero (opcional)
    const hero = $('#inicio');
    if (cfg.hero_imagen && hero) {
      hero.style.setProperty('--hero-image', `url("${encodeURI(cfg.hero_imagen)}")`);
      hero.classList.add('has-image');
    }
    if (cfg.hero_titulo) { const h = $('#inicio h1'); if (h) h.textContent = cfg.hero_titulo; }
    if (cfg.hero_subtitulo) { const p = $('#inicio h1 + p'); if (p) p.textContent = cfg.hero_subtitulo; }
  };

  /* ======================================================================
     CATÁLOGO EN VIVO (con filtros y búsqueda)
     ====================================================================== */
  const catalogState = { items: [], category: 'Todos', query: '' };
  const grid = $('#catalogo-grid');
  const filtersWrap = $('#filtros');
  const emptyMsg = $('#catalogo-empty');
  const searchInput = $('#buscador');

  const productCard = (p) => {
    const price = formatPrice(p.precio);
    const disabled = p.disponible === false;
    const img = p.imagen
      ? `<img src="${encodeURI(p.imagen)}" alt="${escapeHTML(p.nombre)}" loading="lazy" />`
      : `<span class="placeholder">${p.categoria === 'Smartphones' ? '📱' : p.categoria === 'Fundas' ? '🛡️' : '🔌'}</span>`;

    return `
      <article class="product-card">
        <div class="product-media">
          ${img}
          ${p.destacado ? '<span class="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-brand-600 text-white">Destacado</span>' : ''}
          ${disabled ? '<span class="absolute inset-0 bg-white/70 grid place-items-center text-sm font-semibold text-ink-700">Agotado</span>' : ''}
        </div>
        <div class="p-4 flex flex-col flex-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-brand-600">${escapeHTML(p.categoria || '')}</span>
          <h3 class="mt-1 font-display font-bold text-ink-900 leading-snug">${escapeHTML(p.nombre || '')}</h3>
          ${p.descripcion ? `<p class="mt-1 text-sm text-ink-700 line-clamp-2">${escapeHTML(p.descripcion)}</p>` : ''}
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <span class="font-display font-extrabold text-lg text-ink-900">${price || '<span class="text-sm font-medium text-slate-500">Consultar</span>'}</span>
            <a href="https://wa.me/34691142182?text=${encodeURIComponent('Hola, me interesa: ' + (p.nombre || ''))}" target="_blank" rel="noopener" class="btn-whatsapp" data-whatsapp-link>Consultar</a>
          </div>
        </div>
      </article>`;
  };

  const renderCatalog = () => {
    if (!grid) return;
    const { items, category, query } = catalogState;
    const q = query.trim().toLowerCase();
    const filtered = items.filter((p) => {
      const matchCat = category === 'Todos' || p.categoria === category;
      const matchQuery = !q ||
        [p.nombre, p.descripcion, p.categoria].filter(Boolean).join(' ').toLowerCase().includes(q);
      return matchCat && matchQuery;
    });

    grid.innerHTML = filtered.map(productCard).join('');
    if (emptyMsg) emptyMsg.classList.toggle('hidden', filtered.length !== 0);
  };

  const renderFilters = () => {
    if (!filtersWrap) return;
    const cats = ['Todos', ...Array.from(new Set(catalogState.items.map((p) => p.categoria).filter(Boolean)))];
    filtersWrap.innerHTML = cats
      .map((c) => `<button type="button" class="filter-btn${c === catalogState.category ? ' is-active' : ''}" data-cat="${escapeHTML(c)}">${escapeHTML(c)}</button>`)
      .join('');
    $$('.filter-btn', filtersWrap).forEach((btn) =>
      btn.addEventListener('click', () => {
        catalogState.category = btn.dataset.cat;
        $$('.filter-btn', filtersWrap).forEach((b) => b.classList.toggle('is-active', b === btn));
        renderCatalog();
      })
    );
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      catalogState.query = e.target.value;
      renderCatalog();
    });
  }

  /* ======================================================================
     TESTIMONIOS
     ====================================================================== */
  const stars = (n) => {
    const count = Math.max(0, Math.min(5, parseInt(n, 10) || 5));
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  const renderTestimonials = (list) => {
    const wrap = $('#testimonios-grid');
    if (!wrap || !Array.isArray(list) || !list.length) return;
    wrap.innerHTML = list
      .map(
        (t) => `
        <figure class="testimonial-card">
          <div class="text-amber-400 text-lg" aria-label="${(t.valoracion || 5)} de 5 estrellas">${stars(t.valoracion)}</div>
          <blockquote class="mt-3 text-slate-200 leading-relaxed">“${escapeHTML(t.texto || '')}”</blockquote>
          <figcaption class="mt-4 flex items-center gap-3">
            <span class="grid place-items-center w-9 h-9 rounded-full bg-brand-600 text-white font-bold">${escapeHTML((t.nombre || '?').charAt(0).toUpperCase())}</span>
            <span class="text-sm font-semibold text-white">${escapeHTML(t.nombre || 'Cliente')}</span>
          </figcaption>
        </figure>`
      )
      .join('');
  };

  /* ======================================================================
     ARRANQUE: cargar contenido del CMS
     ====================================================================== */
  (async function init() {
    const [settings, productos, testimonios] = await Promise.all([
      getJSON('/content/ajustes.json'),
      getJSON('/content/productos.json'),
      getJSON('/content/testimonios.json'),
    ]);

    applySettings(settings);

    const items = (productos && Array.isArray(productos.productos)) ? productos.productos : [];
    catalogState.items = items;
    renderFilters();
    renderCatalog();

    const tList = (testimonios && Array.isArray(testimonios.testimonios)) ? testimonios.testimonios : [];
    renderTestimonials(tList);
  })();
})();
