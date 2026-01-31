// Sample Products Data (with RFC 4122 compliant UUIDs)
const CATEGORIES = {
  ELECTRONICS: { id: 'a1b2c3d4-e5f6-4890-8bcd-ef1234567890', name: 'Electrónicos', emoji: '📱' },
  CLOTHING: { id: 'b2c3d4e5-f6a7-4901-9cde-f12345678901', name: 'Ropa', emoji: '👕' },
  FOOD: { id: 'c3d4e5f6-a7b8-4012-adef-123456789012', name: 'Alimentos', emoji: '🍕' },
  BOOKS: { id: 'd4e5f6a7-b8c9-4123-befa-234567890123', name: 'Libros', emoji: '📚' },
};

const PRODUCTS = [
  { id: '11a2b3c4-d5e6-4890-8bcd-ef1234567890', name: 'Laptop Gaming', category: CATEGORIES.ELECTRONICS, price: 3500, emoji: '💻' },
  { id: '22b3c4d5-e6f7-4901-9cde-f12345678901', name: 'Smartphone Pro', category: CATEGORIES.ELECTRONICS, price: 2500, emoji: '📱' },
  { id: '33c4d5e6-f7a8-4012-adef-123456789012', name: 'Auriculares BT', category: CATEGORIES.ELECTRONICS, price: 350, emoji: '🎧' },
  { id: '44d5e6f7-a8b9-4123-befa-234567890123', name: 'Camiseta Premium', category: CATEGORIES.CLOTHING, price: 120, emoji: '👕' },
  { id: '55e6f7a8-b9c0-4234-8fab-345678901234', name: 'Jeans Classic', category: CATEGORIES.CLOTHING, price: 180, emoji: '👖' },
  { id: '66f7a8b9-c0d1-4345-9abc-456789012345', name: 'Zapatillas Sport', category: CATEGORIES.CLOTHING, price: 320, emoji: '👟' },
  { id: '77a8b9c0-d1e2-4456-abcd-567890123456', name: 'Pizza Familiar', category: CATEGORIES.FOOD, price: 45, emoji: '🍕' },
  { id: '88b9c0d1-e2f3-4567-bcde-678901234567', name: 'Hamburguesa XL', category: CATEGORIES.FOOD, price: 35, emoji: '🍔' },
  { id: '99c0d1e2-f3a4-4678-8def-789012345678', name: 'Sushi Box', category: CATEGORIES.FOOD, price: 85, emoji: '🍣' },
  { id: 'aad1e2f3-a4b5-4789-9efa-890123456789', name: 'Clean Code', category: CATEGORIES.BOOKS, price: 95, emoji: '📘' },
  { id: 'bbe1f2a3-b4c5-4890-afab-901234567890', name: 'Design Patterns', category: CATEGORIES.BOOKS, price: 110, emoji: '📗' },
  { id: 'ccf2a3b4-c5d6-4901-bfbc-012345678901', name: 'The Pragmatic', category: CATEGORIES.BOOKS, price: 85, emoji: '📙' },
];

// State
let cart = [];
let promotions = [];
let selectedPromotion = null;

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const promotionsList = document.getElementById('promotions-list');
const loadPromotionsBtn = document.getElementById('load-promotions');
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutResult = document.getElementById('checkout-result');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  loadPromotionsBtn.addEventListener('click', loadPromotions);
  checkoutBtn.addEventListener('click', checkout);
});

