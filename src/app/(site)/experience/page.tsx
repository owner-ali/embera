import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = { title: "Experience" };

const experiences = [
  {
    title: "Farm to Table",
    body: "Produce sourced within a day's drive, cooked the same day it arrives.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=80",
  },
  {
    title: "Open Kitchen",
    body: "Watch every dish come together at the fire station, feet from your table.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&q=80",
  },
  {
    title: "Chef's Table",
    body: "A front-row seat to a multi-course tasting, guided by the chef himself.",
    image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1400&q=80",
  },
  {
    title: "Private Dining",
    body: "A dedicated room for the moments that deserve one — up to 20 guests.",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1400&q=80",
  },
];

export default function ExperiencePage() {
  return (
    <div className="bg-ink pb-24 pt-32">
      <div className="container mb-14 max-w-lg">
        <p className="eyebrow mb-4">The Experience</p>
        <h1 className="section-heading">More than a meal.</h1>
      </div>

      <div className="container grid grid-cols-1 gap-6 sm:grid-cols-2">
        {experiences.map((e) => (
          <div key={e.title} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src={e.image}
              alt={e.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h2 className="font-display text-3xl text-bone">{e.title}</h2>
              <p className="mt-2 max-w-xs text-sm text-bone-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {e.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
