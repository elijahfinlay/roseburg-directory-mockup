import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin, Phone, Globe, ArrowLeft, Star, Building2,
  Newspaper, Share2, Heart, ChevronRight,
} from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import CategoryTag from "@/app/components/CategoryTag";
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

export default function ListingPage({ params }: Props) {
  // TODO: fetch from DB
  const business = MOCK_BUSINESSES.find((b) => b.id === params.id);
  if (!business) notFound();

  // Related listings — same category, different id
  // TODO: fetch from DB with category filter
  const related = MOCK_BUSINESSES.filter(
    (b) => b.id !== business.id && b.categories.some((c) => business.categories.includes(c))
  ).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 bg-rt-surface">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-rt-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-1.5 text-xs font-sans text-rt-textMuted">
              <Link href="https://roseburgtracker.com" className="hover:text-rt-amber transition-colors">Home</Link>
              <ChevronRight size={12} className="text-rt-textLight" />
              <Link href="/directory" className="hover:text-rt-amber transition-colors">Directory</Link>
              <ChevronRight size={12} className="text-rt-textLight" />
              <span className="text-rt-text font-medium truncate max-w-xs">{business.name}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left / main column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero card */}
              <div className="rt-card overflow-hidden">
                {/* Hero banner */}
                <div
                  className="h-36 flex items-center justify-center"
                  style={{ backgroundColor: business.logoColor + "22" }}
                >
                  <div
                    className="w-20 h-20 rounded-xl flex items-center justify-center text-white font-serif font-bold text-2xl shadow-md"
                    style={{ backgroundColor: business.logoColor }}
                  >
                    {business.logoPlaceholder}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h1 className="font-serif text-2xl md:text-3xl text-rt-text mb-2 leading-tight">
                        {business.name}
                      </h1>
                      <div className="flex flex-wrap gap-1.5">
                        {business.categories.map((cat) => (
                          <CategoryTag key={cat} category={cat} size="md" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {business.featured && (
                        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold font-sans px-3 py-1.5 rounded-full">
                          <Star size={12} fill="currentColor" />
                          Featured Listing
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Featured in feed badge */}
                  {business.featured && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-card px-4 py-3 mb-4">
                      <Newspaper size={16} className="text-rt-amber flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold font-sans text-rt-text">
                          Featured in the Roseburg Tracker feed
                        </p>
                        <p className="text-xs font-sans text-rt-textMuted">
                          This business appears in the news feed as a featured sponsor.
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-base font-sans text-rt-textMuted leading-relaxed">
                    {business.description}
                  </p>
                </div>
              </div>

              {/* Map placeholder */}
              {/* TODO: wire to Google Maps Embed API or Mapbox */}
              <div className="rt-card overflow-hidden">
                <div className="p-4 border-b border-rt-border">
                  <h2 className="font-serif text-lg text-rt-text flex items-center gap-2">
                    <MapPin size={18} className="text-rt-amber" />
                    Location
                  </h2>
                </div>
                <div className="bg-rt-surface h-52 flex flex-col items-center justify-center gap-2 border-b border-rt-border">
                  <MapPin size={28} className="text-rt-textLight" />
                  <p className="text-sm font-sans text-rt-textMuted">Map preview</p>
                  <p className="text-xs font-sans text-rt-textLight">
                    {/* TODO: embed Google Maps / Mapbox with address */}
                    Developer: embed map here using the address below
                  </p>
                </div>
                <div className="p-4">
                  <p className="text-sm font-sans text-rt-text">{business.address}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(business.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-rt-amber hover:underline font-sans mt-1 inline-block"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Right / sidebar */}
            <div className="space-y-5">
              {/* Contact card */}
              <div className="rt-card p-5">
                <h2 className="font-serif text-lg text-rt-text mb-4">Contact</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <MapPin size={16} className="text-rt-amber mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold font-sans text-rt-textMuted uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-sm font-sans text-rt-text">{business.address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={16} className="text-rt-amber mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold font-sans text-rt-textMuted uppercase tracking-wide mb-0.5">Phone</p>
                      <a href={`tel:${business.phone}`} className="text-sm font-sans text-rt-amber hover:text-rt-amberDark transition-colors">
                        {business.phone}
                      </a>
                    </div>
                  </li>
                  {business.website && (
                    <li className="flex items-start gap-3">
                      <Globe size={16} className="text-rt-amber mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold font-sans text-rt-textMuted uppercase tracking-wide mb-0.5">Website</p>
                        <a
                          href={business.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-sans text-rt-amber hover:text-rt-amberDark transition-colors break-all"
                        >
                          {business.website.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </li>
                  )}
                </ul>

                <div className="mt-5 space-y-2">
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rt-btn-primary w-full justify-center py-2.5"
                  >
                    <Globe size={15} />
                    Visit Website
                  </a>
                  <button className="rt-btn-outline w-full justify-center py-2.5">
                    <Share2 size={15} />
                    Share Listing
                  </button>
                </div>
              </div>

              {/* Plan badge */}
              <div className="rt-card p-4">
                <div className="flex items-center gap-2">
                  {business.plan === "annual" ? (
                    <>
                      <Star size={15} className="text-rt-amber" fill="currentColor" />
                      <div>
                        <p className="text-xs font-semibold font-sans text-rt-text">Annual Subscriber</p>
                        <p className="text-xs font-sans text-rt-textMuted">Priority feed placement</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Heart size={15} className="text-rt-amber" />
                      <div>
                        <p className="text-xs font-semibold font-sans text-rt-text">Monthly Subscriber</p>
                        <p className="text-xs font-sans text-rt-textMuted">Listed in the directory</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Back + list your own */}
              <div className="space-y-2">
                <Link href="/directory" className="flex items-center gap-1.5 text-sm font-sans font-medium text-rt-textMuted hover:text-rt-amber transition-colors">
                  <ArrowLeft size={14} />
                  Back to Directory
                </Link>
                <Link href="/directory/signup" className="flex items-center gap-1.5 text-sm font-sans font-medium text-rt-amber hover:text-rt-amberDark transition-colors">
                  <Building2 size={14} />
                  List your own business →
                </Link>
              </div>
            </div>
          </div>

          {/* Related listings */}
          {related.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-xl text-rt-text">Similar Listings</h2>
                <Link href="/directory" className="text-sm font-sans font-medium text-rt-amber hover:text-rt-amberDark transition-colors">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((biz) => (
                  <BusinessCard key={biz.id} business={biz} />
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
