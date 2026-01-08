/**
 * Loom & Lane - Core Application Logic
 * Handles product management, cart functionality, and theme preferences
 */

// ================================
// Utility Functions - Performance Optimization
// ================================

/**
 * Debounce function to limit function execution frequency
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Blur-up image placeholder effect
 * Shows low-quality placeholder while high-res image loads
 */
function initImageBlurUp() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const highResSrc = img.dataset.src;
        
        // Load high-res image
        const highResImg = new Image();
        highResImg.onload = () => {
          img.src = highResSrc;
          img.classList.add('blur-loaded');
          observer.unobserve(img);
        };
        highResImg.src = highResSrc;
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

/**
 * Scroll Reveal Animation - Fade and Slide Up
 * Applies to sections and product cards as they enter viewport
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('section, .product-card, .hero-content');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeSlideUp 0.6s ease forwards';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    revealObserver.observe(el);
  });
}

// ================================
// Global State Management
// ================================
const AppState = {
  products: [],
  cart: [],
  theme: 'light'
};

// ================================
// Product Data (Embedded to avoid CORS issues)
// ================================
const products = [
  {
    "id": 1,
    "name": "Cinnamon Wood Elephant",
    "category": "Wooden Crafts",
    "price": 8500,
    "description": "Handcarved from authentic Ceylon cinnamon wood, this majestic elephant sculpture embodies Sri Lankan heritage.",
    "image": "/assets/images/product/web1.jfif",
    "rating": 4.8
  },
  {
    "id": 2,
    "name": "Royal Blue Porcelain Vase",
    "category": "Porcelain",
    "price": 12500,
    "description": "A stunning porcelain vase adorned with hand-painted sapphire motifs inspired by Sri Lanka's precious gemstones.",
    "image": "/assets/images/product/web13.jfif",
    "rating": 4.9
  },
  {
    "id": 3,
    "name": "Lotus Bloom Arrangement",
    "category": "Flower Arrangements",
    "price": 6500,
    "description": "An exquisite arrangement featuring fresh lotus flowers and tropical foliage native to Sri Lankan waterways.",
    "image": "/assets/images/product/web5.jfif",
    "rating": 4.7
  },
  {
    "id": 4,
    "name": "Teak Wood Wall Panel",
    "category": "Home Decor",
    "price": 18500,
    "description": "A magnificent carved teak panel featuring traditional Kandyan era motifs and geometric patterns.",
    "image": "/assets/images/product/web10.jfif",
    "rating": 5.0
  },
  {
    "id": 5,
    "name": "Handwoven Palmyra Basket",
    "category": "Accessories",
    "price": 3500,
    "description": "Expertly woven from sustainable palmyra palm fibers by skilled artisans from the Northern Province.",
    "image": "/assets/images/product/web4.jfif",
    "rating": 4.6
  },
  {
    "id": 6,
    "name": "Ceylon Tea Ceremony Set",
    "category": "Porcelain",
    "price": 22500,
    "description": "An elegant six-piece porcelain tea set featuring delicate gold leaf accents and tea plantation illustrations.",
    "image": "/assets/images/product/web18.jpeg",
    "rating": 4.9
  },
  {
    "id": 7,
    "name": "Moonstone Terrace Lamp",
    "category": "Home Decor",
    "price": 15500,
    "description": "Inspired by ancient moonstone carvings found in Anuradhapura, this brass lamp casts enchanting patterns.",
    "image": "/assets/images/product/web6.jfif",
    "rating": 4.8
  },
  {
    "id": 8,
    "name": "Sandalwood Prayer Box",
    "category": "Wooden Crafts",
    "price": 7500,
    "description": "A miniature treasure chest carved from fragrant sandalwood with brass inlay work.",
    "image": "/assets/images/product/web3.jfif",
    "rating": 4.7
  },
  {
    "id": 9,
    "name": "Frangipani Silk Arrangement",
    "category": "Flower Arrangements",
    "price": 5500,
    "description": "Premium silk frangipani blooms artfully arranged with natural dried palm leaves and river stones.",
    "image": "/assets/images/product/web8.jfif",
    "rating": 4.5
  },
  {
    "id": 10,
    "name": "Handloom Cotton Table Runner",
    "category": "Accessories",
    "price": 4200,
    "description": "Woven on traditional handlooms using organic cotton threads and natural dyes from indigenous plants.",
    "image": "/assets/images/product/web10.jfif",
    "rating": 4.6
  },
  {
    "id": 11,
    "name": "Ebony Meditation Buddha",
    "category": "Wooden Crafts",
    "price": 25500,
    "description": "Masterfully sculpted from rare ebony wood, this serene Buddha statue radiates peace and contemplation.",
    "image": "/assets/images/product/web11.jfif",
    "rating": 5.0
  },
  {
    "id": 12,
    "name": "Colonial Era Chandelier",
    "category": "Home Decor",
    "price": 45000,
    "description": "A breathtaking brass chandelier inspired by Dutch colonial architecture with hand-blown glass shades.",
    "image": "/assets/images/product/web16.jpeg",
    "rating": 4.9
  },
  {
    "id": 13,
    "name": "Celadon Serving Platter",
    "category": "Porcelain",
    "price": 9500,
    "description": "A stunning celadon-glazed platter with subtle crackle finish and botanical engravings.",
    "image": "/assets/images/product/web15.jfif",
    "rating": 4.7
  },
  {
    "id": 14,
    "name": "Coconut Shell Wall Hanging",
    "category": "Wooden Crafts",
    "price": 2500,
    "description": "An eco-friendly wall art piece crafted from polished coconut shells arranged in geometric patterns.",
    "image": "/assets/images/product/web17.jpeg",
    "rating": 4.4
  },
  {
    "id": 15,
    "name": "Batik Silk Cushion Cover",
    "category": "Accessories",
    "price": 3800,
    "description": "Hand-dyed using traditional batik techniques with vibrant peacock and floral motifs on pure silk.",
    "image": "/assets/images/product/web9.jfif",
    "rating": 4.8
  }
];

// ================================
// Constants
// ================================
const CONFIG = {
  TAX_RATE: 0.05, // 5% tax
  SHIPPING_COST: 350, // LKR 350 standard shipping
  FREE_SHIPPING_THRESHOLD: 50000, // Free shipping over LKR 50,000
  STORAGE_KEYS: {
    CART: 'loomAndLane_cart',
    THEME: 'loomAndLane_theme'
  },
  TOAST_DURATION: 3000 // 3 seconds
};

// ================================
// Global Initialization
// ================================
/**
 * Initialize search modal functionality
 * - Opens modal on click
 * - Shows real-time product results as you type
 * - Works on all pages
 */
