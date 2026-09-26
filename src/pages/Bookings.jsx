import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MapPin,
  MessageCircle,
  ReceiptText,
  Star,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";

import Card from "../components/Card";
import { createAuthApi } from "../api/api";

const formatCurrency = (amount) => {
  const value = Number(amount || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const getProviderName = (booking) => {
  const firstName =
    booking?.provider?.user?.firstName || "";

  const lastName =
    booking?.provider?.user?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return (
    fullName ||
    booking?.provider?.businessName ||
    "Professional not assigned"
  );
};

const getAddress = (booking) => {
  const address = booking?.serviceAddress;

  if (!address) {
    return "Address unavailable";
  }

  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.pincode,
  ].filter(Boolean);

  return parts.join(", ");
};

const getStatusLabel = (status) => {
  switch (status) {
    case "provider_assigned":
      return "Provider Assigned";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "rejected":
      return "Rejected";
    case "pending":
      return "Pending";
    case "confirmed":
    default:
      return "Confirmed";
  }
};

const getStatusStyles = (status) => {
  switch (status) {
    case "confirmed":
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "text-emerald-600",
      };

    case "provider_assigned":
      return {
        badge:
          "bg-blue-50 text-blue-700 border-blue-200",
        icon: "text-blue-600",
      };

    case "in_progress":
      return {
        badge:
          "bg-violet-50 text-violet-700 border-violet-200",
        icon: "text-violet-600",
      };

    case "completed":
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: "text-emerald-600",
      };

    case "cancelled":
    case "rejected":
      return {
        badge:
          "bg-red-50 text-red-700 border-red-200",
        icon: "text-red-600",
      };

    case "pending":
    default:
      return {
        badge:
          "bg-amber-50 text-amber-700 border-amber-200",
        icon: "text-amber-600",
      };
  }
};

const getPaymentLabel = (paymentStatus) => {
  switch (paymentStatus) {
    case "paid":
      return "Paid";
    case "failed":
      return "Payment Failed";
    case "refunded":
      return "Refunded";
    case "partially_refunded":
      return "Partially Refunded";
    case "pending":
    default:
      return "Payment Pending";
  }
};

const getPaymentStyles = (paymentStatus) => {
  switch (paymentStatus) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "failed":
      return "bg-red-50 text-red-700";

    case "refunded":
    case "partially_refunded":
      return "bg-slate-100 text-slate-700";

    case "pending":
    default:
      return "bg-amber-50 text-amber-700";
  }
};

const StatusIcon = ({ status }) => {
  if (
    status === "cancelled" ||
    status === "rejected"
  ) {
    return <XCircle size={16} />;
  }

  if (status === "completed") {
    return <ReceiptText size={16} />;
  }

  return <CheckCircle2 size={16} />;
};

