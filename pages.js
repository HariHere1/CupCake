/* ══ SHARED COMPONENTS ══════════════════════════════════════════════════════ */

function renderFoodCard(item) {
  return `
    <div class="food-card" data-id="${item.id}">
      <div class="food-card-img-wrap">
        <img class="food-card-img" src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="food-card-body">
        <div class="food-card-cat">${item.category}</div>
        <div class="food-card-name">${item.name}</div>
        <div class="food-card-prep">${svgIcon('clock',12,'var(--text3)')} ${item.prepTime} min prep</div>
        <div class="food-card-footer">
          <span class="food-card-price">${formatPrice(item.price)}</span>
          <button class="food-card-add" data-add-id="${item.id}" aria-label="Add ${item.name}">
            ${svgIcon('plus',14)}
          </button>
        </div>
      </div>
    </div>`;
}

function renderBadge(status) {
  const map = { Preparing:'preparing', Ready:'ready', Completed:'completed' };
  return `<span class="badge badge-${map[status]||'preparing'}">${status}</span>`;
}

function renderSteps(active) {
  const labels = ['Cart','Schedule','Checkout'];
  return `<div class="steps">
    ${labels.map((label, i) => {
      const n = i + 1;
      const cls = n < active ? 'done' : n === active ? 'active' : 'inactive';
      const num = n < active ? svgIcon('check',12,'#fff') : n;
      return `${i > 0 ? '<div class="step-line"></div>' : ''}<div class="step ${cls}"><span class="step-num">${num}</span><span class="step-label">${label}</span></div>`;
    }).join('')}
  </div>`;
}

/* ══ HOME ═══════════════════════════════════════════════════════════════════ */

function renderHome() {
  const featured = MENU_ITEMS.filter(i => FEATURED_IDS.includes(i.id));
  return `
    <div class="page fade-in">
      <div class="hero">
        <div class="hero-content">
          <div class="hero-tag">${svgIcon('leaf',14)} Fresh baked daily</div>
          <h1>Order Ahead,<br>Pick Up Fresh</h1>
          <p>Skip the wait. Pre-order your favourites and we'll have them perfectly fresh and ready at your chosen pickup time.</p>
          <div class="hero-actions">
            <button class="hero-btn hero-btn-primary" onclick="navigate('menu')">Browse Menu</button>
            <button class="hero-btn hero-btn-secondary" onclick="navigate('orders')">My Orders</button>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Featured Items</h2>
            <button class="btn btn-secondary btn-sm" onclick="navigate('menu')">See all →</button>
          </div>
          <div class="food-grid">${featured.map(renderFoodCard).join('')}</div>
        </div>
        <div class="section" style="border-top:1px solid var(--beige)">
          <h2 class="section-title" style="text-align:center;margin-bottom:32px">How It Works</h2>
          <div class="how-grid">
            <div class="how-card"><div class="how-num">01</div><h3 class="how-title">Browse &amp; Order</h3><p class="how-desc">Choose from our freshly baked selection, available daily.</p></div>
            <div class="how-card"><div class="how-num">02</div><h3 class="how-title">Pick a Time</h3><p class="how-desc">Select a convenient 10-minute pickup slot that suits you.</p></div>
            <div class="how-card"><div class="how-num">03</div><h3 class="how-title">We Prepare</h3><p class="how-desc">We'll have everything perfectly fresh and ready for you.</p></div>
            <div class="how-card"><div class="how-num">04</div><h3 class="how-title">Just Pick Up</h3><p class="how-desc">Skip the queue entirely — grab your order and go.</p></div>
          </div>
        </div>
      </div>
    </div>`;
}

/* ══ MENU ═══════════════════════════════════════════════════════════════════ */

