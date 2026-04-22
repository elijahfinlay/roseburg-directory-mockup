import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Globe, ArrowLeft, Star, Share2, ArrowUpRight,
} from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import BusinessCard from "@/app/components/BusinessCard";
import { MOCK_BUSINESSES } from "@/app/lib/mockData";

// TODO: fetch from DB by id — replace MOCK_BUSINESSES.find with Prisma/Supabase query
// TODO: validate listing is 'active' before showing; redirect to /directory if lapsed/paused

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return MOCK_BUSINESSES.map((b) => ({ id: b.id }));
}

// Category dot — same subtle system as BusinessCard
const DOT: Record<string, string> = {
  Business: "bg-amber-600",
  Service: "bg-blue-600",
  Organization: "bg-emerald-600",
};

// Mock hours — TODO: add operating_hours field to DB schema
const MOCK_HOURS = [
  ["Monday",    "8:00 AM – 6:00 PM"],
  ["Tuesday",   "8:00 AM – 6:00 PM"],
  ["Wednesday", "8:00 AM – 6:00 PM"],
  ["Thursday",  "8:00 AM – 6:00 PM"],
  ["Friday",    "8:00 AM – 6:00 PM"],
  ["Saturday",  "9:00 AM – 4:00 PM"],
  ["Sunday",    "Closed"],
];

