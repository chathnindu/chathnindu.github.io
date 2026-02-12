/**
 * ANIMATIONS MODULE
 * Using GSAP for high-performance animations
 */

/**
 * Initializes all animations
 */
export function initAnimations() {
    console.log("✨ Initializing Animations...");

    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    animateHero();
    animateSections();
    initMagneticButtons();
    initLiquidText();
    initProjectBundleWobble();
    initKonamiEasterEgg();
    initTechStackEffects();
    initCursor();
}

/**
 * Unique hover effects for Python and C tech cards
 * Python: snake slither (wiggles side-to-side like a snake)
 * C: segfault crash (violent shake + glitch + error flash)
 */
function initTechStackEffects() {
    const cards = document.querySelectorAll('.tech-card');
    if (!cards.length) return;

    cards.forEach(card => {
        const effect = card.dataset.effect;
        const logo = card.querySelector('.tech-logo');

        card.addEventListener('mouseenter', () => {
            switch (effect) {
                case 'slither':
                    // Python: snake slithering S-curve
                    gsap.to(logo, {
                        keyframes: [
                            { x: -6, rotation: -8, duration: 0.08 },
                            { x: 6, rotation: 8, duration: 0.08 },
                            { x: -4, rotation: -5, duration: 0.08 },
                            { x: 4, rotation: 5, duration: 0.08 },
                            { x: -2, rotation: -2, duration: 0.08 },
                            { x: 0, rotation: 0, duration: 0.1 }
                        ]
                    });
                    gsap.to(card, {
                        scale: 1.08,
                        borderColor: '#FFD43B',
                        boxShadow: '0 0 25px rgba(255,212,59,0.35), 0 0 50px rgba(48,105,152,0.15)',
                        duration: 0.3
                    });
                    // Spawn tiny snake tongue flick
                    const tongue = document.createElement('span');
                    tongue.textContent = '🐍';
                    tongue.style.cssText = 'position:absolute;font-size:16px;pointer-events:none;top:8px;right:8px;opacity:0;';
                    card.appendChild(tongue);
                    gsap.to(tongue, {
                        opacity: 1, scale: 1.3, rotation: 15,
                        duration: 0.3, ease: "back.out(2)",
                        onComplete: () => {
                            gsap.to(tongue, { opacity: 0, y: -10, duration: 0.4, delay: 0.3, onComplete: () => tongue.remove() });
                        }
                    });
                    break;

                case 'mystery':
                    // Mystery: pulsing glow + slow rotation + sparkles
                    gsap.to(logo, {
                        rotation: 360,
                        scale: 1.2,
                        duration: 0.8,
                        ease: "power1.inOut"
                    });
                    gsap.to(card, {
                        scale: 1.1,
                        borderColor: '#50F595',
                        boxShadow: '0 0 30px rgba(80,245,149,0.4), 0 0 60px rgba(249,171,234,0.2)',
                        duration: 0.4
                    });
                    // Spawn floating sparkles
                    for (let i = 0; i < 5; i++) {
                        const sparkle = document.createElement('span');
                        sparkle.textContent = ['✨', '⭐', '🔮', '💫', '✦'][i];
                        sparkle.style.cssText = `position:absolute;font-size:${10 + Math.random() * 8}px;pointer-events:none;opacity:0;`;
                        sparkle.style.left = (15 + Math.random() * 70) + '%';
                        sparkle.style.top = (30 + Math.random() * 40) + '%';
                        card.appendChild(sparkle);
                        gsap.to(sparkle, {
                            opacity: 1, y: -(20 + Math.random() * 25), x: (Math.random() - 0.5) * 20,
                            rotation: Math.random() * 180,
                            scale: 0.4,
                            duration: 0.8 + Math.random() * 0.4,
                            delay: i * 0.08,
                            ease: "power1.out",
                            onComplete: () => sparkle.remove()
                        });
                    }
                    break;
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(logo, { rotation: 0, scale: 1, x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
            gsap.to(card, { scale: 1, borderColor: '', boxShadow: '', duration: 0.3 });
        });
    });

    console.log("✅ Tech stack hover effects initialized");
}

/**
 * Initializes the smooth liquid/ribbon text effect.
 * Splits text into individual character spans,
 * then on mousemove applies a proximity-based wave animation.
 */
function initLiquidText() {
    const textElement = document.getElementById('ink-text');
    if (!textElement) {
        console.warn("Liquid text element #ink-text not found");
        return;
    }

    // Split text into individual span elements
    const originalText = textElement.textContent.trim();
    textElement.innerHTML = '';

    const chars = [];
    for (let i = 0; i < originalText.length; i++) {
        const span = document.createElement('span');
        span.textContent = originalText[i];
        span.style.display = 'inline-block';
        span.style.willChange = 'transform';
        span.style.transformOrigin = 'center bottom';
        textElement.appendChild(span);
        chars.push(span);
    }

    console.log(`Liquid text: split "${originalText}" into ${chars.length} chars`);

    // Mousemove: animate characters near the cursor
    textElement.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        chars.forEach((span) => {
            const rect = span.getBoundingClientRect();
            const charCenterX = rect.left + rect.width / 2;
            const charCenterY = rect.top + rect.height / 2;

            const dx = mouseX - charCenterX;
            const dy = mouseY - charCenterY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const radius = 120;

            if (dist < radius) {
                const intensity = 1 - (dist / radius);

                const yShift = -intensity * 25;
                const scaleY = 1 + intensity * 0.6;
                const scaleX = 1 - intensity * 0.15;
                const skew = (dx > 0 ? 1 : -1) * intensity * 8;

                gsap.to(span, {
                    y: yShift,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    skewX: skew,
                    color: `hsl(${150 + intensity * 30}, 90%, ${55 + intensity * 15}%)`,
                    duration: 0.15,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                gsap.to(span, {
                    y: 0,
                    scaleX: 1,
                    scaleY: 1,
                    skewX: 0,
                    color: "",
                    duration: 0.5,
                    ease: "elastic.out(1, 0.4)",
                    overwrite: "auto"
                });
            }
        });
    });

    textElement.addEventListener('mouseleave', () => {
        chars.forEach((span) => {
            gsap.to(span, {
                y: 0,
                scaleX: 1,
                scaleY: 1,
                skewX: 0,
                color: "",
                duration: 0.6,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    console.log("✅ Liquid text effect initialized");
}

/**
 * Animates the Hero section elements
 */
function animateHero() {
    const tl = gsap.timeline();

    tl.to("#hero-title", {
        opacity: 1,
        y: 0,
        duration: 2.5,
        ease: "power2.out",
        delay: 0.5
    })
        .to("#hero-subtitle", {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out"
        }, "-=1.5")
        .from("#hero-pills > *", {
            scale: 0,
            opacity: 0,
            rotation: 0,
            stagger: 0.2,
            duration: 1,
            ease: "back.out(1.7)"
        }, "-=1");
}

/**
 * Animates sections on scroll
 */
function animateSections() {
    // Tech Stack List
    gsap.from("#tech-stack li", {
        scrollTrigger: {
            trigger: "#tech-stack",
            start: "top 85%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });

    // Project Bundle button entrance
    gsap.from("#project-bundle-wrapper", {
        scrollTrigger: {
            trigger: "#project-bundle-wrapper",
            start: "top 85%",
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    });
}

/**
 * Adds magnetic effect to specific buttons
 */
function initMagneticButtons() {
    const magnets = document.querySelectorAll('.magnetic-btn');

    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const bound = magnet.getBoundingClientRect();
            const x = (e.clientX - bound.left) - bound.width / 2;
            const y = (e.clientY - bound.top) - bound.height / 2;

            gsap.to(magnet, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power3.out"
            });
        });

        magnet.addEventListener('mouseleave', () => {
            gsap.to(magnet, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

/**
 * Adds a wobble/tilt effect on the Project Bundle button
 */
function initProjectBundleWobble() {
    const btn = document.getElementById('project-bundle-btn');
    if (!btn) return;

    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        gsap.to(btn, {
            rotateX: rotateX,
            rotateY: rotateY,
            transformPerspective: 500,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)"
        });
    });
}

/**
 * Konami Code Easter Egg
 * ↑↑↓↓←→←→BA triggers a confetti explosion + party mode
 */
function initKonamiEasterEgg() {
    const konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                triggerPartyMode();
            }
        } else {
            konamiIndex = 0;
        }
    });
}

/**
 * Triggers a confetti explosion + brief party mode
 */
function triggerPartyMode() {
    console.log("🎮 PARTY MODE ACTIVATED!");

    // Create confetti pieces
    const colors = ['#50F595', '#F9ABEA', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const confettiCount = 150;

    for (let i = 0; i < confettiCount; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.width = Math.random() * 12 + 4 + 'px';
        piece.style.height = Math.random() * 12 + 4 + 'px';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = Math.random() * 100 + 'vw';
        piece.style.top = '-20px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(piece);

        // Animate each piece
        gsap.to(piece, {
            y: window.innerHeight + 50,
            x: (Math.random() - 0.5) * 300,
            rotation: Math.random() * 720 - 360,
            duration: Math.random() * 3 + 2,
            ease: "power1.in",
            delay: Math.random() * 0.5,
            onComplete: () => piece.remove()
        });
    }

    // Brief color pulse on the whole page
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; inset: 0; z-index: 9998; pointer-events: none;
        background: radial-gradient(circle, rgba(80,245,149,0.15), transparent 70%);
    `;
    document.body.appendChild(overlay);

    gsap.to(overlay, {
        opacity: 0,
        duration: 2,
        ease: "power2.out",
        onComplete: () => overlay.remove()
    });

    // Make the hero title do a little dance
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        gsap.to(heroTitle, {
            scale: 1.1,
            rotation: 2,
            duration: 0.3,
            yoyo: true,
            repeat: 5,
            ease: "power2.inOut",
            onComplete: () => {
                gsap.set(heroTitle, { scale: 1, rotation: 0 });
            }
        });
    }
}

/**
 * Initializes a custom cursor (optional placeholder)
 */
function initCursor() {
    // Placeholder for future custom cursor implementation
}