function initializeSearchModal() {
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModal = document.getElementById('searchModal');
  const searchModalBackdrop = document.getElementById('searchModalBackdrop');
  const searchModalClose = document.getElementById('searchModalClose');
  const searchModalInput = document.getElementById('searchModalInput');
  const searchModalResults = document.getElementById('searchModalResults');

  if (!searchTrigger || !searchModal) return;

  // Open modal
  function openSearchModal() {
    searchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      searchModalInput.focus();
    }, 100);
  }

  // Close modal
  function closeSearchModal() {
    searchModal.classList.remove('active');
    document.body.style.overflow = '';
    searchModalInput.value = '';
    searchModalResults.innerHTML = '';
  }

  // Event listeners
  searchTrigger.addEventListener('click', openSearchModal);
  searchModalClose.addEventListener('click', closeSearchModal);
  searchModalBackdrop.addEventListener('click', closeSearchModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      closeSearchModal();
    }
  });

  // Real-time search
  searchModalInput.addEventListener('input', debounce(async (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      searchModalResults.innerHTML = '';
      return;
    }

    // Show loading
    searchModalResults.innerHTML = `
      <div class="search-loading">
        <div class="search-loading-spinner"></div>
        <p>Searching...</p>
      </div>
    `;

    // Fetch and filter products
    try {
      const products = await fetchProducts();
      const results = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      ).slice(0, 6); // Limit to 6 results

      if (results.length === 0) {
        searchModalResults.innerHTML = `
          <div class="search-no-results">
            <div class="search-no-results-icon">🔍</div>
            <p class="search-no-results-text">No products found for "${query}"</p>
            <p class="search-no-results-hint">Try searching with different keywords</p>
          </div>
        `;
        return;
      }

      // Display results
      const resultsHTML = `
        <div class="search-results-grid">
          ${results.map(product => `
            <a href="product-details.html?id=${product.id}" class="search-result-item">
              <img src="${product.image}" alt="${product.name}" class="search-result-image" loading="lazy">
              <div class="search-result-content">
                <div class="search-result-category">${product.category}</div>
                <h3 class="search-result-title">${product.name}</h3>
                <p class="search-result-description">${product.description.substring(0, 60)}...</p>
                <div class="search-result-price">${formatCurrency(product.price)}</div>
              </div>
            </a>
          `).join('')}
        </div>
      `;

      searchModalResults.innerHTML = resultsHTML;
    } catch (error) {
      console.error('Search error:', error);
      searchModalResults.innerHTML = `
        <div class="search-no-results">
          <div class="search-no-results-icon">⚠️</div>
          <p class="search-no-results-text">An error occurred</p>
          <p class="search-no-results-hint">Please try again</p>
        </div>
      `;
    }
  }, 300));

  // Navigate on Enter key
  searchModalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = searchModalInput.value.trim();
      if (query) {
        window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
      }
    }
  });
}