// Render Products
function renderProducts() {
  productsGrid.innerHTML = PRODUCTS.map(product => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-emoji">${product.emoji}</div>
      <h3 class="product-name">${product.name}</h3>
      <span class="product-category">${product.category.emoji} ${product.category.name}</span>
      <p class="product-price">S/ ${product.price.toFixed(2)}</p>
      <button class="add-btn" onclick="addToCart('${product.id}')">Agregar al Carrito</button>
    </div>
  `).join('');
}

// Add to Cart
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      productId: product.id,
      categoryId: product.category.id,
      quantity: 1,
      price: product.price,
      name: product.name,
      emoji: product.emoji,
    });
  }
  renderCart();
  updateCheckoutButton();
}

// Remove from Cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.productId !== productId);
  renderCart();
  updateCheckoutButton();
}

// Update Quantity
function updateQuantity(productId, delta) {
  const item = cart.find(item => item.productId === productId);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      renderCart();
    }
  }
}

// Render Cart
function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    subtotalEl.textContent = 'S/ 0.00';
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-details">
        <p class="cart-item-name">${item.name}</p>
        <p class="cart-item-price">S/ ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQuantity('${item.productId}', -1)">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="updateQuantity('${item.productId}', 1)">+</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  subtotalEl.textContent = `S/ ${total.toFixed(2)}`;
}

// Load Promotions from Backend
async function loadPromotions() {
  loadPromotionsBtn.innerHTML = '<span class="loading"></span> Cargando...';
  loadPromotionsBtn.disabled = true;

  try {
    const response = await fetch('/api/promotions');
    if (!response.ok) throw new Error('Error al cargar promociones');
    promotions = await response.json();
    renderPromotions();
  } catch (error) {
    console.error('Error loading promotions:', error);
    promotionsList.innerHTML = `<p class="no-promotions">Error: ${error.message}</p>`;
  } finally {
    loadPromotionsBtn.innerHTML = 'Recargar Promociones';
    loadPromotionsBtn.disabled = false;
  }
}

// Render Promotions
function renderPromotions() {
  const activePromotions = promotions.filter(p => p.isActive);
  if (activePromotions.length === 0) {
    promotionsList.innerHTML = '<p class="no-promotions">No hay promociones activas</p>';
    return;
  }

  promotionsList.innerHTML = activePromotions.map(promo => {
    const startDate = new Date(promo.startDate).toLocaleDateString('es-PE');
    const endDate = new Date(promo.endDate).toLocaleDateString('es-PE');
    const isSelected = selectedPromotion?.id === promo.id;
    
    return `
      <div class="promotion-item ${isSelected ? 'selected' : ''}" onclick="selectPromotion('${promo.id}')" data-id="${promo.id}">
        <p class="promotion-name">🎁 ${promo.name}</p>
        <p class="promotion-description">${promo.description || 'Sin descripción'}</p>
        <p class="promotion-dates">📅 ${startDate} - ${endDate}</p>
      </div>
    `;
  }).join('');
}

// Select Promotion
function selectPromotion(promotionId) {
  selectedPromotion = promotions.find(p => p.id === promotionId) || null;
  renderPromotions();
  updateCheckoutButton();
}

// Update Checkout Button State
function updateCheckoutButton() {
  checkoutBtn.disabled = cart.length === 0 || !selectedPromotion;
}

// Checkout
async function checkout() {
  if (cart.length === 0 || !selectedPromotion) return;

  checkoutBtn.innerHTML = '<span class="loading"></span> Procesando...';
  checkoutBtn.disabled = true;

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const payload = {
    promotionId: selectedPromotion.id,
    cart: {
      totalAmount,
      items: cart.map(item => ({
        productId: item.productId,
        categoryId: item.categoryId,
        quantity: item.quantity,
        price: item.price,
      })),
    },
  };

  try {
    const response = await fetch('/api/promotion-engine/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('API Error:', errorData);
      throw new Error(errorData.message || JSON.stringify(errorData));
    }

    const result = await response.json();
    renderCheckoutResult(result);
  } catch (error) {
    console.error('Checkout error:', error);
    renderCheckoutResult({
      status: 'ERROR',
      message: error.message,
      originalAmount: totalAmount,
      finalAmount: totalAmount,
      discount: 0,
    });
  } finally {
    checkoutBtn.innerHTML = 'Aplicar Promoción y Checkout';
    checkoutBtn.disabled = cart.length === 0 || !selectedPromotion;
  }
}

// Render Checkout Result
function renderCheckoutResult(result) {
  const statusClass = result.status.toLowerCase().replace('_', '-');
  const statusEmoji = { 'applied': '✅', 'not-applicable': '⚠️', 'error': '❌' }[statusClass] || '❓';
  const statusText = { 'applied': 'Promoción Aplicada', 'not-applicable': 'Promoción No Aplicable', 'error': 'Error' }[statusClass] || result.status;

  checkoutResult.innerHTML = `
    <div class="result-card ${statusClass}">
      <div class="result-status ${statusClass}">
        <span>${statusEmoji}</span>
        <span>${statusText}</span>
      </div>
      <p class="result-message">${result.message}</p>
      <div class="result-amounts">
        <div class="amount-row">
          <span>Monto Original:</span>
          <span>S/ ${result.originalAmount.toFixed(2)}</span>
        </div>
        ${result.discount > 0 ? `
          <div class="amount-row discount">
            <span>Descuento:</span>
            <span>- S/ ${result.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="amount-row final">
          <span>Monto Final:</span>
          <span>S/ ${result.finalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}