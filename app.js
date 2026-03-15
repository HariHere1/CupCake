/* ══ NAVBAR ═════════════════════════════════════════════════════════════════ */

function renderNav() {
  const p = State.page, u = State.user, count = State.cartCount();
  return `
    <nav class="nav">
      <div class="nav-logo" onclick="navigate('home')">
        ${svgIcon('leaf',20,'var(--brown2)')} Cupcake
      </div>
      <div class="nav-links">
        <button class="nav-link${p==='home'?' active':''}"    onclick="navigate('home')">${svgIcon('home',16)} Home</button>
        <button class="nav-link${p==='menu'?' active':''}"    onclick="navigate('menu')">${svgIcon('menu',16)} Menu</button>
        <button class="nav-link${p==='orders'?' active':''}"  onclick="navigate('orders')">${svgIcon('orders',16)} Orders</button>
        ${u ? `
          <button class="nav-link${p==='admin'?' active':''}" onclick="navigate('admin')">${svgIcon('admin',16)} Admin</button>
          <button class="nav-link" onclick="logout()">${svgIcon('logout',16)} Logout</button>
        ` : `
          <button class="nav-link${p==='auth'?' active':''}"  onclick="navigate('auth')">${svgIcon('user',16)} Login</button>
        `}
      </div>
      <button class="nav-cart" onclick="navigate('cart')">
        ${svgIcon('cart',16)} Cart
        <span class="cart-badge" style="display:${count>0?'flex':'none'}">${count}</span>
      </button>
    </nav>`;
}

function renderBottomNav() {
  const p = State.page, count = State.cartCount();
  return `
    <div class="bottom-nav">
      <button class="bottom-nav-item${p==='home'?'   active':''}" onclick="navigate('home')">${svgIcon('home',22)}<span>Home</span></button>
      <button class="bottom-nav-item${p==='menu'?'   active':''}" onclick="navigate('menu')">${svgIcon('menu',22)}<span>Menu</span></button>
      <button class="bottom-nav-item${p==='cart'?' active':''}" onclick="navigate('cart')" style="position:relative">
        ${svgIcon('cart',22)}
        <span class="cart-badge" style="display:${count>0?'flex':'none'};position:absolute;top:0;right:4px">${count}</span>
        <span>Cart</span>
      </button>
      <button class="bottom-nav-item${p==='orders'?' active':''}" onclick="navigate('orders')">${svgIcon('orders',22)}<span>Orders</span></button>
      <button class="bottom-nav-item${p==='auth'?'   active':''}" onclick="navigate('auth')">${svgIcon('user',22)}<span>Account</span></button>
    </div>`;
}

/* ══ ROUTER ═════════════════════════════════════════════════════════════════ */

function renderPageContent() {
  switch (State.page) {
    case 'home':         return renderHome();
    case 'menu':         return renderMenu();
    case 'item':         return renderItem();
    case 'cart':         return renderCart();
    case 'schedule':     return renderSchedule();
    case 'checkout':     return renderCheckout();
    case 'confirmation': return renderConfirmation();
    case 'orders':       return renderOrders();
    case 'auth':         return renderAuth();
    case 'admin':        return renderAdmin();
    default:             return renderHome();
  }
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML =
    renderNav() +
    `<main id="main-content">${renderPageContent()}</main>` +
    renderBottomNav() +
    `<div class="toast-container" id="toast-container"></div>`;

  attachCardEvents(document.getElementById('main-content'));
}

/* ══ EVENT DELEGATION ════════════════════════════════════════════════════════ */

function attachCardEvents(root) {
  if (!root) return;

  root.querySelectorAll('.food-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.food-card-add')) return;
      const item = MENU_ITEMS.find(i => i.id === parseInt(card.dataset.id));
      if (item) { State.selectedItem = item; State.itemQty = 1; navigate('item'); }
    });
  });

  root.querySelectorAll('.food-card-add').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const item = MENU_ITEMS.find(i => i.id === parseInt(btn.dataset.addId));
      if (item) {
        addToCart(item);
        const card = btn.closest('.food-card');
        if (card) {
          card.classList.remove('popping');
          void card.offsetWidth;
          card.classList.add('popping');
        }
      }
    });
  });
}

/* ══ AUTH ════════════════════════════════════════════════════════════════════ */

function logout() {
  State.user = null;
  showToast('Logged out successfully');
  navigate('home');
}

/* ══ INIT ════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Load persisted orders and slot usage from localStorage on boot
  loadOrdersFromStorage();
  render();
});
