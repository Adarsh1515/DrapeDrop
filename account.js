(function initAccountPage() {
	const userJson = localStorage.getItem('drapedrop_currentUser');
	if (!userJson) {
		window.location.href = 'login.html';
		return;
	}
	const user = JSON.parse(userJson);

	const userNameEl = document.getElementById('userName');
	const userEmailEl = document.getElementById('userEmail');
	if (userNameEl) {
		const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
		userNameEl.textContent = fullName || 'My Account';
	}
	if (userEmailEl) {
		userEmailEl.textContent = user.email || '';
	}

	const backBtn = document.getElementById('backBtn');
	if (backBtn) {
		backBtn.addEventListener('click', function () {
			// Go back to the appropriate dashboard depending on type
			const type = user.type;
			if (type === 'admin') {
				window.location.href = 'login.html';
			} else {
				window.location.href = 'login.html';
			}
		});
	}

	const logoutBtn = document.getElementById('logoutBtn');
	if (logoutBtn) {
		logoutBtn.addEventListener('click', function () {
			localStorage.removeItem('drapedrop_currentUser');
			localStorage.removeItem('drapedrop_cart');
			window.location.href = 'index.html';
		});
	}

	// Quick actions routing
	const requestsAction = document.getElementById('requestsAction');
	if (requestsAction) {
		requestsAction.addEventListener('click', function () {
			window.location.href = 'requests.html';
		});
	}

	const ordersAction = document.getElementById('ordersAction');
	if (ordersAction) {
		ordersAction.addEventListener('click', function () {
			window.location.href = 'my_orders.html';
		});
	}

	const wishlistAction = document.getElementById('wishlistAction');
	if (wishlistAction) {
		wishlistAction.addEventListener('click', function () {
			window.location.href = 'wishlist.html';
		});
	}

	const helpAction = document.getElementById('helpAction');
	if (helpAction) {
		helpAction.addEventListener('click', function () {
			window.location.href = 'help_center.html';
		});
	}

	const editProfileBtn = document.getElementById('editProfileBtn');
	if (editProfileBtn) {
		editProfileBtn.addEventListener('click', function () {
			window.location.href = 'edit_profile.html';
		});
	}

	const manageAddressesBtn = document.getElementById('manageAddressesBtn');
	if (manageAddressesBtn) {
		manageAddressesBtn.addEventListener('click', function () {
			window.location.href = 'manage_addresses.html';
		});
	}

	const savedCardsBtn = document.getElementById('savedCardsBtn');
	if (savedCardsBtn) {
		savedCardsBtn.addEventListener('click', function () {
			window.location.href = 'saved_cards.html';
		});
	}
})();
