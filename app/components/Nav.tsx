"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Jobs",       href: "https://roseburgtracker.com/jobs" },
  { label: "Events",     href: "https://roseburgtracker.com/events" },
  { label: "Newsletter", href: "https://roseburgtracker.com/newsletter" },
  { label: "Advertise",  href: "https://roseburgtracker.com/advertise" },
  { label: "Directory",  href: "/directory", internal: true },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-white border-b border-rt-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark — text only, no logo block */}
          <Link
            href="https://roseburgtracker.com"
            className="font-serif text-[20px] sm:text-[22px] text-rt-text tracking-tight hover:text-rt-amber transition-colors leading-none"
          >
            Roseburg Tracker
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.internal && pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[13px] tracking-wide font-sans transition-colors ${
                    isActive
                      ? "text-rt-amber font-semibold"
                      : "text-rt-text/70 hover:text-rt-text font-medium"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[22px] left-0 right-0 h-px bg-rt-amber" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-rt-text/70 hover:text-rt-amber transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-rt-border py-2 flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.internal && pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-2 py-2.5 text-sm font-sans transition-colors ${
                    isActive
                      ? "text-rt-amber font-semibold"
                      : "text-rt-text/70 hover:text-rt-amber"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
