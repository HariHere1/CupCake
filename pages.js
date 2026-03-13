// ── SHARED COMPONENTS ────────────────────────────────────────────────────────

function renderFoodCard(item) {
  return `
    <div class="food-card" data-id="${item.id}">
      <div class="food-card-img-wrap">
        <img class="food-card-img" src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="food-card-body">
        <div class="food-card-cat">${item.category}</div>
        <div class="food-card-name">${item.name}</div>
        <div class="food-card-prep">${svgIcon('clock', 12, 'var(--text3)')} ${item.prepTime} min prep</div>
        <div class="food-card-footer">
          <span class="food-card-price">${formatPrice(item.price)}</span>
          <button class="food-card-add" data-add-id="${item.id}" aria-label="Add ${item.name} to cart">
            ${svgIcon('plus', 14)}
          </button>
        </div>
      </div>
    </div>`;
}

function renderBadge(status) {
  const map = { 'Preparing': 'preparing', 'Ready': 'ready', 'Completed': 'completed' };
  return `<span class="badge badge-${map[status] || 'preparing'}">${status}</span>`;
}

function renderSteps(active) {
  // active: 1=cart, 2=schedule, 3=checkout
  const steps = ['Cart', 'Schedule', 'Checkout'];
  return `<div class="steps">
    ${steps.map((label, i) => {
      const n = i + 1;
      const cls = n < active ? 'done' : n === active ? 'active' : 'inactive';
      const num = n < active ? svgIcon('check', 12) : n;
      return `
        ${i > 0 ? '<div class="step-line"></div>' : ''}
        <div class="step ${cls}">
          <span class="step-num">${num}</span>
          <span class="step-label">${label}</span>
        </div>`;
    }).join('')}
  </div>`;
}

// ── HOME PAGE ────────────────────────────────────────────────────────────────
function renderHome() {
  const featured = MENU_ITEMS.filter(i => FEATURED_IDS.includes(i.id));
  return `
    <div class="page fade-in">
      <div class="hero">
        <div class="hero-content">
          <div class="hero-tag">${svgIcon('leaf', 14)} Fresh baked daily</div>
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
          <div class="food-grid">
            ${featured.map(renderFoodCard).join('')}
          </div>
        </div>

        <div class="section" style="border-top:1px solid var(--beige)">
          <h2 class="section-title" style="text-align:center;margin-bottom:32px">How It Works</h2>
          <div class="how-grid">
            <div class="how-card"><div class="how-num">01</div><h3 class="how-title">Browse & Order</h3><p class="how-desc">Choose from our freshly baked selection, available daily.</p></div>
            <div class="how-card"><div class="how-num">02</div><h3 class="how-title">Pick a Time</h3><p class="how-desc">Select a convenient 10-minute pickup slot that suits you.</p></div>
            <div class="how-card"><div class="how-num">03</div><h3 class="how-title">We Prepare</h3><p class="how-desc">We'll have everything perfectly fresh and ready for you.</p></div>
            <div class="how-card"><div class="how-num">04</div><h3 class="how-title">Just Pick Up</h3><p class="how-desc">Skip the queue entirely — grab your order and go.</p></div>
          </div>
        </div>
      </div>
    </div>`;
}

