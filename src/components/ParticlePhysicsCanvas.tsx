import React, { useEffect, useRef } from 'react';
import { FloatingParticle, Point2D, Shockwave } from '../types';
import { SeasonId, SEASONS_CONFIG } from '../data/config';

interface ParticlePhysicsCanvasProps {
  pointer: Point2D;
  isPointerActive: boolean;
  season: SeasonId;
  ripplePoint?: Point2D | null;
}

export const ParticlePhysicsCanvas: React.FC<ParticlePhysicsCanvasProps> = ({
  pointer,
  isPointerActive,
  season,
  ripplePoint,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<FloatingParticle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const animFrameId = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const pointerVelocityRef = useRef<Point2D>({ x: 0, y: 0 });
  const lastPointerRef = useRef<Point2D>({ x: pointer.x, y: pointer.y });
  const lastRippleRef = useRef<Point2D | null>(null);
  const pointerRef = useRef<Point2D>(pointer);
  const isPointerActiveRef = useRef<boolean>(isPointerActive);
  const seasonRef = useRef<SeasonId>(season);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    isPointerActiveRef.current = isPointerActive;
  }, [isPointerActive]);

  useEffect(() => {
    seasonRef.current = season;
  }, [season]);

  // Shockwave trigger
  useEffect(() => {
    if (ripplePoint && ripplePoint !== lastRippleRef.current) {
      lastRippleRef.current = ripplePoint;
      shockwavesRef.current.push({
        x: ripplePoint.x,
        y: ripplePoint.y,
        radius: 4,
        maxRadius: 180 + Math.random() * 80,
        strength: 1.0,
        color: SEASONS_CONFIG[season].rimColor,
        birth: performance.now(),
        lifetime: 900,
      });
    }
  }, [ripplePoint, season]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Number of particles optimized for buttery 60fps on mobile
    const particleCount = Math.min(75, Math.max(40, Math.floor(window.innerWidth / 18)));
    lastTimeRef.current = performance.now();
    lastPointerRef.current = { ...pointerRef.current };

    const particles: FloatingParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const z = 0.3 + Math.random() * 1.1;
      const typeRoll = Math.random();
      const type: FloatingParticle['type'] =
        typeRoll < 0.55 ? 'petal' : typeRoll < 0.8 ? 'mote' : typeRoll < 0.92 ? 'orb' : 'sparkle';

      const baseRadius =
        type === 'petal' ? 5 + Math.random() * 6 : type === 'orb' ? 8 + Math.random() * 12 : 2 + Math.random() * 2.5;

      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius: baseRadius * z,
        baseRadius,
        vx: (Math.random() - 0.48) * 0.5 * z,
        vy: (0.35 + Math.random() * 0.75) * z,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.035,
        type,
        color: '#ffffff',
        alpha: 0.3 + Math.random() * 0.6,
        targetAlpha: 0.4 + Math.random() * 0.6,
        pulseSpeed: 0.002 + Math.random() * 0.003,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    particlesRef.current = particles;

    const render = (now: number) => {
      const dt = Math.min(32, now - lastTimeRef.current);
      lastTimeRef.current = now;

      const currentPointer = pointerRef.current;
      const currentSeason = seasonRef.current;
      const pointerActive = isPointerActiveRef.current;

      pointerVelocityRef.current = {
        x: (currentPointer.x - lastPointerRef.current.x) * 0.3,
        y: (currentPointer.y - lastPointerRef.current.y) * 0.3,
      };
      lastPointerRef.current = { x: currentPointer.x, y: currentPointer.y };

      ctx.clearRect(0, 0, width, height);

      // Render shockwaves
      const activeShockwaves: Shockwave[] = [];
      const shockwaveBase =
        currentSeason === 'semi'
          ? 'rgba(244, 114, 182, '
          : currentSeason === 'panas'
          ? 'rgba(56, 189, 248, '
          : currentSeason === 'gugur'
          ? 'rgba(251, 191, 36, '
          : 'rgba(186, 230, 253, ';

      for (let s of shockwavesRef.current) {
        const age = now - s.birth;
        const progress = age / s.lifetime;

        if (progress < 1) {
          s.radius += (s.maxRadius - s.radius) * 0.09;
          const alpha = (1 - progress) * 0.6 * s.strength;

          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `${shockwaveBase}${alpha})`;
          ctx.lineWidth = Math.max(1, 3 * (1 - progress));
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(s.x, s.y, Math.max(0, s.radius * 0.6), 0, Math.PI * 2);
          ctx.strokeStyle = `${shockwaveBase}${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          activeShockwaves.push(s);
        }
      }
      shockwavesRef.current = activeShockwaves;

      // Update & render seasonal particles
      for (let p of particlesRef.current) {
        // Season-specific physics dynamics
        let windX = 0;
        let windY = 0;

        if (currentSeason === 'semi') {
          // Spring: Fluttering, spiraling cherry blossom breeze
          windX = Math.sin(p.y * 0.005 + now * 0.001) * 0.7 * p.z + 0.3 * p.z;
          windY = 0.2 * Math.sin(p.x * 0.004 + now * 0.0008);
        } else if (currentSeason === 'panas') {
          // Summer: Floating fireflies & sun dust rising or hovering gently
          windX = Math.sin(now * 0.0012 + p.pulsePhase) * 0.4 * p.z;
          windY = -0.3 * p.z + Math.cos(now * 0.001 + p.id) * 0.2;
        } else if (currentSeason === 'gugur') {
          // Autumn: Heavier tumbling leaves gliding diagonally with gusting wind
          windX = Math.sin(p.y * 0.003 + now * 0.0014) * 0.9 * p.z + 0.5 * p.z;
          windY = 0.4 * p.z;
        } else {
          // Winter: Drifting, swirling crystalline snow powder
          windX = Math.sin(p.y * 0.006 + now * 0.001) * 0.5 * p.z;
          windY = 0.5 * p.z;
        }

        p.x += (p.vx + windX) * (dt / 16);
        p.y += (p.vy + windY) * (dt / 16);
        p.rotation += p.rotationSpeed * (dt / 16);

        // Fluid pointer deflection
        if (pointerActive) {
          const dx = p.x - currentPointer.x;
          const dy = p.y - currentPointer.y;
          const distSq = dx * dx + dy * dy;
          const maxDist = 150 * p.z;

          if (distSq < maxDist * maxDist && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / maxDist) * 3.2 * p.z;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
            p.x += pointerVelocityRef.current.x * 0.15;
            p.y += pointerVelocityRef.current.y * 0.15;
          }
        }

        // Boundary wrapping
        if (p.y > height + 25) {
          p.y = -20;
          p.x = Math.random() * width;
        } else if (p.y < -30) {
          p.y = height + 15;
        }
        if (p.x > width + 30) {
          p.x = -20;
        } else if (p.x < -30) {
          p.x = width + 20;
        }

        const alphaPhase = Math.sin(now * p.pulseSpeed + p.pulsePhase);
        const currentAlpha = Math.max(0.15, p.alpha + alphaPhase * 0.2);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // ==========================================
        // AUTHENTIC CGI SEASONAL SHAPE RENDERING
        // ==========================================
        if (currentSeason === 'semi') {
          // SPRING: True Notched Sakura Petal
          if (p.type === 'petal') {
            ctx.fillStyle = p.id % 2 === 0 ? '#fbcfe8' : '#fda4af';
            ctx.globalAlpha = currentAlpha * 0.9;
            ctx.beginPath();
            ctx.moveTo(0, -p.radius * 1.4);
            ctx.bezierCurveTo(p.radius * 0.8, -p.radius * 1.3, p.radius * 1.1, 0, p.radius * 0.3, p.radius * 1.3);
            ctx.lineTo(0, p.radius * 1.1); // subtle notch
            ctx.lineTo(-p.radius * 0.3, p.radius * 1.3);
            ctx.bezierCurveTo(-p.radius * 1.1, 0, -p.radius * 0.8, -p.radius * 1.3, 0, -p.radius * 1.4);
            ctx.fill();
          } else {
            // Spring Pollen / Sunlight Dust
            ctx.fillStyle = '#fff1f2';
            ctx.globalAlpha = currentAlpha * 0.75;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (currentSeason === 'panas') {
          // SUMMER: Glowing Hotaru (Firefly) with bioluminescent halo & Sun Dust
          if (p.type === 'petal' || p.type === 'orb') {
            const glowAlpha = (0.5 + Math.sin(now * 0.003 + p.pulsePhase) * 0.45) * currentAlpha;
            ctx.globalAlpha = glowAlpha;
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.radius * 2);
            grad.addColorStop(0, '#fef08a');
            grad.addColorStop(0.3, '#facc15');
            grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.4)');
            grad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 2, 0, Math.PI * 2);
            ctx.fill();

            // Bright core
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = glowAlpha * 1.2;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Sun ray prism sparkle
            ctx.globalAlpha = currentAlpha;
            ctx.fillStyle = '#67e8f9';
            const r = p.radius * 1.2;
            ctx.beginPath();
            ctx.moveTo(-r, 0);
            ctx.lineTo(r, 0);
            ctx.moveTo(0, -r);
            ctx.lineTo(0, r);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        } else if (currentSeason === 'gugur') {
          // AUTUMN: Ginkgo Leaf & Golden Momiji Leaf
          if (p.type === 'petal') {
            ctx.fillStyle = p.id % 2 === 0 ? '#f59e0b' : '#d97706';
            ctx.globalAlpha = currentAlpha * 0.92;
            // Ginkgo fan shape
            ctx.beginPath();
            ctx.moveTo(0, p.radius * 1.3);
            ctx.quadraticCurveTo(p.radius * 1.4, 0, p.radius * 1.2, -p.radius * 1.1);
            ctx.quadraticCurveTo(0, -p.radius * 0.7, -p.radius * 1.2, -p.radius * 1.1);
            ctx.quadraticCurveTo(-p.radius * 1.4, 0, 0, p.radius * 1.3);
            ctx.fill();
          } else {
            // Golden Autumn Embers
            ctx.fillStyle = '#fbbf24';
            ctx.globalAlpha = currentAlpha * 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // WINTER: True 6-Point Dendritic Snowflake
          if (p.type === 'petal' || p.type === 'sparkle') {
            ctx.globalAlpha = currentAlpha * 0.95;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = Math.max(0.75, 1.2 * p.z);
            const r = p.radius * 1.4;

            // 6-arm snowflake
            for (let arm = 0; arm < 3; arm++) {
              ctx.beginPath();
              ctx.moveTo(-r, 0);
              ctx.lineTo(r, 0);
              ctx.stroke();

              // Side branches
              ctx.beginPath();
              ctx.moveTo(r * 0.6, -r * 0.25);
              ctx.lineTo(r * 0.4, 0);
              ctx.lineTo(r * 0.6, r * 0.25);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(-r * 0.6, -r * 0.25);
              ctx.lineTo(-r * 0.4, 0);
              ctx.lineTo(-r * 0.6, r * 0.25);
              ctx.stroke();

              ctx.rotate(Math.PI / 3);
            }
          } else {
            // Crystalline Frost Powder
            ctx.fillStyle = '#e0f2fe';
            ctx.globalAlpha = currentAlpha * 0.8;
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        ctx.restore();
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="particle-physics-stage"
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
    />
  );
};
