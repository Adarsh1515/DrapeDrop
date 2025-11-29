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
})();

