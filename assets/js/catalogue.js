/**
 * GLNBC Catalogue Page Logic
 * Manages live search, category filtering, multi-image card flippers, verified product imagery, and systematic product grid rendering.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCatalogue();
});

let currentFilters = {
  query: '',
  category: 'all',
  status: 'all',
  material: 'all'
};

function initCatalogue() {
  const grid = document.getElementById('catalogue-grid');
  if (!grid || typeof GLNBC_PRODUCTS === 'undefined') return;

  // Read URL params
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const catParam = urlParams.get('cat');
  const statusParam = urlParams.get('status');

  if (qParam) {
    currentFilters.query = qParam;
    const searchInput = document.getElementById('catalogue-search-input');
    if (searchInput) searchInput.value = qParam;
    updateClearButton(true);
  }

  if (catParam) {
    currentFilters.category = catParam;
    const catButtons = document.querySelectorAll('[data-filter-category]');
    catButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.filterCategory === catParam);
      b.setAttribute('aria-pressed', String(b.dataset.filterCategory === catParam));
    });
  }

  if (statusParam) {
    let mappedStatus = statusParam;
    if (mappedStatus === 'also-deal-in') mappedStatus = 'branded';
    currentFilters.status = mappedStatus;
    const statusButtons = document.querySelectorAll('[data-filter-status]');
    statusButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.filterStatus === mappedStatus || (statusParam === 'also-deal-in' && b.dataset.filterStatus === 'branded'));
    });
  }

  setupCatalogueControls();
  renderCatalogue();
}

function updateClearButton(hasText) {
  const clearBtn = document.getElementById('catalogue-search-clear');
  if (clearBtn) {
    clearBtn.classList.toggle('active', !!hasText);
  }
}

function setupCatalogueControls() {
  const searchInput = document.getElementById('catalogue-search-input');
  const clearBtn = document.getElementById('catalogue-search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      currentFilters.query = val.toLowerCase();
      updateClearButton(val.length > 0);
      renderCatalogue();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      currentFilters.query = '';
      updateClearButton(false);
      renderCatalogue();
    });
  }

  // Quick Filter Tag Pills
  const quickPills = document.querySelectorAll('[data-quick-tag]');
  quickPills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = pill.dataset.quickTag;
      if (searchInput) {
        searchInput.value = tag;
        currentFilters.query = tag.toLowerCase();
        updateClearButton(true);
      }
      quickPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderCatalogue();
    });
  });

  // Category filter buttons
  const catButtons = document.querySelectorAll('[data-filter-category]');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFilters.status = 'all';
      currentFilters.category = btn.dataset.filterCategory;
      renderCatalogue();
    });
  });

  // Status tab buttons
  const statusButtons = document.querySelectorAll('[data-filter-status]');
  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let st = btn.dataset.filterStatus;
      if (st === 'also-deal-in') st = 'branded';
      currentFilters.status = st;
      renderCatalogue();
    });
  });

  // Material select
  const materialSelect = document.getElementById('material-filter-select');
  if (materialSelect) {
    materialSelect.addEventListener('change', (e) => {
      currentFilters.material = e.target.value;
      renderCatalogue();
    });
  }

  // Reset filters
  const resetBtn = document.getElementById('btn-reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetAllFilters();
    });
  }
}

function resetAllFilters() {
  currentFilters = { query: '', category: 'all', status: 'all', material: 'all' };
  const searchInput = document.getElementById('catalogue-search-input');
  const materialSelect = document.getElementById('material-filter-select');
  const catButtons = document.querySelectorAll('[data-filter-category]');
  const statusButtons = document.querySelectorAll('[data-filter-status]');
  const quickPills = document.querySelectorAll('[data-quick-tag]');

  if (searchInput) searchInput.value = '';
  updateClearButton(false);
  if (materialSelect) materialSelect.value = 'all';
  catButtons.forEach(b => { b.classList.toggle('active', b.dataset.filterCategory === 'all'); b.setAttribute('aria-pressed', String(b.dataset.filterCategory === 'all')); });
  statusButtons.forEach(b => b.classList.toggle('active', b.dataset.filterStatus === 'all'));
  quickPills.forEach(p => p.classList.remove('active'));
  renderCatalogue();
}

function renderCatalogue() {
  const grid = document.getElementById('catalogue-grid');
  const countElem = document.getElementById('catalogue-count');
  if (!grid) return;

  const filtered = GLNBC_PRODUCTS.filter(prod => {
    // Visibility / Branded Filter
    if (currentFilters.status === 'branded' || currentFilters.status === 'also-deal-in') {
      if (prod.visibilityTier !== 'Branded' && prod.visibilityTier !== 'Also Deal In') return false;
    }

    // Category Filter
    if (currentFilters.category !== 'all') {
      // Direct categorySlug match
      if (prod.categorySlug !== currentFilters.category) {
        // Support C-Channel and Z-Brackets in Cable Management
        if (currentFilters.category === 'cable-management' && (prod.slug === 'c-channel-brackets' || prod.slug === 'z-brackets' || prod.slug === 'spring-nuts')) {
          // Allow match
        } else if (currentFilters.category === 'fasteners' && (prod.categorySlug === 'fasteners' || prod.slug === 'wedge-anchor' || prod.slug === 'pin-type-anchor-fasteners' || prod.slug === 'bullet-fasteners' || prod.slug === 'rawl-anchor-fasteners')) {
          // Allow match
        } else {
          return false;
        }
      }
    }

    // Material Filter
    if (currentFilters.material !== 'all') {
      const hasMat = prod.materials && prod.materials.some(m => m.toLowerCase().includes(currentFilters.material.toLowerCase()));
      if (!hasMat) return false;
    }

    // Search Query Filter
    if (currentFilters.query) {
      const q = currentFilters.query.replace(/[-_\s]/g, '');
      const name = prod.name.toLowerCase().replace(/[-_\s]/g, '');
      const cat = prod.category.toLowerCase().replace(/[-_\s]/g, '');
      const desc = prod.shortDesc.toLowerCase();
      const matchAlias = prod.aliases && prod.aliases.some(a => a.toLowerCase().replace(/[-_\s]/g, '').includes(q));
      const matchMat = prod.materials && prod.materials.some(m => m.toLowerCase().includes(currentFilters.query));
      const matchGrade = prod.grades && prod.grades.some(g => g.toLowerCase().includes(currentFilters.query));

      if (!name.includes(q) && !cat.includes(q) && !desc.includes(currentFilters.query) && !matchAlias && !matchMat && !matchGrade) {
        return false;
      }
    }

    return true;
  });

  if (countElem) {
    countElem.textContent = `Showing ${filtered.length} of ${GLNBC_PRODUCTS.length} products`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: white; border: 1px solid var(--color-cool-grey-border); border-radius: var(--radius-lg);">
        <h3 style="margin-bottom: 8px;">Can't find the exact product or specification?</h3>
        <p style="margin-bottom: 20px; max-width: 560px; margin-left: auto; margin-right: auto; color: var(--color-text-muted); line-height: 1.6;">
          GLNBC supplies custom metric/imperial dimensions, special alloys (EN8, EN19, B7, SS 316), odd bend profiles, and custom fabrications to drawing. Send us your specification or photo for a direct quotation.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="request-a-quote.html?custom=${encodeURIComponent(currentFilters.query)}" class="btn btn-primary">
            Send Custom Requirement
          </a>
          <button type="button" class="btn btn-whatsapp" onclick="openWhatsAppQuote('', 'Hello GLNBC, I am looking for: ${escapeHtml(currentFilters.query)}')">
            Inquire on WhatsApp
          </button>
          <button type="button" class="btn btn-outline" onclick="resetAllFilters()">Clear Filters</button>
        </div>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(prod => {
    const isBranded = prod.visibilityTier === 'Branded' || prod.visibilityTier === 'Also Deal In';
    const firstMaterial = (prod.materials && prod.materials[0]) ? prod.materials[0] : 'Mild / Stainless Steel';
    const allImages = [prod.heroImage, ...(prod.galleryImages || [])].filter(Boolean);
    
    // Multi-Image Flipper Arrows Markup
    let imageArrows = '';
    let counterMarkup = '';
    if (allImages.length > 1) {
      imageArrows = `
        <button type="button" class="card-img-arrow card-img-prev" onclick="changeCardImage(event, '${prod.slug}', -1)" aria-label="Previous image">‹</button>
        <button type="button" class="card-img-arrow card-img-next" onclick="changeCardImage(event, '${prod.slug}', 1)" aria-label="Next image">›</button>
      `;
      counterMarkup = `<span class="card-img-counter">1/${allImages.length}</span>`;
    }

    let imageMarkup = '';
    if (prod.heroImage) {
      imageMarkup = `
        <div class="product-card-media" onclick="openProductPage('${prod.slug}')" title="Click to view full specifications">
          <img src="${prod.heroImage}" alt="${escapeHtml(prod.name)}" loading="lazy">
          ${imageArrows}
          ${counterMarkup}
        </div>
      `;
    } else {
      imageMarkup = `<div class="product-card-media product-image-placeholder"><span>Photo available on request</span></div>`;
    }

    let brandBadge = '';
    if (isBranded) {
      brandBadge = `<span class="badge badge-branded" style="align-self: flex-start; margin-bottom: 6px;">Branded Line</span>`;
    }

    html += `
      <article class="product-card" data-product-slug="${prod.slug}">
        ${imageMarkup}
        <div class="product-card-content">
          <div class="product-card-header">
            ${brandBadge}
            <span class="product-card-category">${escapeHtml(prod.category)}</span>
            <h2 class="product-card-title">
              <a href="product.html?p=${prod.slug}">${escapeHtml(prod.name)}</a>
            </h2>
          </div>

          <p class="product-card-desc">${escapeHtml(prod.shortDesc)}</p>

          <div class="product-card-specs">
            <div class="product-card-spec-row">
              <span class="product-card-spec-label">Material / Grade</span>
              <span class="product-card-spec-val">${escapeHtml(firstMaterial)}</span>
            </div>
            <div class="product-card-spec-row">
              <span class="product-card-spec-label">Dimensions / Supply</span>
              <span class="product-card-spec-val">${escapeHtml(prod.size || 'Standard & Custom to Drawing')}</span>
            </div>
          </div>

          <div class="product-card-actions">
            <a href="product.html?p=${prod.slug}" class="btn btn-outline btn-sm">
              Full Specs
            </a>
            <a href="request-a-quote.html?product=${encodeURIComponent(prod.name)}" class="btn btn-primary btn-sm">
              Request Quote
            </a>
          </div>
        </div>
      </article>
    `;
  });

  grid.innerHTML = html;
}
