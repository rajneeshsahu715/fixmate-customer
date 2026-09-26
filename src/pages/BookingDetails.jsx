import { useEffect, useState } from "react";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  CreditCard,
  LoaderCircle,
  MapPin,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
  X,
  XCircle,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";
import { useAuth } from "@clerk/react";

import Button from "../components/Button";
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
    weekday: "long",
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

const getInitials = (name) => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "P"
  );
};

const getAddressParts = (booking) => {
  const address = booking?.serviceAddress;

  if (!address) {
    return {
      line1: "Address unavailable",
      line2: "",
      cityStatePincode: "",
      landmark: "",
    };
  }

  const cityStatePincode = [
    address.city,
    address.state,
    address.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    line1: address.line1 || "",
    line2: address.line2 || "",
    cityStatePincode,
    landmark: address.landmark || "",
  };
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
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "provider_assigned":
      return "border-blue-200 bg-blue-50 text-blue-700";

    case "in_progress":
      return "border-violet-200 bg-violet-50 text-violet-700";

    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "cancelled":
    case "rejected":
      return "border-red-200 bg-red-50 text-red-700";

    case "pending":
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
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

const cancellationReasons = [
  "Change of plans",
  "Booked by mistake",
  "Service no longer required",
  "Found another professional",
  "Unable to be available at the scheduled time",
  "Other",
];

const BookingDetails = () => {
  const { bookingId } = useParams();

  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const [booking, setBooking] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================================
  // CANCELLATION STATE
  // ======================================================

  const [showCancelModal, setShowCancelModal] =
    useState(false);

  const [cancelling, setCancelling] =
    useState(false);

  const [cancellationReason, setCancellationReason] =
    useState("");

  const [cancelError, setCancelError] =
    useState("");

  const [cancelSuccess, setCancelSuccess] =
    useState("");

  // ======================================================
  // FETCH BOOKING
  // ======================================================

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      setError("Please sign in to view this booking.");
      return;
    }

    if (!bookingId) {
      setLoading(false);
      setError("Booking ID is missing.");
      return;
    }

    let cancelled = false;

    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const authApi =
          createAuthApi(getToken);

        const response =
          await authApi.get(
            `/api/bookings/${bookingId}`
          );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Unable to load booking."
          );
        }

        if (!cancelled) {
          setBooking(
            response.data?.booking || null
          );
        }
      } catch (requestError) {
        console.error(
          "Booking details fetch failed:",
          requestError?.response?.data ||
            requestError?.message ||
            requestError
        );

        if (!cancelled) {
          setBooking(null);

          setError(
            requestError?.response?.data?.message ||
              requestError?.message ||
              "Unable to load this booking."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBooking();

    return () => {
      cancelled = true;
    };
  }, [
    isLoaded,
    isSignedIn,
    getToken,
    bookingId,
  ]);

  // ======================================================
  // OPEN CANCELLATION MODAL
  // ======================================================

  const openCancelModal = () => {
    setCancellationReason("");
    setCancelError("");
    setCancelSuccess("");
    setShowCancelModal(true);
  };

  // ======================================================
  // CLOSE CANCELLATION MODAL
  // ======================================================

  const closeCancelModal = () => {
    if (cancelling) {
      return;
    }

    setShowCancelModal(false);
    setCancellationReason("");
    setCancelError("");
  };

  // ======================================================
  // CANCEL BOOKING
  // ======================================================

  const handleCancelBooking = async () => {
    if (!bookingId) {
      setCancelError("Booking ID is missing.");
      return;
    }

    if (!cancellationReason) {
      setCancelError(
        "Please select a cancellation reason."
      );
      return;
    }

    try {
      setCancelling(true);
      setCancelError("");
      setCancelSuccess("");

      const authApi =
        createAuthApi(getToken);

      const response =
        await authApi.patch(
          `/api/bookings/${bookingId}/cancel`,
          {
            reason: cancellationReason,
          }
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to cancel this booking."
        );
      }

      const updatedBooking =
        response.data?.booking;

      if (updatedBooking) {
        setBooking(updatedBooking);
      } else {
        setBooking((currentBooking) => ({
          ...currentBooking,
          status: "cancelled",
          cancellation: {
            ...(currentBooking?.cancellation || {}),
            reason: cancellationReason,
            cancelledAt:
              new Date().toISOString(),
          },
        }));
      }

      setShowCancelModal(false);
      setCancellationReason("");

      setCancelSuccess(
        "Booking cancelled successfully."
      );
    } catch (requestError) {
      console.error(
        "Booking cancellation failed:",
        requestError?.response?.data ||
          requestError?.message ||
          requestError
      );

      setCancelError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Unable to cancel this booking."
      );
    } finally {
      setCancelling(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (!isLoaded || loading) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-primary-600"
            />

            <h1 className="mt-5 text-2xl font-extrabold text-primary-900">
              Loading booking...
            </h1>

            <p className="mt-2 text-text-secondary">
              Fetching the latest booking details.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // AUTH
  // ======================================================

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
              Please sign in to view this booking.
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

  // ======================================================
  // BOOKING NOT FOUND
  // ======================================================

  if (!booking) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <ReceiptText size={25} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-primary-900">
              Booking not found
            </h1>

            <p className="mt-4 text-text-secondary">
              {error ||
                "We could not find the booking you are looking for."}
            </p>

            <Link
              to="/bookings"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
            >
              <ArrowLeft size={17} />
              Back to Bookings
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  // ======================================================
  // DERIVED DATA
  // ======================================================

  const providerName =
    getProviderName(booking);

  const providerInitials =
    getInitials(providerName);

  const address =
    getAddressParts(booking);

  const status =
    booking.status || "pending";

  const paymentStatus =
    booking.paymentStatus || "pending";

  const isCancelled =
    status === "cancelled" ||
    status === "rejected";

  const isCompleted =
    status === "completed";

  const isStarted =
    status === "in_progress";

  const isProviderAssigned =
    status ===
      "provider_assigned" ||
    Boolean(booking.provider);

  const isConfirmed =
    status === "confirmed" ||
    isProviderAssigned ||
    isStarted ||
    isCompleted;

  const canCancel =
    status === "pending" ||
    status === "confirmed" ||
    status === "provider_assigned";

  const timeline = [
    {
      title: "Booking Placed",
      description:
        "Your booking was successfully created in FixMate.",
      completed: true,
    },
    {
      title: "Booking Confirmed",
      description:
        isCancelled
          ? "This booking was cancelled before service completion."
          : "Your booking was confirmed by FixMate.",
      completed: isConfirmed,
    },
    {
      title: "Professional Assigned",
      description:
        booking.provider
          ? `${providerName} is assigned to this booking.`
          : "A professional has not been assigned yet.",
      completed:
        isProviderAssigned,
    },
    {
      title: "Service Started",
      description:
        isStarted ||
        isCompleted
          ? "The service has started."
          : isCancelled
            ? "Service did not start because the booking was cancelled."
            : "This step will update when the professional starts the service.",
      completed:
        isStarted ||
        isCompleted,
    },
    {
      title: "Service Completed",
      description:
        isCompleted
          ? "The service has been completed successfully."
          : isCancelled
            ? "This booking was cancelled before completion."
            : "Service completion will appear here after the work is finished.",
      completed:
        isCompleted,
    },
  ];

  if (isCancelled) {
    timeline.push({
      title: "Booking Cancelled",
      description:
        booking?.cancellation?.reason
          ? `Reason: ${booking.cancellation.reason}`
          : "This booking has been cancelled.",
      completed: true,
    });
  }

  return (
    <section className="min-h-screen bg-background">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to My Bookings
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Booking Details
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              {booking?.service?.name ||
                "Home Service"}
            </h1>

            <p className="mt-3 text-sm text-text-secondary">
              Booking ID:{" "}
              <span className="font-semibold text-text-primary">
                {booking.bookingNumber}
              </span>
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${getStatusStyles(
              status
            )}`}
          >
            {isCancelled ? (
              <XCircle size={17} />
            ) : (
              <CheckCircle2 size={17} />
            )}

            {getStatusLabel(status)}
          </span>
        </div>

        {/* =====================================================
            CANCELLATION SUCCESS
        ====================================================== */}

        {cancelSuccess && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            {cancelSuccess}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* =====================================================
              MAIN
          ====================================================== */}

          <div className="space-y-6">
            {/* SERVICE */}

            <Card padding="lg">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-primary-50 sm:h-24 sm:w-24">
                  <Wrench size={27} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Service
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-primary-900">
                    {booking?.service?.name ||
                      "Home Service"}
                  </h2>

                  {booking?.service?.category && (
                    <span className="mt-2 inline-flex rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                      {booking.service.category}
                    </span>
                  )}
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-text-muted">
                    Total Amount
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-primary-900">
                    {formatCurrency(
                      booking?.pricing?.totalAmount
                    )}
                  </p>
                </div>
              </div>

              {/* PROFESSIONAL */}

              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-700">
                    {providerInitials}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Professional
                    </p>

                    <p className="mt-1 text-sm font-bold text-primary-900">
                      {providerName}
                    </p>

                    {booking?.provider && (
                      <p className="mt-0.5 text-xs text-primary-600">
                        Verified FixMate Professional
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* =================================================
                SCHEDULE
            ================================================== */}

            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary-900">
                Service Schedule
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl bg-background p-4">
                  <CalendarDays
                    size={19}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-bold text-text-primary">
                      {formatDate(
                        booking.scheduledDate
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-background p-4">
                  <Clock3
                    size={19}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-bold text-text-primary">
                      {booking?.timeSlot?.start ||
                        "Unavailable"}
                      {booking?.timeSlot?.end
                        ? ` - ${booking.timeSlot.end}`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* =================================================
                ADDRESS
            ================================================== */}

            <Card padding="lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-primary-900">
                    Service Address
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Professional visit location
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-background p-4">
                {address.line1 && (
                  <p className="text-sm font-semibold leading-6 text-text-primary">
                    {address.line1}
                  </p>
                )}

                {address.line2 && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {address.line2}
                  </p>
                )}

                {address.cityStatePincode && (
                  <p className="mt-1 text-sm text-text-secondary">
                    {address.cityStatePincode}
                  </p>
                )}

                {address.landmark && (
                  <p className="mt-2 text-sm text-text-muted">
                    Landmark:{" "}
                    {address.landmark}
                  </p>
                )}
              </div>
            </Card>

            {/* =================================================
                REQUIREMENTS
            ================================================== */}

            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary-900">
                Additional Requirements
              </h2>

              <p className="mt-4 rounded-xl bg-background p-4 text-sm leading-6 text-text-secondary">
                {booking.customerNotes?.trim() ||
                  "No additional requirements were added."}
              </p>
            </Card>

            {/* =================================================
                CANCELLATION INFORMATION
            ================================================== */}

            {isCancelled &&
              booking?.cancellation && (
                <Card padding="lg">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <XCircle size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-primary-900">
                        Cancellation Details
                      </h2>

                      <p className="mt-1 text-sm text-text-muted">
                        This booking has been cancelled.
                      </p>
                    </div>
                  </div>

                  {booking.cancellation.reason && (
                    <div className="mt-5 rounded-xl bg-red-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                        Cancellation Reason
                      </p>

                      <p className="mt-1 text-sm font-semibold text-red-800">
                        {booking.cancellation.reason}
                      </p>
                    </div>
                  )}

                  {booking.cancellation.cancelledAt && (
                    <p className="mt-4 text-xs text-text-muted">
                      Cancelled on{" "}
                      {formatDate(
                        booking.cancellation.cancelledAt
                      )}
                    </p>
                  )}
                </Card>
              )}

            {/* =================================================
                STATUS TIMELINE
            ================================================== */}

            <Card padding="lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-primary-900">
                    Booking Status
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Track the progress of your service.
                  </p>
                </div>

                <ShieldCheck
                  size={22}
                  className="text-success"
                />
              </div>

              <div className="mt-8">
                {timeline.map(
                  (item, index) => {
                    const isLast =
                      index ===
                      timeline.length - 1;

                    return (
                      <div
                        key={`${item.title}-${index}`}
                        className="relative flex gap-4"
                      >
                        {!isLast && (
                          <span
                            className={`absolute left-[11px] top-7 h-[calc(100%-4px)] w-px ${
                              item.completed
                                ? "bg-primary-200"
                                : "bg-slate-200"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            item.completed
                              ? "border-primary-600 bg-primary-600 text-white"
                              : "border-slate-300 bg-white text-slate-300"
                          }`}
                        >
                          {item.completed ? (
                            <CheckCircle2 size={13} />
                          ) : (
                            <Circle size={10} />
                          )}
                        </div>

                        <div className="pb-7">
                          <p
                            className={`text-sm font-bold ${
                              item.completed
                                ? "text-primary-900"
                                : "text-text-muted"
                            }`}
                          >
                            {item.title}
                          </p>

                          <p className="mt-1 max-w-xl text-xs leading-5 text-text-muted">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </Card>
          </div>

          {/* =====================================================
              SIDEBAR
          ====================================================== */}

          <aside>
            <div className="sticky top-24 space-y-5">
              {/* PAYMENT */}

              <Card padding="lg">
                <h2 className="text-xl font-bold text-primary-900">
                  Payment Summary
                </h2>

                <div className="mt-6 space-y-4 border-b border-slate-100 pb-5">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Service amount
                    </span>

                    <span className="font-semibold text-text-primary">
                      {formatCurrency(
                        booking?.pricing
                          ?.servicePrice
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Platform fee
                    </span>

                    <span className="font-semibold text-text-primary">
                      {formatCurrency(
                        booking?.pricing
                          ?.platformFee
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Tax
                    </span>

                    <span className="font-semibold text-text-primary">
                      {formatCurrency(
                        booking?.pricing?.tax
                      )}
                    </span>
                  </div>

                  {Number(
                    booking?.pricing?.discount || 0
                  ) > 0 && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-text-muted">
                        Discount
                      </span>

                      <span className="font-semibold text-emerald-600">
                        -
                        {formatCurrency(
                          booking?.pricing
                            ?.discount
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="font-bold text-text-primary">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-primary-900">
                    {formatCurrency(
                      booking?.pricing?.totalAmount
                    )}
                  </span>
                </div>

                <div
                  className={`flex items-center justify-between rounded-xl px-4 py-3 ${getPaymentStyles(
                    paymentStatus
                  )}`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <CreditCard size={17} />
                    Payment
                  </span>

                  <span className="text-sm font-bold">
                    {getPaymentLabel(
                      paymentStatus
                    )}
                  </span>
                </div>

                {booking?.razorpay?.paymentId && (
                  <div className="mt-4 rounded-xl bg-background p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Payment ID
                    </p>

                    <p className="mt-1 break-all text-xs font-semibold text-text-primary">
                      {booking.razorpay.paymentId}
                    </p>
                  </div>
                )}
              </Card>

              {/* =================================================
                  QUICK ACTIONS
              ================================================== */}

              <Card padding="lg">
                <h2 className="text-lg font-bold text-primary-900">
                  Quick Actions
                </h2>

                <div className="mt-5 space-y-3">
                  {!isCancelled &&
                    booking?.provider && (
                      <Link
                        to={`/messages?professionalId=${booking.provider._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                      >
                        <MessageCircle size={17} />
                        Message Professional
                      </Link>
                    )}

                  {isCompleted && (
                    <Link
                      to={`/review/${booking._id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold !text-white transition-colors hover:bg-accent-600"
                    >
                      <Star
                        size={17}
                        fill="currentColor"
                      />
                      Rate & Review
                    </Link>
                  )}

                  {!isCompleted &&
                    !isCancelled &&
                    booking?.provider && (
                      <Link
                        to={`/professionals/${booking.provider._id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                      >
                        <UserRound size={17} />
                        View Professional
                      </Link>
                    )}

                  {canCancel && (
                    <button
                      type="button"
                      onClick={openCancelModal}
                      disabled={cancelling}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <XCircle size={17} />
                      Cancel Booking
                    </button>
                  )}
                </div>
              </Card>

              {/* =================================================
                  PROTECTION
              ================================================== */}

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-success"
                />

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    FixMate Protection
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Keep your booking, payment, and communication
                    inside FixMate for a safer service experience.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                onClick={() =>
                  window.history.back()
                }
              >
                <ArrowLeft size={17} />
                Go Back
              </Button>
            </div>
          </aside>
        </div>
      </div>

      {/* =======================================================
          CANCELLATION MODAL
      ======================================================== */}

      {showCancelModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !cancelling
            ) {
              closeCancelModal();
            }
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-red-600">
                  Cancel Booking
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-primary-900">
                  Are you sure?
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  You are about to cancel booking{" "}
                  <span className="font-semibold text-text-primary">
                    {booking.bookingNumber}
                  </span>
                  .
                </p>
              </div>

              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelling}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-slate-100 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* MODAL BODY */}

            <div className="px-6 py-6">
              <label
                htmlFor="cancellationReason"
                className="text-sm font-bold text-text-primary"
              >
                Why are you cancelling?
              </label>

              <select
                id="cancellationReason"
                value={cancellationReason}
                onChange={(event) => {
                  setCancellationReason(
                    event.target.value
                  );
                  setCancelError("");
                }}
                disabled={cancelling}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:cursor-not-allowed disabled:bg-slate-50"
              >
                <option value="">
                  Select a reason
                </option>

                {cancellationReasons.map(
                  (reason) => (
                    <option
                      key={reason}
                      value={reason}
                    >
                      {reason}
                    </option>
                  )
                )}
              </select>

              {cancelError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-5 text-red-700">
                  {cancelError}
                </div>
              )}

              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                <p className="text-xs leading-5 text-amber-800">
                  Cancellation will update this booking in FixMate.
                  Any payment or refund handling will follow the
                  booking's payment status and backend rules.
                </p>
              </div>
            </div>

            {/* MODAL FOOTER */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeCancelModal}
                disabled={cancelling}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={
                  cancelling ||
                  !cancellationReason
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle size={17} />
                    Confirm Cancellation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookingDetails;