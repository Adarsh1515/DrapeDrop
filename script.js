// Global variables
let currentUser = null;
let currentUserType = null;
let cart = [];
let products = [];

// New product images state for add-product form
let newProductImages = { front: null, back: null, side: null, full: null, other: null };
let selectedImageSlot = null;

// Authentication functions
function goToAuth() {
    // Add a small delay to ensure smooth redirect
    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 100);
}

function checkAuthentication() {
    const savedUser = localStorage.getItem('drapedrop_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        currentUserType = currentUser.type;
        return true;
    }
    return false;
}

// Initialize products from localStorage or use default data
function initializeProducts() {
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products if no data exists
        products = [
            {
                id: 1,
                name: "Elegant Black Evening Dress",
                brand: "Fashion House",
                color: "Black",
                size: "M",
                condition: "Excellent",
                originalPrice: 24999,
                currentPrice: 12499,
                rentPrice: 1999,
                type: "sale", // sale or rent
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
                description: "Beautiful black evening dress perfect for special occasions. Worn only twice, excellent condition."
            },
            {
                id: 2,
                name: "Summer Floral Dress",
                brand: "Spring Collection",
                color: "Blue",
                size: "S",
                condition: "Good",
                originalPrice: 7499,
                currentPrice: 3749,
                rentPrice: 1,
                type: "rent",
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                description: "Light and comfortable summer dress with floral pattern. Perfect for outdoor events."
            },
            {
                id: 3,
                name: "Red Cocktail Dress",
                brand: "Elegance",
                color: "Red",
                size: "L",
                condition: "Very Good",
                originalPrice: 16699,
                currentPrice: 8349,
                rentPrice: 1599,
                type: "sale",
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
                description: "Stunning red cocktail dress for parties and events. Great condition with minor wear."
            }
        ];
        saveProducts();
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('drapedrop_products', JSON.stringify(products));
}

// Initialize products when page loads
initializeProducts();

// Check if user is already logged in when page loads
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('drapedrop_currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        currentUserType = currentUser.type;

        // Show appropriate dashboard
        if (currentUserType === 'user') {
            showUserDashboard();
        } else if (currentUserType === 'admin') {
            showAdminDashboard();
        }
    }
}

// Account management function
function openAccount() {
    // Navigate to the dedicated account page
    window.location.href = 'account.html';
}

// Make functions globally accessible
window.goToAuth = goToAuth;
window.viewProduct = viewProduct;
window.closeProductModal = closeProductModal;
window.addToCartFromModal = addToCartFromModal;
window.openProductDetails = openProductDetails;
window.openCart = openCart;
window.getCartCount = getCartCount;
window.updateCartCountDisplay = updateCartCountDisplay;
window.buyNowDirect = buyNowDirect;
window.rentNowDirect = rentNowDirect;
window.requestToBuy = requestToBuy;
window.proceedToRent = proceedToRent;
window.closeSlidingWindow = closeSlidingWindow;
window.openAccount = openAccount;

// Add debugging to check if functions are accessible
console.log('viewProduct function available:', typeof window.viewProduct);
console.log('closeProductModal function available:', typeof window.closeProductModal);
console.log('addToCartFromModal function available:', typeof window.addToCartFromModal);
console.log('openProductDetails function available:', typeof window.openProductDetails);

