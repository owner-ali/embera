"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GalleryItem {
  id: string;
  url: string;
  alt: string;
  category: string;
}

const categories = ["All", "Food", "Interior", "Chef", "Kitchen", "Events"];

export function GalleryMasonry({ images }: { images: GalleryItem[] }) {
  const [active, setActive] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = active === "All" ? images : images.filter((i) => i.category.toLowerCase() === active.toLowerCase());

  function close() { setLightboxIndex(null); }
  function next() { if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filtered.length); }
  function prev() { if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length); }

  return (
    <div onKeyDown={(e) => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); }}>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
              active === c ? "border-ember-500 bg-ember-500 text-ink" : "border-white/10 text-bone-muted hover:border-white/30"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {filtered.map((img, i) => (
          <motion.button
            key={img.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            onClick={() => setLightboxIndex(i)}
            className="group relative block w-full overflow-hidden rounded-2xl"
          >
            <Image
              src={img.url}
              alt={img.alt}
              width={600}
              height={i % 3 === 0 ? 750 : 450}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <p className="p-4 text-left text-sm text-bone">{img.alt}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-6"
            onClick={close}
            tabIndex={-1}
            autoFocus
          >
            <button aria-label="Close" onClick={close} className="absolute right-6 top-6 text-bone hover:text-gold"><X size={28} /></button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-bone hover:text-gold sm:left-8"><ChevronLeft size={32} /></button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-bone hover:text-gold sm:right-8"><ChevronRight size={32} /></button>
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-4xl"
            >
              <Image
                src={filtered[lightboxIndex].url}
                alt={filtered[lightboxIndex].alt}
                width={1200}
                height={900}
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
              <p className="mt-3 text-center text-sm text-bone-muted">{filtered[lightboxIndex].alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
