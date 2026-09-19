import { useEffect, useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  BriefcaseBusiness,
  CalendarDays,
  ArrowRight,
  X,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Card from "../components/Card";
import api from "../api/api";

const getProviderName = (provider) => {
  const firstName =
    provider?.user?.firstName || "";

  const lastName =
    provider?.user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    provider?.businessName ||
    "Verified Professional"
  );
};

const getProviderInitials = (provider) => {
  const name = getProviderName(provider);

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) =>
      word.charAt(0).toUpperCase()
    )
    .join("");
};

const formatAvailability = (value) => {
  if (!value) {
    return "Currently unavailable";
  }

  if (value === "available") {
    return "Available";
  }

  if (value === "busy") {
    return "Busy";
  }

  return "Offline";
};

const Professionals = () => {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const [providers, setProviders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [service, setService] = useState(
    searchParams.get("service") ||
      ""
  );

  const [location, setLocation] =
    useState(
      searchParams.get("location") ||
        ""
    );

  const [minRating, setMinRating] =
    useState("");

  const [availability, setAvailability] =
    useState("");

  const [minExperience, setMinExperience] =
    useState("");

  const [sort, setSort] =
    useState("rating");

  const [showFilters, setShowFilters] =
    useState(false);

  const [services, setServices] =
    useState([]);

  // =========================
  // LOAD SERVICE OPTIONS
  // =========================
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await api.get(
          "/api/services"
        );

        if (response.data.success) {
          setServices(
            response.data.services || []
          );
        }
      } catch (error) {
        console.error(
          "Service options fetch failed:",
          error
        );
      }
    };

    loadServices();
  }, []);

  // =========================
  // LOAD PROVIDERS
  // =========================
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (search.trim()) {
          params.search =
            search.trim();
        }

        if (service) {
          params.service = service;
        }

        if (location.trim()) {
          params.city =
            location.trim();
        }

        if (minRating) {
          params.minRating =
            minRating;
        }

        if (availability) {
          params.availability =
            availability;
        }

        if (minExperience) {
          params.minExperience =
            minExperience;
        }

        if (sort) {
          params.sort = sort;
        }

        const response =
          await api.get(
            "/api/providers",
            {
              params,
            }
          );

        if (response.data.success) {
          setProviders(
            response.data.providers || []
          );
        } else {
          setProviders([]);
          setError(
            "Unable to load professionals."
          );
        }
      } catch (error) {
        console.error(
          "Professionals fetch failed:",
          error
        );

        setProviders([]);

        setError(
          error?.response?.data?.message ||
            "Unable to load professionals. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [
    search,
    service,
    location,
    minRating,
    availability,
    minExperience,
    sort,
  ]);

  const clearFilters = () => {
    setSearch("");
    setService("");
    setLocation("");
    setMinRating("");
    setAvailability("");
    setMinExperience("");
    setSort("rating");

    setSearchParams({});
  };

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      search ||
        service ||
        location ||
        minRating ||
        availability ||
        minExperience ||
        sort !== "rating"
    );
  }, [
    search,
    service,
    location,
    minRating,
    availability,
    minExperience,
    sort,
  ]);

  // =========================
  // SYNC URL
  // =========================
  const updateSearchParam = (
    key,
    value
  ) => {
    const params =
      new URLSearchParams(
        searchParams
      );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =========================
          HEADER
      ========================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Trusted professionals
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find a professional
              <span className="text-[#17365D]">
                {" "}
                you can trust.
              </span>
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Compare verified professionals,
              experience, ratings, pricing, and
              availability before you book.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(
                    event.target.value
                  );

                  updateSearchParam(
                    "search",
                    event.target.value
                  );
                }}
                placeholder="Search by name, service or category..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-slate-900 outline-none transition focus:border-[#17365D] focus:ring-2 focus:ring-[#17365D]/10"
              />
            </div>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={location}
                onChange={(event) => {
                  setLocation(
                    event.target.value
                  );

                  updateSearchParam(
                    "location",
                    event.target.value
                  );
                }}
                placeholder="City"
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-slate-900 outline-none transition focus:border-[#17365D] focus:ring-2 focus:ring-[#17365D]/10"
              />
            </div>

            <select
              value={sort}
              onChange={(event) =>
                setSort(event.target.value)
              }
              className="h-12 rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
            >
              <option value="rating">
                Recommended
              </option>

              <option value="experience">
                Most Experienced
              </option>

              <option value="jobs">
                Most Jobs
              </option>

              <option value="price_low">
                Lowest Price
              </option>

              <option value="price_high">
                Highest Price
              </option>
            </select>

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-700 transition hover:border-slate-400"
            >
              <SlidersHorizontal
                size={18}
              />
              Filters
            </button>
          </div>

          {/* FILTERS */}
          {showFilters && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Service
                  </label>

                  <select
                    value={service}
                    onChange={(event) =>
                      setService(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  >
                    <option value="">
                      All services
                    </option>

                    {services.map(
                      (item) => (
                        <option
                          key={item._id}
                          value={item.name}
                        >
                          {item.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Minimum Rating
                  </label>

                  <select
                    value={minRating}
                    onChange={(event) =>
                      setMinRating(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  >
                    <option value="">
                      Any rating
                    </option>

                    <option value="4.5">
                      4.5+
                    </option>

                    <option value="4">
                      4.0+
                    </option>

                    <option value="3">
                      3.0+
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Availability
                  </label>

                  <select
                    value={availability}
                    onChange={(event) =>
                      setAvailability(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  >
                    <option value="">
                      Any availability
                    </option>

                    <option value="available">
                      Available
                    </option>

                    <option value="busy">
                      Busy
                    </option>

                    <option value="offline">
                      Offline
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Experience
                  </label>

                  <select
                    value={minExperience}
                    onChange={(event) =>
                      setMinExperience(
                        event.target.value
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  >
                    <option value="">
                      Any experience
                    </option>

                    <option value="3">
                      3+ years
                    </option>

                    <option value="5">
                      5+ years
                    </option>

                    <option value="8">
                      8+ years
                    </option>

                    <option value="10">
                      10+ years
                    </option>
                  </select>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={
                    clearFilters
                  }
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#17365D]"
                >
                  <X size={16} />
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================
          RESULTS
      ========================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Professionals
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {loading
                ? "Finding professionals..."
                : `${providers.length} trusted professional${
                    providers.length !== 1
                      ? "s"
                      : ""
                  }`}
            </h2>

            {(service ||
              location ||
              search) && (
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-500">
                {service && (
                  <span>
                    Service: {service}
                  </span>
                )}

                {location && (
                  <span>
                    {service
                      ? " • "
                      : ""}
                    Location: {location}
                  </span>
                )}

                {search && (
                  <span>
                    {service ||
                    location
                      ? " • "
                      : ""}
                    Search: {search}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 font-semibold text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          providers.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No professionals found
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                No verified professionals match
                your current search and filter
                selection.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-xl bg-[#17365D] px-5 py-3 text-sm font-bold text-white"
              >
                Clear Filters
              </button>
            </div>
          )}

        {/* RESULTS */}
        {!loading &&
          !error &&
          providers.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map(
                (provider) => {
                  const providerName =
                    getProviderName(
                      provider
                    );

                  const initials =
                    getProviderInitials(
                      provider
                    );

                  const rating = Number(
                    provider.rating
                      ?.average || 0
                  );

                  const reviewCount =
                    Number(
                      provider.rating
                        ?.count || 0
                    );

                  const experience =
                    Number(
                      provider.experienceYears ||
                        0
                    );

                  const jobs =
                    Number(
                      provider.completedJobs ||
                        0
                    );

                  const price =
                    Number(
                      provider.basePrice ||
                        0
                    );

                  const availabilityText =
                    formatAvailability(
                      provider.availability
                    );

                  return (
                    <Card
                      key={provider._id}
                      hover
                      padding="none"
                      className="overflow-hidden"
                    >
                      {/* TOP */}
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-50 text-lg font-extrabold text-primary-700">
                            {provider
                              .profileImage ? (
                              <img
                                src={
                                  provider.profileImage
                                }
                                alt={
                                  providerName
                                }
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              initials
                            )}

                            <span className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500">
                              <ShieldCheck
                                size={11}
                                className="text-white"
                              />
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="truncate text-lg font-bold text-slate-900">
                                  {
                                    providerName
                                  }
                                </h3>

                                <p className="mt-1 text-sm font-medium text-[#17365D]">
                                  {
                                    provider.category
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                              <span className="inline-flex items-center gap-1">
                                <Star
                                  size={14}
                                  className="text-orange-500"
                                  fill="currentColor"
                                />

                                <span className="font-bold text-slate-700">
                                  {rating > 0
                                    ? rating.toFixed(
                                        1
                                      )
                                    : "New"}
                                </span>

                                {reviewCount >
                                  0 && (
                                  <span>
                                    (
                                    {
                                      reviewCount
                                    }
                                    )
                                  </span>
                                )}
                              </span>

                              <span className="inline-flex items-center gap-1">
                                <BriefcaseBusiness
                                  size={14}
                                />
                                {experience}{" "}
                                yrs
                              </span>

                              <span>
                                {jobs} jobs
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* LOCATION */}
                        <div className="mt-5 flex items-start gap-2 text-sm text-slate-600">
                          <MapPin
                            size={17}
                            className="mt-0.5 shrink-0 text-slate-400"
                          />

                          <div>
                            <p>
                              {provider.address
                                ?.city ||
                                "Location not specified"}
                              {provider
                                .address
                                ?.state
                                ? `, ${provider.address.state}`
                                : ""}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Service radius:{" "}
                              {
                                provider.serviceRadiusKm
                              }{" "}
                              km
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* FOOTER */}
                      <div className="border-t border-slate-100 bg-slate-50/70 p-5">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-xs text-slate-400">
                              Starting price
                            </p>

                            <p className="mt-1 text-2xl font-extrabold text-[#17365D]">
                              ₹
                              {price.toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              provider.availability ===
                              "available"
                                ? "bg-emerald-50 text-emerald-700"
                                : provider.availability ===
                                  "busy"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {
                              availabilityText
                            }
                          </span>
                        </div>

                        <Link
                          to={`/professionals/${provider._id}`}
                          className="inline-flex items-center justify-center rounded-xl border border-primary-900 bg-primary-900 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:border-primary-700 hover:bg-primary-700">
                          View Profile
                          <ArrowRight
                            size={17}
                            className="text-white"
                          />
                        </Link>
                      </div>
                    </Card>
                  );
                }
              )}
            </div>
          )}
      </section>
    </div>
  );
};

export default Professionals;