// Define viewProduct function early to ensure it's available
function viewProduct(productId) {
    console.log('viewProduct called with ID:', productId); // Debug log
    const product = products.find(p => p.id === productId);
    console.log('Found product:', product); // Debug log

    if (product) {
        const modalHTML = `
            <div class="modal product-details-modal">
                <div class="modal-content product-details-content">
                    <span class="close" onclick="closeProductModal()">&times;</span>
                    <div class="product-details-container">
                        <div class="product-image-section">
                            <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                        </div>
                        <div class="product-info-section">
                            <h2 class="product-detail-title">${product.name}</h2>
                            <div class="product-detail-grid">
                                <div class="detail-item">
                                    <span class="detail-label">Brand:</span>
                                    <span class="detail-value">${product.brand}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Color:</span>
                                    <span class="detail-value">${product.color}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Size:</span>
                                    <span class="detail-value">${product.size}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Condition:</span>
                                    <span class="detail-value">${product.condition}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Type:</span>
                                    <span class="detail-value">${product.type === 'sale' ? 'For Sale' : 'For Rent'}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">Original Price:</span>
                                    <span class="detail-value">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div class="detail-item">
                                    <span class="detail-label">${product.type === 'sale' ? 'Sale Price:' : 'Rent Price:'}</span>
                                    <span class="detail-value price-highlight">
                                        ${product.type === 'sale' ?
                `₹${product.currentPrice.toLocaleString('en-IN')}` :
                `₹${product.rentPrice.toLocaleString('en-IN')}/day`
            }
                                    </span>
                                </div>
                            </div>
                            <div class="product-description">
                                <h3>Description</h3>
                                <p>${product.description}</p>
                            </div>
                            <div class="product-actions-detail">
                                <button class="btn btn-primary" onclick="addToCartFromModal(${product.id})">
                                    <i class="fas fa-cart-plus"></i>
                                    ${product.type === 'sale' ? 'Buy Now' : 'Rent Now'}
                                </button>
                                <button class="btn btn-secondary" onclick="closeProductModal()">
                                    <i class="fas fa-times"></i>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('Modal HTML added to page'); // Debug log
    } else {
        console.log('Product not found for ID:', productId); // Debug log
        alert('Product not found!');
    }
}

// Function to open product details page
function openProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Function to open cart page
function openCart() {
    window.location.href = 'cart.html';
}

// Function to get cart count from localStorage
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('drapedrop_cart') || '[]');
    return cart.length;
}

// Function for direct buy now
function buyNowDirect(productId) {
    window.location.href = `checkout.html?id=${productId}&action=buy`;
}

// Function for direct rent now
function rentNowDirect(productId) {
    // Load product for price display
    let products = [];
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    const product = products.find(p => p.id === productId);
    const priceText = product && typeof product.currentPrice === 'number'
        ? `₹${product.currentPrice.toLocaleString('en-IN')}`
        : 'Currently unavailable';

    // Create sliding window with selling price info
    const slidingWindow = document.createElement('div');
    slidingWindow.className = 'sliding-window';
    slidingWindow.innerHTML = `
        <div class="sliding-window-content">
            <h3>Rent Now</h3>
            <p>Would you like to request to buy this item instead?</p>
            <p style=\"font-weight:600;margin:8px 0;color:#333;\">Selling Price: ${priceText}</p>
            <div class="sliding-window-buttons">
                <button class="btn btn-primary" onclick="requestToBuy(${productId})">Request to buy</button>
                <button class="btn btn-secondary" onclick="proceedToRent(${productId})">Skip</button>
            </div>
        </div>
    `;
    document.body.appendChild(slidingWindow);
    setTimeout(() => { slidingWindow.classList.add('active'); }, 10);
}

function requestToBuy(productId) {
    const currentUser = JSON.parse(localStorage.getItem('drapedrop_currentUser') || 'null');
    if (!currentUser) { alert('Please login first.'); return; }

    // Ensure products are available, fallback to defaults and persist if missing
    let products = [];
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [
            {
                id: 1,
                name: "Elegant Black Evening Dress",
                brand: "Fashion House",
                color: "Black",
                size: "M",
                condition: "Excellent",
                originalPrice: 24999,
                currentPrice: 12499,
                rentPrice: 1999,
                type: "sale",
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
                description: "Beautiful black evening dress perfect for special occasions. Worn only twice, excellent condition."
            },
            {
                id: 2,
                name: "Summer Floral Dress",
                brand: "Spring Collection",
                color: "Blue",
                size: "S",
                condition: "Good",
                originalPrice: 7499,
                currentPrice: 3749,
                rentPrice: 1,
                type: "rent",
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                description: "Light and comfortable summer dress with floral pattern. Perfect for outdoor events."
            },
            {
                id: 3,
                name: "Red Cocktail Dress",
                brand: "Elegance",
                color: "Red",
                size: "L",
                condition: "Very Good",
                originalPrice: 16699,
                currentPrice: 8349,
                rentPrice: 1599,
                type: "sale",
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop",
                description: "Stunning red cocktail dress for parties and events. Great condition with minor wear."
            }
        ];
        localStorage.setItem('drapedrop_products', JSON.stringify(products));
    }

    const product = products.find(p => p.id === productId);
    if (!product) { alert('Product not found'); return; }

    const requests = JSON.parse(localStorage.getItem('drapedrop_buyRequests') || '[]');
    const request = {
        id: Date.now(),
        productId: product.id,
        userEmail: currentUser.email,
        userName: [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' '),
        status: 'pending',
        createdAt: new Date().toISOString(),
        product: {
            id: product.id,
            name: product.name,
            brand: product.brand,
            color: product.color,
            size: product.size,
            currentPrice: product.currentPrice,
            rentPrice: product.rentPrice,
            type: product.type,
            image: product.image
        }
    };
    requests.push(request);
    localStorage.setItem('drapedrop_buyRequests', JSON.stringify(requests));
    closeSlidingWindow();
    window.location.href = 'requests.html';
}

function proceedToRent(productId) {
    closeSlidingWindow();
    window.location.href = `checkout.html?id=${productId}&action=rent`;
}

function closeSlidingWindow(windowElement) {
    const slidingWindow = windowElement || document.querySelector('.sliding-window');
    if (slidingWindow) {
        slidingWindow.classList.remove('active');
        setTimeout(() => {
            slidingWindow.remove();
        }, 300); // Match this with the CSS transition duration
    }
}

function closeProductModal() {
    const modal = document.querySelector('.product-details-modal');
    if (modal) {
        modal.remove();
    }
}

function addToCartFromModal(productId) {
    addToCart(productId);
    closeProductModal();
}

// Authentication functions
function showLoginModal(userType) {
    currentUserType = userType;
    const modal = document.getElementById('loginModal');
    const title = document.getElementById('loginTitle');
    title.textContent = `${userType.charAt(0).toUpperCase() + userType.slice(1)} Login`;
    modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

function showRegisterForm() {
    const form = document.getElementById('authForm');
    const title = document.getElementById('loginTitle');
    const submitBtn = form.querySelector('button[type="submit"]');
    const registerLink = document.querySelector('.register-link');

    title.textContent = 'Register';
    submitBtn.textContent = 'Register';
    registerLink.innerHTML = 'Already have an account? <a href="#" onclick="showLoginForm()">Login here</a>';

    // Add name field for registration
    if (!document.getElementById('name')) {
        const nameGroup = document.createElement('div');
        nameGroup.className = 'form-group';
        nameGroup.innerHTML = `
            <label for="name">Full Name</label>
            <input type="text" id="name" required>
        `;
        form.insertBefore(nameGroup, form.firstChild);
    }
}

function showLoginForm() {
    const form = document.getElementById('authForm');
    const title = document.getElementById('loginTitle');
    const submitBtn = form.querySelector('button[type="submit"]');
    const registerLink = document.querySelector('.register-link');

    title.textContent = 'Login';
    submitBtn.textContent = 'Login';
    registerLink.innerHTML = 'Don\'t have an account? <a href="#" onclick="showRegisterForm()">Register here</a>';

    // Remove name field for login
    const nameField = document.getElementById('name');
    if (nameField) {
        nameField.parentElement.remove();
    }
}

// Handle form submission
document.getElementById('authForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const nameField = document.getElementById('name');

    if (nameField) {
        // Registration
        const name = nameField.value;
        if (email && password && name) {
            currentUser = { name, email, type: currentUserType };
            // Save user to localStorage
            localStorage.setItem('drapedrop_currentUser', JSON.stringify(currentUser));
            closeModal();
            if (currentUserType === 'user') {
                showUserDashboard();
            } else {
                showAdminDashboard();
            }
        }
    } else {
        // Login
        if (email && password) {
            // Simple authentication - in real app, this would validate against backend
            currentUser = {
                name: email.split('@')[0],
                email,
                type: currentUserType
            };
            // Save user to localStorage
            localStorage.setItem('drapedrop_currentUser', JSON.stringify(currentUser));
            closeModal();
            if (currentUserType === 'user') {
                showUserDashboard();
            } else {
                showAdminDashboard();
            }
        }
    }
});

// User Dashboard
function showUserDashboard() {
    // Refresh products from localStorage before displaying
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    // Only show approved (or legacy without status)
    const visibleProducts = products.filter(p => !p.status || p.status === 'approved');

    document.body.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1><i class="fas fa-tshirt"></i> DrapeDrop - User Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, ${currentUser.name}!</span>
                    <div class="cart-icon" onclick="openCart()">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count">${getCartCount()}</span>
                    </div>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
            
            <div class="products-grid">
                ${visibleProducts.map(product => `
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="view-details-overlay">
                                <button class="btn btn-secondary btn-small view-details-btn" onclick="openProductDetails(${product.id})">
                                    <i class="fas fa-eye"></i>
                                    View Details
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h3 class="product-title">${product.name}</h3>
                            <p class="product-details">
                                Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}<br>
                                Condition: ${product.condition}<br>
                                Original Price: ₹${product.originalPrice.toLocaleString('en-IN')}
                            </p>
                            <div class="product-price">
                                ${product.type === 'sale' ?
            `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` :
            `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
        }
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                                    <i class="fas fa-cart-plus"></i>
                                    Add to Cart
                                </button>
                                ${product.type === 'sale' ?
            `<button class="btn btn-success btn-small" onclick="buyNowDirect(${product.id})">
                                        <i class="fas fa-credit-card"></i>
                                        Buy Now
                                    </button>` :
            `<button class="btn btn-warning btn-small" onclick="rentNowDirect(${product.id})">
                                        <i class="fas fa-calendar-alt"></i>
                                        Rent Now
                                    </button>`
        }
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Update cart count display after dashboard loads
    updateCartCountDisplay();
}

// Seller Dashboard
function showAdminDashboard() {
    // Refresh products from localStorage before displaying
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }

    document.body.innerHTML = `
        <div class="admin-dashboard">
            <div class="admin-header">
                <h1><i class="fas fa-user-shield"></i> DrapeDrop - Seller Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, ${currentUser.name}!</span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
            
            <div class="admin-tabs"><!-- Keeping class name to avoid breaking CSS -->
                <button class="tab-btn active" onclick="showTab('products')">Manage Products</button>
                <button class="tab-btn" onclick="showTab('add-product')">Add New Product</button>
            </div>
            
            <div id="products-tab">
                <h2>Current Products</h2>
                <div class="products-grid">
                    ${products.map(product => `
                        <div class="product-card" data-product-id="${product.id}">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="product-info">
                                <h3 class="product-title">${product.name}</h3>
                                <p class="product-details">
                                    Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}<br>
                                    Condition: ${product.condition}<br>
                                    Type: ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                                </p>
                                                        <div class="product-price">
                            ${product.type === 'sale' ?
            `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` :
            `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
        }
                        </div>
                                <div class="product-actions">
                                    <button class="btn btn-primary btn-small" onclick="editProduct(${product.id})">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </button>
                                    <button class="btn btn-secondary btn-small" onclick="deleteProduct(${product.id})">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="add-product-tab" style="display: none;">
                <h2>Add New Product</h2>
                <form class="add-product-form" id="addProductForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productName">Product Name</label>
                            <input type="text" id="productName" required>
                        </div>
                        <div class="form-group">
                            <label for="productBrand">Brand</label>
                            <input type="text" id="productBrand" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productColor">Color</label>
                            <input type="text" id="productColor" required>
                        </div>
                        <div class="form-group">
                            <label for="productSize">Size</label>
                            <select id="productSize" required>
                                <option value="">Select Size</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="productCondition">Wear Condition</label>
                            <select id="productCondition" required>
                                <option value="">Select Condition</option>
                                <option value="Excellent">Excellent</option>
                                <option value="Very Good">Very Good</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="productType">Product Type</label>
                            <select id="productType" required>
                                <option value="rent" selected>For Rent</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="originalPrice">Original Price (₹)</label>
                            <input type="number" id="originalPrice" step="1" required>
                        </div>
                        <div class="form-group">
                            <label for="currentPrice">Selling Price (₹) (optional)</label>
                            <input type="number" id="currentPrice" step="1" placeholder="Enter selling price (optional)">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="productDescription">Description</label>
                        <textarea id="productDescription" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <div class="section-header">
                            <h3>Images <span class="image-counter" id="imageCounter">(0/5)</span></h3>
                        </div>
                        <div class="multi-image-grid">
                            <div class="image-slot" id="slot-front" onclick="selectSlotForView('front')">
                                <input type="file" id="slot-input-front" accept="image/*" onchange="onSlotInputChange(event,'front')">
                                <div class="slot-inner" id="slot-content-front">
                                    <i class="fas fa-plus"></i>
                                    <span class="slot-label">Front View</span>
                                </div>
                                <div class="slot-actions" id="slot-actions-front" style="display:none;">
                                    <button type="button" class="slot-btn" onclick="triggerEditSlot('front', event)"><i class="fas fa-pen"></i></button>
                                    <button type="button" class="slot-btn danger" onclick="clearSlot('front', event)"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="image-slot" id="slot-back" onclick="selectSlotForView('back')">
                                <input type="file" id="slot-input-back" accept="image/*" onchange="onSlotInputChange(event,'back')">
                                <div class="slot-inner" id="slot-content-back">
                                    <i class="fas fa-plus"></i>
                                    <span class="slot-label">Back View</span>
                                </div>
                                <div class="slot-actions" id="slot-actions-back" style="display:none;">
                                    <button type="button" class="slot-btn" onclick="triggerEditSlot('back', event)"><i class="fas fa-pen"></i></button>
                                    <button type="button" class="slot-btn danger" onclick="clearSlot('back', event)"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="image-slot" id="slot-side" onclick="selectSlotForView('side')">
                                <input type="file" id="slot-input-side" accept="image/*" onchange="onSlotInputChange(event,'side')">
                                <div class="slot-inner" id="slot-content-side">
                                    <i class="fas fa-plus"></i>
                                    <span class="slot-label">Side View</span>
                                </div>
                                <div class="slot-actions" id="slot-actions-side" style="display:none;">
                                    <button type="button" class="slot-btn" onclick="triggerEditSlot('side', event)"><i class="fas fa-pen"></i></button>
                                    <button type="button" class="slot-btn danger" onclick="clearSlot('side', event)"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="image-slot" id="slot-full" onclick="selectSlotForView('full')">
                                <input type="file" id="slot-input-full" accept="image/*" onchange="onSlotInputChange(event,'full')">
                                <div class="slot-inner" id="slot-content-full">
                                    <i class="fas fa-plus"></i>
                                    <span class="slot-label">Full View</span>
                                </div>
                                <div class="slot-actions" id="slot-actions-full" style="display:none;">
                                    <button type="button" class="slot-btn" onclick="triggerEditSlot('full', event)"><i class="fas fa-pen"></i></button>
                                    <button type="button" class="slot-btn danger" onclick="clearSlot('full', event)"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div class="image-slot" id="slot-other" onclick="selectSlotForView('other')">
                                <input type="file" id="slot-input-other" accept="image/*" onchange="onSlotInputChange(event,'other')">
                                <div class="slot-inner" id="slot-content-other">
                                    <i class="fas fa-plus"></i>
                                    <span class="slot-label">Other</span>
                                </div>
                                <div class="slot-actions" id="slot-actions-other" style="display:none;">
                                    <button type="button" class="slot-btn" onclick="triggerEditSlot('other', event)"><i class="fas fa-pen"></i></button>
                                    <button type="button" class="slot-btn danger" onclick="clearSlot('other', event)"><i class="fas fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                        <div class="view-wrapper">
                            <div class="view-top">
                                <h4>View</h4>
                            </div>
                            <div id="selectedImageView" class="selected-image-view">Photo</div>
                            <div class="view-actions" id="viewActions" style="display:none;">
                                <button type="button" class="btn btn-primary btn-small" onclick="editSelectedSlot()">Edit</button>
                                <button type="button" class="btn btn-secondary btn-small" onclick="deleteSelectedSlot()">Delete</button>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Add Product
                    </button>
                </form>
            </div>
        </div>
    `;

    // Add event listener for form submission
    document.getElementById('addProductForm').addEventListener('submit', addNewProduct);
    // Initialize image slot interactions
    setupImageSlots();
}

// Tab switching for admin dashboard
function showTab(tabName) {
    // Hide all tabs
    document.getElementById('products-tab').style.display = 'none';
    document.getElementById('add-product-tab').style.display = 'none';

    // Show selected tab
    document.getElementById(tabName + '-tab').style.display = 'block';

    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // If switching to products tab, refresh the products display
    if (tabName === 'products') {
        refreshProductsDisplay();
    }
}

// Cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('drapedrop_cart') || '[]');
        cart.push(product);
        localStorage.setItem('drapedrop_cart', JSON.stringify(cart));

        // Update cart count in the UI
        updateCartCountDisplay();

        showNotification('Product added to cart!');
    }
}

// Function to update cart count display
function updateCartCountDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('drapedrop_cart') || '[]');
        cartCountElement.textContent = cart.length;
    }
}



// Admin functions
function addNewProduct(e) {
    e.preventDefault();

    const sellingPriceVal = document.getElementById('currentPrice').value;
    const parsedSellingPrice = sellingPriceVal === '' ? null : parseFloat(sellingPriceVal);
    const rentBase = parsedSellingPrice != null ? parsedSellingPrice : parseFloat(document.getElementById('originalPrice').value || '0');

    // Build images object and decide primary image
    const images = { ...newProductImages };
    const primaryImage = images.front || images.full || images.side || images.back || images.other || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop';

    const newProduct = {
        id: products.length + 1,
        name: document.getElementById('productName').value,
        brand: document.getElementById('productBrand').value,
        color: document.getElementById('productColor').value,
        size: document.getElementById('productSize').value,
        condition: document.getElementById('productCondition').value,
        type: document.getElementById('productType').value,
        originalPrice: parseFloat(document.getElementById('originalPrice').value),
        currentPrice: parsedSellingPrice,
        rentPrice: Math.round((rentBase || 0) * 0.1),
        description: document.getElementById('productDescription').value,
        image: primaryImage,
        images,
        status: 'approved',
        addedDate: new Date().toISOString()
    };

    products.push(newProduct);
    saveProducts(); // Save to localStorage

    // Show success notification with product details
    showNotification(`Product "${newProduct.name}" added successfully! It's now available for users.`);

    // Clear the form
    document.getElementById('addProductForm').reset();
    resetImageSlots();

    // Switch to products tab to show the new product
    showTab('products');

    // Highlight the newly added product
    setTimeout(() => {
        highlightNewProduct(newProduct.id);
    }, 500);
}

// -------- Multi-image uploader helpers --------
function setupImageSlots() {
    // expose functions to inline handlers
    window.onSlotInputChange = onSlotInputChange;
    window.triggerEditSlot = triggerEditSlot;
    window.clearSlot = clearSlot;
    window.selectSlotForView = selectSlotForView;
    window.editSelectedSlot = editSelectedSlot;
    window.deleteSelectedSlot = deleteSelectedSlot;

    // Initial render for all slots and counter
    ['front', 'back', 'side', 'full', 'other'].forEach(renderSlot);
    updateImageCounter();
    renderViewPanel();
}

function onSlotInputChange(event, slotKey) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        newProductImages[slotKey] = e.target.result;
        renderSlot(slotKey);
        updateImageCounter();
        selectSlotForView(slotKey);
    };
    reader.readAsDataURL(file);
}

