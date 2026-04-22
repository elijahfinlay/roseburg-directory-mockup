"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, Upload, ArrowLeft, ArrowRight, AlertCircle, Lock,
} from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import type { Category } from "@/app/lib/mockData";

const STEPS = ["Business", "Plan", "Payment"];
const CATEGORIES: Category[] = ["Business", "Service", "Organization"];
const MAX_DESC_WORDS = 35;

// Subtle dot color per category — matches BusinessCard
const DOT: Record<Category, string> = {
  Business:     "bg-amber-600",
  Service:      "bg-blue-600",
  Organization: "bg-emerald-600",
};

function wordCount(text: string) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export default function SignupPage() {
  const [step, setStep] = useState(0);

  // Step 1 state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCats, setSelectedCats] = useState<Category[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFile, setLogoFile] = useState<string | null>(null);

  // Step 2 state
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");

  const descWords = wordCount(description);
  const descOver = descWords > MAX_DESC_WORDS;

  function toggleCategory(cat: Category) {
    setSelectedCats((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function step1Valid() {
    return (
      name.trim() !== "" &&
      description.trim() !== "" &&
      !descOver &&
      selectedCats.length > 0 &&
      address.trim() !== "" &&
      phone.trim() !== ""
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Nav />

      {/* ── Editorial header ── */}
      <header className="border-b border-rt-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 md:pt-16 md:pb-12">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1.5 text-[12px] font-sans text-rt-text/50 hover:text-rt-amber transition-colors mb-6"
          >
            <ArrowLeft size={13} />
            Back to Directory
          </Link>

          <div className="flex items-center gap-2 mb-5 text-[11px] font-sans uppercase tracking-[0.18em] text-rt-text/50 font-medium">
            <span className="w-6 h-px bg-rt-amber" />
            <span>List a business</span>
          </div>

          <h1 className="font-serif text-[40px] sm:text-[52px] md:text-[60px] leading-[0.98] tracking-tight text-rt-text mb-4">
            Get listed in
            <br />
            the Directory.
          </h1>
          <p className="text-[15px] sm:text-[16px] font-sans text-rt-text/65 leading-relaxed max-w-xl">
            Three short steps. Your listing appears on the public directory and
            rotates through the Roseburg Tracker news feed. Starts at $10/month.
          </p>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          {/* ── Thin progress line ── */}
          <div className="mb-12">
            <div className="flex items-center gap-3">
              {STEPS.map((label, i) => {
                const done = i < step;
                const current = i === step;
                return (
                  <div key={label} className="flex items-center gap-3 flex-1 last:flex-none">
                    <button
                      onClick={() => i < step && setStep(i)}
                      disabled={i > step}
                      className="flex items-center gap-2.5 flex-shrink-0 group"
                    >
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-sans font-semibold transition-colors ${
                          done
                            ? "bg-rt-text text-white"
                            : current
                            ? "bg-rt-amber text-white"
                            : "bg-white border border-rt-border text-rt-text/40"
                        }`}
                      >
                        {done ? <Check size={11} strokeWidth={2.5} /> : i + 1}
                      </span>
                      <span
                        className={`text-[12px] font-sans tracking-wide hidden sm:inline transition-colors ${
                          current ? "text-rt-text font-semibold" :
                          done    ? "text-rt-text/70 font-medium" :
                                    "text-rt-text/40 font-medium"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <span
                        className={`flex-1 h-px transition-colors ${
                          i < step ? "bg-rt-text" : "bg-rt-border"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── STEP 1: Business Info ── */}
          {step === 0 && (
            <div>
              <div className="mb-8">
                <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/40 font-medium mb-1">
                  Step 1 of 3
                </p>
                <h2 className="font-serif text-[28px] text-rt-text tracking-tight">
                  Tell us about your business.
                </h2>
              </div>

              <div className="space-y-8">
                {/* Business name */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold mb-2">
                    Business name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-rt-border focus:border-rt-text pb-2 text-[16px] font-sans text-rt-text placeholder-rt-text/30 focus:outline-none transition-colors"
                    placeholder="e.g. Riverside Diner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold">
                      Description
                    </label>
                    <span
                      className={`text-[11px] font-sans tabular-nums ${
                        descOver
                          ? "text-red-600 font-semibold"
                          : descWords >= 30
                          ? "text-rt-amber"
                          : "text-rt-text/40"
                      }`}
                    >
                      {descWords} / {MAX_DESC_WORDS}
                    </span>
                  </div>
                  <textarea
                    className={`w-full bg-transparent border-b ${
                      descOver ? "border-red-400" : "border-rt-border focus:border-rt-text"
                    } pb-2 text-[16px] font-sans text-rt-text placeholder-rt-text/30 focus:outline-none transition-colors resize-none h-24`}
                    placeholder="One clear paragraph. Keep it to 35 words or fewer."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {descOver && (
                    <p className="text-[12px] text-red-600 font-sans mt-2 flex items-center gap-1.5">
                      <AlertCircle size={12} />
                      {descWords - MAX_DESC_WORDS} over the limit
                    </p>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold mb-3">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const selected = selectedCats.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`inline-flex items-center gap-2 text-[13px] font-sans px-3.5 py-2 border transition-colors ${
                            selected
                              ? "bg-rt-text text-white border-rt-text font-medium"
                              : "bg-white text-rt-text border-rt-border hover:border-rt-text/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              selected ? "bg-white" : DOT[cat]
                            }`}
                          />
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-rt-border focus:border-rt-text pb-2 text-[16px] font-sans text-rt-text placeholder-rt-text/30 focus:outline-none transition-colors"
                    placeholder="123 Main St, Roseburg, OR 97470"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Phone + Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full bg-transparent border-b border-rt-border focus:border-rt-text pb-2 text-[16px] font-sans text-rt-text placeholder-rt-text/30 focus:outline-none transition-colors"
                      placeholder="(541) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-baseline gap-1.5 text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold mb-2">
                      Website
                      <span className="text-rt-text/30 font-normal normal-case tracking-normal">
                        optional
                      </span>
                    </label>
                    <input
                      type="url"
                      className="w-full bg-transparent border-b border-rt-border focus:border-rt-text pb-2 text-[16px] font-sans text-rt-text placeholder-rt-text/30 focus:outline-none transition-colors"
                      placeholder="https://yourbusiness.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                {/* Logo upload */}
                <div>
                  <label className="flex items-baseline gap-1.5 text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/60 font-semibold mb-3">
                    Logo
                    <span className="text-rt-text/30 font-normal normal-case tracking-normal">
                      optional · PNG or JPG, 2 MB max
                    </span>
                  </label>
                  <div className="border border-dashed border-rt-border p-8 text-center bg-rt-surface/50 hover:border-rt-text/40 transition-colors cursor-pointer">
                    {logoFile ? (
                      <div className="flex items-center justify-center gap-2 text-[13px] font-sans text-rt-text">
                        <Check size={14} className="text-emerald-600" />
                        <span className="font-medium">{logoFile}</span>
                        <button
                          onClick={() => setLogoFile(null)}
                          className="text-rt-text/40 hover:text-red-500 text-[12px] ml-3 underline underline-offset-2"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload size={18} className="mx-auto text-rt-text/30 mb-3" />
                        <p className="text-[13px] font-sans text-rt-text/60">
                          Drop your logo here, or{" "}
                          {/* TODO: wire file upload to storage (S3 / Cloudflare R2) */}
                          <button
                            type="button"
                            onClick={() => setLogoFile("logo-mockup.png")}
                            className="text-rt-amber hover:underline underline-offset-4 font-semibold"
                          >
                            browse files
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Next */}
              <div className="mt-12 flex items-center justify-end">
                <button
                  onClick={() => setStep(1)}
                  disabled={!step1Valid()}
                  className={`inline-flex items-center gap-2 text-[13px] font-sans font-semibold px-6 py-3 transition-colors ${
                    step1Valid()
                      ? "bg-rt-text text-white hover:bg-rt-amber"
                      : "bg-rt-surface text-rt-text/30 cursor-not-allowed"
                  }`}
                >
                  Choose a plan
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Choose Plan ── */}
          {step === 1 && (
            <div>
              <div className="mb-8">
                <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/40 font-medium mb-1">
                  Step 2 of 3
                </p>
                <h2 className="font-serif text-[28px] text-rt-text tracking-tight">
                  Pick a plan.
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-rt-border border border-rt-border mb-8">
                {/* Monthly */}
                <button
                  type="button"
                  onClick={() => setPlan("monthly")}
                  className={`relative text-left bg-white p-7 transition-colors ${
                    plan === "monthly" ? "ring-2 ring-rt-text ring-inset" : "hover:bg-rt-surface/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold mb-1">
                        Monthly
                      </p>
                      <p className="text-[12px] font-sans text-rt-text/50">Billed monthly</p>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        plan === "monthly" ? "border-rt-text bg-rt-text" : "border-rt-border"
                      }`}
                    >
                      {plan === "monthly" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </span>
                  </div>

                  <p className="font-serif text-[44px] tracking-tight text-rt-text leading-none">
                    $10
                    <span className="text-[14px] font-sans text-rt-text/50 ml-1">/mo</span>
                  </p>

                  <ul className="mt-6 space-y-2.5 text-[13px] font-sans text-rt-text/70">
                    {[
                      "Directory listing",
                      "Category tags",
                      "Contact info + website",
                      "Feed rotation (1× weight)",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-rt-text/40 flex-shrink-0 mt-1" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>

                {/* Annual */}
                <button
                  type="button"
                  onClick={() => setPlan("annual")}
                  className={`relative text-left bg-white p-7 transition-colors ${
                    plan === "annual" ? "ring-2 ring-rt-text ring-inset" : "hover:bg-rt-surface/50"
                  }`}
                >
                  <div className="absolute top-0 right-0">
                    <span className="inline-block bg-rt-amber text-white text-[10px] font-sans font-semibold uppercase tracking-[0.15em] px-2.5 py-1">
                      Best value
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold mb-1">
                        Annual
                      </p>
                      <p className="text-[12px] font-sans text-rt-text/50">Billed yearly</p>
                    </div>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        plan === "annual" ? "border-rt-text bg-rt-text" : "border-rt-border"
                      }`}
                    >
                      {plan === "annual" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <p className="font-serif text-[44px] tracking-tight text-rt-text leading-none">
                      $100
                      <span className="text-[14px] font-sans text-rt-text/50 ml-1">/yr</span>
                    </p>
                    <span className="text-[12px] font-sans text-emerald-700 font-semibold">
                      Save $20
                    </span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-[13px] font-sans text-rt-text/70">
                    {[
                      "Everything in Monthly",
                      "Priority feed placement (2× weight)",
                      "Featured badge on card",
                      "Annual subscriber highlight",
                    ].map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check size={13} className="text-rt-amber flex-shrink-0 mt-1" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              </div>

              {/* Summary line */}
              <p className="text-[13px] font-sans text-rt-text/60 leading-relaxed mb-10 border-l-2 border-rt-amber pl-4">
                {plan === "annual"
                  ? "You'll be billed $100 today, then once per year. Your listing renews automatically — cancel anytime."
                  : "You'll be billed $10 today, then monthly. Cancel anytime; your listing stays active through the end of the period."}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-rt-border">
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-sans font-medium text-rt-text/60 hover:text-rt-amber transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 text-[13px] font-sans font-semibold px-6 py-3 bg-rt-text text-white hover:bg-rt-amber transition-colors"
                >
                  Continue to payment
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Checkout placeholder ── */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/40 font-medium mb-1">
                  Step 3 of 3
                </p>
                <h2 className="font-serif text-[28px] text-rt-text tracking-tight">
                  Review and pay.
                </h2>
              </div>

              {/* Order summary */}
              <div className="border border-rt-border mb-10">
                <div className="px-5 py-4 border-b border-rt-border">
                  <p className="text-[11px] font-sans uppercase tracking-[0.15em] text-rt-text/50 font-semibold">
                    Order summary
                  </p>
                </div>
                <div className="px-5 py-4">
                  <div className="flex items-baseline justify-between mb-2">
                    <div>
                      <p className="text-[14px] font-sans font-medium text-rt-text">
                        {name || "Your business"}
                      </p>
                      <p className="text-[12px] font-sans text-rt-text/50 capitalize mt-0.5">
                        Directory listing · {plan} plan
                      </p>
                    </div>
                    <p className="font-serif text-[22px] text-rt-text tracking-tight">
                      {plan === "annual" ? "$100" : "$10"}
                      <span className="text-[12px] font-sans text-rt-text/50 ml-1">
                        /{plan === "annual" ? "yr" : "mo"}
                      </span>
                    </p>
                  </div>
                  {plan === "annual" && (
                    <div className="mt-3 pt-3 border-t border-rt-border flex items-baseline justify-between">
                      <span className="text-[12px] font-sans text-emerald-700">
                        Annual discount (2 months free)
                      </span>
                      <span className="text-[12px] font-sans font-semibold text-emerald-700 tabular-nums">
                        −$20
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stripe placeholder */}
              {/* TODO: wire to Stripe — create Stripe Checkout session server action here */}
              {/* TODO: use existing Stripe infrastructure from main roseburgtracker.com codebase */}
              <div className="border border-dashed border-rt-border p-10 text-center bg-rt-surface/50 mb-10">
                <Lock size={22} className="mx-auto text-rt-text/30 mb-4" />
                <p className="font-serif text-[20px] text-rt-text mb-1 tracking-tight">
                  Stripe Checkout
                </p>
                <p className="text-[13px] font-sans text-rt-text/60 mb-1">
                  Payment form renders here once wired.
                </p>
                <p className="text-[12px] font-sans text-rt-text/40">
                  Developer: reuse the Stripe integration from the main Roseburg Tracker site.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-rt-border">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-sans font-medium text-rt-text/60 hover:text-rt-amber transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
                {/* TODO: wire to Stripe — this button should trigger createCheckoutSession() */}
                <button
                  className="inline-flex items-center gap-2 text-[13px] font-sans font-semibold px-6 py-3 bg-rt-text/30 text-white cursor-not-allowed"
                  disabled
                  title="Developer: wire this to Stripe Checkout"
                >
                  <Lock size={14} />
                  Pay — wired by developer
                </button>
              </div>

              <p className="text-[11px] font-sans text-rt-text/40 text-center mt-8 leading-relaxed">
                By continuing you agree to our{" "}
                <Link
                  href="https://roseburgtracker.com/terms"
                  className="underline underline-offset-2 hover:text-rt-amber"
                >
                  Terms of Service
                </Link>
                . Subscriptions auto-renew and can be cancelled any time.
              </p>
            </div>
          )}

          {/* Trust line */}
          <div className="mt-16 pt-8 border-t border-rt-border flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[11px] font-sans text-rt-text/40 uppercase tracking-[0.12em]">
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-600" />
              Secure checkout
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-600" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-600" />
              Listed within 24 hours
            </span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
