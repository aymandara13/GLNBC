/**
 * GLNBC Catalogue Page Logic
 * Manages live search, category filtering, material filtering, quick-pills, verified product imagery, and systematic product grid rendering.
 * Grounded in UI Reference 3 layout and User Guidelines:
 * - Clean isolated white product photo container
 * - No explicit "Primary" / "Secondary" text badges
 * - Responsive real-time search with clear button and quick tag pills
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
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
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
  catButtons.forEach(b => b.classList.toggle('active', b.dataset.filterCategory === 'all'));
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
    if (currentFilters.category !== 'all' && prod.categorySlug !== currentFilters.category) {
      return false;
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
    let tierText = `All ${GLNBC_PRODUCTS.length} Products`;
    if (currentFilters.status === 'branded' || currentFilters.status === 'also-deal-in') tierText = 'Branded Lines';
    countElem.textContent = `Showing ${filtered.length} of ${GLNBC_PRODUCTS.length} Industrial Products (${tierText})`;
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
    
    // Verified Hero Image Markup
    let imageMarkup = '';
    if (prod.heroImage) {
      imageMarkup = `
        <div class="product-card-media">
          <img src="${prod.heroImage}" alt="${escapeHtml(prod.name)}" loading="lazy">
        </div>
      `;
    }

    let brandBadge = '';
    if (isBranded) {
      brandBadge = `<span class="badge badge-branded" style="align-self: flex-start; margin-bottom: 6px;">Branded Fastener</span>`;
    }

    html += `
      <article class="product-card">
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
              Full Specifications
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

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
