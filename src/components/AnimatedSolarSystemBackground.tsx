import React, { useEffect, useRef } from 'react';
import earthImgSrc from '../assets/Earth-removebg-preview.png';
import marsImgSrc from '../assets/Mars-removebg-preview.png';
import mercuryImgSrc from '../assets/Mercury-removebg-preview.png';
import moonImgSrc from '../assets/image-removebg-preview (1).png';
import jupiterImgSrc from '../assets/jupiter-removebg-preview.png';
import neptuneImgSrc from '../assets/neptune-removebg-preview.png';
import saturnImgSrc from '../assets/saturn-image-removebg-preview.png';
import sunImgSrc from '../assets/sun-removebg-preview.png';
import uranusImgSrc from '../assets/uranus-removebg-preview.png';
import venusImgSrc from '../assets/venus-removebg-preview (1).png';

// Solar system data (distances and sizes are not to scale for aesthetics)
const PLANETS = [
  { name: 'Mercury', img: mercuryImgSrc, orbit: 60, r: 12, speed: 0.018 },
  { name: 'Venus', img: venusImgSrc, orbit: 90, r: 18, speed: 0.014 },
  { name: 'Earth', img: earthImgSrc, orbit: 160, r: 20, speed: 0.011 },
  { name: 'Mars', img: marsImgSrc, orbit: 250, r: 16, speed: 0.009 },
  { name: 'Jupiter', img: jupiterImgSrc, orbit: 320, r: 36, speed: 0.006 },
  { name: 'Saturn', img: saturnImgSrc, orbit: 400, r: 32, speed: 0.005 },
  { name: 'Uranus', img: uranusImgSrc, orbit: 480, r: 24, speed: 0.004 },
  { name: 'Neptune', img: neptuneImgSrc, orbit: 560, r: 22, speed: 0.003 },
];

const MOON = {
  img: moonImgSrc,
  orbit: 28, // relative to Earth center
  r: 6,
  speed: 0.04, // faster than Earth's orbit
};

const AnimatedSolarSystemBackground: React.FC = () => {
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
    // Calculate dynamic scale so Neptune's orbit fits with margin
    const maxOrbit = Math.max(...PLANETS.map(p => p.orbit));
    const margin = 0.10; // 20% margin for better fit
    let fitScale = ((Math.min(width, height) / 2) * (1 - margin)) / maxOrbit;
    let scale = fitScale;

    function resize() {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cx = width / 2;
      cy = height / 2;
      scale = fitScale;
    }
    window.addEventListener('resize', resize);

    // Preload images
    const sunImg = new window.Image();
    sunImg.src = sunImgSrc;
    const planetImgs = PLANETS.map(p => {
      const img = new window.Image();
      img.src = p.img;
      return img;
    });
    const moonImg = new window.Image();
    moonImg.src = MOON.img;

    // Generate static starfield (positions and sizes)
    const STAR_COUNT = 180;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.5,
      baseOpacity: 0.3 + Math.random() * 0.7,
      twinkleSpeed: 0.5 + Math.random() * 1.5,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    // Each planet gets its own angle
    const planetAngles = PLANETS.map(() => Math.random() * Math.PI * 2);
    let moonAngle = Math.random() * Math.PI * 2;

    function drawOrbits() {
      for (const planet of PLANETS) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.13)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, planet.orbit * scale, planet.orbit * scale, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawBackground(time: number) {
      // Draw solid dark black background
      ctx.save();
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      // Draw animated twinkling stars
      for (const s of stars) {
        ctx.save();
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 * s.twinkleSpeed + s.twinklePhase);
        ctx.globalAlpha = s.baseOpacity * (0.7 + 0.6 * twinkle);
        ctx.beginPath();
        ctx.arc(s.x * width, s.y * height, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }
    }

    function draw(time = 0) {
      ctx.clearRect(0, 0, width, height);
      drawBackground(time);
      // Draw orbits
      drawOrbits();
      // Draw sun
      const sunR = 48 * scale;
      ctx.save(); ctx.globalAlpha = 1;
      ctx.drawImage(sunImg, cx - sunR, cy - sunR, sunR * 2, sunR * 2);
      ctx.restore();
      // Animate and draw planets
      for (let i = 0; i < PLANETS.length; i++) {
        const planet = PLANETS[i];
        planetAngles[i] += planet.speed * 0.7;
        const angle = planetAngles[i];
        const orbitX = cx + Math.cos(angle) * planet.orbit * scale;
        const orbitY = cy + Math.sin(angle) * planet.orbit * scale;
        const planetImg = planetImgs[i];
        ctx.save(); ctx.globalAlpha = 1;
        ctx.drawImage(
          planetImg,
          orbitX - planet.r * scale,
          orbitY - planet.r * scale,
          planet.r * 2 * scale,
          planet.r * 2 * scale
        );
        ctx.restore();
        // Draw moon orbiting Earth
        if (planet.name === 'Earth') {
          moonAngle += MOON.speed * 0.7;
          const moonOrbitX = orbitX + Math.cos(moonAngle) * MOON.orbit * scale;
          const moonOrbitY = orbitY + Math.sin(moonAngle) * MOON.orbit * scale;
          ctx.save(); ctx.globalAlpha = 1;
          ctx.drawImage(
            moonImg,
            moonOrbitX - MOON.r * scale,
            moonOrbitY - MOON.r * scale,
            MOON.r * 2 * scale,
            MOON.r * 2 * scale
          );
          ctx.restore();
        }
      }
      animationRef.current = requestAnimationFrame(draw);
    }
    // Wait for all images to load before starting animation
    const allImgs = [sunImg, moonImg, ...planetImgs];
    let loaded = 0;
    allImgs.forEach(img => {
      img.onload = () => {
        loaded++;
        if (loaded === allImgs.length) {
          draw();
        }
      };
    });

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

export default AnimatedSolarSystemBackground; 