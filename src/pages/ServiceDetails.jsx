import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Star,
  Users,
  LoaderCircle,
  MapPin,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import Card from "../components/Card";
import api from "../api/api";

const fallbackIncluded = [
  "Professional service inspection",
  "Standard service tools",
  "Basic service execution",
  "Service completion summary",
];

const fallbackExcluded = [
  "Major structural work",
  "Replacement parts or materials",
  "Additional work outside the selected service scope",
];

const fallbackFaqs = [
  {
    question: "What does this service include?",
    answer:
      "The selected service includes the standard work described in the service listing. Additional work may require a separate charge.",
  },
  {
    question: "Are replacement materials included?",
    answer:
      "Replacement parts and additional materials may be charged separately depending on the work required.",
  },
  {
    question: "Can I choose a professional?",
    answer:
      "Available verified professionals can be reviewed before booking.",
  },
];

const formatDuration = (minutes = 60) => {
  const totalMinutes = Number(minutes) || 60;

  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }

  const hours = totalMinutes / 60;

  if (Number.isInteger(hours)) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return `${hours.toFixed(1)} hours`;
};

const getProviderName = (provider) => {
  const firstName = provider?.user?.firstName || "";
  const lastName = provider?.user?.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    provider?.businessName ||
    "Verified Professional"
  );
};

