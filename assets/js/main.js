/**
 * GLNBC Main JavaScript Module
 * Navigation, Hero Slider (Rolling Pictures), Multi-Image Card Flipper, Fast Multi-Tier Search, Accordions, Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initAccordions();
  initGlobalSearch();
  initHeroSlider();
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
// Hero Slider (Rolling Pictures - amioptics inspiration)
// ==========================================
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.querySelector('.hero-prev-btn');
  const nextBtn = document.querySelector('.hero-next-btn');
  const wrapper = document.querySelector('.hero-slider-wrapper');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    goToSlide(next);
  }

  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

// ==========================================
// Card Multi-Image Quick Navigation Flipper
// ==========================================
const cardImageIndices = {};

window.changeCardImage = function(event, prodSlug, step) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }

  if (typeof GLNBC_PRODUCTS === 'undefined') return;
  const prod = GLNBC_PRODUCTS.find(p => p.slug === prodSlug);
  if (!prod) return;

  const allImages = [prod.heroImage, ...(prod.galleryImages || [])].filter(Boolean);
  if (allImages.length <= 1) return;

  if (typeof cardImageIndices[prodSlug] === 'undefined') {
    cardImageIndices[prodSlug] = 0;
  }

  cardImageIndices[prodSlug] = (cardImageIndices[prodSlug] + step + allImages.length) % allImages.length;
  const newIndex = cardImageIndices[prodSlug];

  const cardElem = document.querySelector(`[data-product-slug="${prodSlug}"]`);
  if (cardElem) {
    const imgElem = cardElem.querySelector('.product-card-media img');
    if (imgElem) {
      imgElem.src = allImages[newIndex];
    }
    const counterElem = cardElem.querySelector('.card-img-counter');
    if (counterElem) {
      counterElem.textContent = `${newIndex + 1}/${allImages.length}`;
    }
  }
};

window.openProductPage = function(prodSlug) {
  window.location.href = `product.html?p=${encodeURIComponent(prodSlug)}`;
};

// ==========================================
// Accordions (FAQ & Branded Ranges)
// ==========================================
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion');
  
  accordions.forEach(acc => {
    const header = acc.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = acc.classList.contains('active');
      
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

    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

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
    
    const matchAlias = prod.aliases && prod.aliases.some(alias => {
      const cleanAlias = alias.toLowerCase().replace(/[-_\s]/g, '');
      return cleanAlias.includes(cleanQuery);
    });

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
  const phone = '919821441071';
  let message = 'Hello Good Luck Nut Bolt Corporation (GLNBC), I would like to inquire about industrial fasteners.';
  
  if (customMessage) {
    message = customMessage;
  } else if (productName) {
    message = `Hello GLNBC, I would like to request a price quotation for: *${productName}*. Please provide size availability and rates.`;
  }
  
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