/**
 * Initialize the application on page load
 * - Load theme preference
 * - Load cart from localStorage
 * - Update cart count
 */
function initializeApp() {
  // Load and apply saved theme preference
  loadThemePreference();
  
  // Load cart from localStorage
  loadCartFromStorage();
  
  // Update cart count on navbar
  updateCartCount();
  
  // Set up theme toggle listener if toggle exists
  setupThemeToggle();
  
  // Initialize search modal functionality
  initializeSearchModal();
  
  // Initialize scroll-dependent navbar opacity
  initNavbarScrollEffect();
  
  // Initialize smooth scroll reveal animations
  initScrollReveal();
  
  // Initialize parallax effect for hero
  initParallaxEffect();
  
  // Initialize magnetic navigation links
  initMagneticNavLinks();
  
  // Initialize custom cursor trail
  initCursorTrail();
  
  // Initialize image blur-up effect
  initImageBlurUp();
}

/**
 * Load theme preference from localStorage and apply it
 */
function loadThemePreference() {
  const savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME);
  
  if (savedTheme) {
    AppState.theme = savedTheme;
    applyTheme(savedTheme);
  } else {
    // Default to light theme
    AppState.theme = 'light';
    applyTheme('light');
  }
}

/**
 * Apply theme to the document
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  
  // Update toggle button icons if they exist
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    } else {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    }
  }
}

/**
 * Toggle between light and dark theme
 */
function toggleTheme() {
  const newTheme = AppState.theme === 'light' ? 'dark' : 'light';
  AppState.theme = newTheme;
  
  // Apply theme
  applyTheme(newTheme);
  
  // Save to localStorage
  localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, newTheme);
  
  // Show notification
  showToast(`Switched to ${newTheme} mode`, 'info');
}

/**
 * Set up theme toggle button listener
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

// ================================
// Product Fetching
// ================================
/**
 * Fetch products from embedded local data
 * Uses the products constant embedded at the top of this file to avoid CORS issues
 * @param {string} containerId - Optional container ID to show loading state
 * @returns {Promise<Array>} Array of product objects
 */
/**
 * Fetch and load products with comprehensive error handling
 * @param {string} containerId - Optional container ID for error display
 * @returns {Promise<Array>} Products array
 */
async function fetchProducts(containerId = null) {
  try {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (!products || products.length === 0) {
            throw new Error('No products available');
          }
          AppState.products = products;
          resolve(products);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  } catch (error) {
    console.error('❌ Error loading products:', error.message);
    
    // Display user-friendly error message
    if (containerId) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="bi bi-exclamation-triangle"></i> <strong>Oops!</strong> We couldn't load our products.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      }
    }
    throw error;
  }
}

/**
 * Get a single product by ID
 * @param {number} id - Product ID
 * @returns {Object|null} Product object or null if not found
 */
function getProductById(id) {
  return AppState.products.find(product => product.id === parseInt(id)) || null;
}

/**
 * Filter products by category
 * @param {string} category - Category name
 * @returns {Array} Filtered products
 */
