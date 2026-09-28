/**
 * GLNBC Main JavaScript Module
 * Navigation, Fast Multi-Tier Search Modal, Accordions, Helpers & Analytics Hooks
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAccordions();
  initGlobalSearch();
  initAnalyticsTriggers();
});

// ==========================================
// Mobile Navigation
// ==========================================
function initMobileNav() {
  const toggleBtn = document.querySelector('.menu-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.mobile-drawer-overlay');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer || !overlay) return;

  function openMenu() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
}

// ==========================================
// Accordions (FAQ & Also Deal In)
// ==========================================
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = acc.classList.contains('active');
      
      // If in accordion-group with single-open, close others
      const group = acc.closest('.accordion-group');
      if (group && group.dataset.single === 'true') {
        group.querySelectorAll('.accordion').forEach(other => {
          if (other !== acc) other.classList.remove('active');
        });
      }

      acc.classList.toggle('active', !isActive);
      const isNowActive = acc.classList.contains('active');
      header.setAttribute('aria-expanded', isNowActive ? 'true' : 'false');
    });
  });
}

// ==========================================
// Global Fast Search & Alias Matching
// ==========================================
function initGlobalSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  
  searchInputs.forEach(input => {
    const wrapper = input.closest('.search-wrapper');
    if (!wrapper) return;

    let dropdown = wrapper.querySelector('.search-results-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-results-dropdown';
      wrapper.appendChild(dropdown);
    }

    input.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (!query || typeof GLNBC_PRODUCTS === 'undefined') {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        return;
      }

      const results = searchProducts(query);
      renderSearchResults(results, dropdown, query);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Enter key submits to catalogue page
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `products.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  });
}

function searchProducts(query) {
  if (typeof GLNBC_PRODUCTS === 'undefined') return [];
  const cleanQuery = query.toLowerCase().replace(/[-_\s]/g, '');

  return GLNBC_PRODUCTS.filter(prod => {
    const cleanName = prod.name.toLowerCase().replace(/[-_\s]/g, '');
    const cleanCat = prod.category.toLowerCase().replace(/[-_\s]/g, '');
    const matchName = cleanName.includes(cleanQuery);
    const matchCat = cleanCat.includes(cleanQuery);
    
    // Check aliases
    const matchAlias = prod.aliases && prod.aliases.some(alias => {
      const cleanAlias = alias.toLowerCase().replace(/[-_\s]/g, '');
      return cleanAlias.includes(cleanQuery);
    });

    // Check materials & grades
    const matchMaterial = prod.materials && prod.materials.some(mat => 
      mat.toLowerCase().includes(query)
    );
    const matchGrade = prod.grades && prod.grades.some(grd => 
      grd.toLowerCase().includes(query)
    );

    return matchName || matchCat || matchAlias || matchMaterial || matchGrade;
  }).slice(0, 8);
}

function renderSearchResults(results, container, query) {
  if (!results.length) {
    container.innerHTML = `
      <div style="padding: 18px 16px; text-align: center; color: var(--color-text-muted); font-size: 13px;">
        <p style="margin-bottom: 6px; color: var(--color-deep-black); font-weight: 600;">No catalog match for "${escapeHtml(query)}"</p>
        <p style="margin-bottom: 12px; font-size: 12px;">We regularly supply custom fabrications, non-standard threading, and special alloys to drawing.</p>
        <a href="request-a-quote.html?custom=${encodeURIComponent(query)}" class="btn btn-sm btn-primary">Send Custom Requirement</a>
      </div>
    `;
    container.classList.add('active');
    return;
  }

  let html = '';
  results.forEach(prod => {
    const firstMat = (prod.materials && prod.materials[0]) ? prod.materials[0] : 'Industrial Grade';
    const isBranded = prod.visibilityTier === 'Branded' || prod.visibilityTier === 'Also Deal In';
    let brandBadge = isBranded ? `<span class="badge badge-branded" style="font-size: 10px; margin-left: 6px;">Branded</span>` : '';

    html += `
      <a href="product.html?p=${prod.slug}" class="search-result-item">
        <div>
          <div class="search-result-name">${escapeHtml(prod.name)}${brandBadge}</div>
          <div class="search-result-alias">${escapeHtml(prod.category)} • ${escapeHtml(firstMat)}</div>
        </div>
        <span class="btn btn-sm btn-outline-blue" style="min-height: 28px; padding: 0 10px; font-size: 11px;">View</span>
      </a>
    `;
  });

  html += `
    <div style="padding: 10px 16px; background-color: var(--color-cool-grey-light); text-align: right; border-top: 1px solid var(--color-cool-grey-border);">
      <a href="products.html?q=${encodeURIComponent(query)}" style="font-size: 12px; font-weight: 600; color: var(--color-industrial-blue);">
        View all results in Complete Products Catalogue →
      </a>
    </div>
  `;

  container.innerHTML = html;
  container.classList.add('active');
}

// ==========================================
// WhatsApp Link Formatter
// ==========================================
function openWhatsAppQuote(productName = '', customMessage = '') {
  const phone = (typeof GLNBC_COMPANY !== 'undefined' && GLNBC_COMPANY.contacts) ? GLNBC_COMPANY.contacts.whatsappPrimary : '919821441071';
  let text = `Hello Good Luck Nut Bolt Corporation, `;
  
  if (productName) {
    text += `I would like to request a quote for ${productName}.`;
  } else if (customMessage) {
    text += customMessage;
  } else {
    text += `I would like to enquire about your industrial fastener and hardware products.`;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

// ==========================================
// Toast Notification
// ==========================================
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background-color: #1C1C1C;
    color: #FFFFFF;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    border-left: 4px solid ${type === 'success' ? '#25D366' : '#3E6B8A'};
    transition: opacity 300ms ease;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================
// Analytics Event Logging
// ==========================================
function initAnalyticsTriggers() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-track]');
    if (!target) return;
    const eventName = target.dataset.track;
    const eventLabel = target.dataset.trackLabel || '';
    
    // Log structured event (ready for GTM / GA4)
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: eventName,
        event_label: eventLabel,
        timestamp: new Date().toISOString()
      });
    }
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