export default function ListingPage({ params }: Props) {
  // TODO: fetch from DB
  const business = MOCK_BUSINESSES.find((b) => b.id === params.id);
  if (!business) notFound();

  // TODO: fetch related from DB with category filter
  const related = MOCK_BUSINESSES.filter(
    (b) =>
      b.id !== business.id &&
      b.status === "active" &&
      b.categories.some((c) => business.categories.includes(c))
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />

      <main className="flex-1">
        {/* ── Breadcrumb ── */}
        <div className="border-b border-rt-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-[12px] font-sans text-rt-text/50">
              <Link href="/directory" className="hover:text-rt-amber transition-colors">
                Directory
              </Link>
              <span className="text-rt-text/20">/</span>
              <span className="text-rt-text truncate max-w-[50ch]">{business.name}</span>
            </nav>
          </div>
        </div>

        {/* ── Editorial hero ── */}
        <header className="border-b border-rt-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 md:pt-16 md:pb-14">
            {/* Category line */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mb-8 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-medium">
              {business.categories.map((cat) => (
                <span key={cat} className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${DOT[cat]}`} />
                  <span>{cat}</span>
                </span>
              ))}
              {business.featured && (
                <span className="flex items-center gap-1.5 text-rt-amber">
                  <Star size={11} fill="currentColor" />
                  Featured in rotation
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-8">
                <h1 className="font-serif text-[40px] sm:text-[56px] md:text-[72px] leading-[0.98] tracking-tight text-rt-text mb-5">
                  {business.name}
                </h1>
                <p className="text-[17px] md:text-[18px] font-sans text-rt-text/65 leading-relaxed max-w-xl">
                  {business.description}
                </p>
              </div>

              <div className="md:col-span-4 md:text-right">
                <div
                  className="inline-flex w-20 h-20 md:w-24 md:h-24 rounded items-center justify-center text-white font-serif font-medium text-2xl md:text-3xl tracking-wide"
                  style={{ backgroundColor: business.logoColor }}
                  aria-hidden
                >
                  {business.logoPlaceholder}
                  {/* TODO: render real <Image> here from logo URL in DB */}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Body: main + sidebar ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-12 gap-10 md:gap-14">
            {/* ── Main column ── */}
            <div className="md:col-span-8 space-y-14">
              {/* About */}
              <section>
                <h2 className="font-serif text-[11px] uppercase tracking-[0.18em] text-rt-text/50 font-semibold mb-4">
                  About
                </h2>
                <p className="font-sans text-[16px] text-rt-text leading-[1.7] mb-4">
                  {business.description}
                </p>
                {/* TODO: add long_description field to DB schema for full about content */}
                <p className="font-sans text-[16px] text-rt-text/70 leading-[1.7]">
                  Serving the Roseburg and Douglas County community,{" "}
                  {business.name} is committed to quality{" "}
                  {business.categories[0].toLowerCase()} with a connection to
                  local residents and businesses. Reach out directly for
                  appointments, quotes, or questions.
                </p>
              </section>

              {/* Hours */}
              <section>
                <div className="flex items-baseline justify-between mb-5">
                  <h2 className="font-serif text-[11px] uppercase tracking-[0.18em] text-rt-text/50 font-semibold">
                    Hours
                  </h2>
                  <span className="flex items-center gap-1.5 text-[12px] font-sans text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                    Open today
                  </span>
                </div>
                {/* TODO: add operating_hours JSONB field to DB schema */}
                <div className="divide-y divide-rt-border border-t border-b border-rt-border">
                  {MOCK_HOURS.map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex justify-between py-2.5 text-[14px] font-sans"
                    >
                      <span className="text-rt-text/60">{day}</span>
                      <span
                        className={
                          hours === "Closed" ? "text-rt-text/40" : "text-rt-text"
                        }
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Map placeholder */}
              <section>
                <h2 className="font-serif text-[11px] uppercase tracking-[0.18em] text-rt-text/50 font-semibold mb-5">
                  Location
                </h2>
                {/* TODO: embed Google Maps iframe or Mapbox component here */}
                <div className="border border-rt-border">
                  <div
                    className="h-56 md:h-72 flex flex-col items-center justify-center gap-2 relative overflow-hidden"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(0deg,#f3f4f6 0,#f3f4f6 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#f3f4f6 0,#f3f4f6 1px,transparent 1px,transparent 40px)",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <MapPin size={24} className="text-rt-amber" />
                    <p className="text-[12px] font-sans text-rt-text/50 uppercase tracking-[0.15em]">
                      Map placeholder
                    </p>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between gap-4 border-t border-rt-border">
                    <p className="text-[14px] font-sans text-rt-text">
                      {business.address}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        business.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4 whitespace-nowrap flex items-center gap-1"
                    >
                      Directions <ArrowUpRight size={12} />
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Sidebar ── */}
            <aside className="md:col-span-4">
              <div className="md:sticky md:top-24 space-y-8">
                {/* Contact block */}
                <div>
                  <h2 className="font-serif text-[11px] uppercase tracking-[0.18em] text-rt-text/50 font-semibold mb-4">
                    Contact
                  </h2>
                  <div className="space-y-4 pb-5 border-b border-rt-border">
                    <div>
                      <p className="text-[11px] font-sans text-rt-text/40 uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${business.phone.replace(/\D/g, "")}`}
                        className="text-[15px] font-sans text-rt-text hover:text-rt-amber transition-colors"
                      >
                        {business.phone}
                      </a>
                    </div>
                    <div>
                      <p className="text-[11px] font-sans text-rt-text/40 uppercase tracking-wide mb-1">
                        Address
                      </p>
                      <p className="text-[15px] font-sans text-rt-text leading-snug">
                        {business.address}
                      </p>
                    </div>
                    {business.website && (
                      <div>
                        <p className="text-[11px] font-sans text-rt-text/40 uppercase tracking-wide mb-1">
                          Website
                        </p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] font-sans text-rt-amber hover:underline underline-offset-4 break-all inline-flex items-center gap-1"
                        >
                          {business.website.replace(/^https?:\/\//, "")}
                          <ArrowUpRight size={12} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Primary CTA */}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-rt-text text-white text-[13px] font-sans font-semibold px-4 py-3 hover:bg-rt-amber transition-colors"
                    >
                      <Globe size={14} />
                      Visit Website
                    </a>
                  )}
                  <button className="mt-2 w-full inline-flex items-center justify-center gap-2 border border-rt-border text-[13px] font-sans font-semibold px-4 py-3 text-rt-text/70 hover:text-rt-text hover:border-rt-text/30 transition-colors">
                    <Share2 size={14} />
                    Share listing
                  </button>
                </div>

                {/* Subscription status — small, honest */}
                <div className="pb-5 border-b border-rt-border">
                  <p className="text-[11px] font-sans text-rt-text/40 uppercase tracking-wide mb-1.5">
                    Plan
                  </p>
                  <p className="text-[14px] font-sans text-rt-text">
                    {business.plan === "annual"
                      ? "Annual subscriber"
                      : "Monthly subscriber"}
                    {business.featured && (
                      <span className="ml-2 text-rt-amber">· Featured</span>
                    )}
                  </p>
                  <p className="text-[12px] font-sans text-rt-text/50 mt-0.5">
                    {/* TODO: fetch real Stripe subscription status */}
                    {business.plan === "annual"
                      ? "Priority feed rotation"
                      : "Appears in directory + feed rotation"}
                  </p>
                </div>

                {/* Claim / manage */}
                <div className="space-y-2">
                  <Link
                    href="/directory/signup"
                    className="text-[12px] font-sans text-rt-text/60 hover:text-rt-amber transition-colors block"
                  >
                    Is this your business? Claim listing →
                    {/* TODO: wire claim flow to ownership verification */}
                  </Link>
                  <Link
                    href="/directory"
                    className="text-[12px] font-sans text-rt-text/60 hover:text-rt-amber transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={12} /> Back to directory
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          {/* ── Related listings ── */}
          {related.length > 0 && (
            <section className="mt-20 pt-12 border-t border-rt-border">
              <div className="flex items-baseline justify-between mb-7">
                <div>
                  <p className="text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-semibold mb-1">
                    More to explore
                  </p>
                  <h2 className="font-serif text-[28px] text-rt-text tracking-tight">
                    Similar listings
                  </h2>
                </div>
                <Link
                  href="/directory"
                  className="text-[12px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rt-border border border-rt-border">
                {related.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