function triggerEditSlot(slotKey, evt) {
    if (evt) evt.stopPropagation();
    const input = document.getElementById(`slot-input-${slotKey}`);
    if (input) input.click();
}

function clearSlot(slotKey, evt) {
    if (evt) evt.stopPropagation();
    newProductImages[slotKey] = null;
    const input = document.getElementById(`slot-input-${slotKey}`);
    if (input) input.value = '';
    renderSlot(slotKey);
    updateImageCounter();
    if (selectedImageSlot === slotKey) {
        // pick another image if available
        const next = ['front', 'full', 'side', 'back', 'other'].find(k => newProductImages[k]);
        selectedImageSlot = next || null;
        renderViewPanel();
    }
}

function selectSlotForView(slotKey) {
    selectedImageSlot = slotKey;
    renderViewPanel();
}

function editSelectedSlot() {
    if (selectedImageSlot) triggerEditSlot(selectedImageSlot);
}

function deleteSelectedSlot() {
    if (selectedImageSlot) clearSlot(selectedImageSlot);
}

function updateImageCounter() {
    const count = Object.values(newProductImages).filter(Boolean).length;
    const el = document.getElementById('imageCounter');
    if (el) el.textContent = `(${count}/5)`;
}

function renderSlot(slotKey) {
    const container = document.getElementById(`slot-content-${slotKey}`);
    const actions = document.getElementById(`slot-actions-${slotKey}`);
    const imgSrc = newProductImages[slotKey];
    if (container) {
        if (imgSrc) {
            container.innerHTML = `<img src="${imgSrc}" alt="${slotKey}">`;
            if (actions) actions.style.display = 'flex';
        } else {
            const pretty = slotKey === 'front' ? 'Front View' : slotKey === 'back' ? 'Back View' : slotKey === 'side' ? 'Side View' : slotKey === 'full' ? 'Full View' : 'Other';
            container.innerHTML = `<i class=\"fas fa-plus\"></i><span class=\"slot-label\">${pretty}</span>`;
            if (actions) actions.style.display = 'none';
        }
    }
}

