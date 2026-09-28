/**
 * GLNBC Quote Request & Multi-Component Builder Logic
 * Handles dynamic component additions, unknown product mode, file attachments, and WhatsApp RFQ formatting.
 */

document.addEventListener('DOMContentLoaded', () => {
  initQuoteForm();
});

let componentCount = 1;

function initQuoteForm() {
  const container = document.getElementById('components-container');
  const addBtn = document.getElementById('btn-add-component');
  const form = document.getElementById('rfq-main-form');
  if (!container || !form) return;

  // Check URL params for prefilled product or custom requirement
  const urlParams = new URLSearchParams(window.location.search);
  const prefillProduct = urlParams.get('p');
  const customQuery = urlParams.get('custom');

  if (prefillProduct) {
    const firstItemInput = document.getElementById('comp-name-1');
    if (firstItemInput) firstItemInput.value = prefillProduct;
  }

  if (customQuery) {
    const descArea = document.getElementById('notes-input');
    if (descArea) descArea.value = `Custom requirement search: ${customQuery}`;
  }

  // Add Component Row
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      componentCount++;
      addComponentRow(componentCount, container);
    });
  }

  // File Upload Handler
  initFileUpload();

  // Form Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleQuoteSubmission(form);
  });

  // Direct WhatsApp Button
  const waBtn = document.getElementById('btn-quote-whatsapp');
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      sendViaWhatsApp(form);
    });
  }
}

function addComponentRow(index, container) {
  const row = document.createElement('div');
  row.className = 'rfq-component-row';
  row.id = `rfq-row-${index}`;

  row.innerHTML = `
    <div class="rfq-component-header">
      <span class="rfq-component-number">Component #${index}</span>
      <button type="button" class="rfq-btn-remove" onclick="removeComponentRow(${index})">✕ Remove</button>
    </div>

    <div class="form-row form-row-2">
      <div class="form-group">
        <label class="form-label" for="comp-name-${index}">Product Name / Type <span class="required">*</span></label>
        <input type="text" class="form-control" id="comp-name-${index}" name="comp_name_${index}" placeholder="e.g. Hex Nuts, Flat Washers, B7 Studs" required list="products-datalist">
      </div>
      <div class="form-group">
        <label class="form-label" for="comp-qty-${index}">Quantity & Unit</label>
        <input type="text" class="form-control" id="comp-qty-${index}" name="comp_qty_${index}" placeholder="e.g. 500 Pcs, 50 Kgs, 20 Sets">
      </div>
    </div>

    <div class="form-row form-row-3">
      <div class="form-group">
        <label class="form-label" for="comp-size-${index}">Size / Dimensions</label>
        <input type="text" class="form-control" id="comp-size-${index}" name="comp_size_${index}" placeholder="e.g. M12 x 100mm, 2-inch NB">
      </div>
      <div class="form-group">
        <label class="form-label" for="comp-mat-${index}">Material / Grade</label>
        <select class="form-control" id="comp-mat-${index}" name="comp_mat_${index}">
          <option value="Standard / To Spec">Standard / To Spec</option>
          <option value="Mild Steel (MS)">Mild Steel (MS)</option>
          <option value="High Tensile Grade 8.8">High Tensile Grade 8.8</option>
          <option value="High Tensile Grade 10.9">High Tensile Grade 10.9</option>
          <option value="ASTM A193 B7 / A194 2H">ASTM A193 B7 / A194 2H</option>
          <option value="Stainless Steel SS 304">Stainless Steel SS 304</option>
          <option value="Stainless Steel SS 316">Stainless Steel SS 316</option>
          <option value="Stainless Steel SS 202">Stainless Steel SS 202</option>
          <option value="Brass / Aluminium">Brass / Aluminium</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="comp-finish-${index}">Surface Finish</label>
        <select class="form-control" id="comp-finish-${index}" name="comp_finish_${index}">
          <option value="Standard / Self Color">Standard / Self Color</option>
          <option value="Hot Dip Galvanized (HDG)">Hot Dip Galvanized (HDG)</option>
          <option value="Zinc Electroplated">Zinc Electroplated</option>
          <option value="Black Oxide">Black Oxide</option>
          <option value="PTFE / Xylan Coated">PTFE / Xylan Coated</option>
          <option value="Natural SS">Natural SS</option>
        </select>
      </div>
    </div>
  `;

  container.appendChild(row);
}

function removeComponentRow(index) {
  const row = document.getElementById(`rfq-row-${index}`);
  if (row) row.remove();
}

function initFileUpload() {
  const dropZone = document.getElementById('drawing-dropzone');
  const fileInput = document.getElementById('drawing-file-input');
  const filePreview = document.getElementById('file-preview-name');

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      updateFilePreview(fileInput.files[0], filePreview);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      updateFilePreview(fileInput.files[0], filePreview);
    }
  });
}

