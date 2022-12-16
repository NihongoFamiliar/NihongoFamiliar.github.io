/* Footer Shooting stars! */
const siteFooter = document.getElementById('site-footer');
if (siteFooter) {
	const bodyContents = document.getElementById('main-content').querySelector('.main-body')
	const bodyContentsStyle = window.getComputedStyle(bodyContents);

	const footerShootingStarsCanvas = document.createElement("canvas");
	footerShootingStarsCanvas.id = 'shooting-stars-footer';
	footerShootingStarsCanvas.width = siteFooter.offsetWidth;
	footerShootingStarsCanvas.height = siteFooter.offsetHeight + parseInt(bodyContentsStyle.paddingBottom);
	const footerShootingStarsCtx = footerShootingStarsCanvas.getContext('2d');

	siteFooter.insertAdjacentElement('beforebegin', footerShootingStarsCanvas);


	// General canvas settings for tracking particles currently generated
	const footerShootingStarParticleSettings = {
	  density: 50,
	  maxCount: 500,
	  maxGyration: 20,
	  startingY: parseInt(window.getComputedStyle(siteFooter).borderTopWidth) + (parseInt(bodyContentsStyle.paddingBottom) * 1.25)
	};
	const footerShootingStarParticles = [];

	function FooterParticle() {
		//	Set locus
			// X is between 0 & canvas width
		this.startX = Math.floor(Math.random() * (footerShootingStarsCanvas.width - 1));
		this.x = this.startX;
		this.vx = 2; // Shakiness
		this.direction = Math.round(Math.random()); // Jiggle direction, 0 || 1
		//	Y is canvas height
		this.y = footerShootingStarParticleSettings.startingY;
		const minVY = 1;
		const maxVY = 3;
		this.vy = Math.floor(Math.random() * (maxVY - minVY + 1) + minVY);

		// Particle visual properties
		const minSize = 6;
		const maxSize = 60; // 32;
		this.diameter = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
		this.shrinkage = 3;
		this.opacity = 1;


		//	Set particle in particles list
		if (footerShootingStarParticles.length > 0) {
			let emptyInd = -1;
			footerShootingStarParticles.every((particle, p) => {
				if (emptyInd < 0 && !particle) {
					emptyInd = p;
					return false;
				}
				return true;
			});

			if (emptyInd >= 0) {
				this.id = emptyInd;
				footerShootingStarParticles[emptyInd] = this;
			} else {
				this.id = footerShootingStarParticles.length;
				footerShootingStarParticles.push(this);
			}
		} else {
			footerShootingStarParticles.push(this);
			this.id = 0;
		}
	}

	FooterParticle.prototype.draw = function() {
		// Set particle floatation
		this.y -= this.vy;
		// Jiggle particle
		if (this.direction > 0) {
			if (this.x >= (this.startX + footerShootingStarParticleSettings.maxGyration)) {
				this.direction = 0;
			}
			this.x += this.vx;
		} else {
			if (this.x <= (this.startX - footerShootingStarParticleSettings.maxGyration)) {
				this.direction = 1;
			}
			this.x -= this.vx;
		}

		// Create the shapes
		if (this.diameter > 6 && Math.round(Math.random()) > 0) {
			this.diameter -= this.shrinkage;
		}
		footerShootingStarsCtx.font = `${this.diameter}px FontAwesome`;
		this.opacity = this.y / footerShootingStarParticleSettings.startingY;
		const colour = `rgba(108, 111, 144, ${this.opacity})`; // purple
		footerShootingStarsCtx.fillStyle = colour;

		// Draws the star
		footerShootingStarsCtx.fillText('\uf005', this.x, this.y);

		// Destroy particle once too high
		if (this.y <= 0) {
			footerShootingStarParticles[this.id] = undefined;
		}
	};


	// Interval for creating and drawing them
	setInterval(function() {
		footerShootingStarsCtx.clearRect(0, 0, footerShootingStarsCanvas.width, footerShootingStarsCanvas.height);

		// Draw the particles
		for (let i = 0; i < footerShootingStarParticleSettings.density; i++) {
			const definedParticles = footerShootingStarParticles.filter(particle => !!particle);

			if (definedParticles.length < footerShootingStarParticleSettings.maxCount && Math.random() > 0.97) {
				// "Random" chance of creating a particle
				new FooterParticle();
			}
		}

		footerShootingStarParticles.forEach((particle) => {
			if (particle) { particle.draw(); }
		});
	}, 45);


	// Responsiveness handling
	window.addEventListener('resize', function resizeFooterCanvas(e) {
		const changedFooterRef = document.getElementById('site-footer');
		const changedBody = document.getElementById('main-content').querySelector('.main-body')
		const bodyStyle = window.getComputedStyle(changedBody);

		footerShootingStarsCanvas.width = changedFooterRef.offsetWidth;
		footerShootingStarsCanvas.height = changedFooterRef.offsetHeight + parseInt(bodyStyle.paddingBottom);

		footerShootingStarParticleSettings.startingY = parseInt(window.getComputedStyle(changedFooterRef).borderTopWidth) + (parseInt(bodyStyle.paddingBottom) * 1.25);
	});
}



