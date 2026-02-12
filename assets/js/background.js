/**
 * 3D BACKGROUND MODULE — STARFIELD SIMULATION
 * Classic 90s "flying through space" screensaver effect
 * Stars fly toward the camera from deep space
 */

let scene, camera, renderer;
let stars = [];
let mouseX = 0, mouseY = 0;
const isMobile = window.innerWidth < 768;

// Star count — fewer on mobile for performance
const STAR_COUNT = isMobile ? 300 : 600;
const FIELD_DEPTH = 2000;
const SPEED = isMobile ? 2 : 3;

// Soft color palette — warm whites, soft blues, gold
const STAR_COLORS = [
    new THREE.Color(0xE0E8FF),  // lavender-white (most common)
    new THREE.Color(0xE0E8FF),
    new THREE.Color(0xE0E8FF),
    new THREE.Color(0x88C0D0),  // soft cyan
    new THREE.Color(0x7EB8DA),  // sky blue
    new THREE.Color(0xF0C674),  // warm gold (rare)
];

/**
 * Initializes the starfield background
 */
export function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) {
        console.error("Canvas #bg-canvas not found!");
        return;
    }

    // Scene
    scene = new THREE.Scene();

    // Camera — centered, looking into deep space
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        FIELD_DEPTH
    );
    camera.position.z = 0;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: !isMobile // skip AA on mobile
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create stars
    createStarfield();

    // Events
    if (!isMobile) {
        document.addEventListener('mousemove', onMouseMove);
    }
    window.addEventListener('resize', onResize);

    // Go!
    animate();
    console.log("⭐ Starfield Initialized");
}

/**
 * Creates individual star points scattered in space
 */
function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
        const i3 = i * 3;

        // Spread stars across the field, random depth
        positions[i3] = (Math.random() - 0.5) * 1200;      // x
        positions[i3 + 1] = (Math.random() - 0.5) * 1200;  // y
        positions[i3 + 2] = Math.random() * FIELD_DEPTH;    // z (depth)

        // Pick a color from palette
        const color = STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;

        // Varied star sizes — some big, mostly small
        sizes[i] = Math.random() < 0.1 ? 3 + Math.random() * 3 : 1 + Math.random() * 2;
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    // Custom shader for round, glowing star points
    const material = new THREE.PointsMaterial({
        size: isMobile ? 2.5 : 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Store reference for animation
    stars.push({
        points: points,
        positions: positions,
        baseSpeed: SPEED
    });
}

/**
 * Mouse parallax (desktop only)
 */
function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 40;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 40;
}

/**
 * Window resize handler
 */
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Main animation loop — stars fly toward you
 */
function animate() {
    requestAnimationFrame(animate);

    stars.forEach(star => {
        const pos = star.positions;
        const speed = star.baseSpeed;

        for (let i = 0; i < pos.length; i += 3) {
            // Move star toward camera (decrease z)
            pos[i + 2] -= speed;

            // When star passes camera, reset it to the back
            if (pos[i + 2] < 1) {
                pos[i + 2] = FIELD_DEPTH;
                pos[i] = (Math.random() - 0.5) * 1200;
                pos[i + 1] = (Math.random() - 0.5) * 1200;
            }
        }

        // Update the geometry
        star.points.geometry.attributes.position.needsUpdate = true;
    });

    // Gentle mouse parallax for camera (desktop)
    if (!isMobile) {
        camera.position.x += (mouseX - camera.position.x) * 0.02;
        camera.position.y += (-mouseY - camera.position.y) * 0.02;
    }

    camera.lookAt(0, 0, FIELD_DEPTH / 2);
    renderer.render(scene, camera);
}
