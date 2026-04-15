"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DollarSign, Clock, Star, LayoutDashboard, Settings,
  Users, CheckCircle, PauseCircle, XCircle,
  MoreHorizontal, Pin, Edit2, Trash2, Play, Eye, RefreshCw,
  AlertTriangle, TrendingUp, Zap, Info, ArrowUpRight,
} from "lucide-react";
import Nav from "@/app/components/Nav";
import { MOCK_BUSINESSES } from "@/app/lib/mockData";
import CategoryTag from "@/app/components/CategoryTag";

// TODO: fetch from DB — all stats below should come from real queries
// TODO: protect this route — require admin auth (NextAuth / Clerk session check)

type AdminSection = "all" | "pending" | "active" | "rotation";

const STATS = [
  {
    label: "Active Subscribers",
    value: "11",
    sub: "+2 this month",
    icon: <Users size={20} className="text-rt-amber" />,
    color: "bg-amber-50 border-amber-200",
  },
  {
    label: "Monthly Revenue",
    value: "$87",
    sub: "MRR (3 monthly + 8 annual avg.)",
    icon: <DollarSign size={20} className="text-green-600" />,
    color: "bg-green-50 border-green-200",
  },
  {
    label: "Pending Approvals",
    value: "1",
    sub: "Awaiting review",
    icon: <Clock size={20} className="text-blue-600" />,
    color: "bg-blue-50 border-blue-200",
  },
  {
    label: "Featured Slots Served",
    value: "284",
    sub: "Feed injections this month",
    icon: <Star size={20} className="text-purple-600" />,
    color: "bg-purple-50 border-purple-200",
  },
];

