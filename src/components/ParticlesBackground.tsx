import React, { useEffect, useRef } from 'react';

const STAR_COUNT = 120;
const PLANETS = [
  { color: '#b5b5b5', r: 8, orbit: 60, speed: 0.018 }, // Mercury
  { color: '#e6c07b', r: 12, orbit: 90, speed: 0.014 }, // Venus
  { color: '#3b82f6', r: 14, orbit: 120, speed: 0.011 }, // Earth
  { color: '#e57373', r: 11, orbit: 150, speed: 0.009 }, // Mars
  { color: '#fbbf24', r: 24, orbit: 200, speed: 0.006 }, // Jupiter
  { color: '#facc15', r: 20, orbit: 250, speed: 0.005 }, // Saturn
  { color: '#38bdf8', r: 16, orbit: 300, speed: 0.004 }, // Uranus
  { color: '#6366f1', r: 15, orbit: 350, speed: 0.003 }, // Neptune
];

const SUN_COLOR = '#fff700';
const SUN_GLOW = '#ffe066';

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
}

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let cx = width / 2;
    let cy = height / 2;
    let scale = Math.min(width, height) / 900;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
      scale = Math.min(width, height) / 900;
    }
    window.addEventListener('resize', resize);

    // Star field
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 0.5 + Math.random() * 1.2,
      opacity: 0.3 + Math.random() * 0.7,
    }));

    // Each planet gets its own angle
    const planetAngles = PLANETS.map(() => Math.random() * Math.PI * 2);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Draw background
      ctx.save();
      ctx.fillStyle = '#120b1a';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // Draw stars
      for (const s of stars) {
        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      // Draw orbits
      for (const planet of PLANETS) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.13)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, planet.orbit * scale, planet.orbit * scale * 0.98, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }

      // Draw sun (glow)
      ctx.save();
      const sunR = 38 * scale;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunR * 2.2);
      grad.addColorStop(0, SUN_COLOR);
      grad.addColorStop(0.3, SUN_GLOW);
      grad.addColorStop(1, 'rgba(255,255,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * 2.2, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.restore();
      // Draw sun (core)
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, sunR, 0, 2 * Math.PI);
      ctx.fillStyle = SUN_COLOR;
      ctx.shadowColor = SUN_GLOW;
      ctx.shadowBlur = 32 * scale;
      ctx.globalAlpha = 1;
      ctx.fill();
      ctx.restore();

      // Animate and draw planets
      for (let i = 0; i < PLANETS.length; i++) {
        const planet = PLANETS[i];
        planetAngles[i] += planet.speed * 0.7; // Animate
        const angle = planetAngles[i];
        const orbitX = cx + Math.cos(angle) * planet.orbit * scale;
        const orbitY = cy + Math.sin(angle) * planet.orbit * scale * 0.98;
        ctx.save();
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, planet.r * scale, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color + '99';
        ctx.shadowBlur = 24 * scale;
        ctx.globalAlpha = 0.98;
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        background: '#120b1a',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticlesBackground; 