function filterProductsByCategory(category) {
  if (!category || category === 'all') {
    return AppState.products;
  }
  return AppState.products.filter(product => 
    product.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search products by name or description
 * @param {string} query - Search query
 * @returns {Array} Matching products
 */
function searchProducts(query) {
  const searchTerm = query.toLowerCase().trim();
  
  if (!searchTerm) {
    return AppState.products;
  }
  
  return AppState.products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Debounced search function for real-time search input
 * Waits 300ms after user stops typing before triggering search
 */
const debouncedSearch = debounce((searchTerm) => {
  if (window.ProductsPage && typeof window.ProductsPage.filterBySearch === 'function') {
    window.ProductsPage.filterBySearch(searchTerm);
  }
}, 300);

// ================================
// CART MANAGER - Robust Cart System
// ================================
const CartManager = {
  cart: [],
  STORAGE_KEY: 'loomCart',

  /**
   * Initialize cart from localStorage
   */
  init() {
    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      
      if (savedCart) {
        this.cart = JSON.parse(savedCart);
      } else {
        this.cart = [];
      }
    } catch (error) {
      console.error('❌ Error loading cart:', error);
      this.cart = [];
      showToast('Error loading cart data', 'error');
    }
    
    // Update navbar badge
    this.updateCartBadge();
  },

  /**
   * Add item to cart (with type safety and full product details)
   * @param {number|string} productId - Product ID
   * @param {number} quantity - Quantity to add (default 1)
   */
  async addToCart(productId, quantity = 1) {
    try {
      // TYPE SAFETY: Convert to number
      const id = Number(productId);
      const qty = Number(quantity);

      if (isNaN(id) || isNaN(qty) || qty < 1) {
        console.error('Invalid product ID or quantity');
        showToast('Invalid product or quantity', 'error');
        return false;
      }

      // Ensure products are loaded
      if (!AppState.products || AppState.products.length === 0) {
        await fetchProducts();
      }

      // Get full product details from products array
      const product = AppState.products.find(p => Number(p.id) === id);

      if (!product) {
        console.error(`Product with ID ${id} not found`);
        showToast('Product not found', 'error');
        return false;
      }

      // Check if item already exists in cart
      const existingItem = this.cart.find(item => Number(item.id) === id);

      if (existingItem) {
        // Update quantity
        existingItem.quantity = Number(existingItem.quantity) + qty;
        showToast(`${product.name} quantity updated! (${existingItem.quantity})`, 'success');
      } else {
        // Add new item with full details
        const cartItem = {
          id: Number(product.id),
          name: String(product.name),
          category: String(product.category),
          price: Number(product.price), // Store as number, not formatted string
          image: String(product.image),
          quantity: qty
        };

        this.cart.push(cartItem);
        showToast(`🛒 ${product.name} added to cart!`, 'success');
      }

      // Save and update UI
      this.saveCart();
      this.updateCartBadge();

      return true;

    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      showToast('Failed to add item to cart', 'error');
      return false;
    }
  },

  /**
   * Remove item from cart
   * @param {number|string} productId - Product ID
   */
  removeFromCart(productId) {
    const id = Number(productId);
    const itemIndex = this.cart.findIndex(item => Number(item.id) === id);

    if (itemIndex !== -1) {
      const itemName = this.cart[itemIndex].name;
      this.cart.splice(itemIndex, 1);

      // Save and update
      this.saveCart();
      this.updateCartBadge();

      showToast(`${itemName} removed from cart`, 'info');
      
      return true;
    }

    return false;
  },

  /**
   * Update quantity of cart item
   * @param {number|string} productId - Product ID
   * @param {number} newQty - New quantity
   */
  updateQuantity(productId, newQty) {
    const id = Number(productId);
    const quantity = Number(newQty);

    // If quantity is less than 1, remove the item
    if (quantity < 1) {
      return this.removeFromCart(id);
    }

    const item = this.cart.find(item => Number(item.id) === id);

    if (item) {
      item.quantity = quantity;
      this.saveCart();
      this.updateCartBadge();
      return true;
    }

    return false;
  },

  /**
   * Save cart to localStorage
   */
  saveCart() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cart));
    } catch (error) {
      console.error('❌ Error saving cart:', error);
      showToast('Error saving cart', 'error');
    }
  },

  /**
   * Get current cart
   * @returns {Array} Cart items
   */
  getCart() {
    return this.cart;
  },

  /**
   * Clear entire cart
   */
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.updateCartBadge();
  },

  /**
   * Get cart item count (total quantity)
   * @returns {number} Total items in cart
   */
  getItemCount() {
    return this.cart.reduce((total, item) => total + Number(item.quantity), 0);
  },

  /**
   * Update cart badge in navbar
   */
  updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    const count = this.getItemCount();

    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.textContent = '';
        badge.style.display = 'none';
      }
    }
  }
};

