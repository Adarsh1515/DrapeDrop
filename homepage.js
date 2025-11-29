// Minimal homepage script - only handles basic functionality
// No automatic user checking to prevent conflicts

// Account management function
function openAccount() {
    // Navigate to the dedicated account page
    window.location.href = 'account.html';
}

// Expose functions to window object
window.rentNowDirect = rentNowDirect;
window.requestToBuy = requestToBuy;
window.proceedToRent = proceedToRent;
window.closeSlidingWindow = closeSlidingWindow;
window.openAccount = openAccount;

// State for multi-image uploader on Add Product
let newProductImages = { front: null, back: null, side: null, full: null, other: null };
let selectedImageSlot = null;

// Check if user is already logged in when page loads
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('drapedrop_currentUser');
    if (savedUser) {
        const currentUser = JSON.parse(savedUser);
        const currentUserType = currentUser.type;
        
        // Show appropriate dashboard
        if (currentUserType === 'user') {
            showUserDashboard();
        } else if (currentUserType === 'admin') {
            showAdminDashboard();
        }
    }
    
    // Clean up old cart data (convert IDs to full product objects)
    cleanupOldCartData();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
`;
document.head.appendChild(style);

// User Dashboard
function showUserDashboard() {
    // Load products from localStorage
    let products = [];
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
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
                rentPrice: 1199,
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
    }
    
    const currentUser = JSON.parse(localStorage.getItem('drapedrop_currentUser'));
    
    // Only show approved products or items without a status (backward compatibility)
    const visibleProducts = products.filter(p => !p.status || p.status === 'approved');

    document.body.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1><i class="fas fa-tshirt"></i> DrapeDrop - User Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, ${currentUser.firstName}!</span>
                    <button class="account-btn" onclick="openAccount()">
                        <i class="fas fa-user"></i>
                        Account
                    </button>
                    <div class="cart-icon" onclick="openCart()">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="cart-count">0</span>
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
                                <button class="btn btn-warning btn-small" onclick="rentNowDirect(${product.id})">
                                    <i class="fas fa-calendar-alt"></i>
                                    Rent Now
                                </button>
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
    // Load products from localStorage
    let products = [];
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products
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
                description: "Beautiful black evening dress perfect for special occasions. Worn only twice, excellent condition.",
                status: "approved",
                addedDate: new Date().toISOString()
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
                rentPrice: 1199,
                type: "rent",
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                description: "Light and comfortable summer dress with floral pattern. Perfect for outdoor events.",
                status: "approved",
                addedDate: new Date().toISOString()
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
                description: "Stunning red cocktail dress for parties and events. Great condition with minor wear.",
                status: "approved",
                addedDate: new Date().toISOString()
            }
        ];
    }
    // Load buy requests for display in Pending section
    const buyRequests = JSON.parse(localStorage.getItem('drapedrop_buyRequests') || '[]');
    const pendingBuyRequests = buyRequests.filter(r => r.status === 'pending');

    const currentUser = JSON.parse(localStorage.getItem('drapedrop_currentUser'));
    
    document.body.innerHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1><i class="fas fa-user-shield"></i> DrapeDrop - Seller Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, ${currentUser.firstName}!</span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
            
            <div class="admin-tabs"><!-- Keeping class name to avoid breaking CSS -->
                <button class="tab-btn active" onclick="showTab('products')">Manage Products</button>
                <button class="tab-btn" onclick="showTab('pending')">Pending Approval</button>
                <button class="tab-btn" onclick="showTab('add')">Add New Product</button>
            </div>
            
            <div id="productsTab" class="tab-content active">
                <div class="section-header">
                    <h3><i class="fas fa-tshirt"></i> Approved Products</h3>
                    <span class="product-count">${products.filter(p => p.status === 'approved').length} products</span>
                </div>
                <div class="products-grid">
                    ${products.filter(product => product.status === 'approved').map(product => `
                        <div class="product-card">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p>Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}</p>
                                <p>Condition: ${product.condition}</p>
                                <p>Original Price: ₹${product.originalPrice.toLocaleString('en-IN')}</p>
                                <p>${product.type === 'sale' ? 
                                    `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` : 
                                    `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
                                }</p>
                                <p class="product-date">Added: ${new Date(product.addedDate).toLocaleDateString()}</p>
                                <div class="product-actions">
                                    <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="pendingTab" class="tab-content">
                <div class="section-header">
                    <h3><i class="fas fa-clock"></i> Pending Approval</h3>
                    <span class="product-count">${products.filter(p => p.status === 'pending').length} products</span>
                </div>
                <div class="products-grid">
                    ${products.filter(product => product.status === 'pending').map(product => `
                        <div class="product-card pending-card">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="product-info">
                                <h3>${product.name}</h3>
                                <p>Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}</p>
                                <p>Condition: ${product.condition}</p>
                                <p>Original Price: ₹${product.originalPrice.toLocaleString('en-IN')}</p>
                                <p>${product.type === 'sale' ? 
                                    `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` : 
                                    `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
                                }</p>
                                <p class="product-date">Added: ${new Date(product.addedDate).toLocaleDateString()}</p>
                                <div class="product-actions">
                                    <button class="btn btn-success" onclick="approveProduct(${product.id})">Approve</button>
                                    <button class="btn btn-warning" onclick="rejectProduct(${product.id})">Reject</button>
                                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="section-header" style="margin-top: 16px;">
                    <h3><i class="fas fa-hand-holding-dollar"></i> Pending Buy Requests</h3>
                    <span class="product-count">${pendingBuyRequests.length} requests</span>
                </div>
                <div class="requests-list">
                    ${pendingBuyRequests.length === 0 ? `
                        <div class="empty-state"><i class=\"fas fa-box-open\"></i><p>No pending requests.</p></div>
                    ` : pendingBuyRequests.map(req => `
                        <div class="request-item">
                            <img src="${req.product.image}" alt="${req.product.name}">
                            <div class="request-info">
                                <h4>${req.product.name}</h4>
                                <p>${req.product.brand} • ${req.product.color} • ${req.product.size}</p>
                                <p class="request-meta">Requested by ${req.userName || req.userEmail} on ${new Date(req.createdAt).toLocaleString()}</p>
                            </div>
                            <div class="request-right">
                                <span class="price">₹${req.product.type === 'sale' ? req.product.currentPrice.toLocaleString('en-IN') : (req.product.rentPrice.toLocaleString('en-IN') + '/day')}</span>
                                <div class="product-actions">
                                    <button class="btn btn-success" onclick="approveBuyRequest(${req.id})">Approve</button>
                                    <button class="btn btn-warning" onclick="rejectBuyRequest(${req.id})">Reject</button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="addTab" class="tab-content">
                <div class="add-product-form">
                    <h3><i class="fas fa-plus-circle"></i> Add New Product</h3>
                    <form onsubmit="addNewProduct(event)">
                        <div class="form-group">
                            <label for="productName">Product Name</label>
                            <input type="text" id="productName" placeholder="Enter product name" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="brand">Brand</label>
                                <input type="text" id="brand" placeholder="Enter brand name" required>
                            </div>
                            <div class="form-group">
                                <label for="color">Color</label>
                                <input type="text" id="color" placeholder="Enter color" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="size">Size</label>
                                <select id="size" required>
                                    <option value="">Select Size</option>
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="condition">Condition</label>
                                <select id="condition" required>
                                    <option value="">Select Condition</option>
                                    <option value="Excellent">Excellent</option>
                                    <option value="Very Good">Very Good</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="originalPrice">Original Price (₹)</label>
                                <input type="number" id="originalPrice" placeholder="Enter original price" required>
                            </div>
                            <div class="form-group">
                                <label for="currentPrice">Selling Price (₹) (optional)</label>
                                <input type="number" id="currentPrice" placeholder="Enter selling price (optional)">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="rentPrice">Rent Price (₹/day)</label>
                                <input type="number" id="rentPrice" placeholder="Enter rent price per day" required>
                            </div>
                            <div class="form-group">
                                <label for="productType">Product Type</label>
                                <select id="productType" required>
                                    <option value="rent" selected>For Rent</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea id="description" placeholder="Enter product description" required></textarea>
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
        </div>
        
        <!-- Confirmation Modal -->
        <div id="confirmationModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Product Added Successfully!</h3>
                    <span class="close" onclick="closeConfirmationModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="confirmation-details">
                        <img id="confirmationImage" src="" alt="Product Image" class="confirmation-image">
                        <div class="confirmation-info">
                            <h4 id="confirmationName"></h4>
                            <p id="confirmationDetails"></p>
                            <p id="confirmationPrice"></p>
                            <p id="confirmationStatus"></p>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="closeConfirmationModal()">Continue</button>
                    <button class="btn btn-secondary" onclick="viewPendingProducts()">View Pending Products</button>
                </div>
            </div>
        </div>
    `;
    // After rendering, initialize image slot interactions
    setupImageSlots();
}

// Basic functions
function logout() {
    localStorage.removeItem('drapedrop_currentUser');
    localStorage.removeItem('drapedrop_cart');
    window.location.href = 'index.html';
}

function showTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const targetTab = document.getElementById(tabName + 'Tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update button styling
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // If switching to products tab, just switch without refreshing
    if (tabName === 'products') {
        console.log('Switching to products tab');
    }
}

function addNewProduct(e) {
    e.preventDefault();
    const sellingPriceInput = document.getElementById('currentPrice').value;
    const parsedSellingPrice = sellingPriceInput === '' ? null : parseInt(sellingPriceInput);

    // Ensure at least one image is selected
    const count = Object.values(newProductImages).filter(Boolean).length;
    if (count === 0) {
        showNotification('Please upload at least one product image.');
        return;
    }
    
    const images = { ...newProductImages };
    const primaryImage = images.front || images.full || images.side || images.back || images.other;

        const newProduct = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            brand: document.getElementById('brand').value,
            color: document.getElementById('color').value,
            size: document.getElementById('size').value,
            condition: document.getElementById('condition').value,
            originalPrice: parseInt(document.getElementById('originalPrice').value),
            currentPrice: parsedSellingPrice,
            rentPrice: parseInt(document.getElementById('rentPrice').value),
            type: document.getElementById('productType').value,
            description: document.getElementById('description').value,
        image: primaryImage,
        images,
        status: "approved",
            addedDate: new Date().toISOString()
        };
        
        // Load existing products
        let products = [];
        const savedProducts = localStorage.getItem('drapedrop_products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        }
        products.push(newProduct);
        localStorage.setItem('drapedrop_products', JSON.stringify(products));
        
        showConfirmationModal(newProduct);
        
    // Clear form and reset image slots
        e.target.reset();
    resetImageSlots();
}

function editProduct(productId) {
    alert('Edit functionality will be implemented here');
}

function showConfirmationModal(product) {
    const modal = document.getElementById('confirmationModal');
    const image = document.getElementById('confirmationImage');
    const name = document.getElementById('confirmationName');
    const details = document.getElementById('confirmationDetails');
    const price = document.getElementById('confirmationPrice');
    const status = document.getElementById('confirmationStatus');
    
    image.src = product.image;
    name.textContent = product.name;
    details.textContent = `${product.brand} | ${product.color} | Size: ${product.size} | Condition: ${product.condition}`;
    price.textContent = product.type === 'sale' ? 
        `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` : 
        `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`;
    status.textContent = `Status: ${product.status === 'pending' ? 'Pending Approval' : 'Approved'}`;
    
    modal.style.display = 'block';
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}

function viewPendingProducts() {
    closeConfirmationModal();
    showTab('pending');
}

function approveProduct(productId) {
    if (confirm('Are you sure you want to approve this product?')) {
        let products = JSON.parse(localStorage.getItem('drapedrop_products'));
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex].status = 'approved';
            localStorage.setItem('drapedrop_products', JSON.stringify(products));
            showNotification('Product approved successfully!');
            showAdminDashboard(); // Refresh the dashboard
        }
    }
}

function rejectProduct(productId) {
    if (confirm('Are you sure you want to reject this product?')) {
        let products = JSON.parse(localStorage.getItem('drapedrop_products'));
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex].status = 'rejected';
            localStorage.setItem('drapedrop_products', JSON.stringify(products));
            showNotification('Product rejected successfully!');
            showAdminDashboard(); // Refresh the dashboard
        }
    }
}

// Handle buy request approvals on seller side
function approveBuyRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('drapedrop_buyRequests') || '[]');
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx !== -1) {
        // Update request status
        requests[idx].status = 'approved';
        requests[idx].decisionAt = new Date().toISOString();
        localStorage.setItem('drapedrop_buyRequests', JSON.stringify(requests));

        // Ensure the related product is marked as approved and shows under Manage Products
        let products = JSON.parse(localStorage.getItem('drapedrop_products') || '[]');
        const productId = requests[idx].productId;
        const pIdx = products.findIndex(p => p.id === productId);
        if (pIdx !== -1) {
            products[pIdx].status = 'approved';
            if (!products[pIdx].addedDate) {
                products[pIdx].addedDate = new Date().toISOString();
            }
        } else {
            // Fallback: add product from request payload if missing
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

function rejectBuyRequest(requestId) {
    const requests = JSON.parse(localStorage.getItem('drapedrop_buyRequests') || '[]');
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx !== -1) {
        requests[idx].status = 'rejected';
        requests[idx].decisionAt = new Date().toISOString();
        localStorage.setItem('drapedrop_buyRequests', JSON.stringify(requests));
        showNotification('Request rejected.');
        showAdminDashboard();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Find the product card element
        const productCard = document.querySelector(`[onclick="deleteProduct(${productId})"]`).closest('.product-card');
        
        if (productCard) {
            // Animate the deletion
            productCard.classList.add('deleting');
            
            setTimeout(() => {
                productCard.remove();
                showNotification('Product deleted successfully!');
            }, 300);
        }
        
        // Update localStorage
        let products = [];
        const savedProducts = localStorage.getItem('drapedrop_products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        }
        
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('drapedrop_products', JSON.stringify(products));
    }
}

function openCart() {
    window.location.href = 'cart.html';
}

function openProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

function addToCart(productId) {
    // Load cart from localStorage
    let cart = [];
    const savedCart = localStorage.getItem('drapedrop_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    // Find the product details
    let products = [];
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Default products if none saved
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
                rentPrice: 1199,
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
    }
    
    // Find the product by ID
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Add complete product details to cart
        cart.push(product);
        localStorage.setItem('drapedrop_cart', JSON.stringify(cart));
        
        // Update cart count display
        updateCartCountDisplay();
        
        // Show success notification
        showNotification('Product added to cart successfully!');
    } else {
        showNotification('Product not found!');
    }
}

function updateCartCountDisplay() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        const cart = JSON.parse(localStorage.getItem('drapedrop_cart') || '[]');
        cartCountElement.textContent = cart.length;
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function buyNowDirect(productId) {
    window.location.href = `checkout.html?id=${productId}&action=buy`;
}

function rentNowDirect(productId) {
    // Load product to show selling price
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
                rentPrice: 1199,
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
    const priceText = product && typeof product.currentPrice === 'number'
        ? `₹${product.currentPrice.toLocaleString('en-IN')}`
        : 'Currently unavailable';

    // Create sliding window
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

	// Load products with fallback to defaults if not present in localStorage
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
				rentPrice: 1199,
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

function cleanupOldCartData() {
    const cart = JSON.parse(localStorage.getItem('drapedrop_cart') || '[]');
    
    // Check if cart contains only IDs (old format)
    if (cart.length > 0 && typeof cart[0] === 'number') {
        // Load products
        let products = [];
        const savedProducts = localStorage.getItem('drapedrop_products');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
        } else {
            // Default products
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
                    rentPrice: 1199,
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
        }
        
        // Convert IDs to full product objects
        const newCart = cart.map(id => {
            const product = products.find(p => p.id === id);
            return product || null;
        }).filter(item => item !== null);
        
        // Save updated cart
        localStorage.setItem('drapedrop_cart', JSON.stringify(newCart));
    }
}

// Image upload functions
function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; object-fit: cover; border-radius: 8px;">
                <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">Image selected: ${file.name}</p>
            `;
        };
        reader.readAsDataURL(file);
    }
}

function resetImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = `
        <i class="fas fa-cloud-upload-alt"></i>
        <p>Click to upload image or drag & drop</p>
    `;
}

// Add product to display with animation
function addProductToDisplay(product) {
    console.log('Adding product to display:', product);
    
    // Try to find the products grid
    let productsGrid = document.querySelector('.products-grid');
    
    // If not found, try to find it in the active tab
    if (!productsGrid) {
        console.log('Products grid not found, looking in active tab...');
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            productsGrid = activeTab.querySelector('.products-grid');
        }
    }
    
    // If still not found, try to find it in the products tab specifically
    if (!productsGrid) {
        console.log('Products grid still not found, looking in products tab...');
        const productsTab = document.getElementById('productsTab');
        if (productsTab) {
            productsGrid = productsTab.querySelector('.products-grid');
        }
    }
    
    // If still not found, refresh the products display
    if (!productsGrid) {
        console.log('Products grid not found, refreshing display...');
        refreshProductsDisplay();
        productsGrid = document.querySelector('.products-grid');
    }
    
    if (!productsGrid) {
        console.error('Could not find products grid anywhere');
        showNotification('Error: Could not display new product');
        return;
    }
    
    // Create new product card element
    const productCard = document.createElement('div');
    productCard.className = 'product-card new-product';
    
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}</p>
            <p>Condition: ${product.condition}</p>
            <p>Original Price: ₹${product.originalPrice.toLocaleString('en-IN')}</p>
            <p>${product.type === 'sale' ? 
                `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` : 
                `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
            }</p>
            <div class="product-actions">
                <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `;
    
    // Add to the beginning of the grid for better visual effect
    productsGrid.insertBefore(productCard, productsGrid.firstChild);
    
    console.log('Product added to display successfully');
    
    // Add success highlight animation
    setTimeout(() => {
        productCard.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
        setTimeout(() => {
            productCard.style.boxShadow = '';
        }, 2000);
    }, 600);
}

