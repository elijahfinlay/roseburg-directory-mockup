import Link from "next/link";
import { Clock, ExternalLink, ArrowUpRight, Star } from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import { MOCK_BUSINESSES, MOCK_NEWS_POSTS, type Category } from "@/app/lib/mockData";

// TODO: fetch from DB — replace with real feed query
// TODO: implement the rotation engine: inject a featured business card every 5–8 news posts
//       using a round-robin / weighted algorithm (annual subscribers get higher weight)
//       See /admin/directory → Rotation Settings for the business logic spec

// Featured businesses (annual plan, active) for injection
// TODO: fetch from DB — filter by plan='annual' AND status='active', order by last_featured ASC (fair rotation)
const FEATURED_BUSINESSES = MOCK_BUSINESSES.filter(
  (b) => b.featured && b.status === "active"
);

// Category dot — matches BusinessCard
const DOT: Record<Category, string> = {
  Business:     "bg-amber-600",
  Service:      "bg-blue-600",
  Organization: "bg-emerald-600",
};

// Build interleaved feed: inject a featured business card every 5 posts
// TODO: replace this static interleaving with a server-side rotation engine
function buildFeed() {
  const items: Array<
    | { type: "news"; data: (typeof MOCK_NEWS_POSTS)[number] }
    | { type: "business"; data: (typeof MOCK_BUSINESSES)[number] }
  > = [];

  let newsIdx = 0;
  let bizIdx = 0;
  const INJECT_EVERY = 5;

  while (newsIdx < MOCK_NEWS_POSTS.length) {
    items.push({ type: "news", data: MOCK_NEWS_POSTS[newsIdx] });
    newsIdx++;

    if (newsIdx % INJECT_EVERY === 0 && bizIdx < FEATURED_BUSINESSES.length) {
      items.push({
        type: "business",
        data: FEATURED_BUSINESSES[bizIdx % FEATURED_BUSINESSES.length],
      });
      bizIdx++;
    }
  }

  return items;
}

const FEED = buildFeed();

export default function FeedPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />

      {/* ── Editorial header ── */}
      <header className="border-b border-rt-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 md:pt-14 md:pb-10">
          <div className="flex items-center gap-2 mb-5 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-medium">
            <Link
              href="/directory"
              className="hover:text-rt-amber transition-colors"
            >
              Directory
            </Link>
            <span className="text-rt-text/20">/</span>
            <span>Feed integration preview</span>
          </div>
          <h1 className="font-serif text-[36px] sm:text-[48px] md:text-[56px] leading-[0.98] tracking-tight text-rt-text mb-4">
            How listings
            <br />
            appear in the feed.
          </h1>
          <p className="text-[15px] sm:text-[16px] font-sans text-rt-text/65 leading-relaxed max-w-2xl">
            A design preview showing how featured business cards auto-rotate into
            the Roseburg Tracker news feed — one card after every 5–8 news posts.
          </p>
        </div>
      </header>

      <main className="flex-1 bg-rt-surface/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* Subtle dev annotation box */}
          {/* TODO: remove this annotation box from production */}
          <div className="border-l-2 border-rt-amber pl-4 py-2 mb-10">
            <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-amber font-semibold mb-2">
              For developers
            </p>
            <ul className="text-[12px] font-sans text-rt-text/60 space-y-1 leading-relaxed">
              <li>
                Inject a{" "}
                <code className="bg-white border border-rt-border px-1 py-0.5 rounded text-[11px] text-rt-text/80">
                  FeaturedBusinessCard
                </code>{" "}
                into the feed array every 5–8 posts.
              </li>
              <li>
                Rotation engine: round-robin across active subscribers, annual = 2×
                weight.
              </li>
              <li>
                Track{" "}
                <code className="bg-white border border-rt-border px-1 py-0.5 rounded text-[11px] text-rt-text/80">
                  last_featured_at
                </code>{" "}
                per listing for fair distribution.
              </li>
              <li>
                Admins can manually pin a listing via{" "}
                <Link
                  href="/admin/directory"
                  className="text-rt-amber hover:underline underline-offset-4 font-medium"
                >
                  Rotation Settings
                </Link>
                .
              </li>
            </ul>
          </div>

          {/* Feed */}
          <div className="space-y-6">
            {FEED.map((item, i) => {
              if (item.type === "news") {
                // News post card
                const post = item.data;
                return (
                  <article
                    key={post.id}
                    className="bg-white border border-rt-border hover:border-rt-text/30 transition-colors p-5 flex gap-5"
                  >
                    {/* Image placeholder */}
                    <div
                      className="w-24 h-20 sm:w-28 sm:h-24 flex-shrink-0 bg-rt-surface flex items-center justify-center"
                      aria-hidden
                    >
                      <span className="text-[10px] font-sans text-rt-text/30 uppercase tracking-[0.15em]">
                        Photo
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold mb-1.5">
                        {post.category}
                      </p>
                      <h3 className="font-serif text-[18px] sm:text-[20px] text-rt-text leading-[1.15] tracking-tight mb-1.5 line-clamp-2">
                        {post.headline}
                      </h3>
                      <p className="text-[13px] font-sans text-rt-text/60 leading-relaxed line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-sans text-rt-text/40">
                        <Clock size={10} />
                        <span>{post.publishedAt}</span>
                        <span className="text-rt-text/20">·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                );
              } else {
                // Featured business card — injected into feed
                const biz = item.data;
                return (
                  <div key={`biz-${biz.id}-${i}`}>
                    {/* "Featured Local Business" label with amber rule */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-5 h-px bg-rt-amber" />
                      <span className="text-[10px] font-sans uppercase tracking-[0.18em] text-rt-amber font-semibold flex items-center gap-1.5">
                        <Star size={9} fill="currentColor" />
                        Featured local business
                      </span>
                      <span className="flex-1 h-px bg-rt-border" />
                    </div>

                    <article className="group bg-white border border-rt-text/20 hover:border-rt-text/50 transition-colors p-6">
                      <div className="flex items-start gap-5">
                        {/* Logo */}
                        <div
                          className="w-14 h-14 rounded flex items-center justify-center text-white font-serif font-medium text-[15px] tracking-wide flex-shrink-0"
                          style={{ backgroundColor: biz.logoColor }}
                          aria-hidden
                        >
                          {biz.logoPlaceholder}
                        </div>

                        <div className="flex-1 min-w-0">
                          {/* Category dots row */}
                          <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold mb-2">
                            {biz.categories.map((cat, idx) => (
                              <span
                                key={cat}
                                className="flex items-center gap-1.5"
                              >
                                {idx > 0 && (
                                  <span className="text-rt-text/20">·</span>
                                )}
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${DOT[cat]}`}
                                />
                                {cat}
                              </span>
                            ))}
                          </div>

                          <Link
                            href={`/directory/listing/${biz.id}`}
                            className="inline-block"
                          >
                            <h3 className="font-serif text-[22px] leading-[1.15] tracking-tight text-rt-text hover:text-rt-amber transition-colors mb-2">
                              {biz.name}
                            </h3>
                          </Link>

                          <p className="text-[14px] font-sans text-rt-text/65 leading-relaxed mb-4 line-clamp-2">
                            {biz.description}
                          </p>

                          <div className="flex items-center gap-5">
                            <Link
                              href={`/directory/listing/${biz.id}`}
                              className="inline-flex items-center gap-1.5 text-[12px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4"
                            >
                              View listing
                              <ArrowUpRight size={13} />
                            </Link>
                            <a
                              href={biz.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-sans text-rt-text/50 hover:text-rt-amber transition-colors"
                            >
                              Visit website
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      </div>
                    </article>

                    {/* Closing rule */}
                    <div className="mt-3 h-px bg-rt-border" />
                  </div>
                );
              }
            })}
          </div>

          {/* Bottom nav */}
          <div className="mt-14 pt-8 border-t border-rt-border flex items-center justify-center gap-6">
            <Link
              href="/directory"
              className="text-[13px] font-sans font-semibold text-rt-text border-b border-rt-text hover:text-rt-amber hover:border-rt-amber transition-colors pb-0.5"
            >
              Browse Directory
            </Link>
            <Link
              href="/admin/directory"
              className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold text-rt-text/60 hover:text-rt-amber transition-colors"
            >
              Admin Dashboard
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
