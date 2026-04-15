import Link from "next/link";
import { MapPin, Phone, ExternalLink, Star } from "lucide-react";
import type { Business } from "@/app/lib/mockData";
import CategoryTag from "./CategoryTag";

interface Props {
  business: Business;
}

export default function BusinessCard({ business }: Props) {
  return (
    <article className="rt-card flex flex-col overflow-hidden group">
      {/* Card top: logo + header */}
      <div className="p-5 flex items-start gap-4">
        {/* Logo placeholder */}
        <div
          className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-serif font-bold text-lg shadow-sm"
          style={{ backgroundColor: business.logoColor }}
          aria-label={`${business.name} logo`}
        >
          {business.logoPlaceholder}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/directory/listing/${business.id}`} className="hover:text-rt-amber transition-colors">
              <h3 className="font-serif text-lg text-rt-text leading-snug line-clamp-2">
                {business.name}
              </h3>
            </Link>
            {business.featured && (
              <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold font-sans text-rt-amber bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Star size={10} fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          {/* Category tags */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {business.categories.map((cat) => (
              <CategoryTag key={cat} category={cat} />
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-5 pb-4">
        <p className="text-sm font-sans text-rt-textMuted leading-relaxed line-clamp-3">
          {business.description}
        </p>
      </div>

      {/* Contact info */}
      <div className="px-5 pb-4 space-y-1.5 border-t border-rt-border pt-3 mt-auto">
        <div className="flex items-start gap-2 text-xs text-rt-textMuted font-sans">
          <MapPin size={13} className="mt-0.5 flex-shrink-0 text-rt-textLight" />
          <span className="leading-tight">{business.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-rt-textMuted font-sans">
          <Phone size={13} className="flex-shrink-0 text-rt-textLight" />
          <a href={`tel:${business.phone}`} className="hover:text-rt-amber transition-colors">
            {business.phone}
          </a>
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-5 py-3 bg-rt-surface border-t border-rt-border flex items-center justify-between">
        <Link
          href={`/directory/listing/${business.id}`}
          className="text-xs font-semibold font-sans text-rt-amber hover:text-rt-amberDark transition-colors"
        >
          View listing →
        </Link>
        <a
          href={business.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold font-sans text-rt-textMuted hover:text-rt-amber transition-colors"
        >
          Visit website
          <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
}
