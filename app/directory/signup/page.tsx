"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check, ChevronRight, Building2, Upload, Phone, Globe, MapPin,
  Tag, CreditCard, Star, ArrowLeft, AlertCircle, Zap,
} from "lucide-react";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import type { Category } from "@/app/lib/mockData";

const STEPS = ["Business Info", "Choose Plan", "Checkout"];
const CATEGORIES: Category[] = ["Business", "Service", "Organization"];
const MAX_DESC_WORDS = 35;

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
    <div className="min-h-screen flex flex-col bg-rt-surface">
      <Nav />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
          {/* Back link */}
          <Link href="/directory" className="inline-flex items-center gap-1.5 text-sm font-sans text-rt-textMuted hover:text-rt-amber transition-colors mb-6">
            <ArrowLeft size={14} />
            Back to Directory
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl text-rt-text mb-2">List Your Business</h1>
            <p className="text-sm font-sans text-rt-textMuted">
              Get your business in front of thousands of Roseburg Tracker readers for as little as $10/month.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-0 mb-10">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                {/* Step circle */}
                <button
                  onClick={() => i < step && setStep(i)}
                  disabled={i > step}
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold font-sans text-xs flex-shrink-0 transition-colors ${
                    i < step
                      ? "bg-rt-amber border-rt-amber text-white cursor-pointer"
                      : i === step
                      ? "bg-white border-rt-amber text-rt-amber"
                      : "bg-white border-rt-border text-rt-textLight cursor-default"
                  }`}
                >
                  {i < step ? <Check size={14} /> : i + 1}
                </button>
                {/* Label */}
                <span
                  className={`ml-2 text-xs font-semibold font-sans whitespace-nowrap ${
                    i === step ? "text-rt-amber" : i < step ? "text-rt-text" : "text-rt-textLight"
                  }`}
                >
                  {label}
                </span>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 mx-3 h-0.5 ${i < step ? "bg-rt-amber" : "bg-rt-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* ── STEP 1: Business Info ── */}
          {step === 0 && (
            <div className="rt-card p-6 md:p-8">
              <h2 className="font-serif text-xl text-rt-text mb-6 flex items-center gap-2">
                <Building2 size={20} className="text-rt-amber" />
                Business Information
              </h2>

              <div className="space-y-5">
                {/* Business name */}
                <div>
                  <label className="rt-label">Business Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className="rt-input"
                    placeholder="e.g. Riverside Diner"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="rt-label mb-0">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-xs font-sans font-medium ${descOver ? "text-red-500" : descWords >= 30 ? "text-amber-600" : "text-rt-textMuted"}`}>
                      {descWords} / {MAX_DESC_WORDS} words
                    </span>
                  </div>
                  <textarea
                    className={`rt-input resize-none h-24 ${descOver ? "border-red-400 focus:border-red-400 focus:ring-red-200" : ""}`}
                    placeholder="Describe your business in 35 words or fewer…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  {descOver && (
                    <p className="text-xs text-red-500 font-sans mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {descWords - MAX_DESC_WORDS} word{descWords - MAX_DESC_WORDS !== 1 ? "s" : ""} over the limit
                    </p>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <label className="rt-label flex items-center gap-1">
                    <Tag size={13} />
                    Categories <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const selected = selectedCats.includes(cat);
                      const styles: Record<Category, string> = {
                        Business:     selected ? "bg-amber-100 border-amber-400 text-amber-800" : "border-rt-border text-rt-textMuted hover:border-amber-300",
                        Service:      selected ? "bg-blue-100 border-blue-400 text-blue-800" : "border-rt-border text-rt-textMuted hover:border-blue-300",
                        Organization: selected ? "bg-green-100 border-green-400 text-green-800" : "border-rt-border text-rt-textMuted hover:border-green-300",
                      };
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold font-sans px-3 py-1.5 rounded-full border transition-colors ${styles[cat]}`}
                        >
                          {selected && <Check size={12} />}
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="rt-label flex items-center gap-1">
                    <MapPin size={13} />
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="rt-input"
                    placeholder="123 Main St, Roseburg, OR 97470"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Phone + Website row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="rt-label flex items-center gap-1">
                      <Phone size={13} />
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      className="rt-input"
                      placeholder="(541) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="rt-label flex items-center gap-1">
                      <Globe size={13} />
                      Website
                      <span className="text-rt-textLight font-normal ml-1">(optional)</span>
                    </label>
                    <input
                      type="url"
                      className="rt-input"
                      placeholder="https://yourbusiness.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                {/* Logo upload */}
                <div>
                  <label className="rt-label flex items-center gap-1">
                    <Upload size={13} />
                    Logo
                    <span className="text-rt-textLight font-normal ml-1">(optional, PNG or JPG, max 2 MB)</span>
                  </label>
                  <div className="border-2 border-dashed border-rt-border rounded-card p-6 text-center bg-rt-surface hover:border-rt-amber transition-colors cursor-pointer">
                    {logoFile ? (
                      <div className="flex items-center justify-center gap-2 text-sm font-sans text-rt-text">
                        <Check size={16} className="text-green-600" />
                        {logoFile}
                        <button onClick={() => setLogoFile(null)} className="text-rt-textLight hover:text-red-500 text-xs ml-2">Remove</button>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} className="mx-auto text-rt-textLight mb-2" />
                        <p className="text-sm font-sans text-rt-textMuted">
                          Drag and drop your logo here, or{" "}
                          {/* TODO: wire file upload to storage (S3 / Cloudflare R2) */}
                          <button
                            type="button"
                            onClick={() => setLogoFile("logo-mockup.png")}
                            className="text-rt-amber hover:underline"
                          >
                            click to browse
                          </button>
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Next */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(1)}
                  disabled={!step1Valid()}
                  className={`inline-flex items-center gap-2 font-semibold font-sans text-sm px-6 py-2.5 rounded transition-colors ${
                    step1Valid()
                      ? "bg-rt-amber text-white hover:bg-rt-amberDark"
                      : "bg-rt-border text-rt-textLight cursor-not-allowed"
                  }`}
                >
                  Continue to Plan Selection
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Choose Plan ── */}
          {step === 1 && (
            <div className="rt-card p-6 md:p-8">
              <h2 className="font-serif text-xl text-rt-text mb-2 flex items-center gap-2">
                <CreditCard size={20} className="text-rt-amber" />
                Choose Your Plan
              </h2>
              <p className="text-sm font-sans text-rt-textMuted mb-8">
                Your listing will appear in the Roseburg Tracker Business Directory and may be featured in the news feed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Monthly */}
                <button
                  type="button"
                  onClick={() => setPlan("monthly")}
                  className={`relative text-left border-2 rounded-card p-5 transition-all ${
                    plan === "monthly"
                      ? "border-rt-amber bg-amber-50 shadow-card"
                      : "border-rt-border bg-white hover:border-rt-amberLight"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold font-sans text-rt-text text-base">Monthly</p>
                      <p className="text-rt-textMuted text-sm font-sans">Billed each month</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      plan === "monthly" ? "border-rt-amber bg-rt-amber" : "border-rt-border"
                    }`}>
                      {plan === "monthly" && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                  <p className="font-serif text-3xl text-rt-text">
                    $10<span className="text-base font-sans text-rt-textMuted">/mo</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm font-sans text-rt-textMuted">
                    {["Directory listing", "Category tags", "Contact info", "Website link", "Feed appearances (round-robin)"].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check size={13} className="text-rt-amber flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>

                {/* Annual */}
                <button
                  type="button"
                  onClick={() => setPlan("annual")}
                  className={`relative text-left border-2 rounded-card p-5 transition-all ${
                    plan === "annual"
                      ? "border-rt-amber bg-amber-50 shadow-card"
                      : "border-rt-border bg-white hover:border-rt-amberLight"
                  }`}
                >
                  {/* Best value badge */}
                  <div className="absolute -top-3 left-4">
                    <span className="inline-flex items-center gap-1 bg-rt-amber text-white text-xs font-semibold font-sans px-2.5 py-1 rounded-full shadow">
                      <Star size={10} fill="currentColor" />
                      Best Value — 2 months free
                    </span>
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold font-sans text-rt-text text-base">Annual</p>
                      <p className="text-rt-textMuted text-sm font-sans">Billed once per year</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      plan === "annual" ? "border-rt-amber bg-rt-amber" : "border-rt-border"
                    }`}>
                      {plan === "annual" && <Check size={11} className="text-white" />}
                    </div>
                  </div>
                  <p className="font-serif text-3xl text-rt-text">
                    $100<span className="text-base font-sans text-rt-textMuted">/yr</span>
                    <span className="ml-2 text-sm font-sans text-green-600 font-semibold">Save $20</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-sm font-sans text-rt-textMuted">
                    {[
                      "Everything in Monthly",
                      "Priority feed placement",
                      "Featured badge",
                      "Annual subscriber highlight",
                      "2 months free vs. monthly",
                    ].map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check size={13} className="text-rt-amber flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              </div>

              {/* Summary box */}
              <div className="bg-amber-50 border border-amber-200 rounded-card p-4 mb-8">
                <div className="flex items-start gap-3">
                  <Zap size={16} className="text-rt-amber mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold font-sans text-rt-text">
                      {plan === "annual" ? "Annual Plan — $100/year" : "Monthly Plan — $10/month"}
                    </p>
                    <p className="text-xs font-sans text-rt-textMuted mt-0.5">
                      {plan === "annual"
                        ? "You save $20 compared to monthly billing. Your listing renews automatically on the anniversary date."
                        : "Cancel any time. Your listing stays active through the end of your billing period."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(0)} className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-rt-textMuted hover:text-rt-amber transition-colors">
                  <ArrowLeft size={14} />
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="rt-btn-primary px-6 py-2.5"
                >
                  Continue to Payment
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Checkout placeholder ── */}
          {step === 2 && (
            <div className="rt-card p-6 md:p-8">
              <h2 className="font-serif text-xl text-rt-text mb-2 flex items-center gap-2">
                <CreditCard size={20} className="text-rt-amber" />
                Payment
              </h2>
              <p className="text-sm font-sans text-rt-textMuted mb-8">
                Secure payment powered by Stripe.
              </p>

              {/* Order summary */}
              <div className="bg-rt-surface border border-rt-border rounded-card p-4 mb-6">
                <p className="text-xs font-semibold font-sans text-rt-textMuted uppercase tracking-wide mb-3">Order Summary</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold font-sans text-rt-text">
                      {name || "Your Business"} — Directory Listing
                    </p>
                    <p className="text-xs font-sans text-rt-textMuted capitalize">{plan} plan</p>
                  </div>
                  <p className="font-serif text-lg text-rt-text">
                    {plan === "annual" ? "$100" : "$10"}
                    <span className="text-xs font-sans text-rt-textMuted">/{plan === "annual" ? "yr" : "mo"}</span>
                  </p>
                </div>
                {plan === "annual" && (
                  <div className="mt-3 pt-3 border-t border-rt-border flex items-center justify-between text-xs font-sans text-green-700">
                    <span>Annual discount (2 months free)</span>
                    <span>-$20</span>
                  </div>
                )}
              </div>

              {/* Stripe placeholder */}
              {/* TODO: wire to Stripe — create Stripe Checkout session server action here */}
              {/* TODO: use existing Stripe infrastructure from main roseburgtracker.com codebase */}
              <div className="border-2 border-dashed border-rt-border rounded-card p-8 text-center bg-rt-surface mb-8">
                <CreditCard size={32} className="mx-auto text-rt-textLight mb-3" />
                <p className="font-serif text-lg text-rt-text mb-1">Stripe Checkout</p>
                <p className="text-sm font-sans text-rt-textMuted mb-1">
                  Payment form will be rendered here by the developer.
                </p>
                <p className="text-xs font-sans text-rt-textLight">
                  Reuse the Stripe integration already in the main Roseburg Tracker codebase.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm font-sans font-medium text-rt-textMuted hover:text-rt-amber transition-colors">
                  <ArrowLeft size={14} />
                  Back
                </button>
                {/* TODO: wire to Stripe — this button should trigger createCheckoutSession() */}
                <button
                  className="rt-btn-primary px-6 py-2.5 opacity-60 cursor-not-allowed"
                  disabled
                  title="Developer: wire this to Stripe Checkout"
                >
                  <CreditCard size={16} />
                  Continue to payment — wired by developer
                </button>
              </div>

              <p className="text-xs font-sans text-rt-textLight text-center mt-4">
                By continuing, you agree to our{" "}
                <Link href="https://roseburgtracker.com/terms" className="hover:text-rt-amber underline">Terms of Service</Link>.
                Subscriptions auto-renew and can be cancelled any time.
              </p>
            </div>
          )}

          {/* Trust line */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs font-sans text-rt-textLight">
            <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Secure checkout</span>
            <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Cancel any time</span>
            <span className="flex items-center gap-1"><Check size={12} className="text-green-500" /> Listed within 24 hours</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
