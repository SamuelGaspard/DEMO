const itemsBody = document.getElementById('itemsBody');
const itemTemplate = document.getElementById('itemTemplate');
const homeScreen = document.getElementById('homeScreen');
const invoiceApp = document.getElementById('invoiceApp');
const startInvoiceBtn = document.getElementById('startInvoiceBtn');
const previewInvoiceBtn = document.getElementById('previewInvoiceBtn');
const backHomeBtn = document.getElementById('backHomeBtn');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const grandTotalEl = document.getElementById('grandTotal');
const addRowBtn = document.getElementById('addRowBtn');
const printBtn = document.getElementById('printBtn');
const invoiceDate = document.getElementById('invoiceDate');
const qrImage = document.getElementById('qrImage');
const paymentQrImage = document.getElementById('paymentQrImage');
const invoiceNumber = document.getElementById('invoiceNumber');
const issuerTax = document.getElementById('issuerTax');
const clientName = document.getElementById('clientName');
const paymentMethod = document.getElementById('paymentMethod');
const paymentReference = document.getElementById('paymentReference');
const paymentAmount = document.getElementById('paymentAmount');
const paymentInstruction = document.getElementById('paymentInstruction');
const paymentStatus = document.getElementById('paymentStatus');
const mobileMoneyPanel = document.getElementById('mobileMoneyPanel');
const bankPanel = document.getElementById('bankPanel');
const mobileOperator = document.getElementById('mobileOperator');
const mobileNumber = document.getElementById('mobileNumber');
const bankName = document.getElementById('bankName');
const bankHolder = document.getElementById('bankHolder');
const bankAccount = document.getElementById('bankAccount');
const bankSwift = document.getElementById('bankSwift');
const copyPaymentInfoBtn = document.getElementById('copyPaymentInfoBtn');
const refreshPaymentBtn = document.getElementById('refreshPaymentBtn');
const homeContent = document.querySelector('.home-content');

