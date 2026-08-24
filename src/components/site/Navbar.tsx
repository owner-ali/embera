"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";

const links = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Experience", href: "/experience" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount());
  const toggleCart = useCart((s) => s.toggle);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass-panel py-3 shadow-card" : "bg-transparent py-6"
      )}
    >
      <nav className="container flex items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-[0.15em] text-bone">
          EMBERA
        </Link>

        <ul className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-body text-[13px] font-medium uppercase tracking-wider text-bone/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search menu"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-bone/80 transition-colors hover:bg-white/5 hover:text-gold md:flex"
          >
            <Search size={18} />
          </button>
          <button
            aria-label={`View cart, ${itemCount} items`}
            onClick={toggleCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-bone/80 transition-colors hover:bg-white/5 hover:text-gold"
          >
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ember-500 font-mono text-[10px] text-ink">
                {itemCount}
              </span>
            )}
          </button>
          <Link href="/reservations" className="btn-ember ml-2 hidden md:inline-flex">
            Reserve Table
          </Link>
          <button
            aria-label="Toggle menu"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-full text-bone lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-ink/98 backdrop-blur-xl lg:hidden"
          >
            <ul className="container flex flex-col gap-1 py-6">
              {links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-white/5 py-4 font-display text-2xl text-bone"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <Link href="/reservations" className="btn-ember mt-4 w-full">
                Reserve Table
              </Link>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