// Refresh products display
function refreshProductsDisplay() {
    console.log('Starting refreshProductsDisplay...');
    
    // Load products from localStorage
    let products = [];
    const savedProducts = localStorage.getItem('drapedrop_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
    
    console.log('Loaded products:', products.length);
    
    // Try to find the products grid
    let productsGrid = document.querySelector('.products-grid');
    
    // If not found, try to find it in the active tab
    if (!productsGrid) {
        console.log('Products grid not found, looking in active tab...');
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            productsGrid = activeTab.querySelector('.products-grid');
        }
    }
    
    // If still not found, try to find it in the products tab specifically
    if (!productsGrid) {
        console.log('Products grid still not found, looking in products tab...');
        const productsTab = document.getElementById('productsTab');
        if (productsTab) {
            productsGrid = productsTab.querySelector('.products-grid');
        }
    }
    
    if (!productsGrid) {
        console.error('Could not find products grid anywhere');
        showNotification('Error: Could not refresh products display');
        return;
    }
    
    console.log('Found products grid, updating content...');
    
    // Update the products grid content (newest first)
    productsGrid.innerHTML = products.reverse().map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}</p>
                <p>Condition: ${product.condition}</p>
                <p>Original Price: ₹${product.originalPrice.toLocaleString('en-IN')}</p>
                <p>${product.type === 'sale' ? 
                    `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` : 
                    `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
                }</p>
                <div class="product-actions">
                    <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('Products grid updated with', products.length, 'products');
    
    // Add animation to the first product (newest) if there are products
    const firstProduct = productsGrid.querySelector('.product-card');
    if (firstProduct) {
        console.log('Adding animation to first product');
        firstProduct.classList.add('new-product');
        setTimeout(() => {
            firstProduct.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
            setTimeout(() => {
                firstProduct.style.boxShadow = '';
            }, 2000);
        }, 100);
    }
    
    console.log('RefreshProductsDisplay completed');
}

// Add product to display instantly (real-time) - like before
function addProductToDisplayInstantly(product) {
    console.log('Adding product instantly:', product);
    
    // Find the products grid immediately
    let productsGrid = document.querySelector('.products-grid');
    
    // If not found, look in active tab
    if (!productsGrid) {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            productsGrid = activeTab.querySelector('.products-grid');
        }
    }
    
    // If still not found, look in products tab
    if (!productsGrid) {
        const productsTab = document.getElementById('productsTab');
        if (productsTab) {
            productsGrid = productsTab.querySelector('.products-grid');
        }
    }
    
    if (!productsGrid) {
        console.error('Could not find products grid for instant display');
        return;
    }
    
    // Create new product card element
    const productCard = document.createElement('div');
    productCard.className = 'product-card new-product';
    
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>Brand: ${product.brand} | Color: ${product.color} | Size: ${product.size}</p>
            <p>Condition: ${product.condition}</p>
            <p>Original Price: ₹${product.originalPrice.toLocaleString('en-IN')}</p>
            <p>${product.type === 'sale' ? 
                `Sale Price: ₹${product.currentPrice.toLocaleString('en-IN')}` : 
                `Rent Price: ₹${product.rentPrice.toLocaleString('en-IN')}/day`
            }</p>
            <div class="product-actions">
                <button class="btn btn-secondary" onclick="editProduct(${product.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
        </div>
    `;
    
    // Add to the beginning of the grid instantly
    productsGrid.insertBefore(productCard, productsGrid.firstChild);
    
    console.log('Product added instantly to display');
    
    // Add the 2-second glow animation (like before)
    productCard.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
    setTimeout(() => {
        productCard.style.boxShadow = '';
    }, 2000);
}

// -------- Multi-image uploader helpers (same API as in script.js) --------
function setupImageSlots() {
    window.onSlotInputChange = onSlotInputChange;
    window.triggerEditSlot = triggerEditSlot;
    window.clearSlot = clearSlot;
    window.selectSlotForView = selectSlotForView;
    window.editSelectedSlot = editSelectedSlot;
    window.deleteSelectedSlot = deleteSelectedSlot;

    ['front','back','side','full','other'].forEach(renderSlot);
    updateImageCounter();
    renderViewPanel();
}

function onSlotInputChange(event, slotKey) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
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
        const next = ['front','full','side','back','other'].find(k => newProductImages[k]);
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