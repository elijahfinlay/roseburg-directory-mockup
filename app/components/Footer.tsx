import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-rt-surface border-t border-rt-border mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="https://roseburgtracker.com" className="flex items-center gap-2 group mb-3">
              <div className="w-7 h-7 bg-rt-amber rounded flex items-center justify-center">
                <span className="text-white font-serif font-bold text-xs">RT</span>
              </div>
              <span className="font-serif text-base text-rt-text group-hover:text-rt-amber transition-colors">
                Roseburg Tracker
              </span>
            </Link>
            <p className="text-xs text-rt-textMuted leading-relaxed max-w-xs">
              Local news and community resources for Roseburg and Douglas County, Oregon.
            </p>
          </div>

          {/* Sections */}
          <div>
            <h3 className="text-xs font-semibold font-sans text-rt-text uppercase tracking-wide mb-3">Sections</h3>
            <ul className="space-y-2">
              {["News", "Sports", "Community", "Events", "Jobs"].map((item) => (
                <li key={item}>
                  <Link href={`https://roseburgtracker.com/${item.toLowerCase()}`}
                    className="text-sm font-sans text-rt-textMuted hover:text-rt-amber transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Directory */}
          <div>
            <h3 className="text-xs font-semibold font-sans text-rt-text uppercase tracking-wide mb-3">Directory</h3>
            <ul className="space-y-2">
              {[
                { label: "Browse Businesses", href: "/directory" },
                { label: "List Your Business", href: "/directory/signup" },
                { label: "Restaurants", href: "/directory?category=Business" },
                { label: "Services", href: "/directory?category=Service" },
                { label: "Organizations", href: "/directory?category=Organization" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm font-sans text-rt-textMuted hover:text-rt-amber transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-xs font-semibold font-sans text-rt-text uppercase tracking-wide mb-3">Connect</h3>
            <ul className="space-y-2">
              {[
                { label: "Newsletter", href: "https://roseburgtracker.com/newsletter" },
                { label: "Advertise", href: "https://roseburgtracker.com/advertise" },
                { label: "Marketplace", href: "https://roseburgtracker.com/marketplace" },
                { label: "Coupons", href: "https://roseburgtracker.com/coupons" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href}
                    className="text-sm font-sans text-rt-textMuted hover:text-rt-amber transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-rt-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-rt-textMuted font-sans">
            © 2026 Roseburg Tracker. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="https://roseburgtracker.com/privacy" className="text-xs text-rt-textMuted hover:text-rt-amber transition-colors font-sans">Privacy</Link>
            <Link href="https://roseburgtracker.com/terms" className="text-xs text-rt-textMuted hover:text-rt-amber transition-colors font-sans">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
