import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { Business } from "@/app/lib/mockData";

interface Props {
  business: Business;
  compact?: boolean;
}

// Category dot color — subtle visual indicator instead of heavy colored pills
const DOT: Record<string, string> = {
  Business:     "bg-amber-600",
  Service:      "bg-blue-600",
  Organization: "bg-emerald-600",
};

export default function BusinessCard({ business, compact = false }: Props) {
  return (
    <Link
      href={`/directory/listing/${business.id}`}
      className="group relative flex flex-col bg-white border border-rt-border hover:border-rt-text/30 transition-all duration-200 h-full"
    >
      {/* Featured marker — single subtle gold star, top right */}
      {business.featured && (
        <span className="absolute top-3 right-3 text-rt-amber" title="Featured listing">
          <Star size={13} fill="currentColor" />
        </span>
      )}

      {/* Header: logo + name */}
      <div className={`${compact ? "p-5" : "p-6"} pb-3`}>
        <div className="flex items-center gap-3 mb-4">
          {/* Logo — flatter, no shadow, slightly tighter */}
          <div
            className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0 text-white font-serif font-medium text-[13px] tracking-wide"
            style={{ backgroundColor: business.logoColor }}
            aria-hidden
          >
            {business.logoPlaceholder}
          </div>

          {/* Category dots + label — subtle */}
          <div className="flex items-center gap-1.5 text-[11px] font-sans uppercase tracking-[0.12em] text-rt-text/50 font-medium min-w-0">
            {business.categories.map((cat, i) => (
              <span key={cat} className="flex items-center gap-1.5 flex-shrink-0">
                {i > 0 && <span className="text-rt-text/20">·</span>}
                <span className={`w-1.5 h-1.5 rounded-full ${DOT[cat]}`} />
                <span>{cat}</span>
              </span>
            ))}
          </div>
        </div>

        <h3 className="font-serif text-[22px] leading-[1.15] text-rt-text group-hover:text-rt-amber transition-colors mb-2 tracking-tight">
          {business.name}
        </h3>

        <p className="text-[14px] font-sans text-rt-text/65 leading-relaxed line-clamp-3">
          {business.description}
        </p>
      </div>

      {/* Footer: address + chevron */}
      <div className="mt-auto px-6 py-4 border-t border-rt-border flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-sans text-rt-text/60 truncate leading-tight">
            {business.address.split(",")[0]}
          </p>
          <p className="text-[12px] font-sans text-rt-text/40 truncate leading-tight mt-0.5">
            {business.phone}
          </p>
        </div>
        <ArrowUpRight
          size={16}
          className="flex-shrink-0 text-rt-text/30 group-hover:text-rt-amber group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </div>
    </Link>
  );
}
