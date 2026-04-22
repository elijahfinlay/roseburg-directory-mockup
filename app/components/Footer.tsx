import Link from "next/link";

const FOOTER_COLS = [
  {
    title: "Sections",
    links: [
      { label: "News",      href: "https://roseburgtracker.com/news" },
      { label: "Sports",    href: "https://roseburgtracker.com/sports" },
      { label: "Community", href: "https://roseburgtracker.com/community" },
      { label: "Events",    href: "https://roseburgtracker.com/events" },
      { label: "Jobs",      href: "https://roseburgtracker.com/jobs" },
    ],
  },
  {
    title: "Directory",
    links: [
      { label: "Browse",         href: "/directory" },
      { label: "List a business", href: "/directory/signup" },
      { label: "Businesses",     href: "/directory?category=Business" },
      { label: "Services",       href: "/directory?category=Service" },
      { label: "Organizations",  href: "/directory?category=Organization" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Newsletter",  href: "https://roseburgtracker.com/newsletter" },
      { label: "Advertise",   href: "https://roseburgtracker.com/advertise" },
      { label: "Marketplace", href: "https://roseburgtracker.com/marketplace" },
      { label: "Coupons",     href: "https://roseburgtracker.com/coupons" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-rt-border bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-6">
            <Link
              href="https://roseburgtracker.com"
              className="font-serif text-[32px] md:text-[40px] tracking-tight text-rt-text hover:text-rt-amber transition-colors leading-none inline-block"
            >
              Roseburg Tracker
            </Link>
            <p className="text-[14px] font-sans text-rt-text/60 leading-relaxed max-w-sm mt-4">
              Independent local news and community resources for Roseburg and
              Douglas County, Oregon.
            </p>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-[11px] font-sans font-semibold text-rt-text uppercase tracking-[0.15em] mb-4">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[13px] font-sans text-rt-text/60 hover:text-rt-amber transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-rt-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-rt-text/50 font-sans">
            © 2026 Roseburg Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="https://roseburgtracker.com/privacy"
              className="text-[12px] text-rt-text/50 hover:text-rt-amber transition-colors font-sans"
            >
              Privacy
            </Link>
            <Link
              href="https://roseburgtracker.com/terms"
              className="text-[12px] text-rt-text/50 hover:text-rt-amber transition-colors font-sans"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
