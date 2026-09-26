import { useState } from "react";

import {
  ArrowRight,
  ShieldCheck,
  UserRound,
  BriefcaseBusiness,
  LayoutDashboard,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "./Button";

const APP_URLS = {
  provider: "http://localhost:5174",
  admin: "http://localhost:5175",
};

const FinalCTA = () => {
  const navigate = useNavigate();

  const [showGetStarted, setShowGetStarted] =
    useState(false);

  const closeGetStarted = () => {
    setShowGetStarted(false);
  };

  const openExternalApp = (url) => {
    window.location.href = url;
  };

  return (
    <>
      <section className="border-t border-slate-200 bg-background">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-primary-900 px-6 py-12 text-center sm:px-10 sm:py-16">
            {/* Decorative Shapes */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-500/10 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary-500/10 blur-3xl"
            />

            <div className="relative mx-auto max-w-3xl">
              {/* Small Badge */}
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-300">
                <ShieldCheck size={16} />
                Trusted home services
              </div>

              {/* Heading */}
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to get your home sorted?
              </h2>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Find the right professional, choose a convenient time,
                and book your service with confidence.
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-accent-500 hover:bg-accent-600 focus:ring-accent-500"
                  onClick={() =>
                    navigate("/professionals")
                  }
                >
                  Find Professionals
                  <ArrowRight size={18} />
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                  onClick={() =>
                    navigate("/services")
                  }
                >
                  Explore Services
                </Button>

                <button
                  type="button"
                  onClick={() =>
                    setShowGetStarted(true)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-bold text-primary-900 transition-colors hover:bg-slate-100"
                >
                  Get Started
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Trust Note */}
              <p className="mt-6 text-xs text-slate-400">
                Simple booking • Verified professionals • Clear pricing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          GET STARTED MODAL
      ====================================================== */}

      {showGetStarted && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeGetStarted();
            }
          }}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-start justify-between gap-5 border-b border-slate-200 px-6 py-6 sm:px-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">
                  Get Started
                </p>

                <h2 className="mt-2 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                  How would you like to use FixMate?
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  Choose the app that matches your
                  account. You can log in or create
                  an account from there.
                </p>
              </div>

              <button
                type="button"
                onClick={closeGetStarted}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* OPTIONS */}

            <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
              {/* CUSTOMER */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-primary-200 hover:bg-primary-50/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                  <UserRound size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-primary-900">
                  Customer
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-5 text-text-secondary">
                  Book trusted professionals for
                  services at your home.
                </p>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      closeGetStarted();
                      navigate("/login");
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold !text-white transition-colors hover:bg-primary-700"
                  >
                    <span className="!text-white">
                      Login
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-white"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeGetStarted();
                      navigate("/signup");
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-text-primary transition-colors hover:bg-slate-50"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* PROVIDER */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <BriefcaseBusiness size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-primary-900">
                  Provider
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-5 text-text-secondary">
                  Offer your professional services
                  and manage your bookings.
                </p>

                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={() =>
                      openExternalApp(
                        `${APP_URLS.provider}/login`
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold !text-white transition-colors hover:bg-emerald-700"
                  >
                    <span className="!text-white">
                      Login
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-white"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openExternalApp(
                        `${APP_URLS.provider}/signup`
                      )
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-text-primary transition-colors hover:bg-slate-50"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* ADMIN */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-amber-200 hover:bg-amber-50/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <LayoutDashboard size={23} />
                </div>

                <h3 className="mt-5 text-lg font-bold text-primary-900">
                  Admin
                </h3>

                <p className="mt-2 min-h-[48px] text-sm leading-5 text-text-secondary">
                  Manage services, users, providers,
                  bookings, and the platform.
                </p>

                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() =>
                      openExternalApp(
                        `${APP_URLS.admin}/login`
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold !text-white transition-colors hover:bg-amber-700"
                  >
                    <span className="!text-white">
                      Admin Login
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-white"
                    />
                  </button>
                </div>

                <p className="mt-3 text-center text-xs text-text-muted">
                  Admin accounts are created
                  separately.
                </p>
              </div>
            </div>

            {/* FOOTER */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 sm:px-8">
              <p className="text-center text-xs leading-5 text-text-muted">
                Customer and Provider can create
                accounts. Admin access is login-only.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinalCTA;