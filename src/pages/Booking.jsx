import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  UserRound,
  Wrench,
  LoaderCircle,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import api from "../api/api";

const formatDateLabel = (date) => {
  const today = new Date();

  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const tomorrowOnly = new Date(todayOnly);
  tomorrowOnly.setDate(
    tomorrowOnly.getDate() + 1
  );

  let label = date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
    }
  );

  if (
    dateOnly.getTime() ===
    todayOnly.getTime()
  ) {
    label = "Today";
  } else if (
    dateOnly.getTime() ===
    tomorrowOnly.getTime()
  ) {
    label = "Tomorrow";
  }

  return {
    value: `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`,
    day: String(date.getDate()),
    month: date.toLocaleDateString(
      "en-IN",
      {
        month: "short",
      }
    ),
    label,
  };
};

const getUpcomingDates = () => {
  const dates = [];

  for (let index = 0; index < 4; index++) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(
      date.getDate() + index
    );

    dates.push(formatDateLabel(date));
  }

  return dates;
};

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
];

const getServiceIcon = (service) => {
  const text = `${service?.name || ""} ${
    service?.category || ""
  }`.toLowerCase();

  if (
    text.includes("electrical") ||
    text.includes("electric")
  ) {
    return "⚡";
  }

  if (
    text.includes("plumb") ||
    text.includes("pipe")
  ) {
    return "💧";
  }

  if (
    text.includes("carpent") ||
    text.includes("furniture")
  ) {
    return "🔨";
  }

  if (text.includes("paint")) {
    return "🎨";
  }

  if (
    text.includes("ac ") ||
    text.startsWith("ac") ||
    text.includes("air-conditioner")
  ) {
    return "❄️";
  }

  if (text.includes("clean")) {
    return "✨";
  }

  if (text.includes("pest")) {
    return "🐜";
  }

  return "🔧";
};

const formatDuration = (minutes = 60) => {
  const totalMinutes =
    Number(minutes) || 60;

  if (totalMinutes < 60) {
    return `${totalMinutes} mins`;
  }

  const hours = totalMinutes / 60;

  if (Number.isInteger(hours)) {
    return `${hours} hour${
      hours > 1 ? "s" : ""
    }`;
  }

  return `${hours.toFixed(1)} hours`;
};

