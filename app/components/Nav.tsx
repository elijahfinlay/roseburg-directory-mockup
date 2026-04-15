"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Jobs", href: "https://roseburgtracker.com/jobs" },
  { label: "Advertise", href: "https://roseburgtracker.com/advertise" },
  { label: "Newsletter", href: "https://roseburgtracker.com/newsletter" },
  { label: "Events", href: "https://roseburgtracker.com/events" },
  { label: "Directory", href: "/directory", highlight: true },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-nav sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Site name */}
          <Link href="https://roseburgtracker.com" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-rt-amber rounded flex items-center justify-center flex-shrink-0">
              <span className="text-white font-serif font-bold text-sm leading-none">RT</span>
            </div>
            <span className="font-serif text-lg text-rt-text group-hover:text-rt-amber transition-colors">
              Roseburg Tracker
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rt-btn-primary text-xs px-3 py-1.5"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-sans font-medium text-rt-textMuted hover:text-rt-amber transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-1 text-rt-textMuted hover:text-rt-amber transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-rt-border py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-2 py-2 text-sm font-sans font-medium rounded transition-colors ${
                  link.highlight
                    ? "text-rt-amber font-semibold"
                    : "text-rt-textMuted hover:text-rt-amber"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
