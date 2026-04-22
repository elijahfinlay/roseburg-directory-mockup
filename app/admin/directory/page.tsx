"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Settings, CheckCircle,
  MoreHorizontal, Pin, Edit2, Trash2, Play, PauseCircle, Eye,
  RefreshCw, AlertTriangle, Info, ArrowUpRight, Star,
} from "lucide-react";
import Nav from "@/app/components/Nav";
import { MOCK_BUSINESSES, type Category } from "@/app/lib/mockData";

// TODO: fetch from DB — all stats below should come from real queries
// TODO: protect this route — require admin auth (NextAuth / Clerk session check)

type AdminSection = "all" | "pending" | "active" | "rotation";

// Category dot — matches BusinessCard
const DOT: Record<Category, string> = {
  Business:     "bg-amber-600",
  Service:      "bg-blue-600",
  Organization: "bg-emerald-600",
};

const STATS = [
  { label: "Active subscribers",  value: "11",   sub: "+2 this month" },
  { label: "Monthly revenue",     value: "$87",  sub: "MRR · 3 monthly + 8 annual" },
  { label: "Pending approvals",   value: "1",    sub: "Awaiting review" },
  { label: "Feed injections",     value: "284",  sub: "This month" },
];

const STATUS_STYLES: Record<string, { label: string; dot: string; text: string }> = {
  active: { label: "Active", dot: "bg-emerald-600", text: "text-rt-text" },
  paused: { label: "Paused", dot: "bg-amber-500",   text: "text-rt-text/70" },
  lapsed: { label: "Lapsed", dot: "bg-red-500",     text: "text-rt-text/70" },
};

