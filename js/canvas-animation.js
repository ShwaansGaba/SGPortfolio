/**
 * Scroll-Driven Cinematic Laptop Animation Engine with Optical Blur Transition
 * Shwaans Gaba Portfolio
 */

(function () {
  'use strict';

  const TOTAL_FRAMES = 240;
  const FRAME_DIR = 'gemini_generated_video_cd0d7216_gwr_video_mvp_frames/gemini_generated_video_cd0d7216_gwr_video_mvp_frames/';
  const FRAME_PREFIX = 'frame_';
  const FRAME_EXT = '.png';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });

  const scrollTrack = document.querySelector('.hero-scroll-track');
  const heroScreenContent = document.getElementById('hero-screen-content');
  const loaderStrip = document.getElementById('loader-strip');
  const navContainer = document.querySelector('.navbar-container');

  // Frame Cache
  const frames = new Array(TOTAL_FRAMES + 1);
  const frameLoaded = new Array(TOTAL_FRAMES + 1).fill(false);
  let loadedCount = 0;
  let currentDrawnIndex = 1;
  let targetProgress = 0;
  let smoothProgress = 0;

  function pad3(num) {
    return String(num).padStart(3, '0');
  }

  function getFrameSrc(index) {
    return `${FRAME_DIR}${FRAME_PREFIX}${pad3(index)}${FRAME_EXT}`;
  }

  // Draw frame on canvas with aspect ratio preservation
  function renderFrame(index) {
    let img = frames[index];

    // Fallback to nearest loaded frame to prevent any blank flickers
    if (!img || !frameLoaded[index]) {
      let nearest = null;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (index - offset >= 1 && frameLoaded[index - offset]) {
          nearest = frames[index - offset];
          break;
        }
        if (index + offset <= TOTAL_FRAMES && frameLoaded[index + offset]) {
          nearest = frames[index + offset];
          break;
        }
      }
      if (!nearest) return;
      img = nearest;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const nw = img.naturalWidth || 1280;
    const nh = img.naturalHeight || 720;

    const isMobile = window.innerWidth <= 768;
    let scale;
    if (isMobile) {
      scale = Math.max((cw / nw) * 1.25, (ch / nh) * 0.85);
    } else {
      scale = Math.max(cw / nw, ch / nh);
    }

    const dw = nw * scale;
    const dh = nh * scale;
    const dx = (cw - dw) / 2;
    const dy = isMobile ? (ch - dh) / 2 + (ch * 0.05) : (ch - dh) / 2;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    currentDrawnIndex = index;

    const frameCounterEl = document.getElementById('frame-counter');
    if (frameCounterEl) {
      frameCounterEl.textContent = `FRAME ${pad3(index)} / ${TOTAL_FRAMES}`;
    }
  }

  // Preload frames: immediate priority for frame 1, then stream the rest with async decode
  function preloadFrames() {
    const firstImg = new Image();
    firstImg.src = getFrameSrc(1);
    const onFirstLoaded = () => {
      frames[1] = firstImg;
      frameLoaded[1] = true;
      loadedCount++;
      renderFrame(1);
    };
    if (firstImg.decode) {
      firstImg.decode().then(onFirstLoaded).catch(onFirstLoaded);
    } else {
      firstImg.onload = onFirstLoaded;
    }

    let loadIndex = 2;
    const CONCURRENCY = 8;

    function loadNextBatch() {
      for (let i = 0; i < CONCURRENCY && loadIndex <= TOTAL_FRAMES; i++, loadIndex++) {
        const idx = loadIndex;
        const img = new Image();
        img.src = getFrameSrc(idx);
        const onFrameLoaded = () => {
          frames[idx] = img;
          frameLoaded[idx] = true;
          loadedCount++;

          if (loaderStrip) {
            const percent = (loadedCount / TOTAL_FRAMES) * 100;
            loaderStrip.style.width = `${percent}%`;
            if (loadedCount >= TOTAL_FRAMES) {
              setTimeout(() => {
                loaderStrip.classList.add('complete');
              }, 300);
            }
          }
          loadNextBatch();
        };

        if (img.decode) {
          img.decode().then(onFrameLoaded).catch(onFrameLoaded);
        } else {
          img.onload = onFrameLoaded;
          img.onerror = () => loadNextBatch();
        }
      }
    }

    loadNextBatch();
  }

  // Canvas High-DPI resizing
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = window.innerWidth;
    const displayH = window.innerHeight;

    if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      renderFrame(currentDrawnIndex);
    }
  }

  // Main scroll loop with optical blur transition
  function updateScroll() {
    if (!scrollTrack) return;

    const rect = scrollTrack.getBoundingClientRect();
    const maxScroll = scrollTrack.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;

    targetProgress = Math.max(0, Math.min(1, scrolled / maxScroll));

    // Smooth buttery interpolation (relaxed rate to prevent speed spikes)
    smoothProgress += (targetProgress - smoothProgress) * 0.22;
    if (Math.abs(targetProgress - smoothProgress) < 0.0005) {
      smoothProgress = targetProgress;
    }

    // Map to frame 1 -> 240
    // Reserve the first 84% of the track for video frames 1-240,
    // and the remaining 16% as a calm resting cushion to absorb wheel momentum and prevent sudden speed bursts!
    const videoProgress = Math.min(1, smoothProgress / 0.84);
    const frameIndex = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(1 + videoProgress * (TOTAL_FRAMES - 1)))
    );

    if (frameIndex !== currentDrawnIndex) {
      renderFrame(frameIndex);
    } else {
      const frameCounterEl = document.getElementById('frame-counter');
      if (frameCounterEl) {
        frameCounterEl.textContent = `FRAME ${pad3(frameIndex)} / ${TOTAL_FRAMES}`;
      }
    }

    // Optical Blur effect on zoom-in camera push:
    // Starts when hero screen emerges at frame 216 and softens background display
    if (frameIndex >= 216) {
      const blurT = Math.min(1, (frameIndex - 216) / 14);
      const blurFactor = blurT * 14;
      canvas.style.filter = `blur(${blurFactor.toFixed(1)}px)`;
    } else {
      canvas.style.filter = 'none';
    }

    // Flagship Hero Screen Content Pop Effect (Exact frame triggers requested by user):
    // 1. frame < 216: Completely hidden (visibility: hidden + opacity: 0)
    // 2. frame 216 -> 230: Fades in very small (scale 0.08) and enlarges to fit screen (scale 1.015, slight 1.5% overshoot)
    // 3. frame 230 -> 240: Slightly goes back by ~1% (scale 1.015 -> 1.000) for a tactile pop effect!
    // 4. frame >= 240: Fully settled at scale 1.000 during the resting buffer zone
    if (heroScreenContent) {
      if (frameIndex < 216) {
        heroScreenContent.style.visibility = 'hidden';
        heroScreenContent.style.opacity = '0';
        heroScreenContent.style.filter = 'blur(16px)';
        heroScreenContent.style.transform = 'translate(-50%, -50%) scale(0.08)';
        heroScreenContent.style.pointerEvents = 'none';
      } else if (frameIndex >= 216 && frameIndex <= 230) {
        heroScreenContent.style.visibility = 'visible';
        // Enlarge from very small (0.08) to fit screen by frame 230
        const t = (frameIndex - 216) / 14; // 0.0 -> 1.0
        const ease = 1 - Math.pow(1 - t, 2.5); // Smooth ease-out expansion
        const scale = 0.08 + ease * (1.015 - 0.08); // Reaches 1.015 by frame 230
        const opacity = Math.min(1, t * 1.5);
        const blur = Math.max(0, (1 - t) * 12);

        heroScreenContent.style.opacity = opacity.toFixed(3);
        heroScreenContent.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
        heroScreenContent.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(4)})`;
        heroScreenContent.style.pointerEvents = 'none';
      } else {
        heroScreenContent.style.visibility = 'visible';
        // Frame 230 -> 240: Settle back by ~1% (1.015 -> 1.000) for tactile pop effect!
        const tPop = Math.min(1, (frameIndex - 230) / 10); // 0.0 -> 1.0
        const popEase = Math.sin(tPop * Math.PI / 2); // Smooth settle
        const scale = 1.015 - popEase * 0.015; // 1.015 down to 1.000

        heroScreenContent.style.opacity = '1';
        heroScreenContent.style.filter = 'none';
        heroScreenContent.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(4)})`;
        heroScreenContent.style.pointerEvents = 'auto';
      }
    }

    // Curvy Floating Navbar blur-fade pop-down
    if (navContainer) {
      if (smoothProgress >= 0.88 || scrolled > maxScroll) {
        navContainer.classList.add('nav-visible');
        navContainer.classList.remove('nav-hidden');
      } else {
        navContainer.classList.remove('nav-visible');
        navContainer.classList.add('nav-hidden');
      }
    }

    requestAnimationFrame(updateScroll);
  }

  // Scroll-based blur reveal for sections and editorial blocks
  function initScrollBlurReveals() {
    const revealElements = document.querySelectorAll('.scroll-blur-reveal');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('DOMContentLoaded', () => {
    initScrollBlurReveals();
  });

  resizeCanvas();
  preloadFrames();
  updateScroll();
})();
