import { useEffect, useState } from "react";

import {
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Wind,
  Sparkles,
  Bug,
  Wrench,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

import Card from "./Card";
import api from "../api/api";

// ========================================
// Icon mapping based on service/category
// ========================================
const getServiceIcon = (service) => {
  const text = `${service.name || ""} ${
    service.category || ""
  }`.toLowerCase();

  if (
    text.includes("electrical") ||
    text.includes("electric")
  ) {
    return {
      icon: Zap,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    };
  }

  if (
    text.includes("plumb") ||
    text.includes("pipe")
  ) {
    return {
      icon: Droplets,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
    };
  }

  if (
    text.includes("carpent") ||
    text.includes("furniture")
  ) {
    return {
      icon: Hammer,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    };
  }

  if (text.includes("paint")) {
    return {
      icon: Paintbrush,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    };
  }

  if (
    text.includes("ac ") ||
    text.startsWith("ac") ||
    text.includes("air-conditioner")
  ) {
    return {
      icon: Wind,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    };
  }

  if (text.includes("clean")) {
    return {
      icon: Sparkles,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    };
  }

  if (text.includes("pest")) {
    return {
      icon: Bug,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    };
  }

  return {
    icon: Wrench,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  };
};

const PopularServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPopularServices = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/services/popular"
        );

        if (response.data.success) {
          setServices(
            response.data.services || []
          );
        } else {
          setServices([]);
          setError(
            "Unable to load popular services."
          );
        }
      } catch (error) {
        console.error(
          "Popular services fetch failed:",
          error
        );

        setServices([]);

        setError(
          "Unable to load popular services."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, []);

  return (
    <section
      id="services"
      className="border-t border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Popular services
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              Everything your home needs
            </h2>

            <p className="mt-4 text-base leading-7 text-text-secondary">
              From quick repairs to complete home
              maintenance, find trusted professionals
              for the job.
            </p>
          </div>

          {/* View All Services */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-accent-600"
          >
            View all services
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* =========================
            Loading State
        ========================= */}
        {loading && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-2xl bg-slate-100"
                />
              )
            )}
          </div>
        )}

        {/* =========================
            Error State
        ========================= */}
        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}

        {/* =========================
            Empty State
        ========================= */}
        {!loading &&
          !error &&
          services.length === 0 && (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-10 text-center">
              <p className="font-semibold text-slate-700">
                No popular services available right now.
              </p>
            </div>
          )}

        {/* =========================
            Service Grid
        ========================= */}
        {!loading &&
          !error &&
          services.length > 0 && (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => {
                const serviceVisual =
                  getServiceIcon(service);

                const Icon =
                  serviceVisual.icon;

                return (
                  <Card
                    key={service._id}
                    hover
                    padding="lg"
                    className="group"
                  >
                    <Link
                      to={`/services/${service._id}`}
                      className="block h-full"
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${serviceVisual.iconBg} ${serviceVisual.iconColor}`}
                      >
                        <Icon
                          size={23}
                          strokeWidth={2}
                        />
                      </div>

                      <h3 className="mt-5 text-lg font-bold text-text-primary">
                        {service.name}
                      </h3>

                      <p className="mt-2 min-h-12 text-sm leading-6 text-text-secondary">
                        {service.shortDescription}
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary-600">
                          From ₹
                          {Number(
                            service.basePrice || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors group-hover:text-accent-600">
                          Explore

                          <ArrowRight
                            size={16}
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </Link>
                  </Card>
                );
              })}
            </div>
          )}
      </div>
    </section>
  );
};

export default PopularServices;