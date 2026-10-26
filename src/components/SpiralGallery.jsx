import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * 3D Spiral Scrolling Portfolio Gallery (React + React Three Fiber + GSAP ScrollTrigger)
 * Matches reference image (media_1792998804591_3a182a66.png):
 * - Pitch-black background (#000000)
 * - Deep 3D helical/spiral layout with large prominent cards
 * - Active card lands flat & prominent in center/center-right (like TRANTOW / REYNOLDS)
 * - Previous card fades upward and left into the distance (like FAHEY)
 * - Upcoming card rotates in from the bottom-right edge (like WISOKY)
 * - GSAP ScrollTrigger pinning with landing dwell pauses
 */

// 1. Data: Exactly 3 portfolio items
const PORTFOLIO_ITEMS = [
  {
    id: 0,
    category: 'BRANDING',
    title: 'WISOKY',
    subtitle: 'High-Impact Brand Identity',
    accentColor: '#1e293b'
  },
  {
    id: 1,
    category: 'UI/UX',
    title: 'TRANTOW',
    subtitle: 'Spatial Interface Architecture',
    accentColor: '#0f172a'
  },
  {
    id: 2,
    category: 'ARCHITECTURE',
    title: 'BERGSTROM',
    subtitle: 'Generative WebGL Flagship',
    accentColor: '#0b1120'
  }
];

// Helper to generate atmospheric card texture with curved corners and reduced vignette
function createCardTexture(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');

  function drawRoundedRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  }

  // Clear to transparent so outer corner pixels are clean
  ctx.clearRect(0, 0, 1600, 1000);

  // Clip to curved rounded rectangle
  ctx.save();
  drawRoundedRect(ctx, 4, 4, 1592, 992, 60);
  ctx.clip();

  // Deep matte base
  ctx.fillStyle = item.accentColor || '#0a0f1d';
  ctx.fillRect(0, 0, 1600, 1000);

  // Reduced subtle vignette: preserves artwork clarity
  const grad = ctx.createRadialGradient(800, 500, 180, 800, 500, 900);
  grad.addColorStop(0, 'rgba(5, 12, 28, 0.18)');
  grad.addColorStop(0.55, 'rgba(5, 12, 28, 0.35)');
  grad.addColorStop(1, 'rgba(5, 12, 28, 0.54)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1600, 1000);

  // Text drop shadow for high contrast
  ctx.shadowColor = 'rgba(2, 6, 18, 0.9)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  // Category Kicker: small, tracked uppercase
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = '700 28px "Inter", "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = '6px';
  }
  ctx.fillText(item.category, 800, 440);

  // Large Bold Display Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 96px "Inter", "Plus Jakarta Sans", sans-serif';
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = '-1px';
  }
  ctx.fillText(item.title, 800, 540);
  ctx.restore();

  // Translucent curved glass border
  ctx.save();
  drawRoundedRect(ctx, 4, 4, 1592, 992, 60);
  ctx.strokeStyle = 'rgba(147, 197, 253, 0.38)';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

// Parametric 3D Helix Transformation Math
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
    // PREVIOUS: Fade up and left into the distance
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
    // UPCOMING: Rotate in from bottom-right edge
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

function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

// Maps linear progress to active project index with landing dwell pauses
function mapProgressWithDwell(p) {
  if (p <= 0.12) return 0.0;
  if (p < 0.42) return smoothstep(0.12, 0.42, p);
  if (p <= 0.58) return 1.0;
  if (p < 0.88) return 1.0 + smoothstep(0.58, 0.88, p);
  return 2.0;
}

// Individual 3D Card Plane
function GalleryCard({ item, index, progressRef }) {
  const meshRef = useRef();
  const texture = useMemo(() => createCardTexture(item), [item]);

  useFrame(() => {
    if (!meshRef.current) return;
    const activeProgress = mapProgressWithDwell(progressRef.current);
    const delta = index - activeProgress;
    const t = getCardTransform(delta);

    meshRef.current.position.set(t.x, t.y, t.z);
    meshRef.current.rotation.set(t.rotX, t.rotY, t.rotZ);
    meshRef.current.scale.set(t.scale, t.scale, 1);
    meshRef.current.material.opacity = t.opacity;
    meshRef.current.renderOrder = Math.round(25 - Math.abs(delta) * 8);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[8.5, 5.3]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={1}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Scene Root
function HelixScene({ progressRef }) {
  return (
    <>
      <perspectiveCamera makeDefault position={[0, 0, 10.0]} fov={44} />
      <group>
        {PORTFOLIO_ITEMS.map((item, idx) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={idx}
            progressRef={progressRef}
          />
        ))}
      </group>
    </>
  );
}

// Main Export Component
export default function SpiralGallery() {
  const containerRef = useRef(null);
  const progressRef = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=3000',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10.0], fov: 44 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <HelixScene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
