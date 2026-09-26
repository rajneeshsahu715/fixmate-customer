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

import api, { createAuthApi } from "../api/api";
import { useAuth } from "@clerk/react";

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
  {
    label: "09:00 AM",
    start: "09:00 AM",
    end: "10:00 AM",
  },
  {
    label: "10:00 AM",
    start: "10:00 AM",
    end: "11:00 AM",
  },
  {
    label: "11:00 AM",
    start: "11:00 AM",
    end: "12:00 PM",
  },
  {
    label: "12:00 PM",
    start: "12:00 PM",
    end: "01:00 PM",
  },
  {
    label: "02:00 PM",
    start: "02:00 PM",
    end: "03:00 PM",
  },
  {
    label: "03:00 PM",
    start: "03:00 PM",
    end: "04:00 PM",
  },
  {
    label: "04:00 PM",
    start: "04:00 PM",
    end: "05:00 PM",
  },
];

const getServiceIcon = (service) => {
  const text = `${service?.name || ""} ${
    service?.category || ""
  }`.toLowerCase();

  if (
    text.includes("electrical") ||
    text.includes("electric")
  ) {
    return "\u26A1";
  }

  if (
    text.includes("plumb") ||
    text.includes("pipe")
  ) {
    return "\u{1F4A7}";
  }

  if (
    text.includes("carpent") ||
    text.includes("furniture")
  ) {
    return "\u{1F528}";
  }

  if (text.includes("paint")) {
    return "\u{1F3A8}";
  }

  if (
    text.includes("ac ") ||
    text.startsWith("ac") ||
    text.includes("air-conditioner")
  ) {
    return "\u2744\uFE0F";
  }

  if (text.includes("clean")) {
    return "\u2728";
  }

  if (text.includes("pest")) {
    return "\u{1F41B}";
  }

  return "\u{1F527}";
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

const getProviderName = (provider) => {
  const firstName =
    provider?.user?.firstName || "";

  const lastName =
    provider?.user?.lastName || "";

  return (
    `${firstName} ${lastName}`.trim() ||
    provider?.businessName ||
    "Verified Professional"
  );
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(true),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script = document.createElement(
      "script"
    );

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

const Booking = () => {
  const { serviceId } = useParams();

  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const dates = useMemo(
    () => getUpcomingDates(),
    []
  );

  const [service, setService] =
    useState(null);

  const [providers, setProviders] =
    useState([]);

  const [selectedProviderId, setSelectedProviderId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingAddress, setLoadingAddress] =
    useState(false);

  const [addressLoaded, setAddressLoaded] =
    useState(false);

  const [addressError, setAddressError] =
    useState("");

  const [creatingBooking, setCreatingBooking] =
    useState(false);

  const [bookingSuccess, setBookingSuccess] =
    useState(null);

  const [paymentStatus, setPaymentStatus] =
    useState("pending");

  const [paymentError, setPaymentError] =
    useState("");

  const [paying, setPaying] =
    useState(false);

  const [error, setError] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState(dates[0]?.value || "");

  const [selectedTime, setSelectedTime] =
    useState(timeSlots[1].label);

  const [address, setAddress] =
    useState({
      house: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      details: "",
    });

  const [requirements, setRequirements] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [showReview, setShowReview] =
    useState(false);

  // ======================================================
  // FETCH SERVICE
  // ======================================================

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/api/services/${serviceId}`
        );

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Service not found"
          );
        }

        const loadedService =
          response.data?.service || null;

        const loadedProviders =
          response.data?.providers || [];

        setService(loadedService);

        setProviders(loadedProviders);

        if (loadedProviders.length > 0) {
          setSelectedProviderId(
            loadedProviders[0]._id
          );
        }
      } catch (error) {
        console.error(
          "Booking service fetch failed:",
          error
        );

        setService(null);
        setProviders([]);

        setError(
          error?.response?.data?.message ||
            error?.message ||
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

  // ======================================================
  // LOAD SAVED ADDRESS FROM MONGODB
  // ======================================================

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return;
    }

    const fetchSavedAddress = async () => {
      try {
        setLoadingAddress(true);
        setAddressError("");

        const authApi =
          createAuthApi(getToken);

        const response =
          await authApi.get("/api/users/me");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Unable to load saved address."
          );
        }

        const mongoUser =
          response.data?.user || {};

        const savedAddress =
          mongoUser.address || {};

        const hasSavedAddress =
          Boolean(
            savedAddress.house ||
              savedAddress.street ||
              savedAddress.city ||
              savedAddress.state ||
              savedAddress.pincode
          );

        if (hasSavedAddress) {
          setAddress((current) => ({
            ...current,

            house:
              savedAddress.house ||
              current.house,

            street:
              savedAddress.street ||
              current.street,

            city:
              savedAddress.city ||
              current.city,

            state:
              savedAddress.state ||
              current.state,

            pincode:
              savedAddress.pincode ||
              current.pincode,
          }));

          setAddressLoaded(true);
        } else {
          setAddressLoaded(false);
        }
      } catch (error) {
        console.error(
          "Saved address fetch failed:",
          error
        );

        setAddressError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load your saved address."
        );
      } finally {
        setLoadingAddress(false);
      }
    };

    fetchSavedAddress();
  }, [
    isLoaded,
    isSignedIn,
    getToken,
  ]);

  // ======================================================
  // DERIVED VALUES
  // ======================================================

  const selectedDateDetails =
    dates.find(
      (date) =>
        date.value === selectedDate
    );

  const selectedTimeDetails =
    timeSlots.find(
      (slot) =>
        slot.label === selectedTime
    ) || timeSlots[0];

  const provider =
    providers.find(
      (item) =>
        item._id === selectedProviderId
    ) ||
    providers[0] ||
    null;

  const providerName =
    getProviderName(provider);

  const estimatedServicePrice =
    useMemo(
      () => {
        if (provider?.basePrice) {
          return Number(
            provider.basePrice
          );
        }

        return Number(
          service?.basePrice || 0
        );
      },
      [provider, service]
    );

  const estimatedPlatformFee =
    Math.round(
      estimatedServicePrice * 0.05
    );

  const estimatedTax =
    Math.round(
      (estimatedServicePrice +
        estimatedPlatformFee) *
        0.18
    );

  const estimatedTotal =
    estimatedServicePrice +
    estimatedPlatformFee +
    estimatedTax;

  const serviceIcon =
    getServiceIcon(service);

  // ======================================================
  // ADDRESS CHANGE
  // ======================================================

  const handleAddressChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

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

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateBooking = () => {
    const newErrors = {};

    if (!isLoaded || !isSignedIn) {
      newErrors.auth =
        "Please sign in before booking.";
    }

    if (!service?._id) {
      newErrors.service =
        "Service information is missing.";
    }

    if (
      providers.length > 0 &&
      !selectedProviderId
    ) {
      newErrors.provider =
        "Please select a professional.";
    }

    if (!selectedDate) {
      newErrors.date =
        "Please select a service date.";
    }

    if (!selectedTime) {
      newErrors.time =
        "Please select a time slot.";
    }

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

    if (!address.state.trim()) {
      newErrors.state =
        "State is required.";
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

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ======================================================
  // CONTINUE TO REVIEW
  // ======================================================

  const handleContinue = () => {
    if (!validateBooking()) {
      return;
    }

    setError("");
    setShowReview(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // BACK TO EDIT
  // ======================================================

  const handleBackToEdit = () => {
    setShowReview(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // CREATE BOOKING
  // ======================================================

  const handleCreateBooking = async () => {
    if (!validateBooking()) {
      setShowReview(false);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!isLoaded || !isSignedIn) {
      setError(
        "Your session has expired. Please sign in again."
      );

      return;
    }

    try {
      setCreatingBooking(true);
      setError("");

      const authApi =
        createAuthApi(getToken);

      const response =
        await authApi.post(
          "/api/bookings",
          {
            serviceId: service._id,

            providerId:
              selectedProviderId || null,

            scheduledDate: selectedDate,

            timeSlot: {
              start:
                selectedTimeDetails.start,
              end:
                selectedTimeDetails.end,
            },

            serviceAddress: {
              label: "Home",

              line1: `${address.house.trim()}, ${address.street.trim()}`,

              line2:
                address.details.trim(),

              city:
                address.city.trim(),

              state:
                address.state.trim(),

              pincode:
                address.pincode.trim(),

              landmark:
                address.details.trim(),
            },

            customerNotes:
              requirements.trim(),
          }
        );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
            "Unable to create booking."
        );
      }

      setBookingSuccess(
        response.data?.booking || null
      );
    } catch (error) {
      console.error(
        "Create booking failed:",
        error?.response?.data ||
          error?.message ||
          error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to create your booking."
      );
    } finally {
      setCreatingBooking(false);
    }
  };

  // ======================================================
  // RAZORPAY PAYMENT
  // ======================================================

  const handlePayment = async () => {
    if (!bookingSuccess?._id) {
      setPaymentError(
        "Booking information is missing. Please try again."
      );

      return;
    }

    if (!isLoaded || !isSignedIn) {
      setPaymentError(
        "Your session has expired. Please sign in again."
      );

      return;
    }

    try {
      setPaying(true);
      setPaymentError("");

      const authApi =
        createAuthApi(getToken);

      const orderResponse =
        await authApi.post(
          "/api/payments/create-order",
          {
            bookingId:
              bookingSuccess._id,
          }
        );

      if (
        !orderResponse.data?.success ||
        !orderResponse.data?.order?.id
      ) {
        throw new Error(
          orderResponse.data?.message ||
            "Unable to create Razorpay order."
        );
      }

      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again."
        );
      }

      const order =
        orderResponse.data.order;

      const options = {
        key:
          orderResponse.data?.keyId,

        amount:
          order.amount,

        currency:
          order.currency || "INR",

        name: "FixMate",

        description:
          `${service.name} \u2022 Booking ${order.bookingNumber}`,

        order_id:
          order.id,

        notes: {
          bookingNumber:
            order.bookingNumber,
        },

        theme: {
          color: "#173f5f",
        },

        handler: async (
          razorpayResponse
        ) => {
          try {
            setPaymentError("");

            const verifyResponse =
              await authApi.post(
                "/api/payments/verify",
                {
                  bookingId:
                    bookingSuccess._id,

                  razorpay_order_id:
                    razorpayResponse.razorpay_order_id,

                  razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,

                  razorpay_signature:
                    razorpayResponse.razorpay_signature,
                }
              );

            if (
              !verifyResponse.data?.success
            ) {
              throw new Error(
                verifyResponse.data?.message ||
                  "Payment verification failed."
              );
            }

            setPaymentStatus("paid");

            setBookingSuccess(
              (current) => ({
                ...current,
                paymentStatus: "paid",
              })
            );
          } catch (error) {
            console.error(
              "Payment verification failed:",
              error?.response?.data ||
                error?.message ||
                error
            );

            setPaymentStatus("failed");

            setPaymentError(
              error?.response?.data?.message ||
                error?.message ||
                "Payment verification failed. Please contact FixMate support if money was deducted."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      };

      const checkout =
        new window.Razorpay(
          options
        );

      checkout.on(
        "payment.failed",
        (response) => {
          console.error(
            "Razorpay payment failed:",
            response
          );

          setPaymentStatus("failed");

          setPaymentError(
            response?.error?.description ||
              "Payment failed. Please try again."
          );

          setPaying(false);
        }
      );

      checkout.open();
    } catch (error) {
      console.error(
        "Create Razorpay payment failed:",
        error?.response?.data ||
          error?.message ||
          error
      );

      setPaymentStatus("failed");

      setPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start Razorpay payment."
      );

      setPaying(false);
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
              Fetching the latest service details.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // AUTH REQUIRED
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
              Please sign in to continue with your
              booking.
            </p>

            <div className="mt-7">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
              >
                Go to Login
              </Link>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // ======================================================
  // SERVICE ERROR
  // ======================================================

  if (!service) {
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

  // ======================================================
  // SUCCESS
  // ======================================================

  if (bookingSuccess) {
    const bookingTotal = Number(
      bookingSuccess.pricing?.totalAmount ||
        estimatedTotal
    );

    const paymentIsPaid =
      paymentStatus === "paid" ||
      bookingSuccess.paymentStatus ===
        "paid";

    const paymentButtonLabel = paying
      ? "Opening secure payment..."
      : paymentStatus === "failed"
      ? `Retry Payment \u2022 \u20B9${bookingTotal.toLocaleString(
          "en-IN"
        )}`
      : `Pay \u20B9${bookingTotal.toLocaleString(
          "en-IN"
        )} Now`;

    return (
      <section className="min-h-screen bg-background px-5 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Card
            padding="lg"
            className="text-center"
          >
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                paymentIsPaid
                  ? "bg-emerald-50 text-success"
                  : "bg-primary-50 text-primary-600"
              }`}
            >
              {paymentIsPaid ? (
                <CheckCircle2 size={34} />
              ) : (
                <ShieldCheck size={34} />
              )}
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              {paymentIsPaid
                ? "Payment successful"
                : "Booking created"}
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-primary-900">
              {paymentIsPaid
                ? "Your payment is complete"
                : "Your booking is ready"}
            </h1>

            <p className="mt-4 text-text-secondary">
              {paymentIsPaid
                ? "Your payment has been verified successfully. Your booking is now marked as paid."
                : "Your booking has been successfully created in FixMate. Complete the payment below to finish the payment process."}
            </p>

            <div className="mt-7 rounded-2xl bg-background p-5 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-text-muted">
                  Booking number
                </span>

                <span className="font-bold text-primary-900">
                  {bookingSuccess.bookingNumber ||
                    "Created"}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-text-muted">
                  Service
                </span>

                <span className="font-semibold text-text-primary">
                  {service.name}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-text-muted">
                  Professional
                </span>

                <span className="font-semibold text-text-primary">
                  {providerName}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-text-muted">
                  Date
                </span>

                <span className="font-semibold text-text-primary">
                  {selectedDateDetails?.day}{" "}
                  {selectedDateDetails?.month}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-sm text-text-muted">
                  Time
                </span>

                <span className="font-semibold text-text-primary">
                  {selectedTime}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                <span className="font-bold text-text-primary">
                  {paymentIsPaid
                    ? "Amount paid"
                    : "Total payable"}
                </span>

                <span className="text-xl font-extrabold text-primary-900">
                  {"\u20B9"}
                  {bookingTotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>
            </div>

            {!paymentIsPaid && (
              <div className="mt-7">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={paying}
                  onClick={handlePayment}
                >
                  {paying ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Opening secure payment...
                    </>
                  ) : (
                    <>
                      {paymentButtonLabel}
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>

                <p className="mt-3 text-xs leading-5 text-text-muted">
                  You will be redirected to Razorpay's
                  secure checkout to complete your payment.
                </p>
              </div>
            )}

            {paymentError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-left">
                <p className="text-sm font-semibold text-red-800">
                  Payment issue
                </p>

                <p className="mt-1 text-xs leading-5 text-red-700">
                  {paymentError}
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
              >
                Go to Dashboard
              </Link>

              <Link
                to="/services"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
              >
                Browse Services
              </Link>
            </div>

            <div
              className={`mt-6 flex items-start gap-3 rounded-xl p-4 text-left ${
                paymentIsPaid
                  ? "bg-green-50"
                  : "bg-amber-50"
              }`}
            >
              <ShieldCheck
                size={18}
                className={`mt-0.5 shrink-0 ${
                  paymentIsPaid
                    ? "text-success"
                    : "text-amber-600"
                }`}
              />

              <p
                className={`text-xs leading-5 ${
                  paymentIsPaid
                    ? "text-green-800"
                    : "text-amber-800"
                }`}
              >
                {paymentIsPaid
                  ? "Payment has been securely verified by the FixMate backend."
                  : "Your booking is created, but payment is still pending."}
              </p>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  // ======================================================
  // REVIEW & CONFIRM
  // ======================================================

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
              Check your service, professional,
              schedule, and address before creating
              the booking.
            </p>
          </div>

          {error && (
            <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              {/* SERVICE */}

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

              {/* SCHEDULE */}

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
                        {selectedDateDetails?.day}{" "}
                        {selectedDateDetails?.month}
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

              {/* ADDRESS */}

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
                    {address.city},{" "}
                    {address.state} -{" "}
                    {address.pincode}
                  </p>

                  {address.details.trim() && (
                    <p className="mt-2 text-sm text-text-muted">
                      {address.details}
                    </p>
                  )}
                </div>
              </Card>

              {/* REQUIREMENTS */}

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

            {/* SUMMARY */}

            <aside>
              <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-primary-900">
                  Booking summary
                </h2>

                <div className="mt-5 rounded-xl bg-background p-4">
                  <p className="text-sm font-semibold text-text-primary">
                    {service.name}
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    {providerName}
                  </p>
                </div>

                <div className="mt-5 space-y-4 border-b border-slate-100 pb-5">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Service price
                    </span>

                    <span className="font-semibold">
                      {"\u20B9"}
                      {estimatedServicePrice.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Platform fee
                    </span>

                    <span className="font-semibold">
                      {"\u20B9"}
                      {estimatedPlatformFee.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-text-muted">
                      Tax
                    </span>

                    <span className="font-semibold">
                      {"\u20B9"}
                      {estimatedTax.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="font-bold text-text-primary">
                    Estimated total
                  </span>

                  <span className="text-2xl font-extrabold text-primary-900">
                    {"\u20B9"}
                    {estimatedTotal.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={
                    creatingBooking
                  }
                  onClick={
                    handleCreateBooking
                  }
                >
                  {creatingBooking ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Creating booking...
                    </>
                  ) : (
                    <>
                      Create Booking
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  disabled={creatingBooking}
                  onClick={
                    handleBackToEdit
                  }
                  className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50 disabled:opacity-50"
                >
                  Edit Booking
                </button>

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-green-50 p-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-success"
                  />

                  <p className="text-xs leading-5 text-green-800">
                    Booking request will be securely
                    submitted to the FixMate backend.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  // ======================================================
  // MAIN BOOKING FORM
  // ======================================================

  return (
    <section className="min-h-screen bg-background">
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
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Booking
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            Book your service
          </h1>

          <p className="mt-4 text-base leading-7 text-text-secondary">
            Select your professional, address,
            preferred date and time.
          </p>
        </div>

        {error && (
          <div className="mt-7 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* SERVICE */}

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
                      <Clock3 size={15} />
                      {formatDuration(
                        service.estimatedDurationMinutes
                      )}
                    </span>

                    {service.rating?.average > 0 && (
                      <span className="text-accent-600">
                        {"\u2605"}{" "}
                        {Number(
                          service.rating.average
                        ).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* PROFESSIONAL */}

            {providers.length > 0 && (
              <Card padding="lg">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-text-primary">
                      Choose professional
                    </h2>

                    <p className="mt-0.5 text-sm text-text-muted">
                      Select the verified professional for
                      this booking.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {providers.map(
                    (item) => {
                      const selected =
                        item._id ===
                        selectedProviderId;

                      return (
                        <button
                          key={item._id}
                          type="button"
                          onClick={() =>
                            setSelectedProviderId(
                              item._id
                            )
                          }
                          className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                            selected
                              ? "border-primary-600 bg-primary-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-primary-300"
                          }`}
                        >
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary-100">
                            {item.profileImage ? (
                              <img
                                src={
                                  item.profileImage
                                }
                                alt={getProviderName(
                                  item
                                )}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="font-bold text-primary-700">
                                {getProviderName(
                                  item
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-text-primary">
                                {getProviderName(
                                  item
                                )}
                              </h3>

                              <span className="rounded-full bg-green-50 px-2 py-1 text-[11px] font-semibold text-green-700">
                                Verified
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-text-muted">
                              {item.experienceYears ||
                                0}{" "}
                              years experience
                            </p>
                          </div>

                          <div
                            className={`h-5 w-5 rounded-full border-2 ${
                              selected
                                ? "border-primary-600 bg-primary-600"
                                : "border-slate-300"
                            }`}
                          >
                            {selected && (
                              <div className="m-1 h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </Card>
            )}

            {/* ADDRESS */}

            <Card padding="lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <MapPin size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-text-primary">
                      Service address
                    </h2>

                    {addressLoaded && (
                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                        Saved address loaded
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-sm text-text-muted">
                    Where should the professional visit?
                  </p>
                </div>
              </div>

              {loadingAddress && (
                <div className="mt-5 flex items-center gap-2 rounded-xl border border-primary-100 bg-primary-50 px-4 py-3 text-xs font-semibold text-primary-700">
                  <LoaderCircle
                    size={15}
                    className="animate-spin"
                  />
                  Loading your saved address...
                </div>
              )}

              {addressError && (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <p className="text-xs leading-5 text-amber-800">
                    {addressError} You can still enter the
                    address manually.
                  </p>
                </div>
              )}

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
                  label="State"
                  name="state"
                  placeholder="e.g. Madhya Pradesh"
                  value={address.state}
                  onChange={
                    handleAddressChange
                  }
                  error={errors.state}
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

                <Input
                  label="Landmark / Additional details"
                  name="details"
                  placeholder="Floor, landmark, nearby location..."
                  value={address.details}
                  onChange={
                    handleAddressChange
                  }
                />
              </div>
            </Card>

            {/* DATE */}

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
                    Choose a convenient service date.
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

              {errors.date && (
                <p className="mt-3 text-sm text-red-600">
                  {errors.date}
                </p>
              )}
            </Card>

            {/* TIME */}

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
                      slot.label;

                    return (
                      <button
                        key={slot.label}
                        type="button"
                        onClick={() =>
                          setSelectedTime(
                            slot.label
                          )
                        }
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                          selected
                            ? "border-primary-600 bg-primary-50 text-primary-700 shadow-sm"
                            : "border-slate-200 bg-white text-text-secondary hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  }
                )}
              </div>

              {errors.time && (
                <p className="mt-3 text-sm text-red-600">
                  {errors.time}
                </p>
              )}
            </Card>

            {/* REQUIREMENTS */}

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
                maxLength={2000}
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
                {requirements.length}/2000
                characters
              </p>
            </Card>
          </div>

          {/* RIGHT SUMMARY */}

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
                    {"\u20B9"}
                    {estimatedServicePrice.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text-muted">
                    Platform fee
                  </span>

                  <span className="font-semibold text-text-primary">
                    {"\u20B9"}
                    {estimatedPlatformFee.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span className="text-text-muted">
                    Tax
                  </span>

                  <span className="font-semibold text-text-primary">
                    {"\u20B9"}
                    {estimatedTax.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-5">
                <span className="font-bold text-text-primary">
                  Estimated total
                </span>

                <span className="text-2xl font-extrabold text-primary-900">
                  {"\u20B9"}
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
                  Your booking details will be securely
                  sent to FixMate.
                </p>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-text-muted">
                Final pricing is calculated and validated
                by the backend.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Booking;