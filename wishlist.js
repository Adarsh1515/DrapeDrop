(function initWishlistPage() {
    const userJson = localStorage.getItem('drapedrop_currentUser');
    if (!userJson) {
        window.location.href = 'login.html';
        return;
    }
    const user = JSON.parse(userJson);

    const sidebarUserName = document.getElementById('sidebarUserName');
    if (sidebarUserName) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
        sidebarUserName.textContent = `Hello, ${fullName || 'User'}`;
    }

    // Load Wishlist Items
    const wishlistContainer = document.querySelector('.wishlist-content');
    const emptyStateHTML = `
        <div class="wishlist-empty-state">
            <div class="wishlist-icon-box">
                <i class="far fa-heart"></i>
            </div>
            <h3>Empty Wishlist</h3>
            <p>You have no items in your wishlist. Start Adding.</p>
        </div>
    `;

    function renderWishlist() {
        const wishlist = JSON.parse(localStorage.getItem('drapedrop_wishlist') || '[]');

        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = emptyStateHTML;
            return;
        }

        let html = '<div class="wishlist-list">';
        wishlist.forEach(product => {
            html += `
                <div class="wishlist-card-horizontal">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                         <p class="product-details">
                            Size: ${product.size} | Condition: ${product.condition}
                        </p>
                        <div class="product-price">
                            ${product.type === 'sale' ?
                    `₹${product.currentPrice.toLocaleString('en-IN')}` :
                    `₹${product.rentPrice.toLocaleString('en-IN')}/day`
                }
                        </div>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-small" onclick="window.location.href='product-details.html?id=${product.id}'">
                            View
                        </button>
                        <button class="btn btn-danger btn-small" onclick="removeFromWishlist(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        wishlistContainer.innerHTML = html;
    }

    renderWishlist();

    // Make remove function global
    window.removeFromWishlist = function (id) {
        let wishlist = JSON.parse(localStorage.getItem('drapedrop_wishlist') || '[]');
        const newWishlist = wishlist.filter(item => item.id !== id);
        localStorage.setItem('drapedrop_wishlist', JSON.stringify(newWishlist));
        renderWishlist();
    };

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            localStorage.removeItem('drapedrop_currentUser');
            localStorage.removeItem('drapedrop_cart');
            window.location.href = 'index.html';
        });
    }
})();
