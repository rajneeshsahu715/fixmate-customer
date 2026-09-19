import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  Star,
  UserRound,
  Wrench,
  XCircle,
} from "lucide-react";

const bookings = [
  {
    id: "FM-2026-00124",
    service: "AC Repair & Service",
    provider: "Vikas Verma",
    category: "AC Repair",
    date: "16 Sep 2026",
    time: "10:00 AM",
    location: "Bhopal, Madhya Pradesh",
    amount: "₹599",
    status: "Confirmed",
    statusType: "confirmed",
    professionalId: "3",
    description:
      "AC cooling issue inspection and complete servicing.",
  },
  {
    id: "FM-2026-00098",
    service: "Home Deep Cleaning",
    provider: "Neha Sharma",
    category: "Cleaning",
    date: "11 Sep 2026",
    time: "02:00 PM",
    location: "Bhopal, Madhya Pradesh",
    amount: "₹899",
    status: "Completed",
    statusType: "completed",
    professionalId: "4",
    description:
      "Deep cleaning service for 2BHK apartment.",
  },
  {
    id: "FM-2026-00071",
    service: "Plumbing Repair",
    provider: "Amit Patel",
    category: "Plumbing",
    date: "05 Sep 2026",
    time: "11:30 AM",
    location: "Bhopal, Madhya Pradesh",
    amount: "₹449",
    status: "Cancelled",
    statusType: "cancelled",
    professionalId: "2",
    description:
      "Bathroom pipe leakage inspection and repair.",
  },
];

const statusStyles = {
  confirmed: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "text-emerald-600",
  },
  completed: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "text-blue-600",
  },
  cancelled: {
    badge: "bg-red-50 text-red-700 border-red-200",
    icon: "text-red-600",
  },
};

const StatusIcon = ({ type }) => {
  if (type === "confirmed") {
    return <CheckCircle2 size={16} />;
  }

  if (type === "completed") {
    return <ReceiptText size={16} />;
  }

  return <XCircle size={16} />;
};

const Bookings = () => {
  const totalBookings = bookings.length;

  const upcomingBookings = bookings.filter(
    (booking) => booking.statusType === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.statusType === "completed"
  ).length;

  return (
    <section className="min-h-[calc(100vh-72px)] bg-background">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Back */}
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.16em] text-accent-600">
              Customer Area
            </p>

            <h1 className="text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
              View your upcoming services, previous bookings, payment
              details, and booking status in one place.
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

        {/* Summary cards */}
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
              {totalBookings}
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
              {upcomingBookings}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Active booking
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
              {completedBookings}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              Services completed
            </p>
          </div>
        </div>

        {/* Booking list */}
        <div className="space-y-5">
          {bookings.map((booking) => {
            const style = statusStyles[booking.statusType];

            return (
              <article
                key={booking.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  {/* Top row */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                        <Wrench size={21} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-primary-900">
                            {booking.service}
                          </h2>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.badge}`}
                          >
                            <span className={style.icon}>
                              <StatusIcon
                                type={booking.statusType}
                              />
                            </span>

                            {booking.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-text-muted">
                          Booking ID: {booking.id}
                        </p>
                      </div>
                    </div>

                    <p className="text-lg font-extrabold text-primary-900">
                      {booking.amount}
                    </p>
                  </div>

                  {/* Details */}
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
                          {booking.date}
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
                          {booking.time}
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
                          {booking.provider}
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
                          {booking.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-sm leading-6 text-text-secondary">
                      {booking.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      {/* Message */}
                      {booking.statusType !== "cancelled" && (
                        <Link
                          to={`/messages?professionalId=${booking.professionalId}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                        >
                          <MessageCircle size={17} />
                          Message Professional
                        </Link>
                      )}

                      {/* Contact */}
                      {booking.statusType === "confirmed" && (
                        <button
                          type="button"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                          onClick={() =>
                            alert(
                              `Calling ${booking.provider} will be connected in a later step.`
                            )
                          }
                        >
                          <Phone size={17} />
                          Contact
                        </button>
                      )}

                      {/* Rate & Review */}
                      {booking.statusType === "completed" && (
                        <Link
                          to={`/review/${booking.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-accent-600"
                        >
                          <Star size={17} fill="currentColor" />
                          Rate & Review
                        </Link>
                      )}
                    </div>

                    {/* View Booking */}
                    <Link
                      to={`/bookings/${booking.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
                    >
                      View Booking
                      <ArrowRight
                        size={17}
                        className="text-white"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-600">
            <Wrench size={21} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-primary-900">
            Need another service?
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-text-secondary">
            Explore verified professionals and book the right service
            for your home.
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