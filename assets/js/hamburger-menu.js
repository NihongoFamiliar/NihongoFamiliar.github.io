//	Hamburger Menu: Open
const openHamburgerMenu = (e) => {
	document.getElementById('nav-menu').classList.remove('closed');
	document.getElementById('nav-menu').classList.add('open');
};
document.getElementById('nav-menu-hamburger').addEventListener('click', openHamburgerMenu);
//	Hamburger Menu: Close
const closeHamburgerMenu = (e) => {
	const canHasHamburger = window.innerWidth <= 768;
	
	if (!canHasHamburger) {
		document.getElementById('nav-menu').classList.remove('open');
		document.getElementById('nav-menu').classList.remove('closed');
	} else if (e.target.id === 'nav-menu') {
		document.getElementById('nav-menu').classList.add('closed');
		document.getElementById('nav-menu').classList.remove('open');
	}
};
document.getElementById('nav-menu').addEventListener('click', closeHamburgerMenu);