export default function AdminDirectoryPage() {
  const [section, setSection] = useState<AdminSection>("all");
  const [openAction, setOpenAction] = useState<string | null>(null);

  const filtered = MOCK_BUSINESSES.filter((b) => {
    if (section === "pending") return b.pendingApproval === true;
    if (section === "active")  return b.status === "active" && !b.pendingApproval;
    return true;
  });

  const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "all",      label: "All listings",      icon: <LayoutDashboard size={14} />, count: MOCK_BUSINESSES.length },
    { id: "pending",  label: "Pending approval",  icon: <AlertTriangle size={14} />,   count: MOCK_BUSINESSES.filter(b => b.pendingApproval).length },
    { id: "active",   label: "Active subscribers", icon: <CheckCircle size={14} />,    count: MOCK_BUSINESSES.filter(b => b.status === "active").length },
    { id: "rotation", label: "Rotation settings", icon: <Settings size={14} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-white border-r border-rt-border flex-shrink-0">
          <div className="px-5 py-5 border-b border-rt-border">
            <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/40 font-semibold mb-0.5">
              Admin
            </p>
            <p className="font-serif text-[20px] text-rt-text tracking-tight leading-tight">
              Directory
            </p>
          </div>

          <nav className="py-3 flex-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`group w-full flex items-center justify-between gap-2 px-5 py-2.5 text-[13px] font-sans transition-colors ${
                  section === item.id
                    ? "text-rt-text font-semibold bg-rt-surface"
                    : "text-rt-text/60 hover:text-rt-text font-medium"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`${
                      section === item.id ? "text-rt-amber" : "text-rt-text/30"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span
                    className={`text-[11px] tabular-nums ${
                      section === item.id ? "text-rt-text/60 font-medium" : "text-rt-text/30"
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-5 py-4 border-t border-rt-border space-y-2">
            <Link
              href="/directory"
              className="flex items-center gap-2 text-[12px] font-sans text-rt-text/50 hover:text-rt-amber transition-colors"
            >
              <Eye size={12} />
              View public directory
            </Link>
            <Link
              href="/feed-preview"
              className="flex items-center gap-2 text-[12px] font-sans text-rt-text/50 hover:text-rt-amber transition-colors"
            >
              <ArrowUpRight size={12} />
              Feed preview
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 lg:px-10 py-10">
          {/* Mobile section tabs */}
          <div className="md:hidden flex gap-5 overflow-x-auto border-b border-rt-border mb-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`relative flex-shrink-0 pb-3 text-[13px] font-sans whitespace-nowrap transition-colors ${
                  section === item.id
                    ? "text-rt-text font-semibold"
                    : "text-rt-text/50 font-medium"
                }`}
              >
                {item.label}
                {item.count !== undefined && (
                  <span className="ml-1.5 text-[11px] text-rt-text/30">{item.count}</span>
                )}
                {section === item.id && (
                  <span className="absolute left-0 right-0 -bottom-px h-px bg-rt-amber" />
                )}
              </button>
            ))}
          </div>

          {/* ── Stats row (show on all non-rotation sections) ── */}
          {section !== "rotation" && (
            <>
              {/* Page header */}
              <div className="mb-10 pb-6 border-b border-rt-border">
                <div className="flex items-center gap-2 mb-3 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-medium">
                  <span className="w-5 h-px bg-rt-amber" />
                  <span>Overview</span>
                </div>
                <div className="flex items-baseline justify-between gap-6 flex-wrap">
                  <h1 className="font-serif text-[32px] md:text-[40px] text-rt-text tracking-tight leading-tight">
                    {section === "all"     ? "All listings" :
                     section === "pending" ? "Pending approval" :
                                             "Active subscribers"}
                  </h1>
                  <Link
                    href="/directory/signup"
                    className="inline-flex items-center gap-1.5 text-[13px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4"
                  >
                    + Add listing
                  </Link>
                </div>
              </div>

              {/* Flat stats — newspaper-style */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rt-border border-y border-rt-border mb-10">
                {STATS.map((stat) => (
                  <div key={stat.label} className="bg-white px-5 py-6">
                    <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold mb-3">
                      {stat.label}
                    </p>
                    <p className="font-serif text-[36px] tracking-tight text-rt-text leading-none mb-2">
                      {stat.value}
                    </p>
                    <p className="text-[12px] font-sans text-rt-text/50">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Pending alert — subtle */}
              {section === "all" && MOCK_BUSINESSES.some(b => b.pendingApproval) && (
                <div className="border-l-2 border-rt-amber pl-4 py-1 mb-6 flex items-center justify-between gap-3">
                  <p className="text-[13px] font-sans text-rt-text/80">
                    <span className="font-semibold">1 listing</span> is pending approval.
                  </p>
                  <button
                    onClick={() => setSection("pending")}
                    className="text-[12px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4 flex-shrink-0"
                  >
                    Review →
                  </button>
                </div>
              )}

              {/* Table */}
              <div className="border-t border-rt-border">
                <table className="w-full text-[13px] font-sans">
                  <thead>
                    <tr className="border-b border-rt-border">
                      <th className="text-left px-2 py-3 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                        Business
                      </th>
                      <th className="text-left px-2 py-3 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em] hidden sm:table-cell">
                        Plan
                      </th>
                      <th className="text-left px-2 py-3 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                        Status
                      </th>
                      <th className="text-left px-2 py-3 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em] hidden lg:table-cell">
                        Last payment
                      </th>
                      <th className="text-right px-2 py-3 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((biz) => {
                      const statusStyle = STATUS_STYLES[biz.status];
                      return (
                        <tr
                          key={biz.id}
                          className="border-b border-rt-border hover:bg-rt-surface/40 transition-colors"
                        >
                          {/* Business */}
                          <td className="px-2 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded flex items-center justify-center text-white text-[12px] font-serif font-medium flex-shrink-0"
                                style={{ backgroundColor: biz.logoColor }}
                              >
                                {biz.logoPlaceholder}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Link
                                    href={`/directory/listing/${biz.id}`}
                                    className="font-serif text-[15px] text-rt-text hover:text-rt-amber transition-colors truncate"
                                  >
                                    {biz.name}
                                  </Link>
                                  {biz.featured && (
                                    <Star
                                      size={11}
                                      fill="currentColor"
                                      className="text-rt-amber flex-shrink-0"
                                    />
                                  )}
                                  {biz.pendingApproval && (
                                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.12em] text-rt-amber">
                                      Pending
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-sans text-rt-text/50">
                                  {biz.categories.map((cat, i) => (
                                    <span
                                      key={cat}
                                      className="flex items-center gap-1.5"
                                    >
                                      {i > 0 && <span className="text-rt-text/20">·</span>}
                                      <span
                                        className={`w-1.5 h-1.5 rounded-full ${DOT[cat]}`}
                                      />
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Plan */}
                          <td className="px-2 py-4 hidden sm:table-cell">
                            <span
                              className={`inline-flex items-center gap-1 text-[12px] font-sans capitalize ${
                                biz.plan === "annual"
                                  ? "text-rt-amber font-semibold"
                                  : "text-rt-text/60 font-medium"
                              }`}
                            >
                              {biz.plan === "annual" && (
                                <Star size={10} fill="currentColor" />
                              )}
                              {biz.plan}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-2 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-[12px] font-sans font-medium ${statusStyle.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                              />
                              {statusStyle.label}
                            </span>
                          </td>

                          {/* Last payment */}
                          <td className="px-2 py-4 text-[12px] font-sans text-rt-text/50 hidden lg:table-cell">
                            {biz.lastPayment}
                          </td>

                          {/* Actions */}
                          <td className="px-2 py-4">
                            <div className="flex items-center justify-end gap-2 relative">
                              {biz.pendingApproval ? (
                                <>
                                  {/* TODO: wire to DB update — set status='active', pendingApproval=false */}
                                  <button className="text-[12px] font-sans font-semibold text-emerald-700 hover:underline underline-offset-4">
                                    Approve
                                  </button>
                                  <span className="text-rt-text/20">·</span>
                                  {/* TODO: wire to DB update — send rejection email and delete/archive listing */}
                                  <button className="text-[12px] font-sans font-medium text-rt-text/50 hover:text-red-600 hover:underline underline-offset-4">
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <div className="relative">
                                  <button
                                    onClick={() =>
                                      setOpenAction(
                                        openAction === biz.id ? null : biz.id
                                      )
                                    }
                                    className="p-1.5 text-rt-text/40 hover:text-rt-text transition-colors"
                                  >
                                    <MoreHorizontal size={15} />
                                  </button>
                                  {openAction === biz.id && (
                                    <div className="absolute right-0 top-8 bg-white border border-rt-border z-10 min-w-40 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
                                      <ActionItem
                                        icon={<Eye size={12} />}
                                        label="View listing"
                                        href={`/directory/listing/${biz.id}`}
                                      />
                                      {/* TODO: wire to DB update form */}
                                      <ActionItem icon={<Edit2 size={12} />} label="Edit" />
                                      {/* TODO: wire to DB toggle + Stripe subscription pause */}
                                      <ActionItem
                                        icon={
                                          biz.status === "paused" ? (
                                            <Play size={12} />
                                          ) : (
                                            <PauseCircle size={12} />
                                          )
                                        }
                                        label={biz.status === "paused" ? "Resume" : "Pause"}
                                      />
                                      {/* TODO: wire to DB update — set featured=true, bump rotation weight */}
                                      <ActionItem icon={<Pin size={12} />} label="Pin to top" />
                                      {/* TODO: wire to Stripe — cancel subscription, then archive listing */}
                                      <ActionItem
                                        icon={<RefreshCw size={12} />}
                                        label="Cancel sub"
                                      />
                                      <div className="my-1 border-t border-rt-border" />
                                      {/* TODO: soft-delete (set status='deleted') rather than hard delete */}
                                      <ActionItem
                                        icon={<Trash2 size={12} />}
                                        label="Delete"
                                        danger
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── Rotation Settings section ── */}
          {section === "rotation" && <RotationSettings />}
        </main>
      </div>
    </div>
  );
}

// Dropdown action item helper
function ActionItem({
  icon, label, href, danger,
}: {
  icon: React.ReactNode;
  label: string;
  href?: string;
  danger?: boolean;
}) {
  const cls = `flex items-center gap-2 px-3 py-1.5 text-[12px] font-sans w-full text-left hover:bg-rt-surface transition-colors ${
    danger ? "text-red-600" : "text-rt-text/80"
  }`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {icon}
        {label}
      </Link>
    );
  }
  return (
    <button className={cls}>
      {icon}
      {label}
    </button>
  );
}

// Rotation settings sub-page
function RotationSettings() {
  // TODO: fetch rotation config from DB
  const ANNUAL_ACTIVE = MOCK_BUSINESSES.filter(
    (b) => b.plan === "annual" && b.status === "active"
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-rt-border">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-medium">
          <span className="w-5 h-px bg-rt-amber" />
          <span>Engine configuration</span>
        </div>
        <h1 className="font-serif text-[32px] md:text-[40px] text-rt-text tracking-tight leading-tight mb-2">
          Rotation settings.
        </h1>
        <p className="text-[14px] font-sans text-rt-text/60 max-w-2xl">
          How featured business cards are selected and injected into the Roseburg
          Tracker news feed.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="font-serif text-[22px] text-rt-text tracking-tight mb-6">
          How the engine works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <ol className="space-y-6 text-[13px] font-sans">
            {[
              {
                title: "Feed injection trigger",
                body: "Every time the news feed is rendered, a featured business card is injected after every 5–8 news posts (configurable).",
              },
              {
                title: "Weighted round-robin",
                body: "Active subscribers enter the rotation queue. Annual subscribers get 2× weight — they appear twice as often as monthly subscribers.",
              },
              {
                title: "Fair distribution",
                body: "The DB column last_featured_at is updated each appearance. The engine always picks the listing with the oldest timestamp in the eligible pool.",
              },
              {
                title: "Manual pin override",
                body: "Admins can pin any active listing to the next available slot. Pins expire after 7 days or can be removed manually.",
              },
            ].map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="font-serif text-[28px] leading-none text-rt-amber tracking-tight flex-shrink-0 w-8">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-semibold text-rt-text mb-1">{s.title}</p>
                  <p className="text-rt-text/60 leading-relaxed">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Config controls (mockup — not wired) */}
          <div className="border border-rt-border">
            <div className="px-5 py-4 border-b border-rt-border">
              <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold">
                Injection settings
              </p>
              {/* TODO: wire to DB config table */}
            </div>
            <div className="px-5 py-5 space-y-5">
              <div>
                <label className="block text-[12px] font-sans font-medium text-rt-text mb-1.5">
                  Inject every N posts
                </label>
                <div className="flex items-baseline gap-3">
                  <input
                    type="number"
                    defaultValue={5}
                    min={3}
                    max={10}
                    className="w-16 border-b border-rt-border pb-1 text-[15px] font-sans text-rt-text focus:outline-none focus:border-rt-text text-center tabular-nums"
                    readOnly
                  />
                  <span className="text-[12px] font-sans text-rt-text/50">
                    posts · min 3, max 10
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-sans font-medium text-rt-text mb-1.5">
                  Annual plan weight
                </label>
                <div className="flex items-baseline gap-3">
                  <input
                    type="number"
                    defaultValue={2}
                    min={1}
                    max={5}
                    className="w-16 border-b border-rt-border pb-1 text-[15px] font-sans text-rt-text focus:outline-none focus:border-rt-text text-center tabular-nums"
                    readOnly
                  />
                  <span className="text-[12px] font-sans text-rt-text/50">
                    × vs. monthly
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-[12px] font-sans text-rt-text font-medium">
                  Show &ldquo;Featured&rdquo; badge
                </span>
                <div className="w-9 h-5 bg-rt-text rounded-full flex items-center px-0.5">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                </div>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-rt-border bg-rt-surface/50">
              {/* TODO: wire Save button to DB config update endpoint */}
              <button
                disabled
                className="text-[12px] font-sans font-semibold text-rt-text/30 cursor-not-allowed"
              >
                Save settings — wired by developer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Current rotation preview */}
      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-serif text-[22px] text-rt-text tracking-tight">
            Current rotation queue
          </h2>
          <span className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/40 font-medium">
            Ordered by last appearance
          </span>
        </div>
        <p className="text-[13px] font-sans text-rt-text/60 leading-relaxed max-w-xl mb-6">
          Active subscribers in the next rotation cycle, oldest first.
          {/* TODO: fetch from DB — order by last_featured_at ASC, apply weight */}
        </p>

        <div className="border-t border-rt-border">
          <table className="w-full text-[13px] font-sans">
            <thead>
              <tr className="border-b border-rt-border">
                <th className="text-left py-3 pr-2 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                  #
                </th>
                <th className="text-left py-3 pr-2 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                  Business
                </th>
                <th className="text-left py-3 pr-2 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em] hidden sm:table-cell">
                  Plan
                </th>
                <th className="text-left py-3 pr-2 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                  Weight
                </th>
                <th className="text-left py-3 pr-2 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em] hidden md:table-cell">
                  Last featured
                </th>
                <th className="text-right py-3 text-[10px] font-sans font-semibold text-rt-text/50 uppercase tracking-[0.12em]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {ANNUAL_ACTIVE.slice(0, 6).map((biz, i) => (
                <tr
                  key={biz.id}
                  className="border-b border-rt-border hover:bg-rt-surface/40 transition-colors"
                >
                  <td className="py-3 pr-2 font-serif text-[14px] text-rt-text/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </td>
                  <td className="py-3 pr-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded flex items-center justify-center text-white text-[10px] font-serif font-medium flex-shrink-0"
                        style={{ backgroundColor: biz.logoColor }}
                      >
                        {biz.logoPlaceholder.charAt(0)}
                      </div>
                      <span className="font-serif text-[14px] text-rt-text">
                        {biz.name}
                      </span>
                      {biz.featured && (
                        <Pin size={10} className="text-rt-amber" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-2 hidden sm:table-cell">
                    <span
                      className={`text-[12px] font-sans capitalize ${
                        biz.plan === "annual"
                          ? "text-rt-amber font-semibold"
                          : "text-rt-text/60 font-medium"
                      }`}
                    >
                      {biz.plan}
                    </span>
                  </td>
                  <td className="py-3 pr-2 text-[12px] font-sans text-rt-text/60 tabular-nums">
                    {biz.plan === "annual" ? "2×" : "1×"}
                  </td>
                  <td className="py-3 pr-2 text-[12px] font-sans text-rt-text/50 hidden md:table-cell">
                    {/* TODO: fetch last_featured_at from DB */}
                    {biz.lastPayment}
                  </td>
                  <td className="py-3 text-right">
                    {/* TODO: wire to DB update — set this listing as pinned */}
                    <button className="text-[12px] font-sans font-semibold text-rt-amber hover:underline underline-offset-4">
                      Pin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Developer notes — subtler */}
      <section className="border-t border-rt-border pt-6">
        <div className="flex items-start gap-3 max-w-3xl">
          <Info size={14} className="text-rt-text/40 mt-1 flex-shrink-0" />
          <div className="text-[12px] font-sans text-rt-text/60 leading-relaxed">
            <p className="font-semibold text-rt-text mb-2 text-[11px] uppercase tracking-[0.15em]">
              Developer implementation notes
            </p>
            <ul className="space-y-1.5">
              <li>
                Add{" "}
                <code className="bg-rt-surface px-1.5 py-0.5 rounded text-[11px] text-rt-text/80">
                  last_featured_at TIMESTAMPTZ
                </code>{" "}
                and{" "}
                <code className="bg-rt-surface px-1.5 py-0.5 rounded text-[11px] text-rt-text/80">
                  feed_weight INT DEFAULT 1
                </code>{" "}
                columns to the listings table.
              </li>
              <li>
                Set{" "}
                <code className="bg-rt-surface px-1.5 py-0.5 rounded text-[11px] text-rt-text/80">
                  feed_weight = 2
                </code>{" "}
                when a subscriber upgrades to annual.
              </li>
              <li>
                In the feed query, expand the rotation pool: repeat each listing&apos;s
                ID by its weight, then sort by{" "}
                <code className="bg-rt-surface px-1.5 py-0.5 rounded text-[11px] text-rt-text/80">
                  last_featured_at ASC
                </code>
                .
              </li>
              <li>
                After rendering, update{" "}
                <code className="bg-rt-surface px-1.5 py-0.5 rounded text-[11px] text-rt-text/80">
                  last_featured_at = NOW()
                </code>{" "}
                for the selected listing via a background job or server action.
              </li>
              <li>
                A{" "}
                <code className="bg-rt-surface px-1.5 py-0.5 rounded text-[11px] text-rt-text/80">
                  rotation_config
                </code>{" "}
                table should store injection_interval, weight_multiplier, and
                show_badge settings.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