const ServiceDetails = () => {
  const { serviceId } = useParams();

  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/api/services/${serviceId}`
        );

        if (!response.data.success) {
          throw new Error(
            response.data.message ||
              "Service not found"
          );
        }

        setService(response.data.service || null);

        setProviders(
          response.data.providers || []
        );
      } catch (error) {
        console.error(
          "Service details fetch failed:",
          error
        );

        setService(null);
        setProviders([]);

        setError(
          error?.response?.data?.message ||
            error.message ||
            "Unable to load service details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const serviceDuration = useMemo(() => {
    return formatDuration(
      service?.estimatedDurationMinutes
    );
  }, [service]);

  const rating = Number(
    service?.rating?.average || 0
  );

  const reviewCount = Number(
    service?.rating?.count || 0
  );

  const providerCount = providers.length;

  const included =
    Array.isArray(service?.requirements) &&
    service.requirements.length > 0
      ? service.requirements
      : fallbackIncluded;

  const excluded = fallbackExcluded;

  const faqs = fallbackFaqs;

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-4xl items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-primary-600"
            />

            <h1 className="mt-5 text-2xl font-extrabold text-primary-900">
              Loading service...
            </h1>

            <p className="mt-2 text-text-secondary">
              Fetching the latest service details.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // ERROR / NOT FOUND
  // =========================

  if (error || !service) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full text-center"
          >
            <h1 className="text-3xl font-extrabold text-primary-900">
              Service not found
            </h1>

            <p className="mt-4 text-text-secondary">
              {error ||
                "The service you are looking for could not be found."}
            </p>

            <div className="mt-7">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                <ArrowLeft size={17} />

                <span className="text-white">
                  Back to Services
                </span>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background">
      {/* =========================
          TOP BAR
      ========================= */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />

            Back to Services
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* =========================
            MAIN HEADER
        ========================= */}

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* IMAGE */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="relative flex aspect-[4/3] items-center justify-center bg-primary-50">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-900 text-white shadow-md">
                    <WrenchIcon />
                  </div>

                  <p className="mt-5 text-xl font-bold text-primary-900">
                    {service.name}
                  </p>

                  <p className="mt-2 text-sm text-text-secondary">
                    Professional{" "}
                    {service.category?.toLowerCase() ||
                      "home"}{" "}
                    service
                  </p>
                </div>
              )}

              {service.popular && (
                <span className="absolute left-5 top-5 rounded-full bg-accent-500 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                  Popular
                </span>
              )}
            </div>
          </div>

          {/* DETAILS */}

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700">
                {service.category}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-success">
                <ShieldCheck size={14} />
                Verified service
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              {service.name}
            </h1>

            <p className="mt-5 text-base leading-7 text-text-secondary">
              {service.description}
            </p>

            {/* STATS */}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <div className="flex items-center gap-1.5">
                <Star
                  size={18}
                  className="text-accent-500"
                  fill="currentColor"
                />

                <span className="font-bold text-text-primary">
                  {rating > 0
                    ? rating.toFixed(1)
                    : "New"}
                </span>

                <span className="text-sm text-text-muted">
                  {reviewCount}{" "}
                  {reviewCount === 1
                    ? "review"
                    : "reviews"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock3 size={17} />
                {serviceDuration}
              </div>

              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Users size={17} />
                {providerCount} providers
              </div>
            </div>

            {/* PRICE */}

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-text-muted">
                {service.pricingType === "hourly"
                  ? "Starting hourly"
                  : "Starting from"}
              </p>

              <div className="mt-1 flex items-end justify-between gap-5">
                <div>
                  <span className="text-3xl font-extrabold text-primary-900">
                    ₹
                    {Number(
                      service.basePrice || 0
                    ).toLocaleString("en-IN")}
                  </span>

                  <span className="ml-2 text-sm text-text-muted">
                    estimated base price
                  </span>
                </div>

                <span className="hidden rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-accent-600 sm:inline-flex">
                  Transparent pricing
                </span>
              </div>

              <p className="mt-3 text-xs leading-5 text-text-muted">
                Final price may vary depending on
                the work required, additional
                services, distance, or applicable
                charges.
              </p>
            </div>

            {/* CTA */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/services/${service._id}/book`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-700"
              >
                <span className="text-white">
                  Book This Service
                </span>

                <ArrowRight
                  size={18}
                  className="text-white"
                />
              </Link>

              {/* FIXED: service filter instead of text search */}
              <Link
                to={`/professionals?service=${encodeURIComponent(
                  service.slug || service.name
                )}`}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
              >
                View Professionals
              </Link>
            </div>
          </div>
        </div>

        {/* =========================
            PROVIDERS
        ========================= */}

        <div className="mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
                Verified professionals
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                Professionals for this service
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
                Compare verified professionals
                who offer this service before
                booking.
              </p>
            </div>

            {/* FIXED: service filter instead of text search */}
            <Link
              to={`/professionals?service=${encodeURIComponent(
                service.slug || service.name
              )}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-accent-600"
            >
              View all
              <ArrowRight size={17} />
            </Link>
          </div>

          {providers.length === 0 ? (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Users size={21} />
                </div>

                <div>
                  <h3 className="font-bold text-text-primary">
                    No verified professionals available yet
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-text-secondary">
                    Verified providers for this
                    service will appear here when
                    they become available in your
                    area.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {providers
                .slice(0, 6)
                .map((provider) => (
                  <Card
                    key={provider._id}
                    hover
                    padding="lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
                        {provider.profileImage ? (
                          <img
                            src={provider.profileImage}
                            alt={getProviderName(
                              provider
                            )}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-extrabold text-primary-700">
                            {getProviderName(
                              provider
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-text-primary">
                          {getProviderName(
                            provider
                          )}
                        </h3>

                        <p className="mt-1 text-xs text-text-secondary">
                          {provider.category ||
                            service.category}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                          <span className="inline-flex items-center gap-1">
                            <Star
                              size={14}
                              className="text-accent-500"
                              fill="currentColor"
                            />

                            {Number(
                              provider.rating
                                ?.average || 0
                            ).toFixed(1)}
                          </span>

                          <span>
                            {provider.experienceYears ||
                              0}{" "}
                            yrs exp.
                          </span>

                          <span>
                            {provider.completedJobs ||
                              0}{" "}
                            jobs
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <div>
                        <p className="text-xs text-text-muted">
                          Starting price
                        </p>

                        <p className="mt-1 text-lg font-extrabold text-primary-900">
                          ₹
                          {Number(
                            provider.basePrice ||
                              service.basePrice ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                        <ShieldCheck size={14} />
                        Verified
                      </span>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>

        {/* =========================
            INCLUDED / EXCLUDED
        ========================= */}

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Card padding="lg">
            <h2 className="text-xl font-bold text-text-primary">
              What&apos;s included
            </h2>

            <div className="mt-6 space-y-4">
              {included.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <span className="text-sm leading-6 text-text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-xl font-bold text-text-primary">
              What&apos;s not included
            </h2>

            <div className="mt-6 space-y-4">
              {excluded.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-text-muted">
                    —
                  </span>

                  <span className="text-sm leading-6 text-text-secondary">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* =========================
            CUSTOMER FEEDBACK
        ========================= */}

        <div className="mt-14">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
                Customer feedback
              </p>

              <h2 className="mt-2 text-2xl font-extrabold text-primary-900 sm:text-3xl">
                What customers are saying
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Star
                size={19}
                className="text-accent-500"
                fill="currentColor"
              />

              <span className="font-bold text-text-primary">
                {rating > 0
                  ? rating.toFixed(1)
                  : "New"}
              </span>

              <span className="text-sm text-text-muted">
                from {reviewCount} reviews
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Aarav Sharma",
                text: `The ${service.name.toLowerCase()} booking experience was simple and well organized.`,
              },
              {
                name: "Meera Joshi",
                text: "I liked the clear pricing and ability to compare professionals before booking.",
              },
              {
                name: "Kunal Verma",
                text: "The professional arrived on time and explained the service clearly.",
              },
            ].map((review) => (
              <Card key={review.name}>
                <div className="flex items-center gap-1">
                  {Array.from({
                    length: 5,
                  }).map((_, index) => (
                    <Star
                      key={index}
                      size={15}
                      className="text-accent-500"
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm leading-6 text-text-secondary">
                  &quot;{review.text}&quot;
                </p>

                <p className="mt-5 text-sm font-bold text-text-primary">
                  {review.name}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* =========================
            FAQ
        ========================= */}

        <div className="mt-14 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            FAQ
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-primary-900 sm:text-3xl">
            Frequently asked questions
          </h2>

          <div className="mt-7 space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.question}
                padding="lg"
              >
                <h3 className="text-base font-bold text-text-primary">
                  {faq.question}
                </h3>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>

        {/* =========================
            BOTTOM CTA
        ========================= */}

        <div className="mt-14 rounded-3xl bg-primary-900 p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                Ready to book{" "}
                {service.name.toLowerCase()}
                ?
              </h2>

              <p className="mt-2 text-sm text-slate-300">
                Choose a verified professional
                and select a convenient time slot.
              </p>
            </div>

            <Link
              to={`/services/${service._id}/book`}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-accent-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
            >
              <span className="text-white">
                Book Now
              </span>

              <ArrowRight
                size={18}
                className="text-white"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const WrenchIcon = () => {
  return (
    <svg
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-white"
    >
      <path
        d="M14.7 6.3a5 5 0 0 0-6.4 6.4l-5.6 5.6a2.1 2.1 0 0 0 3 3l5.6-5.6a5 5 0 0 0 6.4-6.4l-3.1 3.1-2.8-2.8 2.9-3.3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ServiceDetails;