/**
 * GLNBC Product Detail Page Logic
 * Renders verified product photos, rich technical specifications, size standards, compatible component selectors, and RFQ launcher.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetail();
});

function initProductDetail() {
  const container = document.getElementById('product-detail-root');
  if (!container || typeof GLNBC_PRODUCTS === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('p') || 'u-bolts';

  const product = GLNBC_PRODUCTS.find(p => p.slug === slug) || GLNBC_PRODUCTS[0];

  // Update Page Title and Meta Tags dynamically
  if (product.seo && product.seo.title) {
    document.title = product.seo.title;
  } else {
    document.title = `${product.name} Technical Specifications | GLNBC Mumbai Fasteners`;
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && product.seo && product.seo.description) {
    metaDesc.setAttribute('content', product.seo.description);
  }

  renderProductPage(product, container);
}

function changeMainImage(src) {
  const mainImg = document.getElementById('main-product-img');
  if (mainImg) {
    mainImg.src = src;
  }
  const thumbs = document.querySelectorAll('#product-gallery-thumbnails > div');
  thumbs.forEach(t => {
    const img = t.querySelector('img');
    if (img && img.src.includes(src)) {
      t.style.borderColor = 'var(--color-industrial-blue)';
      t.style.borderWidth = '2px';
    } else {
      t.style.borderColor = 'var(--color-cool-grey-border)';
      t.style.borderWidth = '1px';
    }
  });
}

function renderProductPage(p, container) {
  const isBranded = p.visibilityTier === 'Branded' || p.visibilityTier === 'Also Deal In';

  // Build materials pills
  let materialsHtml = '';
  if (p.materials && p.materials.length) {
    materialsHtml = p.materials.map(m => `<span class="tag">${escapeHtml(m)}</span>`).join('');
  }

  // Build grades pills
  let gradesHtml = '';
  if (p.grades && p.grades.length) {
    gradesHtml = p.grades.map(g => `<span class="tag">${escapeHtml(g)}</span>`).join('');
  }

  // Build finishes pills
  let finishesHtml = '';
  if (p.finishes && p.finishes.length) {
    finishesHtml = p.finishes.map(f => `<span class="tag">${escapeHtml(f)}</span>`).join('');
  }

  // Build standards
  let standardsHtml = '';
  if (p.standards && p.standards.length) {
    standardsHtml = p.standards.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('');
  }

  // Build Product Images Gallery
  let mediaHtml = '';
  if (p.heroImage) {
    let galleryThumbs = '';
    if (p.galleryImages && p.galleryImages.length) {
      galleryThumbs = `
        <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;" id="product-gallery-thumbnails">
          <div style="width: 72px; height: 72px; border-radius: var(--radius-sm); border: 2px solid var(--color-industrial-blue); overflow: hidden; cursor: pointer; background: #FFFFFF;" onclick="changeMainImage('${p.heroImage}')">
            <img src="${p.heroImage}" alt="${escapeHtml(p.name)}" style="width: 100%; height: 100%; object-fit: contain;">
          </div>
          ${p.galleryImages.map((img, idx) => `
            <div style="width: 72px; height: 72px; border-radius: var(--radius-sm); border: 1px solid var(--color-cool-grey-border); overflow: hidden; cursor: pointer; background: #FFFFFF;" onclick="changeMainImage('${img}')">
              <img src="${img}" alt="${escapeHtml(p.name)} view ${idx + 2}" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
          `).join('')}
        </div>
      `;
    }

    mediaHtml = `
      <div style="background-color: white; border: 1px solid var(--color-cool-grey-border); border-radius: var(--radius-lg); padding: 16px; margin-bottom: 28px; box-shadow: var(--shadow-sm);">
        <div style="width: 100%; height: 340px; background-color: #FFFFFF; border-radius: var(--radius-md); overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-cool-grey-border); padding: 12px;">
          <img id="main-product-img" src="${p.heroImage}" alt="${escapeHtml(p.name)}" style="max-width: 95%; max-height: 95%; object-fit: contain;">
        </div>
        ${galleryThumbs}
      </div>
    `;
  }

  // Aliases / Trade names
  let aliasesHtml = '';
  if (p.aliases && p.aliases.length) {
    aliasesHtml = `
      <div style="margin-top: 8px; font-size: 13px; color: var(--color-text-muted);">
        <strong>Also Known As:</strong> ${p.aliases.map(a => `<span style="display: inline-block; background: var(--color-cool-grey); padding: 2px 6px; border-radius: 3px; margin: 2px 4px 2px 0;">${escapeHtml(a)}</span>`).join('')}
      </div>
    `;
  }

  // Applications
  let appsHtml = '';
  if (p.applications && p.applications.length) {
    appsHtml = `
      <div style="margin-top: 24px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 12px; color: var(--color-deep-black);">Primary Applications</h3>
        <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 8px;">
          ${p.applications.map(app => `
            <li style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--color-text-dark); background: var(--color-cool-grey-light); padding: 8px 12px; border-radius: var(--radius-sm); border-left: 3px solid var(--color-industrial-blue);">
              <span>✓</span> ${escapeHtml(app)}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Compatible Components
  let compatibleHtml = '';
  if (p.compatibleComponents && p.compatibleComponents.length) {
    compatibleHtml = `
      <div style="background: white; border: 1px solid var(--color-cool-grey-border); border-radius: var(--radius-lg); padding: 20px; margin-top: 28px;">
        <h3 style="font-size: 1.15rem; margin-bottom: 8px; color: var(--color-deep-black);">Frequently Paired / Compatible Assemblies</h3>
        <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 14px;">GLNBC supplies matched fastener assemblies complete with nuts, washers, brackets, and protective hardware.</p>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          ${p.compatibleComponents.map(comp => `
            <span style="display: inline-flex; align-items: center; gap: 6px; background: var(--color-blue-subtle); color: var(--color-industrial-blue); font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: var(--radius-sm); border: 1px solid rgba(15, 76, 129, 0.2);">
              + ${escapeHtml(comp)}
            </span>
          `).join('')}
        </div>
      </div>
    `;
  }

  let brandTag = isBranded ? `<span class="badge badge-branded">Branded Fastener Line</span>` : '';

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: 1fr; gap: 32px;" class="product-detail-layout">
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 8px;">
        <a href="index.html">Home</a> &gt; 
        <a href="products.html">Products</a> &gt; 
        <a href="products.html?cat=${p.categorySlug}">${escapeHtml(p.category)}</a> &gt; 
        <span style="color: var(--color-deep-black); font-weight: 600;">${escapeHtml(p.name)}</span>
      </nav>

      <div style="display: grid; grid-template-columns: 1fr; gap: 32px;" id="product-detail-columns">
        <!-- Left: Image Gallery & Actions -->
        <div>
          ${mediaHtml}
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="request-a-quote.html?product=${encodeURIComponent(p.name)}" class="btn btn-primary btn-lg w-full">
              Request Quote for ${escapeHtml(p.name)}
            </a>
            <button type="button" class="btn btn-whatsapp btn-lg w-full" onclick="openWhatsAppQuote('${escapeHtml(p.name)}', 'Hello GLNBC, I need quotation for ${escapeHtml(p.name)}')">
              Inquire on WhatsApp (+91 98214 41071)
            </button>
            <div style="font-size: 12px; text-align: center; color: var(--color-text-muted); padding: 4px 0;">
              ⚡ Direct Mumbai Godown Supply • Custom Dimensions to Drawing Available
            </div>
          </div>
        </div>

        <!-- Right: Technical Specification Matrix -->
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            ${brandTag}
            <span style="font-size: 12px; color: var(--color-industrial-blue); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">${escapeHtml(p.category)}</span>
          </div>

          <h1 style="font-size: clamp(1.8rem, 3vw, 2.4rem); color: var(--color-deep-black); margin-bottom: 12px;">
            ${escapeHtml(p.name)}
          </h1>

          <p style="font-size: 16px; line-height: 1.7; color: var(--color-text-dark); margin-bottom: 16px; text-align: justify;">
            ${escapeHtml(p.description)}
          </p>

          ${aliasesHtml}

          <!-- Specification Matrix Table -->
          <div style="background: white; border: 1px solid var(--color-cool-grey-border); border-radius: var(--radius-lg); overflow: hidden; margin-top: 24px; box-shadow: var(--shadow-sm);">
            <div style="background: var(--color-gunmetal); color: white; padding: 12px 16px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px;">
              Technical Specification Matrix
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tbody>
                <tr style="border-bottom: 1px solid var(--color-cool-grey-border);">
                  <td style="padding: 12px 16px; font-weight: 600; width: 35%; background: var(--color-cool-grey-light); color: var(--color-deep-black);">Materials Available</td>
                  <td style="padding: 12px 16px;">${materialsHtml || 'Standard & Custom on Request'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-cool-grey-border);">
                  <td style="padding: 12px 16px; font-weight: 600; background: var(--color-cool-grey-light); color: var(--color-deep-black);">Standard & Custom Grades</td>
                  <td style="padding: 12px 16px;">${gradesHtml || 'Standard Industrial Grades'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-cool-grey-border);">
                  <td style="padding: 12px 16px; font-weight: 600; background: var(--color-cool-grey-light); color: var(--color-deep-black);">Surface Finishes & Coatings</td>
                  <td style="padding: 12px 16px;">${finishesHtml || 'Self Color, Zinc Plated, HDG'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-cool-grey-border);">
                  <td style="padding: 12px 16px; font-weight: 600; background: var(--color-cool-grey-light); color: var(--color-deep-black);">Manufacturing Standards</td>
                  <td style="padding: 12px 16px;">${standardsHtml || 'IS / DIN / ASTM / Custom Drawing'}</td>
                </tr>
                <tr style="border-bottom: 1px solid var(--color-cool-grey-border);">
                  <td style="padding: 12px 16px; font-weight: 600; background: var(--color-cool-grey-light); color: var(--color-deep-black);">Dimensions & Sizing</td>
                  <td style="padding: 12px 16px; font-weight: 500;">${escapeHtml(p.dimensions || p.size || 'Standard & Custom Sizes Available')}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; font-weight: 600; background: var(--color-cool-grey-light); color: var(--color-deep-black);">Threading Specifications</td>
                  <td style="padding: 12px 16px;">${escapeHtml(p.threading || 'Metric Coarse/Fine, Imperial BSW/UNC to Specification')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          ${appsHtml}
          ${compatibleHtml}
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}
