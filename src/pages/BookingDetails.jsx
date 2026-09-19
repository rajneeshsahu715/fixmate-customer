import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  CreditCard,
  MapPin,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
} from "lucide-react";

import { Link, useParams } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";

const bookings = [
  {
    id: "FM-2026-00124",
    service: "AC Repair & Service",
    category: "AC Repair",
    provider: "Vikas Verma",
    professionalId: "3",
    date: "16 Sep 2026",
    time: "10:00 AM",
    location: "Bhopal, Madhya Pradesh",
    fullAddress:
      "Flat 201, ABC Apartments, Arera Colony, Bhopal - 462016",
    amount: 599,
    paymentStatus: "Paid",
    status: "Confirmed",
    statusType: "confirmed",
    description:
      "AC cooling issue inspection and complete servicing.",
    requirements:
      "Please check the cooling issue and clean the indoor unit.",
  },
  {
    id: "FM-2026-00098",
    service: "Home Deep Cleaning",
    category: "Cleaning",
    provider: "Neha Sharma",
    professionalId: "4",
    date: "11 Sep 2026",
    time: "02:00 PM",
    location: "Bhopal, Madhya Pradesh",
    fullAddress:
      "Flat 201, ABC Apartments, Arera Colony, Bhopal - 462016",
    amount: 899,
    paymentStatus: "Paid",
    status: "Completed",
    statusType: "completed",
    description:
      "Deep cleaning service for 2BHK apartment.",
    requirements:
      "Please focus on kitchen, bathrooms, and living room.",
  },
  {
    id: "FM-2026-00071",
    service: "Plumbing Repair",
    category: "Plumbing",
    provider: "Amit Sharma",
    professionalId: "2",
    date: "05 Sep 2026",
    time: "11:30 AM",
    location: "Bhopal, Madhya Pradesh",
    fullAddress:
      "Flat 201, ABC Apartments, Arera Colony, Bhopal - 462016",
    amount: 449,
    paymentStatus: "Refund Pending",
    status: "Cancelled",
    statusType: "cancelled",
    description:
      "Bathroom pipe leakage inspection and repair.",
    requirements:
      "Pipe leakage was reported near the bathroom sink.",
  },
];

const timelineByStatus = {
  confirmed: [
    {
      title: "Booking Placed",
      description: "Your booking request was successfully created.",
      completed: true,
    },
    {
      title: "Booking Confirmed",
      description: "The professional has confirmed your booking.",
      completed: true,
    },
    {
      title: "Professional Assigned",
      description: "Your selected professional is assigned.",
      completed: true,
    },
    {
      title: "Service Started",
      description: "This step will update when the professional arrives.",
      completed: false,
    },
    {
      title: "Service Completed",
      description: "Service completion will be recorded here.",
      completed: false,
    },
  ],

  completed: [
    {
      title: "Booking Placed",
      description: "Your booking request was successfully created.",
      completed: true,
    },
    {
      title: "Booking Confirmed",
      description: "The professional confirmed your booking.",
      completed: true,
    },
    {
      title: "Professional Assigned",
      description: "Your selected professional was assigned.",
      completed: true,
    },
    {
      title: "Service Started",
      description: "The professional started the service.",
      completed: true,
    },
    {
      title: "Service Completed",
      description: "The service was completed successfully.",
      completed: true,
    },
  ],

  cancelled: [
    {
      title: "Booking Placed",
      description: "Your booking request was successfully created.",
      completed: true,
    },
    {
      title: "Booking Confirmed",
      description: "The booking was initially confirmed.",
      completed: true,
    },
    {
      title: "Booking Cancelled",
      description: "This booking has been cancelled.",
      completed: true,
    },
  ],
};