const currencyFormat = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function showInvoiceApp() {
  homeScreen.classList.add('is-hidden');
  invoiceApp.classList.remove('is-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHomeScreen() {
  invoiceApp.classList.add('is-hidden');
  homeScreen.classList.remove('is-hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupHomeEffects() {
  if (!homeContent) {
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    return;
  }

  homeContent.addEventListener('mousemove', (event) => {
    const rect = homeContent.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const tiltX = ((midY - y) / midY) * 2.4;
    const tiltY = ((x - midX) / midX) * 2.4;

    homeContent.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
    homeContent.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
    homeContent.style.setProperty('--glow-x', `${(x / rect.width) * 100}%`);
    homeContent.style.setProperty('--glow-y', `${(y / rect.height) * 100}%`);
  });

  homeContent.addEventListener('mouseleave', () => {
    homeContent.style.setProperty('--tilt-x', '0deg');
    homeContent.style.setProperty('--tilt-y', '0deg');
    homeContent.style.setProperty('--glow-x', '50%');
    homeContent.style.setProperty('--glow-y', '20%');
  });
}

function formatCurrency(value) {
  return `${currencyFormat.format(value)} FC`;
}

function currentSubtotal() {
  return Array.from(itemsBody.querySelectorAll('tr')).reduce((sum, tr) => {
    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
    const price = parseFloat(tr.querySelector('.item-price').value) || 0;
    return sum + (qty * price);
  }, 0);
}

function escapeSvg(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderCodeSvg(title, lines) {
  const width = 520;
  const lineHeight = 28;
  const top = 30;
  const contentHeight = top + (Math.max(lines.length, 1) * lineHeight) + 38;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${contentHeight}" width="${width}" height="${contentHeight}" role="img" aria-label="${title}">`,
    '<rect width="100%" height="100%" rx="18" fill="#ffffff"/>',
    `<rect x="12" y="12" width="496" height="${contentHeight - 24}" rx="14" fill="#f7fbfb" stroke="#c7d5db"/>`,
    '<rect x="12" y="12" width="496" height="12" rx="6" fill="#006d77"/>',
    `<text x="28" y="54" fill="#006d77" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="26" font-weight="700">${escapeSvg(title)}</text>`
  ];

  lines.forEach((line, index) => {
    svg.push(`<text x="28" y="${94 + (index * lineHeight)}" fill="#1a2433" font-family="Trebuchet MS, Segoe UI, sans-serif" font-size="18">${escapeSvg(line)}</text>`);
  });

  const decorative = [
    [372, 72], [398, 72], [424, 72], [450, 72],
    [372, 98], [398, 98], [424, 98], [450, 98],
    [372, 124], [398, 124], [424, 124], [450, 124]
  ];

  decorative.forEach(([x, y], index) => {
    const fill = index % 2 === 0 ? '#006d77' : '#c44536';
    svg.push(`<rect x="${x}" y="${y}" width="14" height="14" rx="2" fill="${fill}"/>`);
  });

  svg.push('</svg>');
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.join(''))}`;
}

function buildInvoiceLines() {
  const subtotal = currentSubtotal();
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  return [
    `Numéro: ${invoiceNumber.value || ''}`,
    `Date: ${invoiceDate.value || ''}`,
    `NI: ${issuerTax.value || ''}`,
    `Client: ${clientName.value || ''}`,
    `HT: ${formatCurrency(subtotal)}`,
    `TVA: ${formatCurrency(vat)}`,
    `TTC: ${formatCurrency(total)}`
  ];
}

function buildPaymentData() {
  const subtotal = currentSubtotal();
  const vat = subtotal * 0.16;
  const total = subtotal + vat;
  const reference = (invoiceNumber.value || '').trim() || 'FACTURE';
  const amount = total.toFixed(2);

  if (paymentMethod.value === 'mobilemoney') {
    let payload = [
      'PAYMENT',
      'METHOD=MOBILEMONEY',
      `REF=${reference}`,
      `OPERATOR=${mobileOperator.value.trim()}`,
      `NUMBER=${mobileNumber.value.trim()}`,
      `AMOUNT=${amount}`,
      'CURRENCY=CDF'
    ].join('|');

    if (new TextEncoder().encode(payload).length > 160) {
      payload = [
        'PAYMENT',
        'METHOD=MOBILEMONEY',
        `REF=${reference}`,
        `NUMBER=${mobileNumber.value.trim()}`,
        `AMOUNT=${amount}`,
        'CURRENCY=CDF'
      ].join('|');
    }

    return {
      reference,
      amountText: formatCurrency(total),
      instruction: `Paiement Mobile Money\nOpérateur: ${mobileOperator.value.trim()}\nNuméro: ${mobileNumber.value.trim()}\nRéférence: ${reference}\nMontant: ${formatCurrency(total)}`,
      payload,
      isMobile: true
    };
  }

  let payload = [
    'PAYMENT',
    'METHOD=BANK',
    `REF=${reference}`,
    `BANK=${bankName.value.trim()}`,
    `HOLDER=${bankHolder.value.trim()}`,
    `ACCOUNT=${bankAccount.value.trim()}`,
    `SWIFT=${bankSwift.value.trim()}`,
    `AMOUNT=${amount}`,
    'CURRENCY=CDF'
  ].join('|');

  if (new TextEncoder().encode(payload).length > 160) {
    payload = [
      'PAYMENT',
      'METHOD=BANK',
      `REF=${reference}`,
      `BANK=${bankName.value.trim()}`,
      `ACCOUNT=${bankAccount.value.trim()}`,
      `AMOUNT=${amount}`,
      'CURRENCY=CDF'
    ].join('|');
  }

  return {
    reference,
    amountText: formatCurrency(total),
    instruction: `Paiement bancaire\nBanque: ${bankName.value.trim()}\nTitulaire: ${bankHolder.value.trim()}\nCompte: ${bankAccount.value.trim()}\nSWIFT / IBAN: ${bankSwift.value.trim()}\nRéférence: ${reference}\nMontant: ${formatCurrency(total)}`,
    payload,
    isMobile: false
  };
}

function createRow(name = '', qty = 1, price = 0) {
  const row = itemTemplate.content.cloneNode(true);
  const tr = row.querySelector('tr');
  const nameInput = row.querySelector('.item-name');
  const qtyInput = row.querySelector('.item-qty');
  const priceInput = row.querySelector('.item-price');
  const totalInput = row.querySelector('.item-total');
  const removeBtn = row.querySelector('.remove-row');

  nameInput.value = name;
  qtyInput.value = qty;
  priceInput.value = price;
  totalInput.value = formatCurrency(qty * price);

  const updateRow = () => updateTotals();

  nameInput.addEventListener('input', updateRow);
  qtyInput.addEventListener('input', updateRow);
  priceInput.addEventListener('input', updateRow);
  removeBtn.addEventListener('click', () => {
    tr.remove();
    updateTotals();
    if (itemsBody.children.length === 0) {
      addInitialRow();
    }
  });

  itemsBody.appendChild(tr);
}

function addInitialRow() {
  if (itemsBody.children.length === 0) {
    createRow('Prestation initiale', 1, 0);
  }
}

function updateInvoiceCode() {
  qrImage.src = renderCodeSvg('FACTURE RDC', buildInvoiceLines());
}

function updatePaymentSection() {
  const data = buildPaymentData();
  paymentReference.textContent = data.reference;
  paymentAmount.textContent = data.amountText;
  paymentInstruction.textContent = data.instruction;
  paymentQrImage.src = renderCodeSvg(data.isMobile ? 'MOBILE MONEY' : 'BANQUE', data.instruction.split('\n'));
  mobileMoneyPanel.classList.toggle('is-hidden', !data.isMobile);
  bankPanel.classList.toggle('is-hidden', data.isMobile);
}

function updateTotals() {
  let subtotal = 0;
  itemsBody.querySelectorAll('tr').forEach((tr) => {
    const qty = parseFloat(tr.querySelector('.item-qty').value) || 0;
    const price = parseFloat(tr.querySelector('.item-price').value) || 0;
    const total = qty * price;
    tr.querySelector('.item-total').value = formatCurrency(total);
    subtotal += total;
  });

  const vat = subtotal * 0.16;
  const grandTotal = subtotal + vat;

  subtotalEl.textContent = formatCurrency(subtotal);
  vatEl.textContent = formatCurrency(vat);
  grandTotalEl.textContent = formatCurrency(grandTotal);
  updateInvoiceCode();
  updatePaymentSection();
}

addRowBtn.addEventListener('click', () => {
  createRow();
  updateTotals();
});

startInvoiceBtn.addEventListener('click', showInvoiceApp);

previewInvoiceBtn.addEventListener('click', showInvoiceApp);

backHomeBtn.addEventListener('click', showHomeScreen);

printBtn.addEventListener('click', () => {
  window.print();
});

[invoiceNumber, invoiceDate, issuerTax, clientName].forEach((input) => {
  input.addEventListener('input', updateInvoiceCode);
});

[paymentMethod, mobileOperator, mobileNumber, bankName, bankHolder, bankAccount, bankSwift, invoiceNumber].forEach((input) => {
  input.addEventListener('input', updatePaymentSection);
  input.addEventListener('change', updatePaymentSection);
});

copyPaymentInfoBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(paymentInstruction.textContent);
    paymentStatus.textContent = 'Informations de paiement copiées.';
  } catch {
    paymentStatus.textContent = 'Impossible de copier automatiquement les informations.';
  }
});

refreshPaymentBtn.addEventListener('click', () => {
  updatePaymentSection();
  paymentStatus.textContent = 'Bloc de paiement mis à jour.';
});

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
invoiceDate.value = `${year}-${month}-${day}`;

createRow('Prestation initiale', 1, 0);
createRow('Frais de service', 2, 0);
updateTotals();
setupHomeEffects();

if (window.location.hash === '#facture') {
  showInvoiceApp();
}