/* Hero stars */
const heroSection = document.getElementById('hero');
if (heroSection) {
	const heroStarsCanvas = document.createElement("canvas");
	heroStarsCanvas.setAttribute('aria-hidden', true);
	heroStarsCanvas.id = 'hero-star-veil';
	heroStarsCanvas.width = heroSection.offsetWidth;
	heroStarsCanvas.height = heroSection.offsetHeight;
	const heroStarsCtx = heroStarsCanvas.getContext('2d');

	heroSection.insertAdjacentElement('beforeend', heroStarsCanvas);

	const heroVeilStars = [];
	const heroShootingStars = [];

	// A particle class/obj/prototype
	function VeilParticle(x, y) {
		//	Set locus on the canvas
		this.x = x;
		this.y = y;
		this.gv = 2; // Rate of growth or shrinkage
		this.isGrowing = Boolean(Math.round(Math.random())); // or shrinking

		// Particle visual properties
		this.minSize = 6;
		const smallerSide = heroStarsCanvas.height <= heroStarsCanvas.width ? heroStarsCanvas.height : heroStarsCanvas.width;
		this.maxSize = Math.round(16 * (smallerSide / 100));
		this.startDiameter = Math.floor(Math.random() * (this.maxSize - this.minSize + 1) + this.minSize);
		this.diameter = this.startDiameter;

		this.maxOpacity = 0.125;
		const randomOp = Math.random();
		this.startOpacity = randomOp <= this.maxOpacity ? randomOp : 0;
		this.opacity = this.startOpacity;
		this.ov = 0.005; // Rate of alpha change
		this.isDimming = Boolean(Math.round(Math.random())); // or not

		const hueColorChance = Math.random();
		this.hue = hueColorChance < 0.125 ? 'pink' :
			hueColorChance < 0.25 ? 'white' :
				hueColorChance < 0.50 ? 'eggplant' : 'purple';
		this.colour = function() {
			switch(this.hue) {
				case ('white'): return `rgba(251, 251, 251, ${this.opacity})`;
				case ('pink'): return `rgba(227, 93, 109, ${this.opacity})`;
				case ('eggplant'): return `rgba(48, 50, 73, ${this.opacity})`;
				default: return `rgba(108, 111, 144, ${this.opacity})`; // purple
			}
		};
	}
	VeilParticle.prototype.draw = function() {
		// Set size
		if (this.isGrowing) {
			const attemptedGrowth = this.diameter + this.gv;
			this.diameter =  attemptedGrowth >= this.maxSize ? this.maxSize : attemptedGrowth;

			if (this.diameter >= this.maxSize) { this.isGrowing = false; }
		} else {
			const attemptedShrinkage = this.diameter - this.gv;
			this.diameter =  attemptedShrinkage <= this.minSize ? this.minSize : attemptedShrinkage;

			if (this.diameter <= this.minSize) { this.isGrowing = true; }
		}

		// Set opacity
		const mayChangeOpacity = this.opacity > 0 || Math.random() > 0.97;
		if (mayChangeOpacity) {
			if (this.isDimming) {
				const attemptedDim = this.opacity - this.ov;
				this.opacity = attemptedDim <= 0 ? 0 : attemptedDim;

				if (this.opacity <= 0) { this.isDimming = false; }
			} else {
				const attemptedBright = this.opacity + this.ov;
				this.opacity = attemptedBright >= this.maxOpacity ? this.maxOpacity : attemptedBright;

				if (this.opacity >= this.maxOpacity) { this.isDimming = true; }
			}
		}

		// Set up visuals
		heroStarsCtx.font = `${this.diameter}px FontAwesome`;
		heroStarsCtx.fillStyle = this.colour();

		// Draws the star
		const xAdjusted = this.x - (this.diameter / 2);
		const yAdjusted = this.y + (this.diameter / 2);
		heroStarsCtx.fillText('\uf005', xAdjusted, yAdjusted);
	};


	const heroShootingStarsSettings = {
	  density: 50,
	  maxCount: 500,
	  maxGyration: 20
	};
	// Shooting star hero particles
	function ShooterParticle() {
		//	Set locus
			// X is between 0 & canvas width
		this.startX = Math.floor(Math.random() * (heroStarsCanvas.width - 1));
		this.x = this.startX;
		this.vx = 2; // Shakiness
		this.direction = Math.round(Math.random()); // Jiggle direction, 0 || 1
		//	Y is canvas height
		this.y = heroStarsCanvas.height;
		const htmlEl = document.documentElement;
		const htmlStyles = window.getComputedStyle(htmlEl);
		const rem = parseInt(htmlStyles.fontSize);
		this.endingY = heroStarsCanvas.height - (rem * 3.5);
		const minVY = 1;
		const maxVY = 3;
		this.vy = Math.floor(Math.random() * (maxVY - minVY + 1) + minVY);

		// Particle visual properties
		const minSize = 6;
		const maxSize = 60; // 32;
		this.diameter = Math.floor(Math.random() * (maxSize - minSize + 1) + minSize);
		this.shrinkage = 3;
		this.opacity = 1;


		//	Set particle in particles list
		if (heroShootingStars.length > 0) {
			let emptyInd = -1;
			heroShootingStars.every((particle, p) => {
				if (emptyInd < 0 && !particle) {
					emptyInd = p;
					return false;
				}
				return true;
			});

			if (emptyInd >= 0) {
				this.id = emptyInd;
				heroShootingStars[emptyInd] = this;
			} else {
				this.id = heroShootingStars.length;
				heroShootingStars.push(this);
			}
		} else {
			heroShootingStars.push(this);
			this.id = 0;
		}
	}
	ShooterParticle.prototype.draw = function() {
		// Set particle floatation
		this.y -= this.vy;
		// Jiggle particle
		if (this.direction > 0) {
			if (this.x >= (this.startX + heroShootingStarsSettings.maxGyration)) {
				this.direction = 0;
			}
			this.x += this.vx;
		} else {
			if (this.x <= (this.startX - heroShootingStarsSettings.maxGyration)) {
				this.direction = 1;
			}
			this.x -= this.vx;
		}

		// Create the shapes
		if (this.diameter > 6 && Math.round(Math.random()) > 0) {
			this.diameter -= this.shrinkage;
		}
		heroStarsCtx.font = `${this.diameter}px FontAwesome`;

		this.opacity = (this.y - this.endingY) / (heroStarsCanvas.height - this.endingY);
		const colour = `rgba(251, 251, 251, ${this.opacity})`; // white
		heroStarsCtx.fillStyle = colour;

		// Draws the star
		heroStarsCtx.fillText('\uf005', this.x, this.y);

		// Destroy particle once too high
		if ((this.y - this.endingY) <= 0) {
			heroShootingStars[this.id] = undefined;
		}
	};


	// Draw hero stars
	let heroVeilStarsTimer;
	const drawStars = function() {
		//	 Clear canvas for fresh render
		heroStarsCtx.clearRect(0, 0, heroStarsCanvas.width, heroStarsCanvas.height);

		// Apply gradient BG settings
		const heightIsSmallerSide = Boolean(heroStarsCanvas.height <= heroStarsCanvas.width);
		const gradientX = heroStarsCanvas.width / 2;
		const gradientY = heroStarsCanvas.height / 2;
		const gradientR0 = heightIsSmallerSide ? (heroStarsCanvas.height / 4) : (heroStarsCanvas.width / 4);
		const gradientR1 = heightIsSmallerSide ? heroStarsCanvas.width : heroStarsCanvas.height;
		const gradient = heroStarsCtx.createRadialGradient(gradientX, gradientY, gradientR0, gradientX, gradientY, gradientR1);
		// Gradient colours
		gradient.addColorStop(0, 'rgba(48, 50, 73, 0.125)'); // eggplant
		gradient.addColorStop(1, 'rgba(227, 93, 109, 0.5)'); // pink

		// Draw gradient
		heroStarsCtx.fillStyle = gradient;
		heroStarsCtx.fillRect(0, 0, heroStarsCanvas.width, heroStarsCanvas.height);

		// Draws stars
		heroVeilStars.forEach((star) => { star.draw(); });

		// Fade colour bars
		const htmlEl = document.documentElement;
		const htmlStyles = window.getComputedStyle(htmlEl);
		const rem = parseInt(htmlStyles.fontSize);
		// 60% bar
		gradBar1Height = rem * 1.5;
		heroStarsCtx.fillStyle = 'rgba(251, 251, 251, 0.6)';
		heroStarsCtx.fillRect(0, (heroStarsCanvas.height - gradBar1Height), heroStarsCanvas.width, gradBar1Height);
		// 30% bar
		gradBar2Height = rem * 1; // 30%
		heroStarsCtx.fillStyle = 'rgba(251, 251, 251, 0.3)';
		heroStarsCtx.fillRect(0, (heroStarsCanvas.height - gradBar1Height - gradBar2Height), heroStarsCanvas.width, gradBar2Height);

		// Shooting stars
			// Draw the particles
		for (let i = 0; i < heroShootingStarsSettings.density; i++) {
			const definedParticles = heroShootingStars.filter(particle => !!particle);

			if (definedParticles.length < heroShootingStarsSettings.maxCount && Math.random() > 0.97) {
				// "Random" chance of creating a particle
				new ShooterParticle();
			}
		}

		heroShootingStars.forEach((particle) => {
			if (particle) { particle.draw(); }
		});
	}

	// Draw all particles on the hero section
	function setVeilParticles() {
		// Reset star list
		clearInterval(heroVeilStarsTimer);
		heroVeilStarsTimer = undefined;
		heroVeilStars.splice(0, heroVeilStars.length);
		heroShootingStars.splice(0, heroShootingStars.length);
		// Clear canvas
		heroStarsCtx.clearRect(0, 0, heroStarsCanvas.width, heroStarsCanvas.height);

		// Star count settings
		const almostMaxStarSize = Math.round(16 * (heroStarsCanvas.height / 200));
		const starsPerX = Math.round(heroStarsCanvas.width / almostMaxStarSize);
		const starsPerY = Math.round(heroStarsCanvas.height / almostMaxStarSize);

		// Draw the particles
		for (let sy = 0; sy < (starsPerY + 1); sy++) {
			const distanceY = heroStarsCanvas.height / starsPerY;
			const y = Math.round((sy + 0.5) * distanceY) + distanceY;

			for (let sx = 0; sx < (starsPerX + 1); sx++) {
				const distanceX = heroStarsCanvas.width / starsPerX;
				const x = sx === 0 ? (0 - distanceX) : Math.round((sx + 0.5) * distanceX) - distanceX;

				const newStar = new VeilParticle(x, y);
				heroVeilStars.push(newStar);
			}
		}

		// Set timer for star effect updates
		heroVeilStarsTimer = setInterval(drawStars, 45);
	}
	setVeilParticles();

	// Responsiveness handling
	window.addEventListener('resize', function resizeHeroCanvas(e) {
		const changedHeroRef = document.getElementById('hero');

		heroStarsCanvas.width = changedHeroRef.offsetWidth;
		heroStarsCanvas.height = changedHeroRef.offsetHeight;

		setVeilParticles();
	});
}