const Bookings = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const authApi =
          createAuthApi(getToken);

        const response =
          await authApi.get(
            "/api/bookings/me"
          );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Unable to load bookings."
          );
        }

        if (!cancelled) {
          const loadedBookings =
            Array.isArray(
              response.data?.bookings
            )
              ? response.data.bookings
              : [];

          setBookings(loadedBookings);
        }
      } catch (requestError) {
        console.error(
          "Bookings fetch failed:",
          requestError?.response?.data ||
            requestError?.message ||
            requestError
        );

        if (!cancelled) {
          setBookings([]);

          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load your bookings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  if (!isLoaded) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (!isSignedIn) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full text-center"
          >
            <h1 className="text-3xl font-extrabold text-primary-900">
              Sign in required
            </h1>

            <p className="mt-4 text-text-secondary">
              Please sign in to view your bookings.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white hover:bg-primary-700"
            >
              Go to Login
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  const totalBookings =
    bookings.length;

  const upcomingBookings =
    bookings.filter(
      (booking) =>
        booking.status !== "cancelled" &&
        booking.status !== "rejected" &&
        booking.status !== "completed"
    ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "completed"
    ).length;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-background">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* BACK */}
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-600">
              Customer Area
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
              View your real FixMate bookings, service schedule,
              professional details, payment status, and booking
              progress.
            </p>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Book a New Service
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-semibold text-red-700">
              Unable to load bookings
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* SUMMARY */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                <CalendarDays size={20} />
              </div>

              <span className="text-xs font-semibold text-text-muted">
                Total
              </span>
            </div>

            <p className="text-2xl font-extrabold text-primary-900">
              {loading ? "..." : totalBookings}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Total bookings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Clock3 size={20} />
              </div>

              <span className="text-xs font-semibold text-text-muted">
                Upcoming
              </span>
            </div>

            <p className="text-2xl font-extrabold text-primary-900">
              {loading
                ? "..."
                : upcomingBookings}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Active bookings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>

              <span className="text-xs font-semibold text-text-muted">
                Completed
              </span>
            </div>

            <p className="text-2xl font-extrabold text-primary-900">
              {loading
                ? "..."
                : completedBookings}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Services completed
            </p>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[250px] items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={38}
                className="mx-auto animate-spin text-primary-600"
              />

              <p className="mt-4 text-sm font-semibold text-text-secondary">
                Loading your bookings...
              </p>
            </div>
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          bookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                <CalendarDays size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-primary-900">
                No bookings yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
                Your real bookings will appear here after you
                book a FixMate service.
              </p>

              <Link
                to="/services"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white hover:bg-primary-700"
              >
                Explore Services
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

        {/* REAL BOOKINGS */}
        {!loading &&
          bookings.length > 0 && (
            <div className="space-y-5">
              {bookings.map((booking) => {
                const style =
                  getStatusStyles(
                    booking.status
                  );

                const providerName =
                  getProviderName(
                    booking
                  );

                return (
                  <article
                    key={booking._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
                  >
                    <div className="p-5 sm:p-6">
                      {/* TOP */}
                      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                            <Wrench size={21} />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-bold text-primary-900">
                                {booking?.service?.name ||
                                  "Home Service"}
                              </h2>

                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                              >
                                <span
                                  className={
                                    style.icon
                                  }
                                >
                                  <StatusIcon
                                    status={
                                      booking.status
                                    }
                                  />
                                </span>

                                {getStatusLabel(
                                  booking.status
                                )}
                              </span>
                            </div>

                            <p className="mt-1 text-sm text-text-muted">
                              Booking ID:{" "}
                              {booking.bookingNumber}
                            </p>
                          </div>
                        </div>

                        <p className="text-lg font-extrabold text-primary-900">
                          {formatCurrency(
                            booking?.pricing
                              ?.totalAmount
                          )}
                        </p>
                      </div>

                      {/* DETAILS */}
                      <div className="grid gap-5 py-5 md:grid-cols-2 xl:grid-cols-4">
                        <div className="flex items-start gap-3">
                          <CalendarDays
                            size={18}
                            className="mt-0.5 shrink-0 text-primary-600"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                              Date
                            </p>

                            <p className="mt-1 text-sm font-semibold text-text-primary">
                              {formatDate(
                                booking.scheduledDate
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock3
                            size={18}
                            className="mt-0.5 shrink-0 text-primary-600"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                              Time
                            </p>

                            <p className="mt-1 text-sm font-semibold text-text-primary">
                              {booking?.timeSlot
                                ?.start ||
                                "Unavailable"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <UserRound
                            size={18}
                            className="mt-0.5 shrink-0 text-primary-600"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                              Professional
                            </p>

                            <p className="mt-1 text-sm font-semibold text-text-primary">
                              {providerName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin
                            size={18}
                            className="mt-0.5 shrink-0 text-primary-600"
                          />

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                              Location
                            </p>

                            <p className="mt-1 text-sm font-semibold text-text-primary">
                              {getAddress(booking)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PAYMENT */}
                      <div className="flex flex-col gap-3 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <ReceiptText
                            size={17}
                            className="text-primary-600"
                          />

                          <span className="text-sm font-semibold text-text-secondary">
                            Payment Status
                          </span>
                        </div>

                        <span
                          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${getPaymentStyles(
                            booking.paymentStatus
                          )}`}
                        >
                          {getPaymentLabel(
                            booking.paymentStatus
                          )}
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                          {booking.status !==
                            "cancelled" &&
                            booking.status !==
                              "rejected" && (
                              <Link
                                to={`/messages?professionalId=${booking?.provider?._id || ""}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                              >
                                <MessageCircle size={17} />
                                Message Professional
                              </Link>
                            )}

                          {booking.status ===
                            "completed" && (
                            <Link
                              to={`/review/${booking._id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-accent-600"
                            >
                              <Star
                                size={17}
                                fill="currentColor"
                              />
                              Rate & Review
                            </Link>
                          )}
                        </div>

                        <Link
  to={`/bookings/${booking._id}`}
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
  style={{ color: "#ffffff" }}
>
  <span style={{ color: "#ffffff" }}>
    View Booking
  </span>

  <ArrowRight
    size={17}
    color="#ffffff"
  />
</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

        {/* CTA */}
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600">
            <Wrench size={21} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-primary-900">
            Need another service?
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary">
            Explore verified professionals and book the
            right service for your home.
          </p>

          <Link
            to="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-accent-600"
          >
            Explore Services
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Bookings;