'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';

export interface FlyingParticleData {
  id: string;
  type: 'cart' | 'wishlist';
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  image?: string;
  cartPayload?: {
    product: Product;
    quantity: number;
    variant: string;
  };
  wishlistPayload?: {
    productId: string;
  };
}

interface FlyToHeaderOverlayProps {
  particles: FlyingParticleData[];
  onParticleComplete: (particle: FlyingParticleData) => void;
}

interface BurstEffect {
  id: string;
  type: 'cart' | 'wishlist';
  x: number;
  y: number;
}

const SingleParticle: React.FC<{
  particle: FlyingParticleData;
  onDone: (finalX: number, finalY: number) => void;
}> = ({ particle, onDone }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    // 1100ms for a clear, readable, graceful parabolic arc
    const duration = 1100;

    // Helper to query live target coordinates so particles always hit button center
    const getLiveTarget = () => {
      const targetId = particle.type === 'cart' ? 'header-cart-btn' : 'header-wishlist-btn';
      const el = document.getElementById(targetId);
      if (el) {
        const rect = el.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      }
      return { x: particle.targetX, y: particle.targetY };
    };

    let lastLiveX = particle.targetX;
    let lastLiveY = particle.targetY;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Graceful deceleration easing curve (cubic out)
      const ease = 1 - Math.pow(1 - progress, 2.8);

      // Re-read live target coordinates in case of scroll or dynamic layout
      const liveTarget = getLiveTarget();
      lastLiveX = liveTarget.x;
      lastLiveY = liveTarget.y;

      // Parabolic high arch calculation
      const deltaY = Math.abs(particle.startY - liveTarget.y);
      const deltaX = liveTarget.x - particle.startX;
      const controlY = Math.min(particle.startY, liveTarget.y) - Math.max(160, deltaY * 0.42);
      const controlX = (particle.startX + liveTarget.x) / 2 + (deltaX >= 0 ? -45 : 45);

      // Bezier curve points
      const currentX =
        (1 - ease) * (1 - ease) * particle.startX +
        2 * (1 - ease) * ease * controlX +
        ease * ease * liveTarget.x;

      const currentY =
        (1 - ease) * (1 - ease) * particle.startY +
        2 * (1 - ease) * ease * controlY +
        ease * ease * liveTarget.y;

      // Dynamic scale: start at 0.55 -> energetic pop to 1.18 -> smoothly compress to 0.45 into button
      let scale = 1;
      if (progress < 0.18) {
        scale = 0.55 + (progress / 0.18) * 0.63;
      } else if (progress < 0.75) {
        scale = 1.18 - ((progress - 0.18) / 0.57) * 0.18;
      } else {
        scale = 1.0 - ((progress - 0.75) / 0.25) * 0.55;
      }

      // Smooth opacity fade out right at target absorption
      const opacity = progress > 0.95 ? (1 - progress) / 0.05 : 1;

      // Gentle rotation during flight
      const rotation = (ease * 360 * (deltaX >= 0 ? 1 : -1)) % 360;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
        containerRef.current.style.opacity = `${opacity}`;
      }

      // Stardust trail 1 with subtle delay
      if (trail1Ref.current) {
        const trail1Ease = Math.max(0, ease - 0.05);
        const t1X =
          (1 - trail1Ease) * (1 - trail1Ease) * particle.startX +
          2 * (1 - trail1Ease) * trail1Ease * controlX +
          trail1Ease * trail1Ease * liveTarget.x;
        const t1Y =
          (1 - trail1Ease) * (1 - trail1Ease) * particle.startY +
          2 * (1 - trail1Ease) * trail1Ease * controlY +
          trail1Ease * trail1Ease * liveTarget.y;
        trail1Ref.current.style.transform = `translate3d(${t1X}px, ${t1Y}px, 0) translate(-50%, -50%) scale(${scale * 0.65})`;
        trail1Ref.current.style.opacity = `${opacity * 0.75}`;
      }

      // Stardust trail 2 with deeper delay
      if (trail2Ref.current) {
        const trail2Ease = Math.max(0, ease - 0.1);
        const t2X =
          (1 - trail2Ease) * (1 - trail2Ease) * particle.startX +
          2 * (1 - trail2Ease) * trail2Ease * controlX +
          trail2Ease * trail2Ease * liveTarget.x;
        const t2Y =
          (1 - trail2Ease) * (1 - trail2Ease) * particle.startY +
          2 * (1 - trail2Ease) * trail2Ease * controlY +
          trail2Ease * trail2Ease * liveTarget.y;
        trail2Ref.current.style.transform = `translate3d(${t2X}px, ${t2Y}px, 0) translate(-50%, -50%) scale(${scale * 0.4})`;
        trail2Ref.current.style.opacity = `${opacity * 0.45}`;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        safeDone(lastLiveX, lastLiveY);
      }
    };

    let isDone = false;
    const safeDone = (x: number, y: number) => {
      if (isDone) return;
      isDone = true;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimer);
      onDone(x, y);
    };

    const safetyTimer = setTimeout(() => {
      safeDone(lastLiveX, lastLiveY);
    }, duration + 150);

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(safetyTimer);
    };
  }, [particle, onDone]);

  const isCart = particle.type === 'cart';

  return (
    <>
      {/* Trailing Comet Stardust 2 */}
      <div
        ref={trail2Ref}
        className={`absolute top-0 left-0 w-3 h-3 rounded-full pointer-events-none will-change-transform ${
          isCart ? 'bg-sky-400 blur-[1px]' : 'bg-rose-400 blur-[1px]'
        }`}
      />

      {/* Trailing Comet Stardust 1 */}
      <div
        ref={trail1Ref}
        className={`absolute top-0 left-0 w-4.5 h-4.5 rounded-full pointer-events-none will-change-transform ${
          isCart ? 'bg-cyan-300 blur-[2px]' : 'bg-pink-300 blur-[2px]'
        }`}
      />

      {/* Main Flying Orb */}
      <div
        ref={containerRef}
        className="absolute top-0 left-0 pointer-events-none will-change-transform z-[9999]"
      >
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5 border-2 border-white shadow-2xl flex items-center justify-center relative overflow-visible ${
            isCart
              ? 'bg-gradient-to-br from-sky-400 via-sky-500 to-sky-700 shadow-sky-500/60'
              : 'bg-gradient-to-br from-rose-400 via-rose-500 to-red-600 shadow-rose-500/60'
          }`}
          style={{
            boxShadow: isCart
              ? '0 0 25px rgba(14, 165, 233, 0.8), 0 8px 18px rgba(14, 165, 233, 0.4)'
              : '0 0 25px rgba(244, 63, 94, 0.8), 0 8px 18px rgba(244, 63, 94, 0.4)',
          }}
        >
          {isCart ? (
            particle.image && !imgFailed ? (
              <div className="w-full h-full rounded-full bg-white overflow-hidden p-0.5 flex items-center justify-center">
                <img
                  src={particle.image}
                  alt=""
                  onError={() => setImgFailed(true)}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>
            ) : (
              <ShoppingCart className="w-5 h-5 text-white fill-white/30" />
            )
          ) : (
            <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
          )}

          {/* Glowing Pill Badge Indicator (+1) */}
          <div
            className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black text-white shadow-md border border-white flex items-center justify-center ${
              isCart ? 'bg-sky-700' : 'bg-rose-700'
            }`}
          >
            +1
          </div>

          {/* Ambient Outer Halo Ring */}
          <div
            className={`absolute -inset-1.5 rounded-full blur-xs opacity-75 pointer-events-none ${
              isCart ? 'bg-sky-400/50' : 'bg-rose-400/50'
            }`}
          />
        </div>
      </div>
    </>
  );
};