function renderViewPanel() {
    const view = document.getElementById('selectedImageView');
    const actions = document.getElementById('viewActions');
    if (!view) return;
    const imgSrc = selectedImageSlot ? newProductImages[selectedImageSlot] : null;
    if (imgSrc) {
        view.innerHTML = `<img src="${imgSrc}" alt="selected">`;
        if (actions) actions.style.display = 'flex';
    } else {
        view.textContent = 'Photo';
        if (actions) actions.style.display = 'none';
    }
}

function resetImageSlots() {
    newProductImages = { front: null, back: null, side: null, full: null, other: null };
    selectedImageSlot = null;
    setupImageSlots();
}

// Handle buy request approvals on seller side so approved request moves product to Approved
function approveBuyRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('drapedrop_buyRequests') || '[]');
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx !== -1) {
        // Update request status
        requests[idx].status = 'approved';
        requests[idx].decisionAt = new Date().toISOString();
        localStorage.setItem('drapedrop_buyRequests', JSON.stringify(requests));

        // Promote related product to approved list
        let products = JSON.parse(localStorage.getItem('drapedrop_products') || '[]');
        const productId = requests[idx].productId;
        const pIdx = products.findIndex(p => p.id === productId);
        if (pIdx !== -1) {
            products[pIdx].status = 'approved';
            if (!products[pIdx].addedDate) {
                products[pIdx].addedDate = new Date().toISOString();
            }
        } else {
            const rp = requests[idx].product || {};
            products.push({
                id: rp.id || productId,
                name: rp.name || 'Product',
                brand: rp.brand || '',
                color: rp.color || '',
                size: rp.size || '',
                condition: rp.condition || 'Good',
                originalPrice: rp.originalPrice || rp.currentPrice || 0,
                currentPrice: rp.currentPrice || 0,
                rentPrice: rp.rentPrice || 0,
                type: rp.type || 'sale',
                description: rp.description || '',
                image: rp.image || '',
                status: 'approved',
                addedDate: new Date().toISOString()
            });
        }
        localStorage.setItem('drapedrop_products', JSON.stringify(products));

        showNotification('Request approved. Product moved to Approved.');
        showAdminDashboard();
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // In a real app, this would open an edit form
        alert(`Edit functionality for ${product.name} would be implemented here.`);
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts(); // Save to localStorage
        showNotification('Product deleted successfully!');
        showAdminDashboard();
    }
}

