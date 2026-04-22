"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import BusinessCard from "@/app/components/BusinessCard";
import { MOCK_BUSINESSES, type Category } from "@/app/lib/mockData";

// TODO: fetch from DB — replace with real Prisma query filtered by status: 'active'
const PAGE_SIZE = 9;

const CATEGORIES: { value: Category | "All"; label: string }[] = [
  { value: "All",          label: "All" },
  { value: "Business",     label: "Businesses" },
  { value: "Service",      label: "Services" },
  { value: "Organization", label: "Organizations" },
];

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [page, setPage] = useState(1);

  const active = useMemo(
    () => MOCK_BUSINESSES.filter((b) => b.status === "active"),
    []
  );

  // TODO: replace with server-side search + pagination
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return active.filter((b) => {
      const matchesQuery =
        q === "" ||
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q);
      const matchesCat =
        category === "All" || b.categories.includes(category as Category);
      return matchesQuery && matchesCat;
    });
  }, [query, category, active]);

  // Separate featured from the rest (only when on "All" + no query)
  const showFeaturedRow = category === "All" && query === "";
  const featured = useMemo(
    () => active.filter((b) => b.featured).slice(0, 3),
    [active]
  );

  const listings = showFeaturedRow
    ? filtered.filter((b) => !featured.some((f) => f.id === b.id))
    : filtered;

  const paginated = listings.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < listings.length;

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: active.length };
    (["Business", "Service", "Organization"] as Category[]).forEach((cat) => {
      c[cat] = active.filter((b) => b.categories.includes(cat)).length;
    });
    return c;
  }, [active]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />

      {/* ── Editorial header ── */}
      <header className="border-b border-rt-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="flex items-center gap-2 mb-6 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-medium">
            <span className="w-6 h-px bg-rt-amber" />
            <span>Local Listings · Roseburg, OR</span>
          </div>

          <h1 className="font-serif text-[44px] sm:text-[60px] md:text-[76px] leading-[0.95] tracking-tight text-rt-text max-w-4xl mb-5">
            The Roseburg
            <br />
            Directory.
          </h1>

          <p className="text-[16px] sm:text-[17px] font-sans text-rt-text/65 leading-relaxed max-w-xl">
            Trusted local businesses, services, and organizations across Douglas
            County — curated and kept current by Roseburg Tracker.
          </p>
        </div>
      </header>

      {/* ── Search + filter bar (sticky) ── */}
      <div className="border-b border-rt-border bg-white sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search row */}
          <div className="flex items-center gap-4 py-3 border-b border-rt-border/70">
            <Search size={16} className="text-rt-text/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by name, keyword, or address…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              // TODO: wire to full-text search index (Postgres tsvector / Algolia)
              className="flex-1 bg-transparent text-[15px] font-sans text-rt-text placeholder-rt-text/40 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-rt-text/40 hover:text-rt-amber transition-colors flex-shrink-0"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <Link
              href="/directory/signup"
              className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4 flex-shrink-0"
            >
              + List a business
            </Link>
          </div>

          {/* Filter tabs — text-based with underline for active */}
          <div className="flex items-center gap-7 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => {
              const active = category === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => {
                    setCategory(c.value);
                    setPage(1);
                  }}
                  className={`relative py-3 text-[13px] font-sans tracking-wide whitespace-nowrap transition-colors ${
                    active
                      ? "text-rt-text font-semibold"
                      : "text-rt-text/50 hover:text-rt-text font-medium"
                  }`}
                >
                  {c.label}
                  <span className="ml-1.5 text-[11px] text-rt-text/30 font-normal">
                    {counts[c.value]}
                  </span>
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-px h-px bg-rt-amber" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {filtered.length === 0 ? (
            /* Empty state */
            <div className="text-center py-24 max-w-md mx-auto">
              <p className="font-serif text-2xl text-rt-text mb-2">
                No listings match.
              </p>
              <p className="text-sm font-sans text-rt-text/60 mb-6">
                Try a different keyword or clear the category filter.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
                className="text-[13px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4"
              >
                Clear filters →
              </button>
            </div>
          ) : (
            <>
              {/* ── Featured row (only when on All / no search) ── */}
              {showFeaturedRow && featured.length > 0 && (
                <section className="mb-14">
                  <div className="flex items-baseline justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="font-serif text-[26px] text-rt-text tracking-tight">
                        Featured
                      </h2>
                      <span className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/40 font-medium">
                        In rotation
                      </span>
                    </div>
                    <Link
                      href="/feed-preview"
                      className="text-[12px] font-sans text-rt-text/50 hover:text-rt-amber transition-colors"
                    >
                      How it works →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-rt-border border border-rt-border">
                    {featured.map((biz) => (
                      <BusinessCard key={biz.id} business={biz} />
                    ))}
                  </div>
                </section>
              )}

              {/* ── All listings ── */}
              <section>
                <div className="flex items-baseline justify-between mb-6">
                  <h2 className="font-serif text-[26px] text-rt-text tracking-tight">
                    {showFeaturedRow
                      ? "All listings"
                      : query
                      ? `Results for "${query}"`
                      : `${category}s`}
                  </h2>
                  <p className="text-[12px] font-sans text-rt-text/50">
                    {listings.length} {listings.length === 1 ? "listing" : "listings"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rt-border border border-rt-border">
                  {paginated.map((biz) => (
                    <BusinessCard key={biz.id} business={biz} />
                  ))}
                </div>

                {/* Load more */}
                <div className="mt-12 flex items-center justify-center">
                  {hasMore ? (
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="text-[13px] font-sans font-semibold text-rt-text border-b border-rt-text hover:text-rt-amber hover:border-rt-amber transition-colors pb-0.5"
                    >
                      Load {Math.min(PAGE_SIZE, listings.length - page * PAGE_SIZE)} more
                    </button>
                  ) : listings.length > PAGE_SIZE ? (
                    <p className="text-[12px] font-sans text-rt-text/40">
                      End of results · {listings.length} listings
                    </p>
                  ) : null}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      {/* ── Refined CTA strip ── */}
      <section className="border-t border-rt-border bg-rt-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-2 mb-4 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-amber font-semibold">
                <span className="w-6 h-px bg-rt-amber" />
                <span>List your business</span>
              </div>
              <h2 className="font-serif text-[36px] md:text-[44px] leading-[1.05] tracking-tight text-rt-text mb-3">
                Get discovered by thousands of Roseburg-area readers.
              </h2>
              <p className="text-[15px] font-sans text-rt-text/65 leading-relaxed max-w-lg">
                Every listing auto-rotates into the Roseburg Tracker news feed,
                puts your business in front of locals searching for what you
                offer, and can be paused or canceled anytime.
              </p>
            </div>

            <div className="md:col-span-5 md:text-right">
              <div className="inline-flex flex-col md:items-end gap-3">
                <div className="flex items-baseline gap-4 text-rt-text">
                  <span className="font-serif text-[40px] tracking-tight">$10</span>
                  <span className="text-[13px] font-sans text-rt-text/50">/month</span>
                  <span className="text-rt-text/20 font-serif text-2xl">/</span>
                  <span className="font-serif text-[40px] tracking-tight">$100</span>
                  <span className="text-[13px] font-sans text-rt-text/50">/year</span>
                </div>
                <p className="text-[12px] font-sans text-rt-text/50">
                  Annual saves ~2 months
                </p>
                <Link
                  href="/directory/signup"
                  className="inline-flex items-center gap-2 bg-rt-text text-white text-[13px] font-sans font-semibold px-5 py-3 hover:bg-rt-amber transition-colors mt-2"
                >
                  Start your listing →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
