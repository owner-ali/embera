"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

export interface ReviewCard {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export function ReviewsCarousel({
  reviews,
  average,
  total,
}: {
  reviews: ReviewCard[];
  average: number;
  total: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 5500);
    return () => clearInterval(id);
  }, [reviews.length]);

  if (reviews.length === 0) return null;
  const review = reviews[index];

  return (
    <section id="reviews" className="bg-char py-24 md:py-32">
      <div className="container">
        <div className="mb-14 flex flex-col items-center text-center">
          <p className="eyebrow mb-4">Guest Reviews</p>
          <div className="flex items-center gap-3">
            <span className="font-display text-5xl text-gold">{average}</span>
            <div className="text-left">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={cn(i < Math.round(average) ? "fill-gold text-gold" : "text-smoke")} />
                ))}
              </div>
              <p className="font-mono text-xs text-smoke">{total} reviews</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <Quote size={32} className="mx-auto mb-6 text-ember-500/40" />
          <AnimatePresence mode="wait">
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-display text-2xl italic leading-snug text-bone md:text-3xl">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={cn(i < review.rating ? "fill-gold text-gold" : "text-smoke")} />
                  ))}
                </div>
              </div>
              <p className="mt-2 font-body text-sm text-bone-muted">
                {review.name} <span className="text-smoke">· {formatDate(review.date)}</span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              aria-label={`Show review from ${r.name}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-ember-400" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
