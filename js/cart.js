// DOM Elements
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const checkoutItemsContainer = document.getElementById('checkout-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutForm = document.getElementById('checkout-form');

// Initialize Cart
function initCart() {
    if (cartItemsContainer || checkoutItemsContainer) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cartItemsContainer) {
            renderCartItems(cart);
        }
        
        if (checkoutItemsContainer) {
            renderCheckoutItems(cart);
        }
        
        updateCartTotals(cart);
    }
}

// Render Cart Items
function renderCartItems(cart) {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-quantity">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity">+</button>
                    </div>
                    <div class="remove-item">Remove</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Add event listeners
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Render Checkout Items
function renderCheckoutItems(cart) {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    checkoutItemsContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
            <span>${item.title} × ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}

// Update Cart Totals
function updateCartTotals(cart) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    if (cartSubtotal && cartTotal) {
        cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartTotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    if (checkoutSubtotal && checkoutTotal) {
        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutTotal.textContent = `$${subtotal.toFixed(2)}`;
    }
    
    // Update cart count in header
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Decrease Quantity
function decreaseQuantity() {
    const cartItem = this.closest('.cart-item');
    const itemId = parseInt(cartItem.dataset.id);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart();
    }
}

// Increase Quantity
function increaseQuantity() {
    const cartItem = this.closest('.cart-item');
    const itemId = parseInt(cartItem.dataset.id);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity++;
        localStorage.setItem('cart', JSON.stringify(cart));
        initCart();
    }
}

// Remove Item
function removeItem() {
    const cartItem = this.closest('.cart-item');
    const itemId = parseInt(cartItem.dataset.id);
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== itemId);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    initCart();
}

// Handle Checkout Form Submission
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real app, you would process payment here
        // For demo purposes, we'll just clear the cart and show a success message
        
        localStorage.removeItem('cart');
        
        // Show success message
        alert('Order placed successfully! Thank you for your purchase.');
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', initCart);