const BookingDetails = () => {
  const { bookingId } = useParams();

  const booking = bookings.find(
    (item) => item.id === bookingId
  );

  if (!booking) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card padding="lg" className="w-full text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <ReceiptText size={25} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-primary-900">
              Booking not found
            </h1>

            <p className="mt-4 text-text-secondary">
              We could not find the booking you are looking for.
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

  const timeline =
    timelineByStatus[booking.statusType] || timelineByStatus.confirmed;

  const statusClasses = {
    confirmed:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
    completed:
      "border-blue-200 bg-blue-50 text-blue-700",
    cancelled:
      "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <section className="min-h-screen bg-background">
      {/* Header */}
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
        {/* Heading */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Booking Details
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              {booking.service}
            </h1>

            <p className="mt-3 text-sm text-text-secondary">
              Booking ID:{" "}
              <span className="font-semibold text-text-primary">
                {booking.id}
              </span>
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${statusClasses[booking.statusType]}`}
          >
            {booking.status === "Confirmed" && (
              <CheckCircle2 size={17} />
            )}

            {booking.status === "Completed" && (
              <CheckCircle2 size={17} />
            )}

            {booking.status === "Cancelled" && (
              <Circle size={17} />
            )}

            {booking.status}
          </span>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main */}
          <div className="space-y-6">
            {/* Service + Professional */}
            <Card padding="lg">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                  <Wrench size={27} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Service
                  </p>

                  <h2 className="mt-1 text-xl font-bold text-primary-900">
                    {booking.service}
                  </h2>

                  <span className="mt-2 inline-flex rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-700">
                    {booking.category}
                  </span>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs text-text-muted">
                    Amount
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-primary-900">
                    ₹{booking.amount}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-extrabold text-primary-700">
                    {booking.provider
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Professional
                    </p>

                    <p className="mt-1 text-sm font-bold text-primary-900">
                      {booking.provider}
                    </p>

                    <p className="mt-0.5 text-xs text-primary-600">
                      Verified FixMate Professional
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Schedule */}
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
                      {booking.date}
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
                      {booking.time}
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
                  <h2 className="text-xl font-bold text-primary-900">
                    Service Address
                  </h2>

                  <p className="mt-1 text-sm text-text-muted">
                    Professional visit location
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-background p-4">
                <p className="text-sm font-semibold leading-6 text-text-primary">
                  {booking.fullAddress}
                </p>
              </div>
            </Card>

            {/* Requirements */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary-900">
                Additional Requirements
              </h2>

              <p className="mt-4 rounded-xl bg-background p-4 text-sm leading-6 text-text-secondary">
                {booking.requirements}
              </p>
            </Card>

            {/* Status Timeline */}
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
                {timeline.map((item, index) => {
                  const isLast = index === timeline.length - 1;

                  return (
                    <div
                      key={item.title}
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
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="sticky top-24 space-y-5">
              {/* Payment */}
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
                      ₹{booking.amount}
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
                    ₹{booking.amount}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CreditCard size={17} />
                    Payment
                  </span>

                  <span className="text-sm font-bold text-emerald-700">
                    {booking.paymentStatus}
                  </span>
                </div>
              </Card>

              {/* Actions */}
              <Card padding="lg">
                <h2 className="text-lg font-bold text-primary-900">
                  Quick Actions
                </h2>

                <div className="mt-5 space-y-3">
                  {booking.statusType !== "cancelled" && (
                    <Link
                      to={`/messages?professionalId=${booking.professionalId}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                    >
                      <MessageCircle size={17} />
                      Message Professional
                    </Link>
                  )}

                  {booking.statusType === "completed" && (
                    <Link
                      to={`/review/${booking.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-3 text-sm font-semibold !text-white transition-colors hover:bg-accent-600"
                    >
                      <Star size={17} fill="currentColor" />
                      Rate & Review
                    </Link>
                  )}

                  {booking.statusType !== "completed" && (
                    <Link
                      to={`/professionals/${booking.professionalId}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                    >
                      <UserRound size={17} />
                      View Professional
                    </Link>
                  )}
                </div>
              </Card>

              {/* Trust */}
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
                    Keep your booking, payment, and communication inside
                    FixMate for a safer service experience.
                  </p>
                </div>
              </div>

              {/* Back */}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={17} />
                Go Back
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default BookingDetails;