const Booking = () => {
  const { serviceId } = useParams();

  const dates = useMemo(
    () => getUpcomingDates(),
    []
  );

  const [service, setService] =
    useState(null);

  const [providers, setProviders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState(dates[0]?.value || "");

  const [selectedTime, setSelectedTime] =
    useState(timeSlots[1]);

  const [address, setAddress] =
    useState({
      house: "",
      street: "",
      city: "",
      pincode: "",
      details: "",
    });

  const [requirements, setRequirements] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [showReview, setShowReview] =
    useState(false);

  // =========================
  // FETCH SERVICE
  // =========================
  useEffect(() => {
    const fetchService = async () => {
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

        setService(
          response.data.service || null
        );

        setProviders(
          response.data.providers || []
        );
      } catch (error) {
        console.error(
          "Booking service fetch failed:",
          error
        );

        setService(null);
        setProviders([]);

        setError(
          error?.response?.data?.message ||
            error.message ||
            "Unable to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchService();
    }
  }, [serviceId]);

  const selectedDateDetails =
    dates.find(
      (date) =>
        date.value === selectedDate
    );

  const estimatedTotal = useMemo(() => {
    return Number(
      service?.basePrice || 0
    );
  }, [service]);

  const provider = providers[0] || null;

  const providerName = provider
    ? `${
        provider.user?.firstName || ""
      } ${
        provider.user?.lastName || ""
      }`.trim() ||
      provider.businessName ||
      "Verified Professional"
    : "Professional assigned after booking";

  const serviceIcon =
    getServiceIcon(service);

  // =========================
  // ADDRESS CHANGE
  // =========================
  const handleAddressChange = (
    event
  ) => {
    const { name, value } =
      event.target;

    setAddress((current) => ({
      ...current,
      [name]:
        name === "pincode"
          ? value
              .replace(/\D/g, "")
              .slice(0, 6)
          : value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  // =========================
  // CONTINUE
  // =========================
  const handleContinue = () => {
    const newErrors = {};

    if (!address.house.trim()) {
      newErrors.house =
        "House / flat details are required.";
    }

    if (!address.street.trim()) {
      newErrors.street =
        "Street / area is required.";
    }

    if (!address.city.trim()) {
      newErrors.city =
        "City is required.";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required.";
    } else if (
      !/^\d{6}$/.test(
        address.pincode.trim()
      )
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }

    setShowReview(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // BACK TO EDIT
  // =========================
  const handleBackToEdit = () => {
    setShowReview(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
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
              Fetching the latest service details.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // =========================
  // SERVICE NOT FOUND
  // =========================
  if (!service || error) {
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
                "We could not find the service you are trying to book."}
            </p>

            <div className="mt-7">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
              >
                <ArrowLeft
                  size={17}
                  className="text-white"
                />

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

  // =========================================================
  // REVIEW & CONFIRM
  // =========================================================
  if (showReview) {
    return (
      <section className="min-h-screen bg-background">
        <div className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={
                handleBackToEdit
              }
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
            >
              <ArrowLeft size={17} />
              Edit Booking
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-success">
              <CheckCircle2 size={28} />
            </div>

            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Review
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              Review your booking
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              Please check your service,
              professional, schedule, and
              address before continuing to
              payment.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              {/* Service */}
              <Card padding="lg">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-2xl">
                    {serviceIcon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-primary-900">
                        {service.name}
                      </h2>

                      <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                        {service.category}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <UserRound size={15} />
                        {providerName}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock3 size={15} />
                        {formatDuration(
                          service.estimatedDurationMinutes
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Schedule */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-primary-900">
                  Schedule
                </h2>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-xl bg-background p-4">
                    <CalendarDays
                      size={19}
                      className="mt-0.5 shrink-0 text-primary-600"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Service Date
                      </p>

                      <p className="mt-1 text-sm font-bold text-text-primary">
                        {selectedDateDetails?.label},{" "}
                        {
                          selectedDateDetails?.day
                        }{" "}
                        {
                          selectedDateDetails?.month
                        }
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
                        Time Slot
                      </p>

                      <p className="mt-1 text-sm font-bold text-text-primary">
                        {selectedTime}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Address */}
              <Card padding="lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <MapPin size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-primary-900">
                      Service address
                    </h2>

                    <p className="mt-0.5 text-sm text-text-muted">
                      Professional visit location
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-background p-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {address.house}
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    {address.street},{" "}
                    {address.city} -{" "}
                    {address.pincode}
                  </p>

                  {address.details.trim() && (
                    <p className="mt-2 text-sm text-text-muted">
                      {address.details}
                    </p>
                  )}
                </div>
              </Card>

              {/* Requirements */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-primary-900">
                  Additional requirements
                </h2>

                {requirements.trim() ? (
                  <div className="mt-4 rounded-xl bg-background p-4">
                    <p className="whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                      {requirements}
                    </p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-text-muted">
                    No additional requirements added.
                  </p>
                )}
              </Card>
            </div>

            {/* Payment Summary */}
            <aside>
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary-900">
                  Payment summary
                </h2>

                <div className="mt-6 space-y-4 border-b border-slate-100 pb-5">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Service price
                    </span>

                    <span className="font-semibold text-text-primary">
                      ₹
                      {estimatedTotal.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Additional charges
                    </span>

                    <span className="font-semibold text-text-primary">
                      ₹0
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="font-bold text-text-primary">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-primary-900">
                    ₹
                    {estimatedTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={() =>
                    alert(
                      "Razorpay payment integration will be connected in the payment step."
                    )
                  }
                >
                  Continue to Payment
                  <ArrowRight size={18} />
                </Button>

                <button
                  type="button"
                  onClick={
                    handleBackToEdit
                  }
                  className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                >
                  Edit Booking
                </button>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-green-50 p-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <p className="text-xs leading-5 text-green-800">
                    Your booking details are
                    ready for secure payment
                    processing.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  // =========================================================
  // BOOKING FORM
  // =========================================================
  return (
    <section className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to={`/services/${service._id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Service
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Page Heading */}
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Booking
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            Book your service
          </h1>

          <p className="mt-4 text-base leading-7 text-text-secondary">
            Select your address,
            preferred date, and available
            time slot to continue.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Service */}
            <Card padding="lg">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-4xl">
                  {serviceIcon}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-text-primary">
                      {service.name}
                    </h2>

                    <span className="rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                      {service.category}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <UserRound size={15} />
                      {providerName}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      {formatDuration(
                        service.estimatedDurationMinutes
                      )}
                    </span>

                    {service.rating?.average > 0 && (
                      <span className="text-accent-600">
                        ★{" "}
                        {Number(
                          service.rating.average
                        ).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Address */}
            <Card padding="lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-text-primary">
                    Service address
                  </h2>

                  <p className="mt-0.5 text-sm text-text-muted">
                    Where should the professional visit?
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Input
                  label="House / Flat / Building"
                  name="house"
                  placeholder="e.g. Flat 201, ABC Apartments"
                  value={address.house}
                  onChange={
                    handleAddressChange
                  }
                  error={errors.house}
                  required
                />

                <Input
                  label="Street / Area"
                  name="street"
                  placeholder="e.g. Arera Colony"
                  value={address.street}
                  onChange={
                    handleAddressChange
                  }
                  error={errors.street}
                  required
                />

                <Input
                  label="City"
                  name="city"
                  placeholder="e.g. Bhopal"
                  value={address.city}
                  onChange={
                    handleAddressChange
                  }
                  error={errors.city}
                  required
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  placeholder="e.g. 462016"
                  value={address.pincode}
                  onChange={
                    handleAddressChange
                  }
                  error={errors.pincode}
                  inputMode="numeric"
                  maxLength={6}
                  required
                />
              </div>

              <div className="mt-5">
                <Input
                  label="Additional address details"
                  name="details"
                  placeholder="Landmark, floor, nearby location..."
                  value={address.details}
                  onChange={
                    handleAddressChange
                  }
                />
              </div>
            </Card>

            {/* Date */}
            <Card padding="lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-text-primary">
                    Select date
                  </h2>

                  <p className="mt-0.5 text-sm text-text-muted">
                    Choose a convenient service
                    date.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {dates.map((date) => {
                  const selected =
                    selectedDate ===
                    date.value;

                  return (
                    <button
                      key={date.value}
                      type="button"
                      onClick={() =>
                        setSelectedDate(
                          date.value
                        )
                      }
                      className={`rounded-2xl border px-4 py-4 text-center transition-all ${
                        selected
                          ? "border-primary-600 bg-primary-50 text-primary-900 shadow-sm"
                          : "border-slate-200 bg-white text-text-primary hover:border-primary-300 hover:bg-primary-50"
                      }`}
                    >
                      <span className="block text-xs font-semibold text-text-muted">
                        {date.label}
                      </span>

                      <span className="mt-1 block text-2xl font-extrabold">
                        {date.day}
                      </span>

                      <span className="text-xs text-text-muted">
                        {date.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Time */}
            <Card padding="lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
                  <Clock3 size={19} />
                </div>

                <div>
                  <h2 className="font-bold text-text-primary">
                    Select time slot
                  </h2>

                  <p className="mt-0.5 text-sm text-text-muted">
                    Choose a convenient time.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {timeSlots.map(
                  (slot) => {
                    const selected =
                      selectedTime ===
                      slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() =>
                          setSelectedTime(
                            slot
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                          selected
                            ? "border-primary-600 bg-primary-50 text-primary-700 shadow-sm"
                            : "border-slate-200 bg-white text-text-secondary hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  }
                )}
              </div>

              <p className="mt-4 text-xs text-text-muted">
                Real provider availability will
                be connected to this schedule in
                the booking availability stage.
              </p>
            </Card>

            {/* Requirements */}
            <Card padding="lg">
              <div className="flex items-center gap-2">
                <Wrench
                  size={18}
                  className="text-primary-600"
                />

                <h2 className="font-bold text-text-primary">
                  Additional requirements
                </h2>
              </div>

              <p className="mt-1 text-sm text-text-muted">
                Tell the professional anything they
                should know before arriving.
              </p>

              <textarea
                rows={5}
                maxLength={500}
                value={requirements}
                onChange={(event) =>
                  setRequirements(
                    event.target.value
                  )
                }
                placeholder="Describe the issue, special instructions, parking information, etc."
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-text-primary outline-none transition-all placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />

              <p className="mt-2 text-xs text-text-muted">
                {requirements.length}/500
                characters
              </p>
            </Card>
          </div>

          {/* RIGHT */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-text-primary">
                Booking summary
              </h2>

              <div className="mt-6 rounded-xl bg-background p-4">
                <p className="text-sm font-semibold text-text-primary">
                  {service.name}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  with {providerName}
                </p>
              </div>

              <div className="mt-5 space-y-4 border-b border-slate-100 pb-5">
                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text-muted">
                    Date
                  </span>

                  <span className="font-semibold text-text-primary">
                    {selectedDateDetails?.day}{" "}
                    {selectedDateDetails?.month}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text-muted">
                    Time
                  </span>

                  <span className="font-semibold text-text-primary">
                    {selectedTime}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text-muted">
                    Service price
                  </span>

                  <span className="font-semibold text-text-primary">
                    ₹
                    {estimatedTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text-muted">
                    Additional charges
                  </span>

                  <span className="font-semibold text-text-primary">
                    ₹0
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="font-bold text-text-primary">
                  Estimated total
                </span>

                <span className="text-2xl font-extrabold text-primary-900">
                  ₹
                  {estimatedTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={
                  handleContinue
                }
              >
                Review & Confirm
                <ArrowRight size={18} />
              </Button>

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-green-50 p-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-success"
                />

                <p className="text-xs leading-5 text-green-800">
                  Your booking information will be
                  securely processed.
                </p>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-text-muted">
                Final pricing will be validated by
                the FixMate backend before payment
                confirmation.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Booking;