function renderMenu() {
  const filtered = MENU_ITEMS.filter(item => {
    const catOk  = State.activeCategory === 'All' || item.category === State.activeCategory;
    const srchOk = item.name.toLowerCase().includes(State.searchQuery.toLowerCase());
    return catOk && srchOk;
  });
  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0">
          <div class="page-title">Our Menu</div>
          <div class="page-subtitle">Pre-order and pick up at your chosen time</div>
        </div>
      </div>
      <div class="container">
        <div class="section">
          <input id="menu-search" class="search-input" type="search" placeholder="Search items…"
            value="${State.searchQuery}" oninput="handleMenuSearch(this.value)">
          <div class="cat-tabs" id="cat-tabs">
            ${CATEGORIES.map(c => `
              <button class="cat-tab${State.activeCategory===c?' active':''}"
                onclick="handleCatChange('${c}')">${c}</button>`).join('')}
          </div>
          <div id="menu-grid">
            ${filtered.length
              ? `<div class="food-grid">${filtered.map(renderFoodCard).join('')}</div>`
              : `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No items found</div><div class="empty-sub">Try a different search or category.</div></div>`}
          </div>
        </div>
      </div>
    </div>`;
}

function handleMenuSearch(val) { State.searchQuery = val; refreshMenuGrid(); }
function handleCatChange(cat) {
  State.activeCategory = cat;
  State.searchQuery = '';
  const inp = document.getElementById('menu-search');
  if (inp) inp.value = '';
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.toggle('active', b.textContent.trim() === cat));
  refreshMenuGrid();
}
function refreshMenuGrid() {
  const filtered = MENU_ITEMS.filter(item => {
    const catOk  = State.activeCategory === 'All' || item.category === State.activeCategory;
    const srchOk = item.name.toLowerCase().includes(State.searchQuery.toLowerCase());
    return catOk && srchOk;
  });
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  grid.innerHTML = filtered.length
    ? `<div class="food-grid">${filtered.map(renderFoodCard).join('')}</div>`
    : `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No items found</div><div class="empty-sub">Try a different search or category.</div></div>`;
  attachCardEvents(grid);
}

/* ══ ITEM DETAIL ════════════════════════════════════════════════════════════ */

function renderItem() {
  const item = State.selectedItem;
  if (!item) { navigate('menu'); return ''; }
  return `
    <div class="page fade-in">
      <div class="container">
        <button class="back-btn" onclick="navigate('menu')">${svgIcon('arrowLeft',16)} Back to Menu</button>
        <div class="item-detail-grid">
          <img class="item-detail-img" src="${item.image}" alt="${item.name}">
          <div>
            <div class="item-detail-cat">${item.category}</div>
            <h1 class="item-detail-title">${item.name}</h1>
            <div class="item-detail-price">${formatPrice(item.price)}</div>
            <div class="item-detail-prep-chip">${svgIcon('clock',14)} Prep time: ${item.prepTime} minutes</div>
            <p class="item-detail-desc">${item.description}</p>
            <div class="ingredients-label">Ingredients</div>
            <div class="ingredients-list">
              ${item.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('')}
            </div>
            <div class="qty-control">
              <button class="qty-btn" onclick="changeItemQty(-1)">${svgIcon('minus',14)}</button>
              <span class="qty-display" id="qty-display">${State.itemQty}</span>
              <button class="qty-btn" onclick="changeItemQty(1)">${svgIcon('plus',14)}</button>
            </div>
            <button class="btn btn-primary btn-lg btn-full" onclick="addItemToCart()">
              ${svgIcon('cart',16)} Add to Cart &middot; <span id="add-btn-price">${formatPrice(item.price * State.itemQty)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function changeItemQty(delta) {
  State.itemQty = Math.max(1, State.itemQty + delta);
  const d = document.getElementById('qty-display');
  const p = document.getElementById('add-btn-price');
  if (d) d.textContent = State.itemQty;
  if (p && State.selectedItem) p.textContent = formatPrice(State.selectedItem.price * State.itemQty);
}

function addItemToCart() {
  if (!State.selectedItem) return;
  for (let i = 0; i < State.itemQty; i++) addToCart(State.selectedItem);
  State.itemQty = 1;
  navigate('cart');
}

/* ══ CART ═══════════════════════════════════════════════════════════════════ */

function renderCart() {
  if (!State.cart.length) return `
    <div class="page fade-in"><div class="container">
      <div class="empty-state">
        <div class="empty-icon">🧺</div>
        <div class="empty-title">Your cart is empty</div>
        <div class="empty-sub">Add some delicious items from our menu.</div>
        <button class="btn btn-primary" onclick="navigate('menu')">Browse Menu</button>
      </div>
    </div></div>`;

  const sub = State.cartSubtotal(), tax = State.cartTax(), total = State.cartTotal();

  // Show pickup reset notice if a time was previously selected but is now invalid
  const pickupNotice = State.pickupTime
    ? `<div style="background:var(--cream2);border-radius:var(--radius-sm);padding:10px 14px;font-size:13px;color:var(--text2);display:flex;align-items:center;gap:8px;margin-bottom:16px">
        ${svgIcon('clock',14,'var(--brown-light)')} Pickup time: <strong>${slotLabel(State.pickupTime)}</strong>
       </div>`
    : '';

  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0">
          <div class="page-title">Your Cart</div>
          <div class="page-subtitle">${State.cartCount()} item${State.cartCount()!==1?'s':''}</div>
        </div>
      </div>
      <div class="container">
        <div class="section" style="max-width:680px;margin:0 auto">
          ${pickupNotice}
          ${State.cart.map(item => `
            <div class="cart-item">
              <img class="cart-item-img" src="${item.image}" alt="${item.name}">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-unit">${formatPrice(item.price)} each</div>
              </div>
              <div class="cart-item-controls">
                <button class="cqty-btn" onclick="updateCartQty(${item.id},-1)">${svgIcon('minus',12)}</button>
                <span class="cqty-num">${item.qty}</span>
                <button class="cqty-btn" onclick="updateCartQty(${item.id},1)">${svgIcon('plus',12)}</button>
                <button class="cqty-btn" style="margin-left:4px" onclick="removeCartItem(${item.id})">${svgIcon('trash',12,'var(--warm-red)')}</button>
              </div>
              <div class="cart-item-total">${formatPrice(item.price*item.qty)}</div>
            </div>`).join('')}

          <div class="cart-summary">
            <div class="summary-row"><span>Subtotal</span><span>${formatPrice(sub)}</span></div>
            <div class="summary-row"><span>Tax (8%)</span><span>${formatPrice(tax)}</span></div>
            <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          </div>
          <button class="btn btn-primary btn-lg btn-full" style="margin-top:20px"
            onclick="${State.user ? "navigate('schedule')" : "navigate('auth')"}">
            ${State.pickupTime ? 'Change Pickup Time →' : 'Choose Pickup Time →'}
          </button>
          <button class="btn btn-secondary btn-full" style="margin-top:8px" onclick="navigate('menu')">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>`;
}

function updateCartQty(id, delta) {
  const item = State.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) State.cart = State.cart.filter(i => i.id !== id);
  updateCartBadge();
  revalidatePickupTime();
  navigate('cart');
}

function removeCartItem(id) {
  State.cart = State.cart.filter(i => i.id !== id);
  updateCartBadge();
  revalidatePickupTime();
  navigate('cart');
}

/* ══ SCHEDULE ═══════════════════════════════════════════════════════════════ */

function renderSchedule() {
  const slots = getAvailableSlots(State.maxPrepTime());
  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0">
          <div class="page-title">Choose Pickup Time</div>
          <div class="page-subtitle">Bakery open 8:00 AM – 8:00 PM · Slots every 10 minutes</div>
        </div>
      </div>
      <div class="container">
        <div class="section" style="max-width:700px;margin:0 auto;padding-bottom:120px">
          ${renderSteps(2)}
          <div class="prep-info-box">
            ${svgIcon('clock',16,'var(--brown-light)')}
            <div>
              <strong>Prep time required: ${State.maxPrepTime()} min</strong><br>
              <span style="color:var(--text3)">Greyed slots are too early. <strong>Full</strong> slots have reached the ${SLOT_CAPACITY}-item limit.</span>
            </div>
          </div>
          <div class="slots-grid">
            ${slots.map(slot => {
              let cls = 'slot';
              if (slot.full)            cls += ' slot-full';
              else if (slot.tooEarly)   cls += ' slot-early';
              if (State.selectedSlot === slot.key) cls += ' slot-selected';
              const dis = (slot.full || slot.tooEarly) ? 'disabled' : '';
              const tag = slot.full     ? `<div class="slot-tag">Full</div>`
                        : slot.tooEarly ? `<div class="slot-tag" style="color:var(--text3)">Early</div>`
                        : '';
              return `<button class="${cls}" ${dis} onclick="selectSlot('${slot.key}')">
                <div class="slot-time">${slot.label}</div>
                <div class="slot-cap">${slot.used}/${SLOT_CAPACITY}</div>
                ${tag}
              </button>`;
            }).join('')}
          </div>
          <button id="confirm-slot-btn" class="btn btn-primary btn-lg btn-full" style="margin-top:28px"
            ${State.selectedSlot ? '' : 'disabled'} onclick="confirmSlot()">
            Confirm${State.selectedSlot ? ': ' + slotLabel(State.selectedSlot) : ' a time slot'} →
          </button>
        </div>
      </div>
    </div>`;
}

function selectSlot(key) {
  State.selectedSlot = State.selectedSlot === key ? null : key;
  navigate('schedule');
}

function confirmSlot() {
  if (!State.selectedSlot) return;
  // Validate one more time before confirming (time may have passed)
  const check = isPickupTimeValid(State.selectedSlot, State.maxPrepTime());
  if (!check.ok) {
    showToast(check.reason, 'warning');
    State.selectedSlot = null;
    navigate('schedule');
    return;
  }
  State.pickupTime = State.selectedSlot;
  navigate('checkout');
}

/* ══ CHECKOUT ═══════════════════════════════════════════════════════════════ */

function renderCheckout() {
  const sub = State.cartSubtotal(), tax = State.cartTax(), total = State.cartTotal();
  const hasPickup = !!State.pickupTime;

  const payOptions = [
    { id:'card',   label:'Credit / Debit Card', emoji:'💳' },
    { id:'apple',  label:'Apple Pay',            emoji:'🍎' },
    { id:'google', label:'Google Pay',           emoji:'🔵' }
  ];

  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0"><div class="page-title">Checkout</div></div>
      </div>
      <div class="container">
        <div class="section">
          ${renderSteps(3)}
          <div class="checkout-grid">
            <div>
              <h3 style="font-size:20px;margin-bottom:20px">Payment</h3>
              ${payOptions.map(p => `
                <div class="payment-option${State.selectedPayment===p.id?' selected':''}" onclick="selectPayment('${p.id}')">
                  <div class="pay-radio"><div class="pay-radio-dot"></div></div>
                  <span style="font-size:18px">${p.emoji}</span>
                  <span style="font-weight:500;font-size:15px">${p.label}</span>
                </div>`).join('')}
              <div id="card-fields" class="card-fields" style="display:${State.selectedPayment==='card'?'grid':'none'}">
                <div class="form-group">
                  <label class="form-label">Card Number</label>
                  <input class="form-input" type="text" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="card-row">
                  <div class="form-group">
                    <label class="form-label">Expiry</label>
                    <input class="form-input" type="text" placeholder="MM / YY" maxlength="7">
                  </div>
                  <div class="form-group">
                    <label class="form-label">CVV</label>
                    <input class="form-input" type="password" placeholder="•••" maxlength="4">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Name on Card</label>
                  <input class="form-input" type="text" placeholder="Full name">
                </div>
              </div>
            </div>

            <div class="summary-box">
              <h3 style="font-size:20px;margin-bottom:18px">Order Summary</h3>
              ${State.cart.map(i => `
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px">
                  <span>${i.name} ×${i.qty}</span>
                  <span style="font-weight:600">${formatPrice(i.price*i.qty)}</span>
                </div>`).join('')}
              <hr class="divider">
              <div class="summary-row"><span>Subtotal</span><span>${formatPrice(sub)}</span></div>
              <div class="summary-row"><span>Tax (8%)</span><span>${formatPrice(tax)}</span></div>
              <div class="summary-row total"><span>Total</span><span style="color:var(--brown2)">${formatPrice(total)}</span></div>
              <hr class="divider">

              <!-- Pickup time chip -->
              <div style="display:flex;align-items:center;gap:10px;background:${hasPickup?'var(--white)':'#FEF9F0'};border:1.5px solid ${hasPickup?'var(--beige)':'#F59E0B'};border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:14px">
                ${svgIcon('clock',16, hasPickup ? 'var(--brown-light)' : '#F59E0B')}
                <div>
                  <div style="font-size:12px;color:var(--text3)">Pickup Time</div>
                  <div style="font-weight:700;font-size:15px;color:${hasPickup?'var(--text)':'#92400E'}">
                    ${hasPickup ? slotLabel(State.pickupTime) : 'Not selected'}
                  </div>
                </div>
                ${!hasPickup ? `<button onclick="navigate('schedule')" style="margin-left:auto;background:var(--brown2);color:white;border:none;border-radius:var(--radius-pill);padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">Select</button>` : ''}
              </div>

              ${!hasPickup ? `<div class="no-pickup-warning">${svgIcon('warn',14,'#92400E')} Please select a pickup time to continue.</div>` : ''}

              <button class="btn btn-primary btn-full" onclick="placeOrder()" ${!hasPickup ? 'disabled' : ''}>
                ${svgIcon('check',16)} Place Order
              </button>
              ${hasPickup ? '' : `<p style="font-size:12px;color:var(--text3);text-align:center;margin-top:8px">Go to Schedule to choose a time</p>`}
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function selectPayment(id) {
  State.selectedPayment = id;
  document.querySelectorAll('.payment-option').forEach(el => {
    el.classList.toggle('selected', el.getAttribute('onclick').includes(`'${id}'`));
  });
  const cf = document.getElementById('card-fields');
  if (cf) cf.style.display = id === 'card' ? 'grid' : 'none';
}

/* ══ PLACE ORDER — VALIDATION + ANIMATION ═══════════════════════════════════ */

function placeOrder() {
  // Guard: must have pickup time
  if (!State.pickupTime) {
    showToast('Please select a pickup time before placing your order.', 'warning');
    return;
  }

  // Re-validate pickup time right before placing
  const check = isPickupTimeValid(State.pickupTime, State.maxPrepTime());
  if (!check.ok) {
    showToast(check.reason, 'warning');
    State.pickupTime   = null;
    State.selectedSlot = null;
    navigate('schedule');
    return;
  }

  // 1. Commit state
  const orderId    = genOrderId();
  const totalItems = State.cart.reduce((s,i) => s + i.qty, 0);

  State.confirmedOrder = {
    id:         orderId,
    items:      [...State.cart],
    total:      State.cartTotal(),
    pickupTime: State.pickupTime,
    status:     'Preparing'
  };

  // 2. Update slot usage (real confirmed orders only)
  incrementSlotUsage(State.pickupTime, totalItems);

  // 3. Add to admin orders and persist
  const adminEntry = {
    id:       orderId,
    items:    State.cart.map(i => ({ name: i.name, qty: i.qty })),
    slot:     State.pickupTime,
    customer: State.user ? State.user.name : 'Guest',
    status:   'Preparing'
  };
  State.adminOrders.unshift(adminEntry);
  saveOrdersToStorage();

  // 4. Clear cart
  State.cart         = [];
  State.selectedSlot = null;
  State.pickupTime   = null;
  updateCartBadge();

  // 5. Build ticket HTML
  const itemsHTML = State.confirmedOrder.items.map(i =>
    `<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:8px;align-items:center">
       <span style="color:#6B5744">${i.name} ×${i.qty}</span>
       <span style="font-weight:600;color:#2C1F0E">${formatPrice(i.price * i.qty)}</span>
     </div>`
  ).join('');
  const pickupTimeLabel = slotLabel(State.confirmedOrder.pickupTime);

  // 6. Inject overlay
  const overlay = document.createElement('div');
  overlay.id = 'confirm-overlay';
  overlay.style.cssText = [
    'position:fixed','inset:0','z-index:2000',
    'background:rgba(250,247,242,0.96)',
    'backdrop-filter:blur(8px)','-webkit-backdrop-filter:blur(8px)',
    'display:flex','align-items:center','justify-content:center',
    'flex-direction:column','padding:24px',
    'opacity:0','transition:opacity 0.3s ease'
  ].join(';');

  overlay.innerHTML = `
    <div id="check-wrap" style="margin-bottom:28px;display:flex;align-items:center;justify-content:center">
      <svg id="check-svg" width="100" height="100" viewBox="0 0 100 100">
        <circle id="check-circle" cx="50" cy="50" r="44"
          fill="none" stroke="#7FA86C" stroke-width="4"
          stroke-dasharray="276.46" stroke-dashoffset="276.46"
          stroke-linecap="round" transform="rotate(-90 50 50)"/>
        <path id="check-mark" d="M28 52 L44 68 L72 34"
          fill="none" stroke="#7FA86C" stroke-width="5"
          stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="60" stroke-dashoffset="60"/>
      </svg>
    </div>
    <div id="confirm-ticket" style="
      background:white;border-radius:20px;
      box-shadow:0 8px 40px rgba(44,31,14,0.14);
      padding:32px 28px;max-width:380px;width:100%;text-align:center;
      transform:translateY(40px);opacity:0;
      transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1),opacity 0.5s ease">
      <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9C8470;margin-bottom:6px">Order Confirmed</div>
      <div style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#6B4C30;margin-bottom:20px">${orderId}</div>
      <div style="text-align:left;margin-bottom:16px">${itemsHTML}</div>
      <hr style="border:none;border-top:1px solid #EDE5D8;margin:14px 0">
      <div id="pickup-time-highlight" style="
        background:#F5F0E8;border-radius:12px;padding:14px 18px;
        display:flex;align-items:center;gap:10px;justify-content:center;
        transform:scale(0.9);
        transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.4s ease,background 0.4s ease">
        <span style="font-size:20px">🕐</span>
        <div style="text-align:left">
          <div style="font-size:11px;color:#9C8470;margin-bottom:2px">Pickup Time</div>
          <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:18px;color:#6B4C30">${pickupTimeLabel}</div>
        </div>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  // Animation sequence
  requestAnimationFrame(() => requestAnimationFrame(() => { overlay.style.opacity = '1'; }));

  setTimeout(() => {
    const c = document.getElementById('check-circle');
    if (c) { c.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.65,0,0.35,1)'; c.style.strokeDashoffset = '0'; }
  }, 50);

  setTimeout(() => {
    const m = document.getElementById('check-mark');
    if (m) { m.style.transition = 'stroke-dashoffset 0.45s cubic-bezier(0.65,0,0.35,1)'; m.style.strokeDashoffset = '0'; }
  }, 500);

  setTimeout(() => {
    const w = document.getElementById('check-wrap');
    if (w) { w.style.transition = 'transform 0.18s ease'; w.style.transform = 'scale(1.08)'; setTimeout(() => { w.style.transform = 'scale(1)'; }, 180); }
  }, 900);

  setTimeout(() => {
    const ticket = document.getElementById('confirm-ticket');
    if (ticket) { ticket.getBoundingClientRect(); ticket.style.transform = 'translateY(0)'; ticket.style.opacity = '1'; }
  }, 1000);

  setTimeout(() => {
    const pth = document.getElementById('pickup-time-highlight');
    if (pth) {
      pth.style.transform  = 'scale(1.06)';
      pth.style.boxShadow  = '0 0 0 3px rgba(107,76,48,0.25), 0 4px 16px rgba(107,76,48,0.14)';
      pth.style.background = '#EDE5D8';
      setTimeout(() => {
        pth.style.transform  = 'scale(1)';
        pth.style.boxShadow  = 'none';
        pth.style.background = '#F5F0E8';
      }, 420);
    }
  }, 1550);

  setTimeout(() => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.cssText = 'margin-top:22px;opacity:0;transition:opacity 0.35s ease';
    btn.textContent = 'View My Order';
    overlay.appendChild(btn);
    requestAnimationFrame(() => requestAnimationFrame(() => { btn.style.opacity = '1'; }));
    btn.addEventListener('click', dismissOverlay);
  }, 2100);

  const autoTimer = setTimeout(dismissOverlay, 5500);

  function dismissOverlay() {
    clearTimeout(autoTimer);
    const ov = document.getElementById('confirm-overlay');
    if (!ov) return;
    ov.style.opacity = '0';
    setTimeout(() => { ov.remove(); navigate('confirmation'); }, 320);
  }
}

/* ══ CONFIRMATION PAGE ══════════════════════════════════════════════════════ */

function renderConfirmation() {
  const o = State.confirmedOrder;
  if (!o) { navigate('home'); return ''; }
  return `
    <div class="page fade-in">
      <div class="confirm-wrap">
        <div class="confirm-card">
          <div class="confirm-icon">${svgIcon('check',34,'white')}</div>
          <h1 class="confirm-title">Order Confirmed!</h1>
          <p class="confirm-sub">Your order will be ready at the selected pickup time. See you soon!</p>
          <div class="order-id-badge">${o.id}</div>
          <div class="confirm-meta">
            <div class="confirm-meta-item">
              <div class="confirm-meta-label">Pickup Time</div>
              <div class="confirm-meta-value">${o.pickupTime ? slotLabel(o.pickupTime) : '—'}</div>
            </div>
            <div class="confirm-meta-item">
              <div class="confirm-meta-label">Status</div>
              ${renderBadge(o.status)}
            </div>
            <div class="confirm-meta-item">
              <div class="confirm-meta-label">Total</div>
              <div class="confirm-meta-value">${formatPrice(o.total)}</div>
            </div>
          </div>
          <div class="confirm-note">🧁 We're already preparing your order. It'll be fresh and waiting for you at the counter!</div>
          <div class="confirm-actions">
            <button class="btn btn-secondary" style="flex:1" onclick="navigate('orders')">View Orders</button>
            <button class="btn btn-primary"   style="flex:1" onclick="navigate('home')">Back Home</button>
          </div>
        </div>
      </div>
    </div>`;
}

/* ══ ORDERS ═════════════════════════════════════════════════════════════════ */

function renderOrders() {
  if (!State.user) return `
    <div class="page fade-in"><div class="container">
      <div class="empty-state">
        <div class="empty-icon">🔐</div>
        <div class="empty-title">Sign In Required</div>
        <div class="empty-sub">Please log in to view your orders.</div>
        <button class="btn btn-primary" onclick="navigate('auth')">Login</button>
      </div>
    </div></div>`;

  // Build display orders: confirmed + mock history
  let all = [...MOCK_ORDERS];
  if (State.confirmedOrder) {
    all = [{
      id:         State.confirmedOrder.id,
      items:      State.confirmedOrder.items,
      total:      State.confirmedOrder.total,
      pickupTime: State.confirmedOrder.pickupTime ? slotLabel(State.confirmedOrder.pickupTime) : '—',
      date:       'Today',
      status:     State.confirmedOrder.status
    }, ...all];
  }

  const upcoming = all.filter(o => o.status !== 'Completed');
  const past     = all.filter(o => o.status === 'Completed');

  const sec = (title, orders) => `
    <div style="margin-bottom:40px">
      <div class="orders-section-title">${title}</div>
      ${orders.length
        ? orders.map(o => `
            <div class="order-card">
              <div class="order-header"><span class="order-id">${o.id}</span>${renderBadge(o.status)}</div>
              <div class="order-meta">
                <span>${svgIcon('clock',12)} ${o.pickupTime}</span>
                <span>📅 ${o.date}</span>
                <span>💰 ${formatPrice(o.total)}</span>
              </div>
              <div class="order-items-text">${o.items.map(i=>`${i.name} ×${i.qty}`).join(' · ')}</div>
            </div>`).join('')
        : `<p style="color:var(--text3);font-size:14px">No ${title.toLowerCase()} yet.</p>`}
    </div>`;

  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0"><div class="page-title">My Orders</div></div>
      </div>
      <div class="container">
        <div class="section" style="max-width:680px;margin:0 auto">
          ${sec('Upcoming Orders', upcoming)}
          ${sec('Past Orders', past)}
        </div>
      </div>
    </div>`;
}

/* ══ AUTH ═══════════════════════════════════════════════════════════════════ */

function renderAuth() {
  const isLogin = State.authMode === 'login';
  return `
    <div class="page fade-in">
      <div class="auth-wrap">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="auth-logo-name">${svgIcon('leaf',24,'var(--brown2)')} Cupcake</div>
            <div class="auth-logo-sub">Pre-order bakery items for pickup</div>
          </div>
          <div class="tab-toggle">
            <button class="tab-toggle-btn${isLogin?' active':''}" onclick="State.authMode='login';navigate('auth')">Sign In</button>
            <button class="tab-toggle-btn${!isLogin?' active':''}" onclick="State.authMode='signup';navigate('auth')">Sign Up</button>
          </div>
          ${!isLogin ? `
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input class="form-input" id="auth-name" type="text" placeholder="Jane Smith">
            </div>` : ''}
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" id="auth-email" type="email" placeholder="hello@example.com">
          </div>
          <div class="form-group" style="margin-bottom:24px">
            <label class="form-label">Password</label>
            <input class="form-input" id="auth-pass" type="password" placeholder="••••••••">
          </div>
          <button class="btn btn-primary btn-full" onclick="submitAuth()">
            ${isLogin ? 'Sign In' : 'Create Account'}
          </button>
          <p style="text-align:center;font-size:12px;color:var(--text3);margin-top:14px">
            ${isLogin ? 'Demo: any email. Use <strong>admin@…</strong> for staff dashboard.' : 'By signing up you agree to our terms.'}
          </p>
        </div>
      </div>
    </div>`;
}

function submitAuth() {
  const email = document.getElementById('auth-email')?.value.trim();
  const pass  = document.getElementById('auth-pass')?.value;
  const name  = document.getElementById('auth-name')?.value.trim();
  if (!email || !pass) { showToast('Please fill in all fields'); return; }
  State.user = { name: name || email.split('@')[0], email, isAdmin: email.toLowerCase().startsWith('admin') };
  showToast(`Welcome, ${State.user.name}!`, 'success');
  navigate('home');
}

/* ══ ADMIN ══════════════════════════════════════════════════════════════════ */

function renderAdmin() {
  if (!State.user?.isAdmin) return `
    <div class="page fade-in"><div class="container">
      <div class="empty-state">
        <div class="empty-icon">🔒</div>
        <div class="empty-title">Admin Access Required</div>
        <div class="empty-sub">Log in with an admin account (any email starting with <strong>admin@</strong>).</div>
        <button class="btn btn-primary" onclick="navigate('auth')">Login</button>
      </div>
    </div></div>`;

  const orders = State.adminOrders;

  if (!orders.length) return `
    <div class="page fade-in">
      <div class="admin-header">
        <div class="admin-header-title">🧁 Staff Dashboard</div>
        <div class="admin-header-sub">Cupcake — Live Orders</div>
      </div>
      <div class="container">
        <div class="empty-state">
          <div class="empty-icon">📋</div>
          <div class="empty-title">No orders yet</div>
          <div class="empty-sub">Orders will appear here once customers place them.</div>
        </div>
      </div>
    </div>`;

  const stats = [
    { label:'Active Orders',    value: orders.filter(o=>o.status!=='Completed').length },
    { label:'Ready for Pickup', value: orders.filter(o=>o.status==='Ready').length },
    { label:'Completed Today',  value: orders.filter(o=>o.status==='Completed').length },
    { label:'Items in Prep',    value: orders.filter(o=>o.status==='Preparing').reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0) }
  ];

  const grouped = {};
  orders.forEach(o => { (grouped[o.slot] = grouped[o.slot] || []).push(o); });

  return `
    <div class="page fade-in">
      <div class="admin-header">
        <div class="admin-header-title">🧁 Staff Dashboard</div>
        <div class="admin-header-sub">Cupcake — Live Orders</div>
      </div>
      <div class="container">
        <div class="section">
          <div class="admin-stats">
            ${stats.map(s=>`<div class="stat-card"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join('')}
          </div>
          <h3 style="font-size:22px;margin-bottom:24px">Orders by Pickup Slot</h3>
          ${Object.entries(grouped).sort().map(([slot,slotOrders]) => {
            const used = slotOrders.reduce((s,o)=>s+o.items.reduce((a,i)=>a+i.qty,0),0);
            const cap  = State.slotUsage[slot] || used;
            const pct  = Math.min(100, Math.round((cap / SLOT_CAPACITY) * 100));
            return `
              <div class="slot-group">
                <div class="slot-group-header">
                  <span>${slotLabel(slot)} — ${slotOrders.length} order${slotOrders.length!==1?'s':''}</span>
                  <div class="cap-bar-wrap">
                    <span class="cap-label">${cap}/${SLOT_CAPACITY}</span>
                    <div class="cap-bar"><div class="cap-fill${pct>=80?' high':''}" style="width:${pct}%"></div></div>
                  </div>
                </div>
                ${slotOrders.map(o=>`
                  <div class="admin-order-card" id="ao-${o.id}">
                    <div class="admin-order-top">
                      <div>
                        <span class="admin-order-id">${o.id}</span>
                        <span class="admin-order-customer">${o.customer}</span>
                      </div>
                      <select class="status-select" onchange="updateAdminStatus('${o.id}',this.value)">
                        <option${o.status==='Preparing'?' selected':''}>Preparing</option>
                        <option${o.status==='Ready'?' selected':''}>Ready</option>
                        <option${o.status==='Completed'?' selected':''}>Completed</option>
                      </select>
                    </div>
                    <div class="admin-order-items-text">${o.items.map(i=>`${i.name} ×${i.qty}`).join(' · ')}</div>
                    <div style="margin-top:10px" id="ao-badge-${o.id}">${renderBadge(o.status)}</div>
                  </div>`).join('')}
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

function updateAdminStatus(id, status) {
  const o = State.adminOrders.find(o => o.id === id);
  if (o) {
    o.status = status;
    saveOrdersToStorage();
    const badge = document.getElementById(`ao-badge-${id}`);
    if (badge) badge.innerHTML = renderBadge(status);
    showToast(`${id} marked as ${status}`, 'success');
  }
}
