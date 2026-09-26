import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Star,
  TrendingUp,
  Wallet,
  Wrench,
  XCircle,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";

import { createAuthApi } from "../api/api";

const formatCurrency = (value = 0) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatNumber = (value = 0) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const formatDate = (value) => {
  if (!value) {
    return "Date not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatTimeSlot = (timeSlot) => {
  if (!timeSlot) {
    return "Time not specified";
  }

  if (typeof timeSlot === "string") {
    return timeSlot;
  }

  if (timeSlot.start && timeSlot.end) {
    return `${timeSlot.start} - ${timeSlot.end}`;
  }

  return timeSlot.start || timeSlot.end || "Time not specified";
};

const getCustomerName = (customer) => {
  if (!customer) {
    return "Customer";
  }

  const fullName = [
    customer.firstName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    customer.name ||
    customer.fullName ||
    "Customer"
  );
};

const getCustomerPhone = (booking) => {
  return (
    booking?.customer?.phone ||
    booking?.customerPhone ||
    booking?.phone ||
    ""
  );
};

const normalizeIndianPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("91") && digits.length === 12) {
    return digits;
  }

  if (digits.length === 10) {
    return `91${digits}`;
  }

  return digits;
};

const getWhatsAppUrl = (booking) => {
  const phone = getCustomerPhone(booking);
  const whatsappNumber = normalizeIndianPhone(phone);

  if (!whatsappNumber) {
    return "";
  }

  const customerName = getCustomerName(booking?.customer);

  const bookingNumber =
    booking?.bookingNumber || "your FixMate booking";

  const message =
    `Hi ${customerName}, this is your FixMate service professional. ` +
    `I’m contacting you regarding booking ${bookingNumber}.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
};

const getCallUrl = (booking) => {
  const phone = getCustomerPhone(booking);

  if (!phone) {
    return "";
  }

  return `tel:${String(phone).replace(/\s+/g, "")}`;
};

const openWhatsApp = (booking) => {
  const url = getWhatsAppUrl(booking);

  if (!url) {
    return;
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

const callCustomer = (booking) => {
  const url = getCallUrl(booking);

  if (!url) {
    return;
  }

  window.location.href = url;
};

const getStatusStyle = (status) => {
  const normalized = String(status || "")
    .toLowerCase()
    .replace(/-/g, "_");

  if (
    normalized === "completed"
  ) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (
    normalized === "cancelled" ||
    normalized === "rejected"
  ) {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (
    normalized === "pending"
  ) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (
    normalized === "in_progress"
  ) {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
};

const formatStatus = (status) => {
  if (!status) {
    return "Pending";
  }

  return String(status)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
};

const Dashboard = () => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async ({
    showLoader = false,
  } = {}) => {
    try {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const authApi = createAuthApi(getToken);

      const response = await authApi.get(
        "/api/bookings/provider/dashboard"
      );

      const data =
        response.data?.data ||
        response.data ||
        null;

      setDashboard(data);
    } catch (requestError) {
      console.error(
        "Provider dashboard fetch failed:",
        requestError?.response?.data ||
          requestError?.message ||
          requestError
      );

      setError(
        requestError?.response?.data?.message ||
          "Unable to load your dashboard."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard({
      showLoader: true,
    });
  }, [getToken]);

  const provider =
    dashboard?.provider || {};

  const stats =
    dashboard?.stats || {};

  const earnings =
    dashboard?.earnings || {};

  const upcomingJobs =
    dashboard?.upcomingJobs || [];

  const recentBookings =
    dashboard?.recentBookings || [];

  const monthlyEarnings =
    dashboard?.monthlyEarnings || [];

  const displayName =
    provider?.businessName ||
    user?.fullName ||
    [user?.firstName, user?.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Service Professional";

  const rating =
    provider?.rating ??
    provider?.averageRating ??
    null;

  const reviewCount =
    provider?.reviewCount ??
    provider?.reviewsCount ??
    0;

  const isVerified =
    provider?.verificationStatus === "verified" ||
    provider?.verificationStatus === "approved";

  const todayJobs = Number(
    stats?.todayJobs || 0
  );

  const activeJobs = Number(
    stats?.activeJobs || 0
  );

  const completedJobs = Number(
    stats?.completedJobs || 0
  );

  const pendingRequests = Number(
    stats?.pendingRequests || 0
  );

  const totalBookings = Number(
    stats?.totalBookings || 0
  );

  const totalEarnings = Number(
    earnings?.totalEarnings || 0
  );

  const pendingEarnings = Number(
    earnings?.pendingEarnings || 0
  );

  const paidEarnings = Number(
    earnings?.paidEarnings || 0
  );

  const providerLocation = [
    provider?.address?.city,
    provider?.address?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const chartData = useMemo(() => {
    if (!Array.isArray(monthlyEarnings)) {
      return [];
    }

    return monthlyEarnings;
  }, [monthlyEarnings]);

  const maxChartValue = useMemo(() => {
    if (!chartData.length) {
      return 1;
    }

    return Math.max(
      ...chartData.map((item) =>
        Number(item?.amount || 0)
      ),
      1
    );
  }, [chartData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="rounded-3xl border border-slate-200 bg-white px-10 py-9 text-center shadow-sm">
            <Loader2
              size={34}
              className="mx-auto animate-spin text-[#0B1F3A]"
            />

            <h1 className="mt-5 text-xl font-bold text-[#0B1F3A]">
              Loading dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Fetching your latest bookings and earnings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#0B1F3A]">
                  Provider Dashboard
                </p>

                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    <ShieldCheck size={13} />
                    Verified
                  </span>
                )}
              </div>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1F3A] sm:text-3xl">
                Welcome back, {displayName}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Wrench size={15} />
                  {provider?.category ||
                    "Home Service Professional"}
                </span>

                {providerLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} />
                    {providerLocation}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  fetchDashboard({
                    showLoader: false,
                  })
                }
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-[#12345D]"
              >
                My Profile
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <XCircle
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-bold text-red-800">
                  Dashboard could not be loaded
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                fetchDashboard({
                  showLoader: false,
                })
              }
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-red-700 ring-1 ring-red-200 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Welcome / Status Card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-[#0B1F3A] shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white">
                <ShieldCheck size={14} />
                {isVerified
                  ? "Verified professional"
                  : "Verification in progress"}
              </div>

              <h2 className="mt-4 max-w-2xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Manage your bookings, customers and earnings from one place.
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Stay on top of upcoming jobs and contact customers
                directly from each booking.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 lg:min-w-[250px]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-300">
                Total earnings
              </p>

              <p className="mt-2 text-3xl font-extrabold text-white">
                {formatCurrency(totalEarnings)}
              </p>

              <p className="mt-1 text-xs text-slate-300">
                Completed & paid services
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays size={21} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Today
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              {formatNumber(todayJobs)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Today&apos;s bookings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={21} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Requests
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              {formatNumber(pendingRequests)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Pending requests
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <BriefcaseBusiness size={21} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Active
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              {formatNumber(activeJobs)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Active jobs
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Completed
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              {formatNumber(completedJobs)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Completed services
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                <Wallet size={21} />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Paid
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              {formatCurrency(paidEarnings)}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Paid earnings
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Star
                  size={21}
                  fill="currentColor"
                />
              </div>

              <span className="text-xs font-semibold text-slate-400">
                Reviews
              </span>
            </div>

            <p className="mt-5 text-2xl font-extrabold text-[#0B1F3A]">
              {rating !== null
                ? Number(rating).toFixed(1)
                : "—"}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {formatNumber(reviewCount)} reviews
            </p>
          </div>
        </section>

        {/* Main Grid */}
        <div className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
          {/* Upcoming bookings */}
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  Upcoming bookings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Contact customers directly from their booking.
                </p>
              </div>

              <Link
                to="/bookings"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B1F3A] hover:text-blue-600"
              >
                View all
                <ChevronRight size={17} />
              </Link>
            </div>

            {upcomingJobs.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarDays size={25} />
                </div>

                <h3 className="mt-4 text-lg font-bold text-[#0B1F3A]">
                  No upcoming bookings
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  New customer bookings will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingJobs.map(
                  (booking) => {
                    const customerName =
                      getCustomerName(
                        booking?.customer
                      );

                    const customerPhone =
                      getCustomerPhone(booking);

                    const whatsappUrl =
                      getWhatsAppUrl(
                        booking
                      );

                    const callUrl =
                      getCallUrl(booking);

                    return (
                      <div
                        key={
                          booking?._id ||
                          booking?.bookingNumber
                        }
                        className="p-6"
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base font-bold text-[#0B1F3A]">
                                {booking?.service
                                  ?.name ||
                                  booking
                                    ?.serviceName ||
                                  "Home Service"}
                              </h3>

                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusStyle(
                                  booking?.status
                                )}`}
                              >
                                {formatStatus(
                                  booking?.status
                                )}
                              </span>
                            </div>

                            <div className="mt-3 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                              <div className="flex items-center gap-2">
                                <CalendarDays
                                  size={16}
                                  className="shrink-0 text-slate-400"
                                />

                                <span>
                                  {formatDate(
                                    booking?.scheduledDate
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Clock3
                                  size={16}
                                  className="shrink-0 text-slate-400"
                                />

                                <span>
                                  {formatTimeSlot(
                                    booking?.timeSlot
                                  )}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <MapPin
                                  size={16}
                                  className="shrink-0 text-slate-400"
                                />

                                <span className="truncate">
                                  {booking
                                    ?.serviceAddress
                                    ?.city ||
                                    booking
                                      ?.customer
                                      ?.address
                                      ?.city ||
                                    "Address available in booking"}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <Wallet
                                  size={16}
                                  className="shrink-0 text-slate-400"
                                />

                                <span className="font-semibold text-slate-700">
                                  {formatCurrency(
                                    booking
                                      ?.pricing
                                      ?.servicePrice ??
                                      booking
                                        ?.pricing
                                        ?.totalAmount ??
                                      0
                                  )}
                                </span>
                              </div>
                            </div>

                            {/* Customer */}
                            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Customer
                                  </p>

                                  <p className="mt-1 text-sm font-bold text-[#0B1F3A]">
                                    {customerName}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    Booking:{" "}
                                    {booking?.bookingNumber ||
                                      "—"}
                                  </p>

                                  {customerPhone && (
                                    <p className="mt-1 text-xs font-medium text-slate-600">
                                      {customerPhone}
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      openWhatsApp(
                                        booking
                                      )
                                    }
                                    disabled={
                                      !whatsappUrl
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#20BD5A] disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    <MessageCircle
                                      size={17}
                                    />
                                    WhatsApp
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      callCustomer(
                                        booking
                                      )
                                    }
                                    disabled={
                                      !callUrl
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B1F3A] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12345D] disabled:cursor-not-allowed disabled:opacity-40"
                                  >
                                    <Phone
                                      size={17}
                                    />
                                    Call
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex shrink-0 flex-col gap-2 lg:w-36">
                            <Link
                              to={`/bookings/${booking?._id}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              View booking
                              <ArrowRight
                                size={15}
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </section>

          {/* Earnings */}
          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0B1F3A]">
                    Earnings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your provider-side earnings summary.
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <TrendingUp size={21} />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-400">
                    Total
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-[#0B1F3A]">
                    {formatCurrency(
                      totalEarnings
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-amber-50 p-4">
                  <p className="text-xs font-semibold text-amber-600">
                    Pending
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-amber-800">
                    {formatCurrency(
                      pendingEarnings
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-500">
                    Completed jobs
                  </span>

                  <span className="font-bold text-[#0B1F3A]">
                    {formatNumber(
                      completedJobs
                    )}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        totalBookings > 0
                          ? (completedJobs /
                              totalBookings) *
                              100
                          : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Monthly earnings */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0B1F3A]">
                    Monthly earnings
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Last available earnings period.
                  </p>
                </div>

                <Wallet
                  size={21}
                  className="text-[#0B1F3A]"
                />
              </div>

              {chartData.length === 0 ? (
                <div className="mt-7 rounded-2xl bg-slate-50 px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-500">
                    No monthly earnings data yet.
                  </p>
                </div>
              ) : (
                <div className="mt-7">
                  <div className="flex h-48 items-end gap-3">
                    {chartData.map(
                      (item, index) => {
                        const amount = Number(
                          item?.amount || 0
                        );

                        const height =
                          amount > 0
                            ? Math.max(
                                8,
                                (amount /
                                  maxChartValue) *
                                  100
                              )
                            : 4;

                        const label =
                          item?.label ||
                          item?.month ||
                          `M${index + 1}`;

                        return (
                          <div
                            key={`${label}-${index}`}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                          >
                            <div className="text-[10px] font-bold text-slate-500">
                              {formatCurrency(
                                amount
                              )}
                            </div>

                            <div className="flex h-full w-full items-end">
                              <div
                                className="w-full rounded-t-xl bg-[#0B1F3A] transition-all"
                                style={{
                                  height: `${height}%`,
                                }}
                              />
                            </div>

                            <span className="text-[10px] font-semibold text-slate-400">
                              {label}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Recent bookings */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                Recent bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer activity on your account.
              </p>
            </div>

            <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
              {formatNumber(totalBookings)} total bookings
            </span>
          </div>

          {recentBookings.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-500">
                No recent bookings available.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Booking
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Date
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                      Contact
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {recentBookings.map(
                    (booking) => {
                      const phone =
                        getCustomerPhone(
                          booking
                        );

                      return (
                        <tr
                          key={
                            booking?._id ||
                            booking?.bookingNumber
                          }
                          className="transition hover:bg-slate-50/70"
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            <p className="text-sm font-bold text-[#0B1F3A]">
                              {booking?.bookingNumber ||
                                "Booking"}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {booking?.service
                                ?.name ||
                                booking?.serviceName ||
                                "Home Service"}
                            </p>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <p className="text-sm font-semibold text-slate-700">
                              {getCustomerName(
                                booking?.customer
                              )}
                            </p>

                            {phone && (
                              <p className="mt-1 text-xs text-slate-400">
                                {phone}
                              </p>
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                            {formatDate(
                              booking?.scheduledDate
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getStatusStyle(
                                booking?.status
                              )}`}
                            >
                              {formatStatus(
                                booking?.status
                              )}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-[#0B1F3A]">
                            {formatCurrency(
                              booking?.pricing
                                ?.servicePrice ??
                                booking?.pricing
                                  ?.totalAmount ??
                                0
                            )}
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openWhatsApp(
                                    booking
                                  )
                                }
                                disabled={!phone}
                                title="WhatsApp customer"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366] text-white transition hover:bg-[#20BD5A] disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <MessageCircle
                                  size={16}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  callCustomer(
                                    booking
                                  )
                                }
                                disabled={!phone}
                                title="Call customer"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B1F3A] text-white transition hover:bg-[#12345D] disabled:cursor-not-allowed disabled:opacity-30"
                              >
                                <Phone
                                  size={16}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            to="/bookings"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <CalendarDays size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0B1F3A]"
              />
            </div>

            <h3 className="mt-5 font-bold text-[#0B1F3A]">
              Manage bookings
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Review customer bookings and manage your upcoming work.
            </p>
          </Link>

          <Link
            to="/services"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Wrench size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0B1F3A]"
              />
            </div>

            <h3 className="mt-5 font-bold text-[#0B1F3A]">
              Manage services
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Manage the services and pricing customers can book.
            </p>
          </Link>

          <Link
            to="/profile"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness size={21} />
              </div>

              <ArrowRight
                size={18}
                className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0B1F3A]"
              />
            </div>

            <h3 className="mt-5 font-bold text-[#0B1F3A]">
              Update profile
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Keep your business, contact and service information updated.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;