import { useState } from "react";

import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  UserRound,
  BriefcaseBusiness,
  LayoutDashboard,
  X,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "./Button";

const APP_URLS = {
  customer: "http://localhost:5173",
  provider: "http://localhost:5174",
  admin: "http://localhost:5175",
};

const Hero = () => {
  const navigate = useNavigate();

  const [serviceQuery, setServiceQuery] =
    useState("");

  const [locationQuery, setLocationQuery] =
    useState("");

  const [error, setError] =
    useState("");

  const [showGetStarted, setShowGetStarted] =
    useState(false);

  const handleFindProfessionals = () => {
    const service =
      serviceQuery.trim();

    const location =
      locationQuery.trim();

    if (!service && !location) {
      setError(
        "Please enter a service and your location."
      );
      return;
    }

    if (!service) {
      setError(
        "Please enter the service you need."
      );
      return;
    }

    if (!location) {
      setError(
        "Please enter your location."
      );
      return;
    }

    setError("");

    navigate(
      `/professionals?search=${encodeURIComponent(
        service
      )}&location=${encodeURIComponent(
        location
      )}`
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleFindProfessionals();
    }
  };

  const openExternalApp = (url) => {
    window.location.href = url;
  };

  const closeGetStarted = () => {
    setShowGetStarted(false);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-background">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            {/* =================================================
                LEFT CONTENT
            ================================================== */}

            <div>
              {/* Trust Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700">
                <ShieldCheck size={16} />
                Trusted & verified professionals
              </div>

              {/* Heading */}
              <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
                Trusted professionals.
                <span className="mt-2 block text-primary-600">
                  Right at your doorstep.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
                Book reliable professionals for
                repairs, cleaning, appliance
                services, and everyday home
                maintenance — all from one
                trusted platform.
              </p>

              {/* Search Box */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/40">
                <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_auto]">
                  {/* Service Input */}
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                    <Search
                      size={20}
                      className="shrink-0 text-text-muted"
                    />

                    <input
                      type="text"
                      value={serviceQuery}
                      onChange={(event) => {
                        setServiceQuery(
                          event.target.value
                        );

                        if (error) {
                          setError("");
                        }
                      }}
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="What service do you need?"
                      className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Location Input */}
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                    <MapPin
                      size={20}
                      className="shrink-0 text-text-muted"
                    />

                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(event) => {
                        setLocationQuery(
                          event.target.value
                        );

                        if (error) {
                          setError("");
                        }
                      }}
                      onKeyDown={
                        handleKeyDown
                      }
                      placeholder="Enter your location"
                      className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* CTA */}
                  <Button
                    size="lg"
                    type="button"
                    onClick={
                      handleFindProfessionals
                    }
                  >
                    Find Professionals
                  </Button>
                </div>

                {/* Validation */}
                {error && (
                  <div className="mt-3 flex items-center gap-2 px-1 text-sm font-medium text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    {error}
                  </div>
                )}
              </div>

              {/* Get Started CTA */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowGetStarted(true)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3.5 text-sm font-bold !text-white shadow-sm transition-all duration-200 hover:bg-primary-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span className="!text-white">
                    Get Started
                  </span>

                  <ArrowRight
                    size={18}
                    className="text-white"
                  />
                </button>

                <p className="text-sm text-text-secondary">
                  Book services or join FixMate
                  as a professional.
                </p>
              </div>

              {/* Trust Stats */}
              <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={17}
                    className="text-success"
                  />
                  <span>
                    Verified providers
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Star
                    size={17}
                    className="text-accent-500"
                    fill="currentColor"
                  />
                  <span>
                    Trusted ratings
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Users
                    size={17}
                    className="text-primary-600"
                  />
                  <span>
                    Local professionals
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT VISUAL
            ================================================== */}

            <div className="relative mx-auto w-full max-w-lg">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6">
                {/* Visual */}
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
                  <div className="text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-900 text-4xl shadow-md">
                      🛠️
                    </div>

                    <p className="mt-5 text-lg font-bold text-primary-900">
                      Your home, taken care of.
                    </p>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                      Skilled professionals for
                      the jobs that matter most.
                    </p>
                  </div>
                </div>

                {/* Provider Preview */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
                        RK
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-text-primary">
                            Verified Professional
                          </p>

                          <ShieldCheck
                            size={15}
                            className="text-success"
                          />
                        </div>

                        <p className="mt-0.5 text-xs text-text-muted">
                          Available near you
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-bold text-text-primary">
                        <Star
                          size={15}
                          className="text-accent-500"
                          fill="currentColor"
                        />
                        4.8
                      </div>

                      <p className="mt-0.5 text-xs text-text-muted">
                        Top rated
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex sm:items-center sm:gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-text-muted">
                    Safety first
                  </p>

                  <p className="text-sm font-bold text-text-primary">
                    Verified professionals
                  </p>
                </div>
              </div>
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
            {/* Modal Header */}
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

            {/* Modal Content */}
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-primary-200 hover:bg-primary-50/40">
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
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-primary-200 hover:bg-primary-50/40">
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

            {/* Modal Footer */}
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

export default Hero;