function updateFilePreview(file, previewElem) {
  if (!previewElem || !file) return;
  const sizeKb = Math.round(file.size / 1024);
  previewElem.innerHTML = `
    <div style="margin-top: 10px; padding: 8px 12px; background: var(--color-blue-subtle); border-radius: 4px; display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--color-industrial-blue);">
      <span>Attached: ${escapeHtml(file.name)} (${sizeKb} KB)</span>
    </div>
  `;
}

function extractFormData(form) {
  const name = form.querySelector('#client-name')?.value.trim() || '';
  const phone = form.querySelector('#client-phone')?.value.trim() || '';
  const company = form.querySelector('#client-company')?.value.trim() || '';
  const email = form.querySelector('#client-email')?.value.trim() || '';
  const location = form.querySelector('#client-location')?.value.trim() || '';
  const notes = form.querySelector('#notes-input')?.value.trim() || '';

  const components = [];
  const rows = form.querySelectorAll('.rfq-component-row');
  rows.forEach((row, idx) => {
    const cName = row.querySelector('input[name^="comp_name"]')?.value.trim();
    const cQty = row.querySelector('input[name^="comp_qty"]')?.value.trim();
    const cSize = row.querySelector('input[name^="comp_size"]')?.value.trim();
    const cMat = row.querySelector('select[name^="comp_mat"]')?.value;
    const cFin = row.querySelector('select[name^="comp_finish"]')?.value;

    if (cName) {
      components.push({
        itemNumber: idx + 1,
        name: cName,
        qty: cQty || 'As required',
        size: cSize || 'Standard / Custom',
        material: cMat || 'Standard',
        finish: cFin || 'Standard'
      });
    }
  });

  return { name, phone, company, email, location, notes, components };
}

function buildWhatsAppMessage(data) {
  let msg = `*GOOD LUCK NUT BOLT CORPORATION — QUOTE REQUEST*\n`;
  msg += `----------------------------------------\n`;
  msg += `*Buyer Name:* ${data.name}\n`;
  msg += `*Phone:* ${data.phone}\n`;
  if (data.company) msg += `*Company:* ${data.company}\n`;
  if (data.email) msg += `*Email:* ${data.email}\n`;
  if (data.location) msg += `*Delivery Location:* ${data.location}\n`;
  msg += `----------------------------------------\n`;
  msg += `*REQUESTED COMPONENTS:*\n`;

  data.components.forEach(c => {
    msg += `\n*${c.itemNumber}. ${c.name}*\n`;
    msg += `  • Qty: ${c.qty}\n`;
    msg += `  • Size: ${c.size}\n`;
    msg += `  • Material: ${c.material}\n`;
    msg += `  • Finish: ${c.finish}\n`;
  });

  if (data.notes) {
    msg += `\n*Additional Notes / Application:*\n${data.notes}\n`;
  }

  msg += `\n_Submitted via GLNBC Official Web Platform_`;
  return msg;
}

function sendViaWhatsApp(form) {
  const data = extractFormData(form);
  if (!data.name || !data.phone) {
    showToast('Please provide your Name and Phone Number to generate WhatsApp Quote.', 'warning');
    return;
  }
  if (!data.components.length) {
    showToast('Please add at least one component requirement.', 'warning');
    return;
  }

  const msg = buildWhatsAppMessage(data);
  const targetPhone = (typeof GLNBC_COMPANY !== 'undefined') ? GLNBC_COMPANY.contacts.whatsappPrimary : '919821441071';
  const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function handleQuoteSubmission(form) {
  const data = extractFormData(form);
  if (!data.name || !data.phone) {
    showToast('Please fill in required fields (Name & Phone).', 'warning');
    return;
  }

  const modalRoot = document.getElementById('rfq-success-modal');
  if (modalRoot) {
    const summaryElem = document.getElementById('modal-summary-text');
    if (summaryElem) {
      summaryElem.innerHTML = `
        <p><strong>Thank you, ${escapeHtml(data.name)}.</strong> Your quotation request for <strong>${data.components.length} item(s)</strong> has been compiled.</p>
        <p style="margin-top: 8px; font-size: 13px; color: var(--color-text-muted);">
          Our sales team at Good Luck Nut Bolt Corporation (Kumbharwada & Nagdevi) will review the specifications and reply promptly on <strong>${escapeHtml(data.phone)}</strong>.
        </p>
      `;
    }
    modalRoot.classList.add('active');
  } else {
    showToast('Quote compiled successfully! Our team will contact you shortly.', 'success');
  }
}
