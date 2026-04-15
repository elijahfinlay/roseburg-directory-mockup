"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown, MapPin, Building2, Wrench, Heart } from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import BusinessCard from "@/app/components/BusinessCard";
import { MOCK_BUSINESSES, type Category } from "@/app/lib/mockData";

// TODO: fetch from DB — replace with real Prisma query filtered by status: 'active'
const PAGE_SIZE = 9;

const CATEGORIES: { value: Category | "All"; label: string; icon: React.ReactNode }[] = [
  { value: "All",          label: "All Categories",  icon: <SlidersHorizontal size={14} /> },
  { value: "Business",     label: "Businesses",      icon: <Building2 size={14} /> },
  { value: "Service",      label: "Services",        icon: <Wrench size={14} /> },
  { value: "Organization", label: "Organizations",   icon: <Heart size={14} /> },
];

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [page, setPage] = useState(1);

  // TODO: replace with DB search query
  const filtered = useMemo(() => {
    return MOCK_BUSINESSES.filter((b) => {
      const matchesQuery =
        query.trim() === "" ||
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.description.toLowerCase().includes(query.toLowerCase()) ||
        b.address.toLowerCase().includes(query.toLowerCase());
      const matchesCat =
        category === "All" || b.categories.includes(category as Category);
      return matchesQuery && matchesCat;
    });
  }, [query, category]);

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = page * PAGE_SIZE < filtered.length;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      {/* Hero */}
      <section className="bg-rt-amber">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-amber-200" />
            <span className="text-amber-200 text-sm font-sans font-medium tracking-wide uppercase">
              Roseburg, Oregon
            </span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-3 leading-tight max-w-2xl">
            Discover Local Businesses, Services &amp; Organizations in Roseburg
          </h1>
          <p className="text-amber-100 font-sans text-base md:text-lg max-w-xl mb-8">
            Support your neighbors. Find trusted local businesses, service providers, and nonprofits serving Douglas County.
          </p>

          {/* Search + filter */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-rt-textLight pointer-events-none" />
              <input
                type="text"
                placeholder="Search businesses, services, organizations…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded border border-white/30 bg-white text-rt-text text-sm font-sans placeholder-rt-textLight focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value as Category | "All"); setPage(1); }}
                className="appearance-none w-full sm:w-auto pl-3 pr-8 py-2.5 rounded border border-white/30 bg-white text-rt-text text-sm font-sans focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-rt-textMuted pointer-events-none" />
            </div>
            <button type="submit" className="bg-rt-amberDark text-white font-semibold font-sans text-sm px-5 py-2.5 rounded hover:bg-rt-amberDark/90 transition-colors whitespace-nowrap border border-amber-900">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Category pill nav */}
      <div className="bg-white border-b border-rt-border sticky top-14 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2.5 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => { setCategory(c.value as Category | "All"); setPage(1); }}
                className={`flex items-center gap-1.5 flex-shrink-0 text-xs font-semibold font-sans px-3 py-1.5 rounded-full border transition-colors ${
                  category === c.value
                    ? "bg-rt-amber text-white border-rt-amber"
                    : "bg-white text-rt-textMuted border-rt-border hover:border-rt-amber hover:text-rt-amber"
                }`}
              >
                {c.icon}
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-rt-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-sans text-rt-textMuted">
                {filtered.length === 0
                  ? "No listings found"
                  : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""} found${category !== "All" ? ` in ${category}s` : ""}`}
              </p>
            </div>
            <Link href="/directory/signup" className="rt-btn-primary text-xs">
              + List Your Business
            </Link>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Building2 size={40} className="mx-auto text-rt-textLight mb-4" />
              <p className="font-serif text-xl text-rt-text mb-2">No listings found</p>
              <p className="text-sm font-sans text-rt-textMuted mb-6">
                Try a different search term or category.
              </p>
              <button onClick={() => { setQuery(""); setCategory("All"); }} className="rt-btn-outline">
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
                ))}
              </div>

              {/* Load more / pagination */}
              <div className="mt-10 text-center">
                {hasMore ? (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    className="rt-btn-outline px-6 py-2.5"
                  >
                    Load more listings ({filtered.length - page * PAGE_SIZE} remaining)
                  </button>
                ) : (
                  <p className="text-xs font-sans text-rt-textLight">
                    Showing all {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* CTA banner */}
      <section className="bg-white border-t border-rt-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-serif text-2xl text-rt-text mb-1">Own a business in Roseburg?</h2>
            <p className="text-sm font-sans text-rt-textMuted">
              Get listed in the directory and reach thousands of local readers through the Roseburg Tracker feed.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-sans text-rt-textMuted">Starting at $10/mo</span>
            <Link href="/directory/signup" className="rt-btn-primary px-6 py-2.5">
              Get listed →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
