// ── FORMATTERS ───────────────────────────────────────────────────────────────
function formatPrice(p) {
  return '$' + Number(p).toFixed(2);
}

function slotLabel(key) {
  const [h, m] = key.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hh}:${String(m).padStart(2, '0')} ${ampm}`;
}

function getAvailableSlots(maxPrepMinutes) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const earliest = currentMinutes + maxPrepMinutes + SLOT_INTERVAL;
  const slots = [];
  let t = BAKERY_OPEN;
  while (t < BAKERY_CLOSE) {
    const h = String(Math.floor(t / 60)).padStart(2, '0');
    const m = String(t % 60).padStart(2, '0');
    const key = `${h}:${m}`;
    const used = SLOT_CAPS[key] || 0;
    slots.push({
      key,
      label: slotLabel(key),
      used,
      full: used >= SLOT_CAPACITY,
      tooEarly: t < earliest
    });
    t += SLOT_INTERVAL;
  }
  return slots;
}

function genOrderId() {
  return 'BK-' + (2415 + Math.floor(Math.random() * 80));
}

// ── STATE ────────────────────────────────────────────────────────────────────
const State = {
  page:           'home',
  cart:           [],
  user:           null,
  selectedItem:   null,
  pickupTime:     null,
  confirmedOrder: null,
  authMode:       'login',
  activeCategory: 'All',
  searchQuery:    '',
  selectedPayment:'card',
  selectedSlot:   null,
  itemQty:        1,
  adminOrders:    JSON.parse(JSON.stringify(ADMIN_ORDERS)),

  cartCount() {
    return this.cart.reduce((s, i) => s + i.qty, 0);
  },
  cartSubtotal() {
    return this.cart.reduce((s, i) => s + i.price * i.qty, 0);
  },
  cartTax() {
    return this.cartSubtotal() * 0.08;
  },
  cartTotal() {
    return this.cartSubtotal() + this.cartTax();
  },
  maxPrepTime() {
    if (!this.cart.length) return 0;
    return Math.max(...this.cart.map(i => i.prepTime || 0));
  }
};

function navigate(page) {
  State.page = page;
  window.scrollTo(0, 0);
  render();
}

function addToCart(item) {
  const existing = State.cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    State.cart.push({ ...item, qty: 1 });
  }
  updateCartBadge();
  showToast(`${item.name} added to cart`, 'success');
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = State.cartCount();
    el.style.display = State.cartCount() > 0 ? 'flex' : 'none';
  });
}

// ── TOAST ────────────────────────────────────────────────────────────────────
function showToast(message, type = '') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast${type ? ' ' + type : ''}`;
  toast.innerHTML = (type === 'success' ? svgIcon('check', 16) + ' ' : '') + message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastIn .3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// ── SVG ICONS ────────────────────────────────────────────────────────────────
function svgIcon(name, size = 20, color = 'currentColor') {
  const s = size;
  const icons = {
    menu:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    cart:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
    orders:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>`,
    user:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    home:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>`,
    plus:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    minus:      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    trash:      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
    clock:      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`,
    arrowLeft:  `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.2"><polyline points="15,18 9,12 15,6"/></svg>`,
    check:      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>`,
    admin:      `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    leaf:       `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><path d="M2 22c1.25-1.25 2.5-2.5 3.75-3.75C7 17 9 16 11 16c2 0 3.5-.5 5-2 3-3 4-8 2-12-4 2-9 3-11 6-1.5 2-2 4.5-2 7"/><path d="M6 18l6-6"/></svg>`,
    logout:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    search:     `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  };
  return icons[name] || '';
}
