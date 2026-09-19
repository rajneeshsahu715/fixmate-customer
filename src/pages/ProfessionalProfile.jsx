import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../api/api";
import Card from "../components/Card";

const ProfessionalProfile = () => {
  const { professionalId } = useParams();

  const [provider, setProvider] = useState(null);
  const [providerServices, setProviderServices] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const loadProvider = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response = await api.get(
          `/api/providers/${professionalId}`
        );

        const providerData =
          response.data?.provider || null;

        const serviceData =
          response.data?.services || [];

        if (!providerData) {
          throw new Error(
            "Professional not found"
          );
        }

        if (mounted) {
          setProvider(providerData);
          setProviderServices(serviceData);
        }
      } catch (error) {
        console.error(
          "Professional profile load failed:",
          error.response?.data ||
            error.message
        );

        if (mounted) {
          setProvider(null);

          setErrorMessage(
            error.response?.data?.message ||
              "The professional you are looking for could not be found."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProvider();

    return () => {
      mounted = false;
    };
  }, [professionalId]);

  const professionalName = useMemo(() => {
    if (!provider) {
      return "Professional";
    }

    const userName = [
      provider.user?.firstName,
      provider.user?.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      provider.businessName ||
      userName ||
      "FixMate Professional"
    );
  }, [provider]);

  const initials = useMemo(() => {
    if (!professionalName) {
      return "FM";
    }

    const words = professionalName
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .slice(0, 2)
        .toUpperCase();
    }

    return (
      words[0][0] +
      words[words.length - 1][0]
    ).toUpperCase();
  }, [professionalName]);

  const locationText = useMemo(() => {
    if (!provider?.address) {
      return "Location not provided";
    }

    const parts = [
      provider.address.line1,
      provider.address.line2,
      provider.address.city,
      provider.address.state,
    ].filter(Boolean);

    const base = parts.join(", ");

    if (provider.address.pincode) {
      return base
        ? `${base} - ${provider.address.pincode}`
        : provider.address.pincode;
    }

    return base || "Location not provided";
  }, [provider]);

  const primaryServiceId =
    providerServices?.[0]?.service?._id ||
    null;

  const serviceNames =
    providerServices
      .map((item) => item.service?.name)
      .filter(Boolean);

  const serviceAreas = [
    provider?.address?.city,
    provider?.address?.state,
  ].filter(Boolean);

  const portfolio =
    Array.isArray(provider?.portfolioImages) &&
    provider.portfolioImages.length > 0
      ? provider.portfolioImages
      : [];

  const availabilityLabel =
    provider?.availability === "available"
      ? "Available now"
      : provider?.availability === "busy"
      ? "Currently busy"
      : "Currently offline";

  if (loading) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full text-center"
          >
            <Loader2
              size={32}
              className="mx-auto animate-spin text-primary-600"
            />

            <p className="mt-4 text-sm font-medium text-text-secondary">
              Loading professional profile...
            </p>
          </Card>
        </div>
      </section>
    );
  }

  if (!provider) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <ShieldCheck size={27} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-primary-900">
              Professional not found
            </h1>

            <p className="mt-4 text-text-secondary">
              {errorMessage ||
                "The professional you are looking for could not be found."}
            </p>

            <div className="mt-7">
              <Link
                to="/professionals"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
              >
                <ArrowLeft size={17} />
                Back to Professionals
              </Link>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/professionals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Professionals
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Profile Header */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-primary-900 sm:h-40" />

          <div className="px-6 pb-7 sm:px-8">
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-primary-100 text-2xl font-extrabold text-primary-700 shadow-md sm:h-28 sm:w-28">
                  {provider.profileImage ? (
                    <img
                      src={provider.profileImage}
                      alt={professionalName}
                      className="h-full w-full rounded-[20px] object-cover"
                    />
                  ) : (
                    initials
                  )}

                  <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-success text-white">
                    <ShieldCheck size={16} />
                  </span>
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-extrabold text-primary-900 sm:text-3xl">
                      {professionalName}
                    </h1>

                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-success">
                      <ShieldCheck size={13} />
                      Verified
                    </span>
                  </div>

                  <p className="mt-1 text-sm font-semibold text-primary-600">
                    {provider.category ||
                      "Service Professional"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  to={`/messages?professionalId=${provider._id}`}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                >
                  Message
                </Link>

                {primaryServiceId && (
                  <Link
                    to={`/services/${primaryServiceId}/book`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
                  >
                    Book Now
                    <ArrowRight size={17} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Star
                  size={19}
                  fill="currentColor"
                />
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Rating
                </p>

                <p className="font-bold text-text-primary">
                  {provider.rating?.average ??
                    0}{" "}
                  <span className="font-normal text-text-muted">
                    ({provider.rating?.count ?? 0})
                  </span>
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Experience
                </p>

                <p className="font-bold text-text-primary">
                  {provider.experienceYears ?? 0} years
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
                <CheckCircle2 size={19} />
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Completed jobs
                </p>

                <p className="font-bold text-text-primary">
                  {provider.completedJobs ?? 0}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Availability
                </p>

                <p
                  className={`font-bold ${
                    provider.availability ===
                    "available"
                      ? "text-success"
                      : "text-text-primary"
                  }`}
                >
                  {availabilityLabel}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div className="space-y-8">
            {/* About */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-text-primary">
                About {professionalName.split(" ")[0]}
              </h2>

              <p className="mt-4 text-sm leading-7 text-text-secondary">
                {provider.bio ||
                  "This professional has not added a business description yet."}
              </p>
            </Card>

            {/* Services */}
            <Card padding="lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Services offered
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Services currently associated with this professional.
                  </p>
                </div>

                <Wrench
                  size={21}
                  className="text-primary-600"
                />
              </div>

              {serviceNames.length > 0 ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {serviceNames.map((serviceName) => (
                    <div
                      key={serviceName}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <CheckCircle2
                        size={17}
                        className="shrink-0 text-success"
                      />

                      <span className="text-sm font-medium text-text-primary">
                        {serviceName}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                  <p className="text-sm font-medium text-text-secondary">
                    No services have been added yet.
                  </p>
                </div>
              )}
            </Card>

            {/* Service Areas */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-text-primary">
                Service areas
              </h2>

              {serviceAreas.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {serviceAreas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-text-secondary"
                    >
                      <MapPin size={14} />
                      {area}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-text-muted">
                  Service area has not been provided.
                </p>
              )}
            </Card>

            {/* Portfolio */}
            <Card padding="lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-text-primary">
                    Work portfolio
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Portfolio images uploaded by this professional.
                  </p>
                </div>

                <Wrench
                  size={21}
                  className="text-primary-600"
                />
              </div>

              {portfolio.length > 0 ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {portfolio.map((imageUrl, index) => (
                    <a
                      key={`${imageUrl}-${index}`}
                      href={imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={`Portfolio ${index + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      <div className="px-4 py-3">
                        <span className="text-xs font-semibold text-primary-600">
                          PROJECT {index + 1}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex aspect-[4/2] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50">
                  <p className="text-sm text-text-muted">
                    No portfolio images uploaded yet.
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Booking Card */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-text-muted">
                Starting price
              </p>

              <div className="mt-1">
                <span className="text-3xl font-extrabold text-primary-900">
                  ₹{provider.basePrice ?? 0}
                </span>

                <span className="ml-2 text-sm text-text-muted">
                  onwards
                </span>
              </div>

              <div className="mt-6 space-y-4 border-y border-slate-100 py-5">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-text-muted"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium text-text-primary">
                      {locationText}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={18}
                    className="mt-0.5 shrink-0 text-text-muted"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Availability
                    </p>

                    <p
                      className={`mt-1 text-sm font-semibold ${
                        provider.availability ===
                        "available"
                          ? "text-success"
                          : "text-text-primary"
                      }`}
                    >
                      {availabilityLabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <BriefcaseBusiness
                    size={18}
                    className="mt-0.5 shrink-0 text-text-muted"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-medium text-text-primary">
                      {provider.experienceYears ?? 0} years
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Verification
                    </p>

                    <p className="mt-1 text-sm font-semibold text-success">
                      Verified FixMate Provider
                    </p>
                  </div>
                </div>
              </div>

              {primaryServiceId ? (
                <Link
                  to={`/services/${primaryServiceId}/book`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
                >
                  Book with{" "}
                  {professionalName.split(" ")[0]}
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <div className="mt-6 rounded-xl bg-slate-100 px-5 py-3 text-center text-sm font-semibold text-slate-500">
                  Booking service not available yet
                </div>
              )}

              <Link
                to={`/messages?professionalId=${provider._id}`}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
              >
                Message Professional
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-text-muted">
                Final pricing may depend on the selected service,
                requirements, distance, and applicable charges.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProfessionalProfile;