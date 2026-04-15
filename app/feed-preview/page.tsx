import Link from "next/link";
import { Clock, Star, ExternalLink, ChevronRight, Info } from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import CategoryTag from "@/app/components/CategoryTag";
import { MOCK_BUSINESSES, MOCK_NEWS_POSTS } from "@/app/lib/mockData";

// TODO: fetch from DB — replace with real feed query
// TODO: implement the rotation engine: inject a featured business card every 5–8 news posts
//       using a round-robin / weighted algorithm (annual subscribers get higher weight)
//       See /admin/directory → Rotation Settings for the business logic spec

// Featured businesses (annual plan, active) for injection
// TODO: fetch from DB — filter by plan='annual' AND status='active', order by last_featured ASC (fair rotation)
const FEATURED_BUSINESSES = MOCK_BUSINESSES.filter(
  (b) => b.featured && b.status === "active"
);

// Build interleaved feed: inject a featured business card every 5–8 posts
// TODO: replace this static interleaving with a server-side rotation engine
function buildFeed() {
  const items: Array<
    | { type: "news"; data: (typeof MOCK_NEWS_POSTS)[number] }
    | { type: "business"; data: (typeof MOCK_BUSINESSES)[number] }
  > = [];

  let newsIdx = 0;
  let bizIdx = 0;
  // Inject a business card after every 5th news post
  const INJECT_EVERY = 5;

  while (newsIdx < MOCK_NEWS_POSTS.length) {
    items.push({ type: "news", data: MOCK_NEWS_POSTS[newsIdx] });
    newsIdx++;

    if (newsIdx % INJECT_EVERY === 0 && bizIdx < FEATURED_BUSINESSES.length) {
      items.push({ type: "business", data: FEATURED_BUSINESSES[bizIdx % FEATURED_BUSINESSES.length] });
      bizIdx++;
    }
  }

  return items;
}

const FEED = buildFeed();

// Category pill colors for news posts
const NEWS_CATEGORY_STYLES: Record<string, string> = {
  Government: "bg-slate-100 text-slate-700",
  Sports:     "bg-blue-100 text-blue-700",
  Healthcare: "bg-red-100 text-red-700",
  Wildfires:  "bg-orange-100 text-orange-700",
  "City Council": "bg-purple-100 text-purple-700",
  Education:  "bg-indigo-100 text-indigo-700",
  Environment: "bg-green-100 text-green-700",
  Community:  "bg-teal-100 text-teal-700",
  Arts:       "bg-pink-100 text-pink-700",
  default:    "bg-gray-100 text-gray-700",
};

function newsCategoryStyle(cat: string) {
  return NEWS_CATEGORY_STYLES[cat] ?? NEWS_CATEGORY_STYLES.default;
}

export default function FeedPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 bg-rt-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <Link href="/directory" className="text-xs font-sans text-rt-textMuted hover:text-rt-amber transition-colors">Directory</Link>
              <ChevronRight size={12} className="text-rt-textLight" />
              <span className="text-xs font-sans text-rt-textMuted">Feed Integration Preview</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-rt-text mb-2">
              Feed Integration Mockup
            </h1>
            <p className="text-sm font-sans text-rt-textMuted">
              This is a design preview showing how featured business cards appear auto-injected into the main Roseburg Tracker news feed every 5–8 posts.
            </p>
          </div>

          {/* Dev annotation box */}
          {/* TODO: remove this annotation box from production */}
          <div className="bg-amber-50 border border-amber-200 rounded-card p-4 mb-8 flex items-start gap-3">
            <Info size={16} className="text-rt-amber mt-0.5 flex-shrink-0" />
            <div className="text-xs font-sans text-rt-textMuted space-y-1">
              <p className="font-semibold text-rt-text">Developer notes for feed integration:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>Inject a <code className="bg-amber-100 px-1 rounded">FeaturedBusinessCard</code> component into the feed array every 5–8 news posts</li>
                <li>Rotation engine: round-robin across active subscribers, weighted by plan (annual = 2× weight)</li>
                <li>Track <code className="bg-amber-100 px-1 rounded">last_featured_at</code> per listing in DB to ensure fair distribution</li>
                <li>Monthly subscribers appear in rotation; annual subscribers appear more frequently and get the &ldquo;Featured&rdquo; badge</li>
                <li>Admin can manually pin a listing to the top slot via <Link href="/admin/directory" className="text-rt-amber underline">Rotation Settings</Link></li>
              </ul>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-4">
            {FEED.map((item, i) => {
              if (item.type === "news") {
                // News post card
                const post = item.data;
                return (
                  <article
                    key={post.id}
                    className="rt-card p-5 flex gap-4 hover:shadow-cardHover transition-shadow"
                  >
                    {/* Image placeholder */}
                    <div
                      className="w-20 h-16 sm:w-24 sm:h-18 rounded flex-shrink-0 bg-rt-border flex items-center justify-center"
                      style={{ backgroundColor: "#e5e7eb" }}
                    >
                      <span className="text-xs font-sans text-rt-textLight text-center leading-tight px-1">Photo</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-xs font-semibold font-sans px-2 py-0.5 rounded-full ${newsCategoryStyle(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <h3 className="font-serif text-base text-rt-text leading-snug mb-1 line-clamp-2">
                        {post.headline}
                      </h3>
                      <p className="text-xs font-sans text-rt-textMuted line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs font-sans text-rt-textLight">
                        <Clock size={11} />
                        <span>{post.publishedAt}</span>
                        <span>·</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </article>
                );
              } else {
                // Featured business card — injected into feed
                const biz = item.data;
                return (
                  <div key={`biz-${biz.id}-${i}`} className="relative">
                    {/* "Sponsored / Featured Local Business" label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-px bg-rt-border" />
                      <span className="text-xs font-semibold font-sans text-rt-textLight uppercase tracking-wide flex items-center gap-1">
                        <Star size={10} fill="currentColor" className="text-rt-amber" />
                        Featured Local Business
                      </span>
                      <div className="flex-1 h-px bg-rt-border" />
                    </div>

                    <article className="bg-white border-2 border-amber-200 rounded-card shadow-card p-5 flex gap-4">
                      {/* Logo */}
                      <div
                        className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-serif font-bold text-base flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: biz.logoColor }}
                      >
                        {biz.logoPlaceholder}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Star size={11} fill="currentColor" className="text-rt-amber" />
                              <span className="text-xs font-semibold font-sans text-rt-amber">Featured</span>
                            </div>
                            <Link href={`/directory/listing/${biz.id}`}>
                              <h3 className="font-serif text-lg text-rt-text hover:text-rt-amber transition-colors leading-snug">
                                {biz.name}
                              </h3>
                            </Link>
                          </div>
                          <div className="flex flex-wrap gap-1 flex-shrink-0">
                            {biz.categories.map((cat) => (
                              <CategoryTag key={cat} category={cat} />
                            ))}
                          </div>
                        </div>

                        <p className="text-sm font-sans text-rt-textMuted leading-relaxed mt-1 mb-3">
                          {biz.description}
                        </p>

                        <div className="flex items-center gap-4">
                          <Link
                            href={`/directory/listing/${biz.id}`}
                            className="text-xs font-semibold font-sans text-rt-amber hover:text-rt-amberDark transition-colors"
                          >
                            View listing →
                          </Link>
                          <a
                            href={biz.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-semibold font-sans text-rt-textMuted hover:text-rt-amber transition-colors"
                          >
                            Visit website
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </article>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-px bg-rt-border" />
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* Bottom nav */}
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center gap-4">
              <Link href="/directory" className="rt-btn-outline text-sm px-5 py-2">
                Browse Directory
              </Link>
              <Link href="/admin/directory" className="rt-btn-primary text-sm px-5 py-2">
                Admin Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
