"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Image as DreiImage } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Plus, Flame, Leaf } from "lucide-react";
import type { CarouselDish } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

const RADIUS = 4.4;

// ---------------------------------------------------------------
// One image plane, positioned on the circle and facing outward.
// Scale/opacity ease toward "active" state every frame.
// ---------------------------------------------------------------
function CarouselCard({
  url,
  index,
  total,
  isActive,
}: {
  url: string;
  index: number;
  total: number;
  isActive: boolean;
}) {
  const sector = (Math.PI * 2) / total;
  const angle = index * sector;
  const x = Math.sin(angle) * RADIUS;
  const z = Math.cos(angle) * RADIUS;
  const meshRef = useRef<any>(null);

  useFrame(() => {
    const m = meshRef.current;
    if (!m) return;
    const targetScale = isActive ? 1.5 : 0.82;
    m.scale.x = THREE.MathUtils.lerp(m.scale.x || 1, targetScale * 1.6, 0.09);
    m.scale.y = THREE.MathUtils.lerp(m.scale.y || 1, targetScale * 2.05, 0.09);
    if (m.material) {
      const targetOpacity = isActive ? 1 : 0.32;
      m.material.opacity = THREE.MathUtils.lerp(m.material.opacity ?? 1, targetOpacity, 0.09);
      m.material.transparent = true;
    }
  });

  return (
    <DreiImage
      ref={meshRef}
      url={url}
      position={[x, 0, z]}
      rotation={[0, angle, 0]}
      radius={0.14}
    />
  );
}

function Rig({
  groupRef,
  targetRotation,
}: {
  groupRef: React.RefObject<THREE.Group>;
  targetRotation: React.MutableRefObject<number>;
}) {
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current,
      0.08
    );
  });
  return null;
}

interface FoodCarousel3DProps {
  dishes: CarouselDish[];
}

export function FoodCarousel3D({ dishes }: FoodCarousel3DProps) {
  const total = dishes.length;
  const sector = (Math.PI * 2) / total;
  const [activeStep, setActiveStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef(0);
  const dragStartX = useRef(0);
  const dragStartStep = useRef(0);
  const addItem = useCart((s) => s.addItem);

  const activeIndex = ((activeStep % total) + total) % total;
  const activeDish = dishes[activeIndex];

  const goTo = useCallback(
    (step: number) => {
      setActiveStep(step);
      targetRotation.current = -step * sector;
    },
    [sector]
  );

  const next = useCallback(() => goTo(activeStep + 1), [activeStep, goTo]);
  const prev = useCallback(() => goTo(activeStep - 1), [activeStep, goTo]);

  // Autoplay — pauses on hover or drag
  useEffect(() => {
    if (hovered || dragging) return;
    const id = setInterval(() => goTo(activeStep + 1), 4200);
    return () => clearInterval(id);
  }, [activeStep, hovered, dragging, goTo]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  function onPointerDown(e: React.PointerEvent) {
    setDragging(true);
    dragStartX.current = e.clientX;
    dragStartStep.current = activeStep;
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const delta = e.clientX - dragStartX.current;
    const fractional = -delta / 140; // px per step
    targetRotation.current = -(dragStartStep.current + fractional) * sector;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    const delta = e.clientX - dragStartX.current;
    const fractional = -delta / 140;
    const newStep = Math.round(dragStartStep.current + fractional);
    goTo(newStep);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <div
        className="relative h-[420px] w-full touch-pan-y select-none sm:h-[480px] lg:h-[540px]"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="region"
        aria-label="Signature dishes, 3D carousel. Use arrow keys to navigate."
        tabIndex={0}
      >
        <Canvas camera={{ position: [0, 0, 9.5], fov: 42 }} dpr={[1, 1.75]}>
          <ambientLight intensity={1.1} />
          <group ref={groupRef}>
            {dishes.map((dish, i) => (
              <CarouselCard key={dish.id} url={dish.imageUrl} index={i} total={total} isActive={i === activeIndex} />
            ))}
          </group>
          <Rig groupRef={groupRef} targetRotation={targetRotation} />
        </Canvas>

        {/* Prev / Next controls */}
        <button
          aria-label="Previous dish"
          onClick={prev}
          className="glass-panel absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-bone transition-colors hover:text-gold sm:left-4"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          aria-label="Next dish"
          onClick={next}
          className="glass-panel absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-bone transition-colors hover:text-gold sm:right-4"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {dishes.map((d, i) => (
          <button
            key={d.id}
            aria-label={`Go to ${d.name}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex ? "w-6 bg-ember-400" : "w-1.5 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>

      {/* Active dish info panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDish.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-md text-center"
        >
          <div className="mb-2 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-smoke">
            <span>{activeDish.category}</span>
            {activeDish.isSpicy && <Flame size={12} className="text-ember-400" />}
            {activeDish.isVegetarian && <Leaf size={12} className="text-green-500" />}
          </div>
          <h3 className="font-display text-3xl text-bone">{activeDish.name}</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-bone-muted">{activeDish.description}</p>
          <div className="mt-4 flex items-center justify-center gap-1 font-mono text-sm text-gold">
            <Star size={14} className="fill-gold text-gold" />
            {activeDish.rating.toFixed(1)}
            <span className="text-smoke">({activeDish.ratingCount})</span>
          </div>
          <div className="mt-5 flex items-center justify-center gap-4">
            <span className="font-display text-2xl text-bone">{formatCurrency(activeDish.price)}</span>
            <button
              onClick={() =>
                addItem({
                  dishId: activeDish.id,
                  slug: activeDish.slug,
                  name: activeDish.name,
                  imageUrl: activeDish.imageUrl,
                  unitPrice: activeDish.price,
                  quantity: 1,
                })
              }
              className="btn-ember"
            >
              <Plus size={16} /> Add to Cart
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
