(function initRequestsPage() {
	const back = document.getElementById('backFromRequests');
	if (back) {
		back.addEventListener('click', function () {
			window.location.href = 'account.html';
		});
	}

	const requests = JSON.parse(localStorage.getItem('drapedrop_buyRequests') || '[]');
	const currentUser = JSON.parse(localStorage.getItem('drapedrop_currentUser') || 'null');

	const userEmail = currentUser ? currentUser.email : null;
	const filtered = userEmail ? requests.filter(r => r.userEmail === userEmail) : [];

	function renderList(containerId, list) {
		const container = document.getElementById(containerId);
		if (!container) return;
		if (!list || list.length === 0) {
			container.innerHTML = '<div class="empty-state"><i class="fas fa-box-open"></i><p>No items here yet.</p></div>';
			return;
		}
		container.innerHTML = list.map(item => {
			const price = item.product.type === 'sale' ? item.product.currentPrice : item.product.rentPrice + '/day';
			return `
				<div class="request-item">
					<img src="${item.product.image}" alt="${item.product.name}">
					<div class="request-info">
						<h4>${item.product.name}</h4>
						<p>${item.product.brand} • ${item.product.color} • ${item.product.size}</p>
						<p class="request-meta">Requested on ${new Date(item.createdAt).toLocaleString()}</p>
					</div>
					<div class="request-right">
						<span class="price">₹${price}</span>
						<span class="status-badge ${item.status}">${item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
					</div>
				</div>
			`;
		}).join('');
	}

	const pending = filtered.filter(r => r.status === 'pending');
	const approved = filtered.filter(r => r.status === 'approved');
	const rejected = filtered.filter(r => r.status === 'rejected');

	renderList('pendingTab', pending);
	renderList('approvedTab', approved);
	renderList('rejectedTab', rejected);

	// Tabs
	document.querySelectorAll('.tab-btn').forEach(btn => {
		btn.addEventListener('click', function () {
			document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
			document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
			this.classList.add('active');
			document.getElementById(this.dataset.tab).classList.add('active');
		});
	});
})();

