(function initOnboarding() {
	// Guard: only for logged-in admin
	const user = JSON.parse(localStorage.getItem('drapedrop_currentUser') || 'null');
	if (!user || user.type !== 'admin') {
		window.location.href = 'login.html';
		return;
	}

	// Load existing onboarding state
	const key = 'drapedrop_onboarding_' + user.email;
	let state = JSON.parse(localStorage.getItem(key) || 'null') || {
		mobileVerified: true,
		emailVerified: true,
		aadhaarNo: '',
		panNo: '',
		voterId: '',
		dlNo: '',
		docAadhaar: null,
		docSecond: null,
		signature: null,
		displayName: '',
		pickupAddress: '',
		// structured address
		addrPincode: '', addrState: '', addrCity: '', addrHouse: '', addrRoad: '', addrLandmark: '', addrType: 'home',
		submitted: false
	};

	// Backward compatibility defaults
	if (typeof state.mobileVerified !== 'boolean') state.mobileVerified = true;
	if (typeof state.emailVerified !== 'boolean') state.emailVerified = true;

	// Bind elements
	const el = id => document.getElementById(id);
	const obProgress = el('obProgress');
	const obProgressText = el('obProgressText');
	const obLogout = el('obLogout');

	// Pre-fill
	const sellerSummary = el('sellerSummary');
	if (sellerSummary) sellerSummary.textContent = `${user.firstName || user.name || 'Seller'} (${user.email})`;

	// Inputs
	const aadhaarNo = el('aadhaarNo');
	const secondIdType = el('secondIdType');
	const secondId = el('secondId');
	const displayName = el('displayName');
	const pickupAddress = el('pickupAddress');
	const addrPincode = el('addrPincode');
	const addrState = el('addrState');
	const addrCity = el('addrCity');
	const addrHouse = el('addrHouse');
	const addrRoad = el('addrRoad');
	const addrLandmark = el('addrLandmark');
	const addrTypeHome = el('addrTypeHome');
	const addrTypeWork = el('addrTypeWork');
	const addrUseLocation = el('addrUseLocation');
	const docAadhaar = el('docAadhaar');
	const docSecond = el('docSecond');
	const docSign = el('docSign');

	// Status labels
	const docAadhaarStatus = el('docAadhaarStatus');
	const docSecondStatus = el('docSecondStatus');
	const docSignStatus = el('docSignStatus');
	const obMobileStatus = el('obMobileStatus');
	const obEmailStatus = el('obEmailStatus');

	// Checklist items
	const chkIds = el('chkIds');
	const chkDocs = el('chkDocs');
	const chkStore = el('chkStore');

	// Restore values
	if (aadhaarNo) aadhaarNo.value = state.aadhaarNo || '';
	if (secondIdType) secondIdType.value = state.secondIdType || '';
	if (secondId) secondId.value = state.secondId || '';
	if (displayName) displayName.value = state.displayName || '';
	if (pickupAddress) pickupAddress.value = state.pickupAddress || '';
	if (addrPincode) addrPincode.value = state.addrPincode || '';
	if (addrState) addrState.value = state.addrState || '';
	if (addrCity) addrCity.value = state.addrCity || '';
	if (addrHouse) addrHouse.value = state.addrHouse || '';
	if (addrRoad) addrRoad.value = state.addrRoad || '';
	if (addrLandmark) addrLandmark.value = state.addrLandmark || '';
	if (addrTypeHome && addrTypeWork) {
		(addrTypeHome.classList.toggle('active', (state.addrType || 'home') === 'home'));
		(addrTypeWork.classList.toggle('active', (state.addrType || 'home') === 'work'));
	}
	if (docAadhaarStatus) docAadhaarStatus.textContent = state.docAadhaar ? 'Uploaded' : 'Not uploaded';
	if (docSecondStatus) docSecondStatus.textContent = state.docSecond ? 'Uploaded' : 'Not uploaded';
	if (docSignStatus) docSignStatus.textContent = state.signature ? 'Uploaded' : 'Not uploaded';

	function reflectVerificationBadges() {
		if (obMobileStatus) {
			obMobileStatus.textContent = state.mobileVerified ? 'Verified' : 'Not verified';
			obMobileStatus.className = state.mobileVerified ? 'verified' : 'danger';
		}
		if (obEmailStatus) {
			obEmailStatus.textContent = state.emailVerified ? 'Verified' : 'Not verified';
			obEmailStatus.className = state.emailVerified ? 'verified' : 'danger';
		}
	}

	function computeProgress() {
		// Steps: Mobile, Email, IDs, Docs, Store
		let done = 0, total = 5;
		const mobileOk = !!state.mobileVerified;
		const emailOk = !!state.emailVerified;
		const idsOk = !!(state.aadhaarNo && state.secondIdType && state.secondId);
		const docsOk = !!(state.docAadhaar && state.docSecond && state.signature);
		const storeOk = !!(state.displayName && ((state.addrPincode && state.addrState && state.addrCity && state.addrHouse && state.addrRoad) || state.pickupAddress));
		if (mobileOk) done++;
		if (emailOk) done++;
		if (idsOk) done++;
		if (docsOk) done++;
		if (storeOk) done++;
		const pct = Math.round((done / total) * 100);
		if (obProgress) obProgress.style.width = pct + '%';
		if (obProgressText) obProgressText.textContent = pct + '%';
		// Reflect checklist visual state (icon + color)
		function setChecklistState(li, ok) {
			if (!li) return;
			const icon = li.querySelector('i');
			li.style.color = ok ? '#22c55e' : '#666';
			if (icon) {
				icon.className = ok ? 'fas fa-check-circle' : 'fas fa-circle';
				icon.style.color = ok ? '#22c55e' : '#aaa';
			}
		}
		setChecklistState(chkIds, idsOk);
		setChecklistState(chkDocs, docsOk);
		setChecklistState(chkStore, storeOk);
		return pct;
	}

	function save(partial) {
		state = { ...state, ...partial };
		localStorage.setItem(key, JSON.stringify(state));
		computeProgress();
	}

	// Wire inputs
	[aadhaarNo, secondIdType, secondId, displayName, pickupAddress, addrPincode, addrState, addrCity, addrHouse, addrRoad, addrLandmark].forEach(input => {
		if (!input) return;
		const saveNow = () => save({
			aadhaarNo: aadhaarNo.value,
			secondIdType: secondIdType.value,
			secondId: secondId.value,
			displayName: displayName.value,
			pickupAddress: pickupAddress.value,
			addrPincode: addrPincode?.value || '',
			addrState: addrState?.value || '',
			addrCity: addrCity?.value || '',
			addrHouse: addrHouse?.value || '',
			addrRoad: addrRoad?.value || '',
			addrLandmark: addrLandmark?.value || ''
		});
		input.addEventListener('input', saveNow);
		// Ensure selects trigger state update on change as well
		if (input.tagName === 'SELECT') {
			input.addEventListener('change', saveNow);
		}
	});

	// Address type toggles
	function setAddrType(type) {
		save({ addrType: type });
		if (addrTypeHome && addrTypeWork) {
			addrTypeHome.classList.toggle('active', type === 'home');
			addrTypeWork.classList.toggle('active', type === 'work');
		}
	}
	if (addrTypeHome) addrTypeHome.addEventListener('click', () => setAddrType('home'));
	if (addrTypeWork) addrTypeWork.addEventListener('click', () => setAddrType('work'));

	// Use my location (open Google Maps with current coordinates and store coords in landmark)
	if (addrUseLocation) addrUseLocation.addEventListener('click', () => {
		if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
		navigator.geolocation.getCurrentPosition(pos => {
			const lat = pos.coords.latitude;
			const lng = pos.coords.longitude;
			// Save coordinates into landmark field for quick reference
			save({ addrLandmark: `Lat ${lat.toFixed(4)}, Lng ${lng.toFixed(4)}` });
			if (addrLandmark) addrLandmark.value = state.addrLandmark;
			// Open Google Maps centered on current location
			const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
			window.open(mapsUrl, '_blank');
		}, () => alert('Unable to get location'));
	});

	function readFile(input, cb) {
		const f = input.files && input.files[0];
		if (!f) return;
		const r = new FileReader();
		r.onload = e => cb(e.target.result);
		r.readAsDataURL(f);
	}

	if (docAadhaar) docAadhaar.addEventListener('change', () => readFile(docAadhaar, data => { save({ docAadhaar: data }); if (docAadhaarStatus) docAadhaarStatus.textContent = 'Uploaded'; }));
	if (docSecond) docSecond.addEventListener('change', () => readFile(docSecond, data => { save({ docSecond: data }); if (docSecondStatus) docSecondStatus.textContent = 'Uploaded'; }));
	if (docSign) docSign.addEventListener('change', () => readFile(docSign, data => { save({ signature: data }); if (docSignStatus) docSignStatus.textContent = 'Uploaded'; }));

	// Buttons
	const obSave = el('obSave');
	const obSubmit = el('obSubmit');
	if (obSave) obSave.addEventListener('click', () => {
		// Capture latest form values on explicit Save as well
		save({
			aadhaarNo: aadhaarNo?.value || '',
			secondIdType: secondIdType?.value || '',
			secondId: secondId?.value || '',
			displayName: displayName?.value || '',
			pickupAddress: pickupAddress?.value || '',
			addrPincode: addrPincode?.value || '',
			addrState: addrState?.value || '',
			addrCity: addrCity?.value || '',
			addrHouse: addrHouse?.value || '',
			addrRoad: addrRoad?.value || '',
			addrLandmark: addrLandmark?.value || ''
		});
		alert('Progress saved.');
	});
	if (obSubmit) obSubmit.addEventListener('click', () => {
		const pct = computeProgress();
		if (pct < 100) {
			if (!confirm('Some steps are incomplete. Submit anyway?')) return;
		}
		save({ submitted: true });
		alert('Onboarding submitted. Redirecting to Seller Dashboard...');
		window.location.href = 'index.html';
	});

	if (obLogout) obLogout.addEventListener('click', () => { localStorage.removeItem('drapedrop_currentUser'); window.location.href = 'index.html'; });

	reflectVerificationBadges();
	computeProgress();
})();