const STATUS_STYLES: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
  active:  { label: "Active",  icon: <CheckCircle size={13} />,  cls: "text-green-700 bg-green-50 border-green-200" },
  paused:  { label: "Paused",  icon: <PauseCircle size={13} />,  cls: "text-amber-700 bg-amber-50 border-amber-200" },
  lapsed:  { label: "Lapsed",  icon: <XCircle size={13} />,      cls: "text-red-700 bg-red-50 border-red-200" },
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
    { id: "all",      label: "All Listings",        icon: <LayoutDashboard size={15} />, count: MOCK_BUSINESSES.length },
    { id: "pending",  label: "Pending Approval",     icon: <AlertTriangle size={15} />, count: MOCK_BUSINESSES.filter(b => b.pendingApproval).length },
    { id: "active",   label: "Active Subscribers",   icon: <CheckCircle size={15} />, count: MOCK_BUSINESSES.filter(b => b.status === "active").length },
    { id: "rotation", label: "Rotation Settings",    icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-rt-surface">
      <Nav />

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r border-rt-border flex-shrink-0">
          <div className="p-4 border-b border-rt-border">
            <p className="text-xs font-semibold font-sans text-rt-textMuted uppercase tracking-wide">Directory Admin</p>
          </div>

          <nav className="p-3 space-y-0.5 flex-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded text-sm font-sans font-medium transition-colors ${
                  section === item.id
                    ? "bg-amber-50 text-rt-amber"
                    : "text-rt-textMuted hover:bg-rt-surface hover:text-rt-text"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    section === item.id ? "bg-rt-amber text-white" : "bg-rt-surface text-rt-textMuted"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-rt-border">
            <Link href="/directory" className="flex items-center gap-2 text-xs font-sans text-rt-textMuted hover:text-rt-amber transition-colors">
              <Eye size={13} />
              View public directory
            </Link>
            <Link href="/feed-preview" className="flex items-center gap-2 text-xs font-sans text-rt-textMuted hover:text-rt-amber transition-colors mt-2">
              <ArrowUpRight size={13} />
              Feed preview
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-6">
          {/* Mobile section tabs */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-6">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold font-sans px-3 py-1.5 rounded-full border transition-colors ${
                  section === item.id
                    ? "bg-rt-amber text-white border-rt-amber"
                    : "bg-white text-rt-textMuted border-rt-border"
                }`}
              >
                {item.icon}
                {item.label}
                {item.count !== undefined && <span>({item.count})</span>}
              </button>
            ))}
          </div>

          {/* ── Stats row (show on all non-rotation sections) ── */}
          {section !== "rotation" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STATS.map((stat) => (
                  <div key={stat.label} className={`rt-card p-4 border ${stat.color}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded flex items-center justify-center bg-white shadow-sm">
                        {stat.icon}
                      </div>
                      <TrendingUp size={14} className="text-rt-textLight" />
                    </div>
                    <p className="font-serif text-2xl text-rt-text">{stat.value}</p>
                    <p className="text-xs font-semibold font-sans text-rt-text mt-0.5">{stat.label}</p>
                    <p className="text-xs font-sans text-rt-textMuted mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>

              {/* Section heading */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-serif text-xl text-rt-text">
                  {section === "all"     ? "All Listings" :
                   section === "pending" ? "Pending Approval" :
                   "Active Subscribers"}
                </h1>
                <Link href="/directory/signup" className="rt-btn-primary text-xs px-3 py-1.5">
                  + Add listing
                </Link>
              </div>

              {/* Pending alert banner */}
              {section === "all" && MOCK_BUSINESSES.some(b => b.pendingApproval) && (
                <div className="bg-blue-50 border border-blue-200 rounded-card p-3 mb-4 flex items-center gap-3">
                  <AlertTriangle size={15} className="text-blue-600 flex-shrink-0" />
                  <p className="text-sm font-sans text-blue-800">
                    <strong>1 listing</strong> is pending approval.{" "}
                    <button onClick={() => setSection("pending")} className="underline hover:text-blue-900">
                      Review now →
                    </button>
                  </p>
                </div>
              )}

              {/* Table */}
              <div className="rt-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="bg-rt-surface border-b border-rt-border">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Business</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Plan</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Last Payment</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rt-border">
                      {filtered.map((biz) => {
                        const statusStyle = STATUS_STYLES[biz.status];
                        return (
                          <tr key={biz.id} className="hover:bg-rt-surface/60 transition-colors">
                            {/* Business */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-serif font-bold flex-shrink-0"
                                  style={{ backgroundColor: biz.logoColor }}
                                >
                                  {biz.logoPlaceholder}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <Link
                                      href={`/directory/listing/${biz.id}`}
                                      className="font-medium text-rt-text hover:text-rt-amber transition-colors"
                                    >
                                      {biz.name}
                                    </Link>
                                    {biz.featured && (
                                      <Star size={11} fill="currentColor" className="text-rt-amber flex-shrink-0" />
                                    )}
                                    {biz.pendingApproval && (
                                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-1 mt-0.5">
                                    {biz.categories.map((cat) => (
                                      <CategoryTag key={cat} category={cat} />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Plan */}
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${
                                biz.plan === "annual"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-gray-50 text-gray-600 border-gray-200"
                              }`}>
                                {biz.plan === "annual" && <Star size={10} fill="currentColor" />}
                                {biz.plan}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${statusStyle.cls}`}>
                                {statusStyle.icon}
                                {statusStyle.label}
                              </span>
                            </td>

                            {/* Last payment */}
                            <td className="px-4 py-3 text-xs text-rt-textMuted">
                              {biz.lastPayment}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1 relative">
                                {biz.pendingApproval ? (
                                  <>
                                    {/* TODO: wire to DB update — set status='active', pendingApproval=false */}
                                    <button className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded hover:bg-green-100 transition-colors">
                                      <CheckCircle size={11} />
                                      Approve
                                    </button>
                                    {/* TODO: wire to DB update — send rejection email and delete/archive listing */}
                                    <button className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded hover:bg-red-100 transition-colors">
                                      <XCircle size={11} />
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <div className="relative">
                                    <button
                                      onClick={() => setOpenAction(openAction === biz.id ? null : biz.id)}
                                      className="p-1 rounded hover:bg-rt-surface text-rt-textMuted hover:text-rt-text transition-colors"
                                    >
                                      <MoreHorizontal size={16} />
                                    </button>
                                    {openAction === biz.id && (
                                      <div className="absolute right-0 top-7 bg-white border border-rt-border rounded-card shadow-cardHover z-10 min-w-36 py-1">
                                        <ActionItem icon={<Eye size={13} />} label="View listing" href={`/directory/listing/${biz.id}`} />
                                        {/* TODO: wire to DB update form */}
                                        <ActionItem icon={<Edit2 size={13} />} label="Edit" />
                                        {/* TODO: wire to DB toggle + Stripe subscription pause */}
                                        <ActionItem icon={biz.status === "paused" ? <Play size={13} /> : <PauseCircle size={13} />}
                                          label={biz.status === "paused" ? "Resume" : "Pause"} />
                                        {/* TODO: wire to DB update — set featured=true, bump rotation weight */}
                                        <ActionItem icon={<Pin size={13} />} label="Pin to top" />
                                        {/* TODO: wire to Stripe — cancel subscription, then archive listing */}
                                        <ActionItem icon={<RefreshCw size={13} />} label="Cancel sub" />
                                        <div className="my-1 border-t border-rt-border" />
                                        {/* TODO: soft-delete (set status='deleted') rather than hard delete */}
                                        <ActionItem icon={<Trash2 size={13} />} label="Delete" danger />
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
  const cls = `flex items-center gap-2 px-3 py-1.5 text-xs font-sans w-full text-left hover:bg-rt-surface transition-colors ${
    danger ? "text-red-600 hover:bg-red-50" : "text-rt-text"
  }`;
  if (href) {
    return <Link href={href} className={cls}>{icon}{label}</Link>;
  }
  return <button className={cls}>{icon}{label}</button>;
}

// Rotation settings sub-page
function RotationSettings() {
  // TODO: fetch rotation config from DB
  const ANNUAL_ACTIVE   = MOCK_BUSINESSES.filter(b => b.plan === "annual" && b.status === "active");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl text-rt-text mb-1">Rotation Settings</h1>
        <p className="text-sm font-sans text-rt-textMuted">
          Configure how featured business cards are injected into the news feed.
        </p>
      </div>

      {/* How it works */}
      <div className="rt-card p-6">
        <h2 className="font-serif text-lg text-rt-text mb-4 flex items-center gap-2">
          <Zap size={18} className="text-rt-amber" />
          How the Rotation Engine Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 text-sm font-sans">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rt-amber text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
              <div>
                <p className="font-semibold text-rt-text">Feed injection trigger</p>
                <p className="text-rt-textMuted mt-0.5">
                  Every time the news feed is rendered, a featured business card is injected after every <strong>5–8 news posts</strong> (configurable below).
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rt-amber text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
              <div>
                <p className="font-semibold text-rt-text">Weighted round-robin selection</p>
                <p className="text-rt-textMuted mt-0.5">
                  Active subscribers enter a rotation queue. <strong>Annual plan</strong> subscribers receive <strong>2× weight</strong> — they appear twice as often as monthly subscribers.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rt-amber text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</div>
              <div>
                <p className="font-semibold text-rt-text">Fair distribution tracking</p>
                <p className="text-rt-textMuted mt-0.5">
                  The DB column <code className="bg-rt-surface px-1 rounded">last_featured_at</code> is updated each time a listing appears. The rotation engine always picks the listing with the oldest <code className="bg-rt-surface px-1 rounded">last_featured_at</code> from the eligible pool.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-rt-amber text-white text-xs font-bold flex items-center justify-center flex-shrink-0">4</div>
              <div>
                <p className="font-semibold text-rt-text">Manual pin override</p>
                <p className="text-rt-textMuted mt-0.5">
                  Admins can pin any active listing to always appear in the next available slot. Pins expire after 7 days or can be manually removed.
                </p>
              </div>
            </div>
          </div>

          {/* Config controls (mockup — not wired) */}
          <div className="space-y-4">
            <div className="bg-rt-surface border border-rt-border rounded-card p-4">
              <p className="text-xs font-semibold font-sans text-rt-textMuted uppercase tracking-wide mb-3">
                Injection Settings
                {/* TODO: wire to DB config table */}
              </p>
              <div className="space-y-3">
                <div>
                  <label className="rt-label text-xs">Inject every N posts</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={5} min={3} max={10}
                      className="rt-input w-20 text-center" readOnly />
                    <span className="text-xs font-sans text-rt-textMuted">posts (min 3, max 10)</span>
                  </div>
                </div>
                <div>
                  <label className="rt-label text-xs">Annual plan weight multiplier</label>
                  <div className="flex items-center gap-2">
                    <input type="number" defaultValue={2} min={1} max={5}
                      className="rt-input w-20 text-center" readOnly />
                    <span className="text-xs font-sans text-rt-textMuted">× vs. monthly</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold font-sans text-rt-text">Show &ldquo;Featured&rdquo; badge on cards</span>
                  <div className="w-10 h-5 bg-rt-amber rounded-full flex items-center px-0.5">
                    <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm" />
                  </div>
                </div>
              </div>
              <p className="text-xs font-sans text-rt-textLight mt-3">
                {/* TODO: wire Save button to DB config update endpoint */}
                Developer: wire &ldquo;Save&rdquo; to a server action that updates the rotation_config table.
              </p>
              <button className="rt-btn-primary text-xs mt-3 opacity-60 cursor-not-allowed" disabled>
                Save settings — wired by developer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Current rotation preview */}
      <div className="rt-card p-6">
        <h2 className="font-serif text-lg text-rt-text mb-1 flex items-center gap-2">
          <RefreshCw size={18} className="text-rt-amber" />
          Current Rotation Queue
        </h2>
        <p className="text-sm font-sans text-rt-textMuted mb-4">
          Active subscribers in the next rotation cycle, ordered by last appearance (oldest first).
          {/* TODO: fetch from DB — order by last_featured_at ASC, apply weight */}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="border-b border-rt-border">
                <th className="text-left pb-2 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Position</th>
                <th className="text-left pb-2 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Business</th>
                <th className="text-left pb-2 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Plan</th>
                <th className="text-left pb-2 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Weight</th>
                <th className="text-left pb-2 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Last Featured</th>
                <th className="text-right pb-2 text-xs font-semibold text-rt-textMuted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rt-border">
              {ANNUAL_ACTIVE.slice(0, 6).map((biz, i) => (
                <tr key={biz.id} className="hover:bg-rt-surface/60 transition-colors">
                  <td className="py-2.5 px-1">
                    <span className="text-xs font-semibold text-rt-textMuted">{i + 1}</span>
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded text-white text-xs font-serif font-bold flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: biz.logoColor }}>
                        {biz.logoPlaceholder.charAt(0)}
                      </div>
                      <span className="font-medium text-rt-text text-xs">{biz.name}</span>
                      {biz.featured && <Pin size={10} className="text-rt-amber" />}
                    </div>
                  </td>
                  <td className="py-2.5">
                    <span className={`text-xs font-semibold capitalize px-1.5 py-0.5 rounded-full ${
                      biz.plan === "annual" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                    }`}>{biz.plan}</span>
                  </td>
                  <td className="py-2.5 text-xs text-rt-textMuted">
                    {biz.plan === "annual" ? "2×" : "1×"}
                  </td>
                  <td className="py-2.5 text-xs text-rt-textMuted">
                    {/* TODO: fetch last_featured_at from DB */}
                    {biz.lastPayment}
                  </td>
                  <td className="py-2.5 text-right">
                    {/* TODO: wire to DB update — set this listing as pinned */}
                    <button className="text-xs font-semibold text-rt-amber hover:text-rt-amberDark transition-colors flex items-center gap-1 ml-auto">
                      <Pin size={11} />
                      Pin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Annotation */}
      <div className="bg-amber-50 border border-amber-200 rounded-card p-4 flex items-start gap-3">
        <Info size={15} className="text-rt-amber mt-0.5 flex-shrink-0" />
        <div className="text-xs font-sans text-rt-textMuted space-y-1">
          <p className="font-semibold text-rt-text">Developer: Rotation engine implementation notes</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li>Add <code className="bg-amber-100 px-1 rounded">last_featured_at TIMESTAMPTZ</code> and <code className="bg-amber-100 px-1 rounded">feed_weight INT DEFAULT 1</code> columns to the listings table</li>
            <li>Set <code className="bg-amber-100 px-1 rounded">feed_weight = 2</code> when a subscriber upgrades to annual</li>
            <li>In the feed query, expand the rotation pool: repeat each listing&apos;s ID by its weight, then sort by <code className="bg-amber-100 px-1 rounded">last_featured_at ASC</code></li>
            <li>After rendering, update <code className="bg-amber-100 px-1 rounded">last_featured_at = NOW()</code> for the selected listing via a background job or server action</li>
            <li>A <code className="bg-amber-100 px-1 rounded">rotation_config</code> DB table should store injection_interval, weight_multiplier, and show_badge settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
