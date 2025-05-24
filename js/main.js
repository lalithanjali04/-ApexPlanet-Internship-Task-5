// Main Application Script for ApexPlanet E-Commerce
document.addEventListener('DOMContentLoaded', function() {
  // Product Data
  const products = [
    {
      id: 1,
      title: 'Premium Smartphone X',
      price: 799.99,
      category: 'smartphones',
      image: 'images/optimized/phone1.jpg',
      thumbnails: [
        'images/optimized/phone1-thumb1.jpg',
        'images/optimized/phone1-thumb2.jpg'
      ],
      rating: 4.5,
      reviews: 124,
      description: 'Flagship smartphone with advanced camera system and all-day battery.'
    },
    {
      id: 2,
      title: 'Ultra Slim Laptop Pro',
      price: 1299.99,
      category: 'laptops',
      image: 'images/optimized/laptop1.jpg',
      thumbnails: [
        'images/optimized/laptop1-thumb1.jpg',
        'images/optimized/laptop1-thumb2.jpg'
      ],
      rating: 4.8,
      reviews: 89,
      description: 'Powerful laptop with high-resolution display and long battery life.'
    },
    {
      id: 3,
      title: 'Wireless Noise-Canceling Headphones',
      price: 349.99,
      category: 'accessories',
      image: 'images/optimized/headphones1.jpg',
      thumbnails: [
        'images/optimized/headphones1-thumb1.jpg',
        'images/optimized/headphones1-thumb2.jpg'
      ],
      rating: 4.7,
      reviews: 215,
      description: 'Premium headphones with active noise cancellation.'
    },
    {
      id: 4,
      title: 'Smart Watch Series 5',
      price: 299.99,
      category: 'accessories',
      image: 'images/optimized/watch1.jpg',
      thumbnails: [
        'images/optimized/watch1-thumb1.jpg',
        'images/optimized/watch1-thumb2.jpg'
      ],
      rating: 4.3,
      reviews: 178,
      description: 'Feature-packed smartwatch with health monitoring.'
    },
    {
      id: 5,
      title: '4K Ultra HD Smart TV',
      price: 899.99,
      category: 'tvs',
      image: 'images/optimized/tv1.jpg',
      thumbnails: [
        'images/optimized/tv1-thumb1.jpg',
        'images/optimized/tv1-thumb2.jpg'
      ],
      rating: 4.6,
      reviews: 67,
      description: '55-inch 4K Smart TV with HDR and voice control.'
    },
    {
      id: 6,
      title: 'Gaming Console Pro',
      price: 499.99,
      category: 'gaming',
      image: 'images/optimized/console1.jpg',
      thumbnails: [
        'images/optimized/console1-thumb1.jpg',
        'images/optimized/console1-thumb2.jpg'
      ],
      rating: 4.9,
      reviews: 342,
      description: 'Next-gen gaming console with ultra-fast loading.'
    }
  ];

  // DOM Elements
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navbar = document.querySelector('.navbar');
  const featuredProductsGrid = document.getElementById('featured-products');
  const allProductsGrid = document.getElementById('all-products');
  const relatedProductsGrid = document.getElementById('related-products');

  // Initialize Application
  function init() {
    setupMobileMenu();
    updateCartCount();
    loadFeaturedProducts();
    initializeProductFilters();
    setupProductDetailPage();
  }

  // Mobile Menu Toggle
  function setupMobileMenu() {
    if (mobileMenuBtn && navbar) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navbar.classList.toggle('active');
      });
    }
  }

  // Cart Management
  function updateCartCount() {
    const cart = getCart();
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
  }

  function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }

  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  // Product Filtering and Sorting
  function initializeProductFilters() {
    if (!allProductsGrid) return;

    // Initial render
    renderProducts(products);

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(button => {
      button.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(btn => 
          btn.classList.remove('active'));
        this.classList.add('active');
        filterProducts(this.dataset.category);
      });
    });

    // Sort dropdown
    const sortSelect = document.getElementById('sort-by');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        sortProducts(this.value);
      });
    }
  }

  function filterProducts(category) {
    let filteredProducts = category === 'all' 
      ? products 
      : products.filter(p => p.category === category);
    
    const sortValue = document.getElementById('sort-by')?.value || 'default';
    renderProducts(sortProductList(filteredProducts, sortValue));
  }

  function sortProducts(sortValue) {
    const activeCategory = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
    let filteredProducts = activeCategory === 'all' 
      ? products 
      : products.filter(p => p.category === activeCategory);
    
    renderProducts(sortProductList(filteredProducts, sortValue));
  }

  function sortProductList(products, sortValue) {
    const sorted = [...products];
    switch(sortValue) {
      case 'price-low': return sorted.sort((a, b) => a.price - b.price);
      case 'price-high': return sorted.sort((a, b) => b.price - a.price);
      case 'name': return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default: return sorted;
    }
  }

  // Product Rendering
  function renderProducts(productsToRender) {
    if (!allProductsGrid) return;

    allProductsGrid.innerHTML = productsToRender.map(product => `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.title}" loading="lazy">
        </div>
        <div class="product-info">
          <h3 class="product-title">${product.title}</h3>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-rating">
            <span class="stars">${renderStars(product.rating)}</span>
            <span class="review-count">(${product.reviews})</span>
          </div>
          <button class="btn add-to-cart">Add to Cart</button>
        </div>
      </div>
    `).join('');

    // Add event listeners to new elements
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const productId = parseInt(this.closest('.product-card').dataset.id);
        addToCart(productId);
      });
    });
  }

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }

  // Featured Products
  function loadFeaturedProducts() {
    if (featuredProductsGrid) {
      featuredProductsGrid.innerHTML = products.slice(0, 4).map(product => `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn add-to-cart">Add to Cart</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
          const productId = parseInt(this.closest('.product-card').dataset.id);
          addToCart(productId);
        });
      });
    }
  }

  // Product Detail Page
  function setupProductDetailPage() {
    if (!window.location.pathname.includes('product-detail.html')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
      window.location.href = 'products.html';
      return;
    }

    // Update product details
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-availability').textContent = product.inStock ? 'In Stock' : 'Out of Stock';

    // Update images
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.image;
    mainImage.alt = product.title;

    const thumbnailContainer = document.querySelector('.thumbnail-images');
    thumbnailContainer.innerHTML = [
      product.image,
      ...product.thumbnails
    ].map((img, i) => `
      <div class="thumbnail">
        <img src="${img}" alt="${product.title} Thumbnail ${i+1}" loading="lazy">
      </div>
    `).join('');

    // Thumbnail click events
    document.querySelectorAll('.thumbnail img').forEach(thumb => {
      thumb.addEventListener('click', () => {
        mainImage.src = thumb.src;
      });
    });

    // Rating
    document.querySelector('.rating .stars').textContent = renderStars(product.rating);
    document.querySelector('.review-count').textContent = `(${product.reviews} reviews)`;

    // Add to cart button
    document.getElementById('add-to-cart').addEventListener('click', () => {
      const quantity = parseInt(document.getElementById('quantity').value) || 1;
      addToCart(product.id, quantity);
    });

    // Related products
    loadRelatedProducts(product.category, product.id);
  }

  function loadRelatedProducts(category, currentProductId) {
    if (!relatedProductsGrid) return;

    const related = products.filter(p => 
      p.category === category && p.id !== currentProductId
    ).slice(0, 4);

    if (related.length > 0) {
      relatedProductsGrid.innerHTML = related.map(product => `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy">
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="btn add-to-cart">Add to Cart</button>
          </div>
        </div>
      `).join('');

      document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
          const productId = parseInt(this.closest('.product-card').dataset.id);
          addToCart(productId);
        });
      });
    } else {
      document.querySelector('.related-products').style.display = 'none';
    }
  }

  // Cart Functionality
  function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }

    saveCart(cart);
    showNotification(`${product.title} added to cart`);
  }

  // Notification System
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Initialize the app
  init();
});