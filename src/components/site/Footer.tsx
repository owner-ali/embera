import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="noise-overlay border-t border-white/5 bg-char">
      <div className="container grid grid-cols-1 gap-12 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl tracking-[0.15em] text-bone">EMBERA</p>
          <p className="mt-3 max-w-[220px] font-display italic text-bone-muted">
            Crafted for the Extraordinary.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone/70 transition-colors hover:border-gold hover:text-gold">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-bone/70 transition-colors hover:border-gold hover:text-gold">
              <Facebook size={16} />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Quick Links</p>
          <ul className="space-y-3 font-body text-sm text-bone-muted">
            <li><Link href="/menu" className="hover:text-gold">Menu</Link></li>
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
            <li><Link href="/gallery" className="hover:text-gold">Gallery</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Opening Hours</p>
          <ul className="space-y-2 font-body text-sm text-bone-muted">
            <li>Mon – Thu · 5pm – 11pm</li>
            <li>Fri – Sun · 12pm – 1am</li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">Contact</p>
          <ul className="space-y-3 font-body text-sm text-bone-muted">
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-ember-400" /> 214 Ember Lane, New York, NY 10012</li>
            <li className="flex items-center gap-2"><Phone size={16} className="text-ember-400" /> +1 (212) 555-0148</li>
            <li className="flex items-center gap-2"><Mail size={16} className="text-ember-400" /> reservations@embera.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="container text-center font-mono text-xs text-smoke">
          Designed &amp; Developed by <span className="text-bone-muted">CodedByAli</span>
        </p>
      </div>
    </footer>
  );
}