// ================================
// Legacy Cart Functions (Wrapper for backward compatibility)
// ================================
// ================================
// Legacy Cart Functions (Wrapper for backward compatibility)
// ================================
/**
 * Load cart from localStorage (Legacy - now uses CartManager)
 */
function loadCartFromStorage() {
  CartManager.init();
  AppState.cart = CartManager.getCart();
}

/**
 * Save cart to localStorage (Legacy - now uses CartManager)
 */
function saveCartToStorage() {
  CartManager.saveCart();
}

/**
 * Add item to cart (Legacy wrapper - uses CartManager)
 * @param {number} id - Product ID
 * @returns {boolean} Success status
 */
async function addToCart(id) {
  return await CartManager.addToCart(id, 1);
}

/**
 * Remove item from cart (Legacy wrapper)
 * @param {number} id - Product ID
 */
function removeFromCart(id) {
  return CartManager.removeFromCart(id);
}

/**
 * Update quantity of an item in cart (Legacy wrapper)
 * @param {number} id - Product ID
 * @param {number} quantity - New quantity
 */
function updateCartItemQuantity(id, quantity) {
  return CartManager.updateQuantity(id, quantity);
}

/**
 * Clear all items from cart (Legacy wrapper)
 */
function clearCart() {
  CartManager.clearCart();
  showToast('Cart cleared', 'info');
}

/**
 * Get cart items (Legacy wrapper)
 * @returns {Array} Cart items
 */
function getCart() {
  return CartManager.getCart();
}

/**
 * Get total number of items in cart
 * @returns {number} Total quantity
 */
function getCartItemCount() {
  return AppState.cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Update cart count badge on navbar
 */
function updateCartCount() {
  const cartBadge = document.querySelector('.cart-badge');
  const count = getCartItemCount();
  
  if (cartBadge) {
    if (count > 0) {
      cartBadge.textContent = count;
      cartBadge.style.display = 'flex';
    } else {
      cartBadge.textContent = '';
      cartBadge.style.display = 'none';
    }
  }
}

/**
 * Calculate cart totals
 * @returns {Object} Object containing subtotal, tax, shipping, and total
 */
function calculateTotal() {
  // Calculate subtotal
  const subtotal = AppState.cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  // Calculate tax (5%)
  const tax = subtotal * CONFIG.TAX_RATE;
  
  // Calculate shipping (free if over threshold, otherwise standard cost)
  const shipping = subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD ? 0 : CONFIG.SHIPPING_COST;
  
  // Calculate total
  const total = subtotal + tax + shipping;
  
  return {
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: total,
    itemCount: getCartItemCount(),
    freeShipping: subtotal >= CONFIG.FREE_SHIPPING_THRESHOLD
  };
}

// ================================
// Currency Formatting
// ================================
/**
 * Format number as LKR currency using Intl.NumberFormat
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
  // Ensure amount is a number
  const numAmount = parseFloat(amount) || 0;
  
  // Use Intl.NumberFormat for proper locale-aware currency formatting
  try {
    const formatter = new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(numAmount);
  } catch (error) {
    // Fallback for browsers that don't support en-LK locale
    const formatted = numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `LKR ${formatted}`;
  }
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string (e.g., "LKR 4,500.00")
 * @returns {number} Numeric value
 */
function parseCurrency(currencyString) {
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, '')) || 0;
}

// ================================
// Toast Notifications
// ================================
/**
 * Show elegant toast notification sliding from top-right
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
  // Remove existing toasts first
  const existingToasts = document.querySelectorAll('.toast');
  existingToasts.forEach(toast => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  });
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Add icon based on type
  const icon = getToastIcon(type);
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
  `;
  
  // Add to document
  document.body.appendChild(toast);
  
  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      toast.remove();
    }, 300); // Match animation duration
  }, CONFIG.TOAST_DURATION);
}

/**
 * Get icon for toast type
 * @param {string} type - Toast type
 * @returns {string} Icon HTML
 */
function getToastIcon(type) {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };
  return icons[type] || icons.info;
}

// ================================
// UI Helper Functions
// ================================
/**
 * Display products on the page
 * @param {Array} products - Products to display
 * @param {string} containerId - Container element ID
 */
