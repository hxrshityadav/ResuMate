import React from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Crown,
  Sparkles,
  ArrowRight
} from "lucide-react";

function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      sub: "Perfect to start",
      featured: false,
      features: [
        "2 Resume Templates",
        "3 Exports / month",
        "Basic AI Resume Builder",
        "PDF Download"
      ]
    },
    {
      name: "Pro",
      price: "₹299",
      sub: "Per month",
      featured: true,
      features: [
        "All Premium Templates",
        "Unlimited Exports",
        "ATS Optimizer",
        "Bullet Rewriter",
        "DOCX + PDF",
        "Priority Support"
      ]
    },
    {
      name: "Career+",
      price: "₹699",
      sub: "Per month",
      featured: false,
      features: [
        "Everything in Pro",
        "AI Interview Prep",
        "Job Match Analyzer",
        "Cover Letter Generator",
        "Portfolio Builder"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-20 text-center">
        <div className="inline-flex px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-zinc-300">
          Transparent Pricing
        </div>

        <h1 className="mt-6 text-5xl lg:text-6xl font-bold">
          Choose Your Growth Plan
        </h1>

        <p className="mt-5 text-zinc-400 max-w-2xl mx-auto text-lg">
          Start free. Upgrade when you're ready to dominate interviews.
        </p>

        <div className="grid lg:grid-cols-3 gap-7 mt-14">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-8 text-left ${
                plan.featured
                  ? "border-violet-500 bg-zinc-900 shadow-xl shadow-violet-500/10 scale-[1.02]"
                  : "border-white/10 bg-zinc-950"
              }`}
            >
              {plan.featured && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 text-xs mb-5">
                  <Crown className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <h2 className="text-2xl font-bold">
                {plan.name}
              </h2>

              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-bold">
                  {plan.price}
                </span>
                <span className="text-zinc-400 mb-2">
                  {plan.sub}
                </span>
              </div>

              <div className="mt-7 space-y-4">
                {plan.features.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 text-sm text-zinc-300"
                  >
                    <Check className="h-4 w-4 text-violet-400 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                to="/create"
                className={`mt-8 block text-center px-5 py-3 rounded-xl font-semibold transition ${
                  plan.featured
                    ? "bg-gradient-to-r from-violet-500 to-purple-600"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 text-center">
          <h3 className="text-4xl font-bold">
            5,000+ Users Trust ResuMate
          </h3>

          <p className="mt-4 text-zinc-400">
            Students, freshers and developers growing faster.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Pricing;