// ── MENU PAGE ────────────────────────────────────────────────────────────────
function renderMenu() {
  const filtered = MENU_ITEMS.filter(item => {
    const catMatch = State.activeCategory === 'All' || item.category === State.activeCategory;
    const searchMatch = item.name.toLowerCase().includes(State.searchQuery.toLowerCase());
    return catMatch && searchMatch;
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
          <input class="search-input" type="search" placeholder="Search items…" value="${State.searchQuery}"
            oninput="State.searchQuery=this.value; renderMenuItems();" id="menu-search">
          <div class="cat-tabs" id="cat-tabs">
            ${CATEGORIES.map(c => `
              <button class="cat-tab${State.activeCategory === c ? ' active' : ''}"
                onclick="State.activeCategory='${c}'; State.searchQuery=''; document.getElementById('menu-search').value=''; renderMenuItems();">
                ${c}
              </button>`).join('')}
          </div>
          <div id="menu-grid">
            ${filtered.length
              ? `<div class="food-grid">${filtered.map(renderFoodCard).join('')}</div>`
              : `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No items found</div><div class="empty-sub">Try a different search or category</div></div>`
            }
          </div>
        </div>
      </div>
    </div>`;
}

function renderMenuItems() {
  const filtered = MENU_ITEMS.filter(item => {
    const catMatch = State.activeCategory === 'All' || item.category === State.activeCategory;
    const searchMatch = item.name.toLowerCase().includes(State.searchQuery.toLowerCase());
    return catMatch && searchMatch;
  });

  const grid = document.getElementById('menu-grid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? `<div class="food-grid">${filtered.map(renderFoodCard).join('')}</div>`
      : `<div class="empty-state"><div class="empty-icon">🔍</div><div class="empty-title">No items found</div><div class="empty-sub">Try a different search or category</div></div>`;
    attachCardEvents(grid);
  }

  document.querySelectorAll('.cat-tab').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === State.activeCategory);
  });
}

// ── ITEM DETAIL PAGE ─────────────────────────────────────────────────────────
function renderItem() {
  const item = State.selectedItem;
  if (!item) { navigate('menu'); return ''; }
  const qty = State.itemQty;

  return `
    <div class="page fade-in">
      <div class="container">
        <button class="back-btn" onclick="navigate('menu')">${svgIcon('arrowLeft', 16)} Back to Menu</button>
        <div class="item-detail-grid">
          <img class="item-detail-img" src="${item.image}" alt="${item.name}">
          <div>
            <div class="item-detail-cat">${item.category}</div>
            <h1 class="item-detail-title">${item.name}</h1>
            <div class="item-detail-price">${formatPrice(item.price)}</div>
            <div class="item-detail-prep-chip">${svgIcon('clock', 14)} Prep time: ${item.prepTime} minutes</div>
            <p class="item-detail-desc">${item.description}</p>
            <div class="ingredients-label">Ingredients</div>
            <div class="ingredients-list">
              ${item.ingredients.map(ing => `<span class="ingredient-tag">${ing}</span>`).join('')}
            </div>
            <div class="qty-control">
              <button class="qty-btn" id="qty-minus" onclick="changeItemQty(-1)">${svgIcon('minus', 14)}</button>
              <span class="qty-display" id="qty-display">${qty}</span>
              <button class="qty-btn" id="qty-plus" onclick="changeItemQty(1)">${svgIcon('plus', 14)}</button>
            </div>
            <button class="btn btn-primary btn-lg btn-full" onclick="addItemToCart()">
              ${svgIcon('cart', 16)} Add to Cart · <span id="add-btn-price">${formatPrice(item.price * qty)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function changeItemQty(delta) {
  State.itemQty = Math.max(1, State.itemQty + delta);
  const display = document.getElementById('qty-display');
  const price   = document.getElementById('add-btn-price');
  if (display) display.textContent = State.itemQty;
  if (price && State.selectedItem) price.textContent = formatPrice(State.selectedItem.price * State.itemQty);
}

function addItemToCart() {
  if (!State.selectedItem) return;
  for (let i = 0; i < State.itemQty; i++) addToCart(State.selectedItem);
  State.itemQty = 1;
  navigate('cart');
}

// ── CART PAGE ────────────────────────────────────────────────────────────────
function renderCart() {
  if (!State.cart.length) {
    return `
      <div class="page fade-in">
        <div class="container">
          <div class="empty-state">
            <div class="empty-icon">🧺</div>
            <div class="empty-title">Your cart is empty</div>
            <div class="empty-sub">Add some delicious items from our menu to get started.</div>
            <button class="btn btn-primary" onclick="navigate('menu')">Browse Menu</button>
          </div>
        </div>
      </div>`;
  }

  const sub = State.cartSubtotal();
  const tax = State.cartTax();
  const total = State.cartTotal();

  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0">
          <div class="page-title">Your Cart</div>
          <div class="page-subtitle">${State.cartCount()} item${State.cartCount() !== 1 ? 's' : ''}</div>
        </div>
      </div>
      <div class="container">
        <div class="section" style="max-width:680px;margin:0 auto">
          <div id="cart-items">
            ${State.cart.map(item => `
              <div class="cart-item" data-id="${item.id}">
                <img class="cart-item-img" src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.name}</div>
                  <div class="cart-item-unit">${formatPrice(item.price)} each</div>
                </div>
                <div class="cart-item-controls">
                  <button class="cqty-btn" onclick="updateCartQty(${item.id}, -1)">${svgIcon('minus', 12)}</button>
                  <span class="cqty-num">${item.qty}</span>
                  <button class="cqty-btn" onclick="updateCartQty(${item.id}, 1)">${svgIcon('plus', 12)}</button>
                  <button class="cqty-btn" style="margin-left:4px" onclick="removeCartItem(${item.id})">${svgIcon('trash', 12, 'var(--warm-red)')}</button>
                </div>
                <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
              </div>`).join('')}
          </div>

          <div class="cart-summary">
            <div class="summary-row"><span>Subtotal</span><span>${formatPrice(sub)}</span></div>
            <div class="summary-row"><span>Tax (8%)</span><span>${formatPrice(tax)}</span></div>
            <div class="summary-row total"><span>Total</span><span>${formatPrice(total)}</span></div>
          </div>

          <button class="btn btn-primary btn-lg btn-full" style="margin-top:20px"
            onclick="${State.user ? "navigate('schedule')" : "navigate('auth')"}">
            Choose Pickup Time →
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
  navigate('cart');
}

function removeCartItem(id) {
  State.cart = State.cart.filter(i => i.id !== id);
  updateCartBadge();
  navigate('cart');
}

// ── SCHEDULE PAGE ────────────────────────────────────────────────────────────
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
        <div class="section" style="max-width:700px;margin:0 auto">
          <div class="prep-info-box">
            ${svgIcon('clock', 16, 'var(--brown-light)')}
            <div>
              <strong>Earliest available slot based on your order:</strong> ${State.maxPrepTime()} min prep time required.<br>
              <span style="color:var(--text3)">Greyed slots are too early. Slots marked <strong>Full</strong> have reached the 10-item capacity.</span>
            </div>
          </div>

          <div class="slots-grid" id="slots-grid">
            ${slots.map(slot => {
              let cls = 'slot';
              if (slot.full) cls += ' slot-full';
              else if (slot.tooEarly) cls += ' slot-early';
              if (State.selectedSlot === slot.key) cls += ' slot-selected';
              const disabled = slot.full || slot.tooEarly ? 'disabled' : '';
              const tag = slot.full ? '<div class="slot-tag">Full</div>'
                        : slot.tooEarly ? '<div class="slot-tag" style="color:var(--text3)">Too early</div>'
                        : '';
              return `
                <button class="${cls}" ${disabled}
                  onclick="selectSlot('${slot.key}')">
                  <div class="slot-time">${slot.label}</div>
                  <div class="slot-cap">${slot.used}/${SLOT_CAPACITY}</div>
                  ${tag}
                </button>`;
            }).join('')}
          </div>

          <button class="btn btn-primary btn-lg btn-full" style="margin-top:32px"
            id="confirm-slot-btn"
            ${State.selectedSlot ? '' : 'disabled'}
            onclick="confirmSlot()">
            Confirm Time: ${State.selectedSlot ? slotLabel(State.selectedSlot) : '—'} →
          </button>
        </div>
      </div>
    </div>`;
}

function selectSlot(key) {
  State.selectedSlot = State.selectedSlot === key ? null : key;
  // Re-render just the slots + button without full page reload
  const grid = document.getElementById('slots-grid');
  const btn  = document.getElementById('confirm-slot-btn');
  if (grid) {
    grid.querySelectorAll('.slot').forEach(el => {
      el.classList.toggle('slot-selected', el.onclick && el.getAttribute('onclick').includes(`'${key}'`));
    });
    // Re-render slots cleanly
    navigate('schedule');
  }
}

function confirmSlot() {
  if (!State.selectedSlot) return;
  State.pickupTime = State.selectedSlot;
  navigate('checkout');
}

// ── CHECKOUT PAGE ────────────────────────────────────────────────────────────
function renderCheckout() {
  const sub   = State.cartSubtotal();
  const tax   = State.cartTax();
  const total = State.cartTotal();

  const payOptions = [
    { id: 'card',   label: 'Credit / Debit Card', emoji: '💳' },
    { id: 'apple',  label: 'Apple Pay',            emoji: '🍎' },
    { id: 'google', label: 'Google Pay',           emoji: '🔵' }
  ];

  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0">
          <div class="page-title">Checkout</div>
        </div>
      </div>
      <div class="container">
        <div class="section">
          ${renderSteps(3)}
          <div class="checkout-grid">

            <!-- LEFT: Payment -->
            <div>
              <h3 style="font-size:20px;margin-bottom:20px">Payment</h3>
              ${payOptions.map(p => `
                <div class="payment-option${State.selectedPayment === p.id ? ' selected' : ''}"
                  onclick="selectPayment('${p.id}')">
                  <div class="pay-radio"><div class="pay-radio-dot"></div></div>
                  <span style="font-size:18px">${p.emoji}</span>
                  <span style="font-weight:500;font-size:15px">${p.label}</span>
                </div>`).join('')}

              <div id="card-fields" style="display:${State.selectedPayment === 'card' ? 'grid' : 'none'}" class="card-fields">
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

            <!-- RIGHT: Summary -->
            <div class="summary-box">
              <h3 style="font-size:20px;margin-bottom:18px">Order Summary</h3>
              ${State.cart.map(i => `
                <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:14px">
                  <span>${i.name} ×${i.qty}</span>
                  <span style="font-weight:600">${formatPrice(i.price * i.qty)}</span>
                </div>`).join('')}
              <hr class="divider">
              <div class="summary-row"><span>Subtotal</span><span>${formatPrice(sub)}</span></div>
              <div class="summary-row"><span>Tax (8%)</span><span>${formatPrice(tax)}</span></div>
              <div class="summary-row total"><span>Total</span><span style="color:var(--brown2)">${formatPrice(total)}</span></div>
              <hr class="divider">
              <div style="display:flex;align-items:center;gap:10px;background:var(--white);border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:18px">
                ${svgIcon('clock', 16, 'var(--brown-light)')}
                <div>
                  <div style="font-size:12px;color:var(--text3)">Pickup Time</div>
                  <div style="font-weight:700;font-size:15px">${State.pickupTime ? slotLabel(State.pickupTime) : '—'}</div>
                </div>
              </div>
              <button class="btn btn-primary btn-full" onclick="placeOrder()">
                ${svgIcon('check', 16)} Place Order
              </button>
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
  const fields = document.getElementById('card-fields');
  if (fields) fields.style.display = id === 'card' ? 'grid' : 'none';
}

function placeOrder() {
  const orderId = genOrderId();
  State.confirmedOrder = {
    id: orderId,
    items: [...State.cart],
    total: State.cartTotal(),
    pickupTime: State.pickupTime,
    status: 'Preparing'
  };
  State.cart = [];
  State.selectedSlot = null;
  updateCartBadge();
  showToast('Order placed successfully!', 'success');
  navigate('confirmation');
}

// ── CONFIRMATION PAGE ────────────────────────────────────────────────────────
function renderConfirmation() {
  const o = State.confirmedOrder;
  if (!o) { navigate('home'); return ''; }
  return `
    <div class="page fade-in">
      <div class="confirm-wrap">
        <div class="confirm-card">
          <div class="confirm-icon">${svgIcon('check', 34, 'white')}</div>
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
          <div class="confirm-note">🧁 We're already preparing your order. It'll be ready and waiting for you at the counter!</div>
          <div class="confirm-actions">
            <button class="btn btn-secondary" style="flex:1" onclick="navigate('orders')">View Orders</button>
            <button class="btn btn-primary"   style="flex:1" onclick="navigate('home')">Back Home</button>
          </div>
        </div>
      </div>
    </div>`;
}

// ── ORDERS PAGE ──────────────────────────────────────────────────────────────
function renderOrders() {
  if (!State.user) {
    return `
      <div class="page fade-in">
        <div class="container">
          <div class="empty-state">
            <div class="empty-icon">🔐</div>
            <div class="empty-title">Sign In Required</div>
            <div class="empty-sub">Please log in to view your orders.</div>
            <button class="btn btn-primary" onclick="navigate('auth')">Login</button>
          </div>
        </div>
      </div>`;
  }

  let allOrders = [...MOCK_ORDERS];
  if (State.confirmedOrder) {
    allOrders = [{
      id: State.confirmedOrder.id,
      items: State.confirmedOrder.items,
      total: State.confirmedOrder.total,
      pickupTime: State.confirmedOrder.pickupTime ? slotLabel(State.confirmedOrder.pickupTime) : '—',
      date: 'Today',
      status: State.confirmedOrder.status
    }, ...allOrders];
  }

  const upcoming = allOrders.filter(o => o.status !== 'Completed');
  const past     = allOrders.filter(o => o.status === 'Completed');

  const renderSection = (title, orders) => `
    <div style="margin-bottom:40px">
      <div class="orders-section-title">${title}</div>
      ${orders.length ? orders.map(o => `
        <div class="order-card">
          <div class="order-header">
            <span class="order-id">${o.id}</span>
            ${renderBadge(o.status)}
          </div>
          <div class="order-meta">
            <span>${svgIcon('clock', 12)} ${o.pickupTime}</span>
            <span>📅 ${o.date}</span>
            <span>💰 ${formatPrice(o.total)}</span>
          </div>
          <div class="order-items-text">${o.items.map(i => `${i.name} ×${i.qty}`).join(' · ')}</div>
        </div>`).join('')
      : `<p style="color:var(--text3);font-size:14px">No ${title.toLowerCase()} yet.</p>`}
    </div>`;

  return `
    <div class="page fade-in">
      <div class="page-title-bar">
        <div class="container" style="padding:0">
          <div class="page-title">My Orders</div>
        </div>
      </div>
      <div class="container">
        <div class="section" style="max-width:680px;margin:0 auto">
          ${renderSection('Upcoming Orders', upcoming)}
          ${renderSection('Past Orders', past)}
        </div>
      </div>
    </div>`;
}

// ── AUTH PAGE ────────────────────────────────────────────────────────────────
function renderAuth() {
  const isLogin = State.authMode === 'login';
  return `
    <div class="page fade-in">
      <div class="auth-wrap">
        <div class="auth-card">
          <div class="auth-logo">
            <div class="auth-logo-name">${svgIcon('leaf', 24, 'var(--brown2)')} Flour & Bloom</div>
            <div class="auth-logo-sub">Pre-order bakery items for pickup</div>
          </div>

          <div class="tab-toggle">
            <button class="tab-toggle-btn${isLogin ? ' active' : ''}" onclick="State.authMode='login'; navigate('auth')">Sign In</button>
            <button class="tab-toggle-btn${!isLogin ? ' active' : ''}" onclick="State.authMode='signup'; navigate('auth')">Sign Up</button>
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
            ${isLogin ? 'Demo: any email works. Use <strong>admin@…</strong> for staff access.' : 'By signing up you agree to our terms of service.'}
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
  State.user = { name: name || email.split('@')[0], email, isAdmin: email.startsWith('admin') };
  showToast(`Welcome, ${State.user.name}!`, 'success');
  navigate('home');
}

// ── ADMIN PAGE ───────────────────────────────────────────────────────────────
function renderAdmin() {
  if (!State.user?.isAdmin) {
    return `
      <div class="page fade-in">
        <div class="container">
          <div class="empty-state">
            <div class="empty-icon">🔒</div>
            <div class="empty-title">Admin Access Required</div>
            <div class="empty-sub">Log in with an admin account (use any email starting with <strong>admin@</strong>).</div>
            <button class="btn btn-primary" onclick="navigate('auth')">Login</button>
          </div>
        </div>
      </div>`;
  }

  const orders = State.adminOrders;
  const stats = [
    { label: 'Active Orders',      value: orders.filter(o => o.status !== 'Completed').length },
    { label: 'Ready for Pickup',   value: orders.filter(o => o.status === 'Ready').length },
    { label: 'Completed Today',    value: orders.filter(o => o.status === 'Completed').length },
    { label: 'Items in Prep',      value: orders.filter(o => o.status === 'Preparing').reduce((s,o) => s + o.items.reduce((a,i) => a + i.qty, 0), 0) }
  ];

  const grouped = {};
  orders.forEach(o => { (grouped[o.slot] = grouped[o.slot] || []).push(o); });

  return `
    <div class="page fade-in">
      <div class="admin-header">
        <div class="admin-header-title">🧁 Staff Dashboard</div>
        <div class="admin-header-sub">Flour & Bloom — Live Orders</div>
      </div>
      <div class="container">
        <div class="section">
          <div class="admin-stats">
            ${stats.map(s => `
              <div class="stat-card">
                <div class="stat-value">${s.value}</div>
                <div class="stat-label">${s.label}</div>
              </div>`).join('')}
          </div>

          <h3 style="font-size:22px;margin-bottom:24px">Orders by Pickup Slot</h3>
          ${Object.entries(grouped).sort().map(([slot, slotOrders]) => {
            const used = slotOrders.length;
            const pct  = Math.round((used / SLOT_CAPACITY) * 100);
            return `
              <div class="slot-group">
                <div class="slot-group-header">
                  <span>${slotLabel(slot)} — ${used} order${used !== 1 ? 's' : ''}</span>
                  <div class="cap-bar-wrap">
                    <span class="cap-label">${used}/${SLOT_CAPACITY}</span>
                    <div class="cap-bar"><div class="cap-fill${pct >= 80 ? ' high' : ''}" style="width:${pct}%"></div></div>
                  </div>
                </div>
                ${slotOrders.map(o => `
                  <div class="admin-order-card" id="ao-${o.id}">
                    <div class="admin-order-top">
                      <div>
                        <span class="admin-order-id">${o.id}</span>
                        <span class="admin-order-customer">${o.customer}</span>
                      </div>
                      <select class="status-select" onchange="updateAdminStatus('${o.id}', this.value)">
                        <option${o.status==='Preparing'?' selected':''}>Preparing</option>
                        <option${o.status==='Ready'?' selected':''}>Ready</option>
                        <option${o.status==='Completed'?' selected':''}>Completed</option>
                      </select>
                    </div>
                    <div class="admin-order-items">${o.items.map(i => `${i.name} ×${i.qty}`).join(' · ')}</div>
                    <div style="margin-top:10px" id="ao-badge-${o.id}">${renderBadge(o.status)}</div>
                  </div>`).join('')}
              </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
}

function updateAdminStatus(id, status) {
  const order = State.adminOrders.find(o => o.id === id);
  if (order) {
    order.status = status;
    const badge = document.getElementById(`ao-badge-${id}`);
    if (badge) badge.innerHTML = renderBadge(status);
    showToast(`${id} marked as ${status}`, 'success');
  }
}