function displayProducts(products, containerId = 'productContainer') {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with ID '${containerId}' not found`);
    return;
  }
  
  // Clear existing content
  container.innerHTML = '';
  
  if (products.length === 0) {
    container.innerHTML = '<p class="text-center">No products found.</p>';
    return;
  }
  
  // Create product cards
  products.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

/**
 * Create product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
  const col = document.createElement('div');
  col.className = 'col-md-4 col-sm-6 mb-4 px-3';
  
  col.innerHTML = `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy">
      <div class="product-card-body">
        <div class="product-card-category">${product.category}</div>
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-description">${product.description}</p>
        <div class="product-card-price">${formatCurrency(product.price)}</div>
        <div class="product-card-rating">
          <span>⭐ ${product.rating}</span>
        </div>
        <div class="d-grid gap-2 mt-3">
          <a href="product-details.html?id=${product.id}" class="btn btn-outline-secondary">
            <i class="bi bi-eye"></i> View Details
          </a>
          <button class="btn btn-primary" onclick="addToCart(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
  
  return col;
}

/**
 * Show loading skeleton for product grid
 * @param {string} containerId - Container element ID
 */
function showLoadingSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear container
  container.innerHTML = '';
  
  // Create skeleton cards (show 6 placeholders)
  for (let i = 0; i < 6; i++) {
    const skeletonCol = document.createElement('div');
    skeletonCol.className = 'col-lg-4 col-md-6 col-sm-6 mb-4';
    
    skeletonCol.innerHTML = `
      <div class="loading-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-body">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line" style="margin-top: 16px;"></div>
        </div>
      </div>
    `;
    
    container.appendChild(skeletonCol);
  }
}

/**
 * Show loading spinner
 * @param {string} containerId - Container element ID
 */
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '<div class="text-center"><div class="spinner mx-auto"></div></div>';
  }
}

/**
 * Scroll to top of page
 */
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// ================================
// Event Listeners & Initialization
// ================================
// Initialize app when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOMContentLoaded already fired
  initializeApp();
}

// ================================
// Export for module usage (optional)
// ================================
// ================================
// ADVANCED UI/UX FEATURES
// ================================

/**
 * Navbar Scroll Detection - Sticky-Blur Effect
 * Changes navbar opacity and blur as user scrolls
 */
function initNavbarScrollEffect() {
  const navbar = document.querySelector('.navbar');
  
  if (!navbar) return;
  
  window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add 'scrolled' class after 50px of scroll
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 10));
}

/**
 * Smooth Scroll Reveal Animation
 * Fade and slide up effect using Intersection Observer
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('section, .product-card, .hero-content, .testimonial-card');
  
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        entry.target.classList.add('active');
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  revealElements.forEach(el => {
    scrollRevealObserver.observe(el);
  });
}

/**
 * Parallax Background Effect
 * Creates depth effect for hero section background
 */
function initParallaxEffect() {
  const heroParallax = document.querySelector('.hero-parallax');
  
  if (!heroParallax) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.5; // Adjust for stronger/weaker effect
    
    heroParallax.style.backgroundPosition = `center ${scrolled * parallaxSpeed}px`;
  });
}

/**
 * Magnetic Navigation Links
 * Creates smooth underline animation on hover
 */
function initMagneticNavLinks() {
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  
  navLinks.forEach(link => {
    link.classList.add('nav-link-magnetic');
    
    link.addEventListener('mouseenter', (e) => {
      // Optional: Add additional magnetic effect
      e.target.style.color = 'var(--color-secondary)';
    });
    
    link.addEventListener('mouseleave', (e) => {
      e.target.style.color = '';
    });
  });
}

/**
 * Custom Cursor Trail
 * Creates subtle animated dots following mouse cursor
 */
