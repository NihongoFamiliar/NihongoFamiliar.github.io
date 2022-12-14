//	Hamburger Menu: Open
const openHamburgerMenu = (e) => {
	e.preventDefault();
	e.stopPropagation();

	const navMenuEl = document.getElementById('nav-menu');
	if (navMenuEl) {
		navMenuEl.classList.remove('closed');
		navMenuEl.classList.add('open');
		const listItem1El = navMenuEl.querySelector('ul > li:first-child > a');
		if (listItem1El) { listItem1El.focus(); }
	}
};
const hamburgerEl = document.getElementById('nav-menu-hamburger');
if (hamburgerEl) { hamburgerEl.addEventListener('click', openHamburgerMenu); }

//	Hamburger Menu: Close
const closeHamburgerMenu = (e) => {
	if ((
			e.type === 'focusout' &&
			e.relatedTarget && e.relatedTarget.offsetParent &&
			e.relatedTarget.offsetParent === e.currentTarget
		) || (e.type === 'click' && e.target !== e.currentTarget)
	) { return; }

	const navMenuEl = document.getElementById('nav-menu');
	if (navMenuEl) {
		const canHasHamburger = window.innerWidth <= 768;

		if (!canHasHamburger) {
			navMenuEl.classList.remove('open');
			navMenuEl.classList.remove('closed');
		} else {
			navMenuEl.classList.add('closed');
			navMenuEl.classList.remove('open');
		}
	}
	const hamburgerEl = document.getElementById('nav-menu-hamburger');
	if (hamburgerEl) { hamburgerEl.focus(); }
};

const navMenuEl = document.getElementById('nav-menu');
if (navMenuEl) {
	navMenuEl.addEventListener('click', closeHamburgerMenu);
	navMenuEl.addEventListener('focusout', closeHamburgerMenu);
}