function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px; margin-top: 10px;">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Refresh products display in admin dashboard
function refreshProductsDisplay() {
    const productsTab = document.getElementById('products-tab');
    if (productsTab) {
        const productsGrid = productsTab.querySelector('.products-grid');
        if (productsGrid) {
            productsGrid.innerHTML = products.map(product => `
                <div class="product-card" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-details">
                            Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}<br>
                            Condition: ${product.condition}<br>
                            Type: ${product.type.charAt(0).toUpperCase() + product.type.slice(1)}
                        </p>
                        <div class="product-price">
                            ${product.type === 'sale' ?
                    `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` :
                    `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
                }
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-primary btn-small" onclick="editProduct(${product.id})">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                            <button class="btn btn-secondary btn-small" onclick="deleteProduct(${product.id})">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Highlight newly added product
function highlightNewProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        productCard.style.animation = 'highlightProduct 2s ease-in-out';
        productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Utility functions
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function logout() {
    currentUser = null;
    currentUserType = null;
    cart = [];
    // Clear user data from localStorage
    localStorage.removeItem('drapedrop_currentUser');
    localStorage.removeItem('drapedrop_cart');
    // Redirect to homepage
    window.location.href = 'index.html';
}

// Close modal when clicking outside
window.onclick = function (event) {
    const loginModal = document.getElementById('loginModal');
    const productModal = document.querySelector('.product-details-modal');

    if (event.target === loginModal) {
        closeModal();
    }

    if (event.target === productModal) {
        closeProductModal();
    }
}

// Check for logged in user when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Only check for logged in user if we're on the main page and not trying to access auth
    // Temporarily disabled to prevent conflicts with login navigation
    // if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    //     checkLoggedInUser();
    // }
    // Only update cart count if we're not on the homepage (to prevent conflicts)
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        updateCartCountDisplay();
    }
});