// Celestial Sparkle Glints & Soft Bloom upon arriving at Header
const HeaderArrivalBurst: React.FC<{
  burst: BurstEffect;
  onFinished: () => void;
}> = ({ burst, onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(onFinished, 620);
    return () => clearTimeout(timer);
  }, [onFinished]);

  const isCart = burst.type === 'cart';

  // 6 delicate diamond sparkles radiating outward
  const SPARKLE_CONFIGS = [
    { x: 0, y: -34, delay: 0, size: 12 },
    { x: 28, y: -20, delay: 30, size: 10 },
    { x: 30, y: 18, delay: 65, size: 12 },
    { x: 0, y: 32, delay: 20, size: 9 },
    { x: -28, y: 18, delay: 50, size: 11 },
    { x: -28, y: -20, delay: 80, size: 9 },
  ];

  return (
    <div
      className="absolute pointer-events-none z-[9999]"
      style={{
        left: burst.x,
        top: burst.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Ethereal Soft Bloom Aura (replaces harsh border-ping) */}
      <div
        className={`absolute w-16 h-16 rounded-full pointer-events-none animate-arrival-bloom ${
          isCart ? 'bg-sky-400/35 shadow-lg shadow-sky-400/40' : 'bg-rose-400/35 shadow-lg shadow-rose-400/40'
        }`}
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Delicate Starburst Glints (✦ sparkles) */}
      {SPARKLE_CONFIGS.map((cfg, idx) => (
        <div
          key={idx}
          className="absolute pointer-events-none animate-sparkle-glint"
          style={{
            left: '50%',
            top: '50%',
            width: `${cfg.size}px`,
            height: `${cfg.size}px`,
            color: isCart ? '#38bdf8' : '#fb7185',
            animationDelay: `${cfg.delay}ms`,
            ['--sparkle-x' as any]: `${cfg.x}px`,
            ['--sparkle-y' as any]: `${cfg.y}px`,
          }}
        >
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current filter drop-shadow-[0_0_6px_currentColor]">
            <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
          </svg>
        </div>
      ))}
    </div>
  );
};

export const FlyToHeaderOverlay: React.FC<FlyToHeaderOverlayProps> = ({
  particles,
  onParticleComplete,
}) => {
  const [bursts, setBursts] = useState<BurstEffect[]>([]);

  const handleDone = (particle: FlyingParticleData, finalX: number, finalY: number) => {
    // Add arrival burst at exact target location
    setBursts((prev) => [
      ...prev,
      {
        id: `burst-${Date.now()}-${Math.random()}`,
        type: particle.type,
        x: finalX,
        y: finalY,
      },
    ]);

    onParticleComplete(particle);
  };

  const removeBurst = (burstId: string) => {
    setBursts((prev) => prev.filter((b) => b.id !== burstId));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {particles.map((particle) => (
        <SingleParticle
          key={particle.id}
          particle={particle}
          onDone={(finalX, finalY) => handleDone(particle, finalX, finalY)}
        />
      ))}

      {bursts.map((burst) => (
        <HeaderArrivalBurst
          key={burst.id}
          burst={burst}
          onFinished={() => removeBurst(burst.id)}
        />
      ))}
    </div>
  );
};