function initCursorTrail() {
  const trailContainer = document.createElement('div');
  trailContainer.id = 'cursor-trail';
  trailContainer.style.position = 'fixed';
  trailContainer.style.pointerEvents = 'none';
  trailContainer.style.zIndex = '9999';
  document.body.appendChild(trailContainer);
  
  let mouseX = 0;
  let mouseY = 0;
  const trail = [];
  const trailLength = 5;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create trail particle
    const particle = document.createElement('div');
    particle.className = 'cursor-particle';
    particle.style.position = 'absolute';
    particle.style.left = mouseX + 'px';
    particle.style.top = mouseY + 'px';
    particle.style.width = '8px';
    particle.style.height = '8px';
    particle.style.borderRadius = '50%';
    particle.style.background = 'var(--color-secondary)';
    particle.style.opacity = '0.5';
    particle.style.pointerEvents = 'none';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.animation = 'fadeOut 1s ease-out forwards';
    
    trailContainer.appendChild(particle);
    trail.push(particle);
    
    // Remove old particles
    if (trail.length > trailLength) {
      const oldParticle = trail.shift();
      oldParticle.addEventListener('animationend', () => oldParticle.remove());
    }
  });
  
  // Add fadeOut keyframe if not present
  if (!document.getElementById('cursor-trail-styles')) {
    const style = document.createElement('style');
    style.id = 'cursor-trail-styles';
    style.textContent = `
      @keyframes fadeOut {
        from {
          opacity: 0.5;
          transform: translate(-50%, -50%) scale(1);
        }
        to {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Initialize Scroll-Reveal Animation
 * Uses Intersection Observer API for fade-in and slide-up effects
 */
function initializeScrollReveal() {
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  const revealOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealOnScroll.unobserve(entry.target);
      }
    });
  }, revealOptions);

  // Apply scroll reveal to product cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    card.classList.add('scroll-reveal');
    revealOnScroll.observe(card);
  });

  // Apply to section headers
  const sectionHeaders = document.querySelectorAll('h1, h2, h3');
  sectionHeaders.forEach(header => {
    if (!header.closest('.navbar')) {
      header.classList.add('scroll-reveal');
      revealOnScroll.observe(header);
    }
  });
}

/**
 * Initialize Page Loader
 * Shows a sophisticated pre-loader that fades out when page is fully loaded
 */
function initializePageLoader() {
  // Create loader HTML if not already present
  let loader = document.getElementById('pageLoader');
  
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'page-loader';
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <div class="loader-logo">Loom & Lane</div>
      <div class="loader-text">Loading Artistry...</div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
  }

  // Hide loader when all images are loaded or after 3 seconds (timeout)
  window.addEventListener('load', () => {
    setTimeout(() => {
      hidePageLoader();
    }, 500);
  });

  // Fallback timeout
  setTimeout(() => {
    hidePageLoader();
  }, 3000);
}

/**
 * Hide the page loader
 */
function hidePageLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  }
}

/**
 * Initialize Sticky Navbar Transformation
 * Navbar becomes solid with blur effect when scrolled 50px down
 */
function initializeStickyNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const scrollThreshold = 50;

  window.addEventListener('scroll', () => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/**
 * Create flying icon animation for Add-to-Cart
 * Small gold dot travels from button to navbar cart icon
 * 
 * @param {HTMLElement} button - The "Add to Cart" button that was clicked
 */
function createFlyingCartIcon(button) {
  const cartIcon = document.querySelector('.cart-icon');
  
  if (!cartIcon) return;

  // Get button position
  const buttonRect = button.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Create flying icon element
  const flyingIcon = document.createElement('div');
  flyingIcon.className = 'flying-icon';
  flyingIcon.innerHTML = '<i class="bi bi-bag-check"></i>';
  
  // Set initial position
  flyingIcon.style.left = buttonRect.left + 'px';
  flyingIcon.style.top = buttonRect.top + 'px';
  
  document.body.appendChild(flyingIcon);

  // Trigger animation
  flyingIcon.classList.add('animating');
  
  // Animate to cart icon
  flyingIcon.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  
  setTimeout(() => {
    flyingIcon.style.left = cartRect.left + 'px';
    flyingIcon.style.top = cartRect.top + 'px';
  }, 10);

  // Remove element after animation
  setTimeout(() => {
    flyingIcon.remove();
  }, 810);
}

/**
 * Enhanced Add-to-Cart with Flying Icon Animation
 * Wraps the original addToCart function with visual feedback
 * 
 * @param {number} id - Product ID
 */
const originalAddToCart = addToCart;
addToCart = async function(id) {
  const button = event?.target?.closest('.btn-primary');
  
  // Call original add to cart
  const result = await originalAddToCart(id);
  
  // Create flying icon animation
  if (button && result) {
    createFlyingCartIcon(button);
  }
  
  return result;
};

/**
 * Initialize Custom Cursor Follower (Optional but Aesthetic)
 * Creates an elegant circular cursor that grows on hover
 */
function initializeCustomCursor() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return;
  }

  // Create cursor follower element
  let follower = document.getElementById('cursorFollower');
  
  if (!follower) {
    follower = document.createElement('div');
    follower.id = 'cursorFollower';
    follower.className = 'cursor-follower';
    document.body.appendChild(follower);
  }

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!follower.classList.contains('active')) {
      follower.classList.add('active');
    }
  });

  // Animate follower with smooth trailing effect
  function updateFollower() {
    // Smooth easing
    followerX += (mouseX - followerX) * 0.2;
    followerY += (mouseY - followerY) * 0.2;

    follower.style.left = (followerX - 15) + 'px';
    follower.style.top = (followerY - 15) + 'px';

    requestAnimationFrame(updateFollower);
  }

  updateFollower();

  // Add hover effect on clickable elements
  const clickableElements = document.querySelectorAll(
    'button, a, .btn, .product-card, input[type="button"], input[type="submit"]'
  );

  clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      follower.classList.add('hover');
    });

    element.addEventListener('mouseleave', () => {
      follower.classList.remove('hover');
    });
  });

  // Hide cursor follower when leaving window
  document.addEventListener('mouseleave', () => {
    follower.classList.remove('active');
  });
}

/**
 * Initialize all advanced UI/UX features
 * Call this function when DOM is ready (e.g., in DOMContentLoaded or after page load)
 */
function initializeAdvancedAnimations() {
  // Initialize page loader
  initializePageLoader();

  // Initialize animations on page ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeScrollReveal();
      initializeStickyNavbar();
      initializeCustomCursor();
    });
  } else {
    // DOM already loaded
    initializeScrollReveal();
    initializeStickyNavbar();
    initializeCustomCursor();
  }
}

// Auto-initialize on page load (if script is loaded)
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (document.readyState === 'complete') {
      initializeAdvancedAnimations();
    }
  });

  // Also try to initialize on DOMContentLoaded
  if (document.readyState !== 'loading') {
    initializeAdvancedAnimations();
  } else {
    document.addEventListener('DOMContentLoaded', initializeAdvancedAnimations);
  }
}

// If using ES6 modules, uncomment below:
/*
export {
  initializeApp,
  fetchProducts,
  getProductById,
  filterProductsByCategory,
  searchProducts,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCart,
// ============================================
// FLOATING CHAT WIDGET
// ============================================

function initializeChatWidget() {
  const chatToggle = document.getElementById('chatToggle');
  const chatContainer = document.getElementById('chatContainer');
  const chatClose = document.getElementById('chatClose');
  const chatSend = document.getElementById('chatSend');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (!chatToggle || !chatContainer) return;

  // Toggle chat open/close
  const toggleChat = () => {
    chatContainer.classList.toggle('active');
    chatToggle.classList.toggle('active');
    
    if (chatContainer.classList.contains('active')) {
      chatInput.focus();
    }
  };

  chatToggle.addEventListener('click', toggleChat);
  chatClose.addEventListener('click', toggleChat);

  // Send message functionality
  const sendMessage = () => {
    const message = chatInput.value.trim();
    
    if (!message) return;

    // Add user message
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('chat-message', 'user');
    userMessageDiv.innerHTML = `
      <div class="message-bubble user">${message}</div>
    `;
    chatMessages.appendChild(userMessageDiv);

    // Clear input
    chatInput.value = '';

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate bot response
    setTimeout(() => {
      const botMessageDiv = document.createElement('div');
      botMessageDiv.classList.add('chat-message', 'bot');
      
      const responses = [
        "Thank you for your message! Our team will get back to you soon.",
        "Great question! Feel free to explore our collection or contact us for more details.",
        "We appreciate your interest in Loom & Lane. How else can we help?",
        "Thanks for reaching out! We're here to assist with any questions about our products.",
        "Your message has been received. We'll respond shortly!",
        "We love your enthusiasm! Browse our shop or ask us anything about Sri Lankan craftsmanship."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      botMessageDiv.innerHTML = `
        <div class="message-bubble bot">${randomResponse}</div>
      `;
      chatMessages.appendChild(botMessageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  };

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}

// Initialize chat widget on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatWidget);
} else {
  initializeChatWidget();
}

/* Exported functions for external use:
  getCartItemCount,
  updateCartCount,
  calculateTotal,
  formatCurrency,
  parseCurrency,
  showToast,
  displayProducts,
  toggleTheme,
  initializeAdvancedAnimations,
  initializeScrollReveal,
  initializePageLoader,
  initializeStickyNavbar,
  createFlyingCartIcon,
  initializeCustomCursor,
  initializeChatWidget
*/