// Add CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes highlightProduct {
        0% { 
            transform: scale(1);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        50% { 
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
            border: 2px solid #667eea;
        }
        100% { 
            transform: scale(1);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
    }
    
    .cart-items {
        max-height: 400px;
        overflow-y: auto;
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 15px;
        border-bottom: 1px solid #eee;
    }
    
    .cart-total {
        margin-top: 20px;
        text-align: right;
        padding-top: 20px;
        border-top: 2px solid #eee;
    }
    
    textarea {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        resize: vertical;
    }
    
    select {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #e1e5e9;
        border-radius: 8px;
        font-size: 1rem;
        background: white;
    }
    
    /* Product Details Modal Styles */
    .product-details-modal .modal-content {
        max-width: 900px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        padding: 0;
    }
    
    .product-details-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
        min-height: 500px;
    }
    
    .product-image-section {
        background: #f8f9fa;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px;
    }
    
    .product-detail-image {
        max-width: 100%;
        max-height: 400px;
        object-fit: cover;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .product-info-section {
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .product-detail-title {
        font-size: 2rem;
        color: #333;
        margin-bottom: 20px;
        border-bottom: 2px solid #667eea;
        padding-bottom: 10px;
    }
    
    .product-detail-grid {
        display: grid;
        gap: 15px;
    }
    
    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }
    
    .detail-label {
        font-weight: 600;
        color: #666;
        min-width: 120px;
    }
    
    .detail-value {
        color: #333;
        font-weight: 500;
    }
    
    .price-highlight {
        color: #667eea;
        font-weight: 700;
        font-size: 1.1rem;
    }
    
    .product-description {
        margin-top: 20px;
    }
    
    .product-description h3 {
        color: #333;
        margin-bottom: 10px;
        font-size: 1.2rem;
    }
    
    .product-description p {
        color: #666;
        line-height: 1.6;
        font-size: 1rem;
    }
    
    .product-actions-detail {
        display: flex;
        gap: 15px;
        margin-top: auto;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    
    /* Responsive design for product details modal */
    @media (max-width: 768px) {
        .product-details-container {
            grid-template-columns: 1fr;
        }
        
        .product-image-section {
            padding: 20px;
        }
        
        .product-info-section {
            padding: 20px;
        }
        
        .product-detail-title {
            font-size: 1.5rem;
        }
        
        .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
        }
        
        .product-actions-detail {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// Utility function to clear all data (for testing)
function clearAllData() {
    localStorage.removeItem('drapedrop_products');
    alert('All data cleared! Refresh the page to see default products.');
}