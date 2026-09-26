import { useEffect, useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  LayoutDashboard,
  MapPin,
  Menu,
  Search,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useUser, UserButton } from "@clerk/react";

const locations = [
  "Bhopal",
  "Indore",
  "Raipur",
  "Jabalpur",
  "Nagpur",
  "Delhi",
  "Mumbai",
  "Bengaluru",
];

const APP_URLS = {
  provider: "http://localhost:5174",
  admin: "http://localhost:5175",
};

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [locationModalOpen, setLocationModalOpen] =
    useState(false);

  const [locationSearch, setLocationSearch] =
    useState("");

  const [selectedLocation, setSelectedLocation] =
    useState("");

  const [getStartedModalOpen, setGetStartedModalOpen] =
    useState(false);

  const {
    isLoaded,
    isSignedIn,
    user,
  } = useUser();

  useEffect(() => {
    const savedLocation =
      localStorage.getItem(
        "fixmate_location"
      );

    if (savedLocation) {
      setSelectedLocation(savedLocation);
    }
  }, []);

  const navLinks = [
    {
      label: "Services",
      to: "/services",
      hasDropdown: true,
    },
    {
      label: "Professionals",
      to: "/professionals",
    },
    {
      label: "How It Works",
      to: "/how-it-works",
    },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ======================================================
  // LOCATION MODAL
  // ======================================================

  const openLocationModal = () => {
    setLocationModalOpen(true);
    setLocationSearch("");
  };

  const closeLocationModal = () => {
    setLocationModalOpen(false);
    setLocationSearch("");
  };

  const handleLocationSelect = (
    location
  ) => {
    setSelectedLocation(location);

    localStorage.setItem(
      "fixmate_location",
      location
    );

    closeLocationModal();
  };

  const filteredLocations =
    locations.filter((location) =>
      location
        .toLowerCase()
        .includes(
          locationSearch
            .trim()
            .toLowerCase()
        )
    );

  // ======================================================
  // GET STARTED MODAL
  // ======================================================

  const openGetStartedModal = () => {
    setGetStartedModalOpen(true);
    setMobileMenuOpen(false);
  };

  const closeGetStartedModal = () => {
    setGetStartedModalOpen(false);
  };

  const openExternalApp = (url) => {
    window.location.href = url;
  };

  const handleCustomerLogin = () => {
    closeGetStartedModal();
    navigate("/login");
  };

  const handleCustomerSignup = () => {
    closeGetStartedModal();
    navigate("/signup");
  };

  const displayName =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split(
      "@"
    )[0] ||
    "Customer";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
            aria-label="FixMate Home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Wrench
                size={20}
                strokeWidth={2.5}
              />
            </span>

            <div className="leading-none">
              <span className="block text-xl font-extrabold tracking-tight text-primary-900">
                FixMate
              </span>

              <span className="mt-1 hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-text-muted sm:block">
                Home Services
              </span>
            </div>
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-8 lg:flex">
            <Link
              to="/"
              className="text-sm font-semibold text-text-primary transition-colors hover:text-accent-600"
            >
              Home
            </Link>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-accent-600"
              >
                {link.label}

                {link.hasDropdown && (
                  <ChevronDown
                    size={15}
                    className="transition-transform duration-200 group-hover:rotate-180"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================== */}

          <div className="hidden items-center gap-4 lg:flex">
            {/* Location */}
            <button
              type="button"
              onClick={openLocationModal}
              className="flex max-w-[190px] items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-50 hover:text-primary-600"
            >
              <MapPin
                size={16}
                className="shrink-0"
              />

              <span className="truncate">
                {selectedLocation ||
                  "Set Location"}
              </span>

              <ChevronDown
                size={14}
                className="shrink-0"
              />
            </button>

            <div className="h-5 w-px bg-slate-200" />

            {!isLoaded ? (
              <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
            ) : isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-slate-50"
                >
                  <div className="hidden text-right xl:block">
                    <p className="text-[11px] leading-none text-text-muted">
                      Welcome back
                    </p>

                    <p className="mt-1 max-w-[120px] truncate text-sm font-semibold text-primary-900">
                      {displayName}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {displayName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </Link>

                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        "h-10 w-10",
                    },
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
                >
                  <UserRound size={16} />
                  Login
                </Link>

                <button
                  type="button"
                  onClick={
                    openGetStartedModal
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-700"
                >
                  <span className="!text-white">
                    Get Started
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-white"
                  />
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (current) => !current
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-text-primary transition-colors hover:border-slate-300 hover:bg-slate-50 lg:hidden"
            aria-label={
              mobileMenuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </nav>

        {/* =================================================
            MOBILE MENU
        ================================================== */}

        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white lg:hidden">
            <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-slate-50 hover:text-primary-600"
                >
                  Home
                </Link>

                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-50 hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-5 border-t border-slate-100 pt-5">
                {/* Mobile Location */}
                <button
                  type="button"
                  onClick={openLocationModal}
                  className="mb-3 flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-slate-50"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <MapPin
                      size={17}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      {selectedLocation ||
                        "Set Location"}
                    </span>
                  </span>

                  <ChevronDown
                    size={16}
                    className="shrink-0"
                  />
                </button>

                {!isLoaded ? (
                  <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
                ) : isSignedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                        {displayName
                          .charAt(0)
                          .toUpperCase()}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-text-muted">
                          Welcome back
                        </p>

                        <p className="truncate text-sm font-semibold text-text-primary">
                          {displayName}
                        </p>
                      </div>

                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox:
                              "h-9 w-9",
                          },
                        }}
                      />
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex w-full items-center justify-center rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
                    >
                      Open Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                      >
                        <UserRound
                          size={16}
                        />
                        Login
                      </Link>

                      <button
                        type="button"
                        onClick={
                          openGetStartedModal
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
                      >
                        <span className="!text-white">
                          Get Started
                        </span>

                        <ArrowRight
                          size={16}
                          className="text-white"
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================
          LOCATION MODAL
      ====================================================== */}

      {locationModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-5 py-8"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeLocationModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent-600">
                  Location
                </p>

                <h2 className="mt-1 text-xl font-bold text-primary-900">
                  Choose your location
                </h2>
              </div>

              <button
                type="button"
                onClick={closeLocationModal}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary"
                aria-label="Close location modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="p-5">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="text"
                  autoFocus
                  value={locationSearch}
                  onChange={(event) =>
                    setLocationSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search city..."
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              {/* Current Selected */}
              {selectedLocation &&
                !locationSearch && (
                  <div className="mt-4 rounded-xl border border-primary-100 bg-primary-50 p-3">
                    <p className="text-xs font-semibold text-text-muted">
                      Current location
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <MapPin
                        size={16}
                        className="text-primary-600"
                      />

                      <span className="text-sm font-bold text-primary-900">
                        {selectedLocation}
                      </span>
                    </div>
                  </div>
                )}

              {/* Location List */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-muted">
                  Popular locations
                </p>

                <div className="max-h-64 overflow-y-auto">
                  {filteredLocations.length >
                  0 ? (
                    filteredLocations.map(
                      (location) => {
                        const selected =
                          location ===
                          selectedLocation;

                        return (
                          <button
                            key={location}
                            type="button"
                            onClick={() =>
                              handleLocationSelect(
                                location
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors ${
                              selected
                                ? "bg-primary-50"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <span
                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                  selected
                                    ? "bg-primary-100 text-primary-600"
                                    : "bg-slate-100 text-text-muted"
                                }`}
                              >
                                <MapPin
                                  size={17}
                                />
                              </span>

                              <span
                                className={`text-sm font-semibold ${
                                  selected
                                    ? "text-primary-900"
                                    : "text-text-primary"
                                }`}
                              >
                                {location}
                              </span>
                            </span>

                            {selected && (
                              <Check
                                size={17}
                                className="text-primary-600"
                              />
                            )}
                          </button>
                        );
                      }
                    )
                  ) : (
                    <div className="py-8 text-center">
                      <MapPin
                        size={24}
                        className="mx-auto text-text-muted"
                      />

                      <p className="mt-3 text-sm font-semibold text-primary-900">
                        No location found
                      </p>

                      <p className="mt-1 text-xs text-text-muted">
                        Try searching another
                        city.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Later GPS */}
              <button
                type="button"
                onClick={() =>
                  alert(
                    "Current device location will be connected in the location services step."
                  )
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
              >
                <MapPin size={17} />
                Use Current Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          GET STARTED MODAL
      ====================================================== */}

      {getStartedModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeGetStartedModal();
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
                onClick={
                  closeGetStartedModal
                }
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary"
                aria-label="Close Get Started modal"
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
                    onClick={
                      handleCustomerLogin
                    }
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
                    onClick={
                      handleCustomerSignup
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-text-primary transition-colors hover:bg-slate-50"
                  >
                    Create Account
                  </button>
                </div>
              </div>

              {/* PROVIDER */}

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <BriefcaseBusiness
                    size={23}
                  />
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
                  <LayoutDashboard
                    size={23}
                  />
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

export default Navbar;