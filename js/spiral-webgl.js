/**
 * 3D Spiral Scrolling Portfolio Gallery (Three.js + GSAP ScrollTrigger)
 * Matches reference image (media_1792998804591_3a182a66.png):
 * - Pitch-black background (#000000)
 * - Large, prominent cards with centered bold typography and atmospheric dark exposure
 * - Deep 3D helical placement: active card lands flat in center/center-right,
 *   previous card fades up-left into the distance, upcoming card rotates in from bottom-right.
 * - Locked in viewport via ScrollTrigger pin: camera pauses, cards rotate sequentially
 *   with landing dwell zones, and only upon completion does the page continue downward.
 *
 * Creator: Shwaans Gaba
 */

(function () {
  'use strict';

  const container = document.getElementById('spiral-webgl-container');
  if (!container) return;

  // 1. Data: 3 Portfolio Projects
  const PROJECTS = [
    {
      id: 0,
      title: 'EKMAN',
      category: 'E-COMMERCE / SKINCARE',
      image: 'assets/project-ekman.png'
    },
    {
      id: 1,
      title: 'SOUND FINANCE',
      category: 'COMMERCIAL FLEET NBFC',
      image: 'assets/project-soundfinance.png'
    },
    {
      id: 2,
      title: 'GRYND',
      category: 'FREELANCE MARKETPLACE',
      image: 'assets/project-grynd.png'
    }
  ];

  // 2. Setup Three.js Scene, Camera, Renderer (Transparent for Background Continuity)
  const scene = new THREE.Scene();
  scene.background = null; // Transparent so moving ambient blue orbs show through!

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
  camera.position.set(0, 0, 10.0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // Transparent WebGL canvas
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0); // 100% transparent clear
  renderer.toneMapping = THREE.NoToneMapping;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // 3. Card Geometry: Large and dominant in the viewport (matches reference image proportion)
  const cardGeometry = new THREE.PlaneGeometry(8.5, 5.3);
  const cardMeshes = [];

  // Rounded rectangle path helper for curved card corners
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Helper to build atmospheric texture with curved corners and reduced vignette
  function buildCardTexture(project, onReady) {
    const cv = document.createElement('canvas');
    cv.width = 1700;
    cv.height = 1060;
    const ctx = cv.getContext('2d');

    const drawContent = (img) => {
      // Clear canvas to 100% transparent so outer corner pixels are clean
      ctx.clearRect(0, 0, 1700, 1060);

      // 1. Clip to smooth curved rounded rectangle
      ctx.save();
      drawRoundedRect(ctx, 4, 4, 1692, 1052, 64);
      ctx.clip();

      // Deep base fill
      ctx.fillStyle = '#080e1e';
      ctx.fillRect(0, 0, 1700, 1060);

      // Draw project screenshot (bright and clearly visible)
      if (img) {
        ctx.drawImage(img, 0, 0, 1700, 1060);
      }

      // Reduced subtle vignette: preserves screenshot brightness and clarity
      const grad = ctx.createRadialGradient(850, 530, 180, 850, 530, 950);
      grad.addColorStop(0, 'rgba(5, 12, 28, 0.18)');
      grad.addColorStop(0.55, 'rgba(5, 12, 28, 0.35)');
      grad.addColorStop(1, 'rgba(5, 12, 28, 0.54)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1700, 1060);

      // Text drop shadow for high contrast & legibility without heavy black wash
      ctx.shadowColor = 'rgba(2, 6, 18, 0.9)';
      ctx.shadowBlur = 26;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;

      // Centered Category kicker (tracked uppercase)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if ('letterSpacing' in ctx) {
        ctx.letterSpacing = '6px';
      }
      ctx.fillText(project.category, 850, 470);

      // Centered Bold Title (high-impact display typography)
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 96px "Plus Jakarta Sans", sans-serif';
      if ('letterSpacing' in ctx) {
        ctx.letterSpacing = '-1px';
      }
      ctx.fillText(project.title, 850, 560);

      ctx.restore();

      // 2. Translucent curved glass border along rounded perimeter
      ctx.save();
      drawRoundedRect(ctx, 4, 4, 1692, 1052, 64);
      ctx.strokeStyle = 'rgba(147, 197, 253, 0.38)';
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.restore();

      const texture = new THREE.CanvasTexture(cv);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = true;
      if (onReady) onReady(texture);
    };

    // Draw placeholder immediately so no black flash occurs
    drawContent(null);

    const img = new Image();
    img.src = project.image;
    img.onload = () => drawContent(img);
  }

  // 4. Create Meshes
  PROJECTS.forEach((project, i) => {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(cardGeometry, material);
    mesh.userData = { id: i, project };
    scene.add(mesh);
    cardMeshes.push(mesh);

    buildCardTexture(project, (texture) => {
      mesh.material.map = texture;
      mesh.material.needsUpdate = true;
      renderer.render(scene, camera);
    });
  });

  // 5. 3D Spiral Mathematics matching reference image media_1792998804591_3a182a66.png
  // Active card: Centered slightly to the right, completely flat facing camera (z = 0, rot = 0)
  // Previous card: In top-left quadrant, angled rightwards, further back in depth (z = -4.0, rotY = +0.44)
  // Upcoming card: In bottom-right quadrant, angled leftwards, in the distance (z = -3.6, rotY = -0.48)
  function getCardTransform(delta) {
    if (Math.abs(delta) < 0.0001) {
      return {
        x: 0.5,
        y: -0.1,
        z: 0.0,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scale: 1.0,
        opacity: 1.0
      };
    }

    if (delta < 0) {
      // PREVIOUS CARDS: Move upward-left into depth (matches FAHEY in reference image)
      const d = -delta;
      const dClamped = Math.min(d, 2.2);
      return {
        x: 0.5 - dClamped * 5.8,
        y: -0.1 + dClamped * 3.2,
        z: -dClamped * 4.0,
        rotX: -dClamped * 0.12,
        rotY: dClamped * 0.44,
        rotZ: -dClamped * 0.04,
        scale: Math.max(0.35, 1.0 - dClamped * 0.22),
        opacity: Math.max(0, 1.0 - dClamped * 0.52)
      };
    } else {
      // UPCOMING CARDS: Rotate in from bottom-right (matches WISOKY / BERGSTROM in reference image)
      const d = delta;
      const dClamped = Math.min(d, 2.2);
      return {
        x: 0.5 + dClamped * 5.4,
        y: -0.1 - dClamped * 3.1,
        z: -dClamped * 3.6,
        rotX: dClamped * 0.14,
        rotY: -dClamped * 0.48,
        rotZ: dClamped * 0.04,
        scale: Math.max(0.35, 1.0 - dClamped * 0.18),
        opacity: Math.max(0, 1.0 - dClamped * 0.42)
      };
    }
  }

  // Smoothstep utility
  function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  let currentScrollProgress = 0;

  // Dwell curve: gives each card a dedicated landing dwell pause in the center of the viewport
  function mapProgressWithDwell(p) {
    // 3 cards -> target values 0, 1, 2
    if (p <= 0.12) {
      // Card 0 (EKMAN) locked flat in center for initial scroll
      return 0.0;
    } else if (p < 0.42) {
      // Transition Card 0 -> Card 1
      const t = smoothstep(0.12, 0.42, p);
      return t * 1.0;
    } else if (p <= 0.58) {
      // Card 1 (SOUND FINANCE) locked flat in center for viewing pause
      return 1.0;
    } else if (p < 0.82) {
      // Transition Card 1 -> Card 2
      const t = smoothstep(0.58, 0.82, p);
      return 1.0 + t * 1.0;
    } else {
      // Card 2 (GRYND) locked flat in center from 0.82 to 1.00 (resting buffer to absorb momentum!)
      return 2.0;
    }
  }

  function updateSpiralPositions(rawProgress) {
    currentScrollProgress = rawProgress;
    const activeProgress = mapProgressWithDwell(rawProgress);

    cardMeshes.forEach((mesh, index) => {
      const delta = index - activeProgress;
      const t = getCardTransform(delta);

      mesh.position.set(t.x, t.y, t.z);
      mesh.rotation.set(t.rotX, t.rotY, t.rotZ);
      mesh.scale.set(t.scale, t.scale, 1);
      mesh.material.opacity = t.opacity;

      // Higher render order for cards closer to the focus center
      mesh.renderOrder = Math.round(25 - Math.abs(delta) * 8);
    });

    renderer.render(scene, camera);
  }

  // Initial draw
  updateSpiralPositions(0);

  // 6. GSAP ScrollTrigger with PIN
  // The camera locks onto this section; user scrolls through the 3D spiral;
  // and only after the sequence finishes does the page scroll downward!
  function initScrollTrigger() {
    if (!window.gsap || !window.ScrollTrigger) {
      setTimeout(initScrollTrigger, 80);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: '#spiral-track',
      start: 'top top',
      end: '+=3000', // 3000px pinned scroll distance
      pin: true,     // Locks section in center of viewport
      scrub: 1.2,    // Buttery, smooth scrub response
      anticipatePin: 1,
      onUpdate: (self) => {
        updateSpiralPositions(self.progress);
      }
    });
  }

  initScrollTrigger();

  // 7. Responsive Resizing
  function handleResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    updateSpiralPositions(currentScrollProgress);
  }

  window.addEventListener('resize', handleResize, { passive: true });
})();
