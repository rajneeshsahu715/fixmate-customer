import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Star,
  MapPin,
  Clock3,
  X,
} from "lucide-react";

import api from "../api/api";

const Services = () => {
  const [searchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState(
    searchParams.get("search") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [sort, setSort] = useState("newest");
  const [availableOnly, setAvailableOnly] =
    useState(false);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [showFilters, setShowFilters] =
    useState(false);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          "/api/categories"
        );

        if (response.data.success) {
          setCategories(
            response.data.categories || []
          );
        }
      } catch (error) {
        console.error(
          "Categories fetch failed:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

  // =========================
  // FETCH SERVICES
  // =========================
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {};

        if (search.trim()) {
          params.search = search.trim();
        }

        if (category) {
          params.category = category;
        }

        if (sort) {
          params.sort = sort;
        }

        if (availableOnly) {
          params.available = "true";
        }

        if (minPrice !== "") {
          params.minPrice = minPrice;
        }

        if (maxPrice !== "") {
          params.maxPrice = maxPrice;
        }

        const response = await api.get(
          "/api/services",
          {
            params,
          }
        );

        if (response.data.success) {
          setServices(
            response.data.services || []
          );
        } else {
          setServices([]);
          setError(
            "Unable to load services."
          );
        }
      } catch (error) {
        console.error(
          "Services fetch failed:",
          error
        );

        setServices([]);

        setError(
          "Unable to load services. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [
    search,
    category,
    sort,
    availableOnly,
    minPrice,
    maxPrice,
  ]);

  // =========================
  // CLEAR FILTERS
  // =========================
  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("newest");
    setAvailableOnly(false);
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      search ||
        category ||
        availableOnly ||
        minPrice ||
        maxPrice ||
        sort !== "newest"
    );
  }, [
    search,
    category,
    availableOnly,
    minPrice,
    maxPrice,
    sort,
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* =========================
          HEADER
      ========================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-500">
              FixMate Services
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find the right service
              <span className="text-[#17365D]">
                {" "}
                for your home.
              </span>
            </h1>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Browse trusted home services, compare
              prices and choose a service that fits
              your needs.
            </p>
          </div>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search services..."
                className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-slate-900 outline-none transition focus:border-[#17365D] focus:ring-2 focus:ring-[#17365D]/10"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters((value) => !value)
              }
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-700 transition hover:border-slate-400"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  >
                    <option value="">
                      All Categories
                    </option>

                    {categories.map(
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
                    Minimum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        e.target.value
                      )
                    }
                    placeholder="₹0"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Maximum Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        e.target.value
                      )
                    }
                    placeholder="₹5000"
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Sort By
                  </label>

                  <select
                    value={sort}
                    onChange={(e) =>
                      setSort(e.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-slate-700 outline-none focus:border-[#17365D]"
                  >
                    <option value="newest">
                      Newest
                    </option>
                    <option value="popular">
                      Most Popular
                    </option>
                    <option value="rating">
                      Highest Rated
                    </option>
                    <option value="price_low">
                      Price: Low to High
                    </option>
                    <option value="price_high">
                      Price: High to Low
                    </option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex h-11 w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-white px-3">
                    <input
                      type="checkbox"
                      checked={
                        availableOnly
                      }
                      onChange={(e) =>
                        setAvailableOnly(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 accent-[#17365D]"
                    />

                    <span className="text-sm font-medium text-slate-700">
                      Available only
                    </span>
                  </label>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
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
          SERVICES
      ========================= */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Available services
            </h2>

            {!loading && (
              <p className="mt-1 text-sm text-slate-500">
                {services.length} service
                {services.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            )}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(
              (item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            <p className="font-semibold">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-3 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <Search
                  size={24}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No services found
              </h3>

              <p className="mt-2 text-slate-500">
                Try changing your search or
                filters.
              </p>
            </div>
          )}

        {/* Cards */}
        {!loading &&
          !error &&
          services.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map(
                (service) => (
                  <Link
                    key={service._id}
                    to={`/services/${service._id}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                  >
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {service.imageUrl ? (
                        <img
                          src={
                            service.imageUrl
                          }
                          alt={
                            service.name
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                          <span className="text-sm font-medium text-slate-400">
                            FixMate Service
                          </span>
                        </div>
                      )}

                      {service.popular && (
                        <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                          Popular
                        </span>
                      )}

                      {service.available && (
                        <span className="absolute right-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-600 shadow-sm">
                          Available
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                        {service.category}
                      </p>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        {service.name}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {
                          service.shortDescription
                        }
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Star
                            size={16}
                            className="fill-orange-400 text-orange-400"
                          />
                          {service.rating
                            ?.average ||
                            "New"}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Clock3 size={16} />
                          {Math.round(
                            (service.estimatedDurationMinutes ||
                              60) / 60
                          )}{" "}
                          hr
                        </span>
                      </div>

                      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-xs text-slate-400">
                            {service.pricingType ===
                            "hourly"
                              ? "Starting hourly"
                              : "Starting from"}
                          </p>

                          <p className="mt-1 text-2xl font-bold text-[#17365D]">
                            ₹
                            {Number(
                              service.basePrice ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </p>
                        </div>

                        <span className="inline-flex items-center gap-1 text-sm font-bold text-[#17365D]">
                          Explore
                          <span aria-hidden="true">
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
      </section>
    </div>
  );
};

export default Services;