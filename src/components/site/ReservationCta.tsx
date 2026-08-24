import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export function ReservationCta() {
  return (
    <section className="relative overflow-hidden bg-ink py-28">
      <div className="absolute inset-0 opacity-25">
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=70"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink" />
      </div>
      <div className="container relative z-10 flex flex-col items-center text-center">
        <p className="eyebrow mb-5">Reservations</p>
        <h2 className="section-heading max-w-xl">A table by the fire is waiting.</h2>
        <p className="mt-5 max-w-md text-bone-muted">
          Book online in under a minute — we&apos;ll confirm within the hour.
        </p>
        <Link href="/reservations" className="btn-ember mt-9 group">
          Reserve a Table
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </section>
  );
}
