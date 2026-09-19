import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  UserRound,
  Wrench,
} from "lucide-react";

import { Link, Navigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";

import Card from "../components/Card";

const Dashboard = () => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();

  if (!authLoaded || !userLoaded) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-72 animate-pulse rounded-xl bg-slate-200" />

          <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-40 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  const firstName =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "Customer";

  const fullName = user?.fullName || firstName;

  const email =
    user?.primaryEmailAddress?.emailAddress ||
    "No email available";

  return (
    <section className="min-h-screen bg-background">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
                Customer Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
                Welcome back, {firstName}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
                Manage your bookings, discover services, and keep
                everything related to your home services in one place.
              </p>
            </div>

            {/* FIXED: Primary CTA with guaranteed white text */}
            <Link
              to="/services"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
              style={{ color: "#ffffff" }}
            >
              <Wrench size={17} />
              <span style={{ color: "#ffffff" }}>
                Book a Service
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            Quick actions
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Book Service */}
            <Link to="/services">
              <Card
                padding="md"
                className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Wrench size={21} />
                </div>

                <h3 className="mt-4 font-bold text-text-primary">
                  Book a Service
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Find the right professional for your home.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                  Explore
                  <ArrowRight size={15} />
                </div>
              </Card>
            </Link>

            {/* Bookings */}
            <Link to="/bookings">
              <Card
                padding="md"
                className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                  <CalendarDays size={21} />
                </div>

                <h3 className="mt-4 font-bold text-text-primary">
                  My Bookings
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  View upcoming and previous service bookings.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                  View bookings
                  <ArrowRight size={15} />
                </div>
              </Card>
            </Link>

            {/* Messages */}
            <Link to="/messages">
              <Card
                padding="md"
                className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-50 text-secondary-600">
                  <MessageCircle size={21} />
                </div>

                <h3 className="mt-4 font-bold text-text-primary">
                  Messages
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Chat with professionals about your bookings.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                  Open messages
                  <ArrowRight size={15} />
                </div>
              </Card>
            </Link>

            {/* Profile */}
            <Link to="/profile">
              <Card
                padding="md"
                className="h-full transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-text-secondary">
                  <UserRound size={21} />
                </div>

                <h3 className="mt-4 font-bold text-text-primary">
                  My Profile
                </h3>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                  Manage your account information and preferences.
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary-600">
                  Manage profile
                  <ArrowRight size={15} />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          {/* Upcoming Booking */}
          <Card padding="lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-accent-600">
                  Upcoming
                </p>

                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  Your next booking
                </h2>
              </div>

              <Link
                to="/bookings"
                className="text-sm font-semibold text-primary-600 transition-colors hover:text-accent-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-background p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-2xl">
                    ❄️
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-text-primary">
                        AC Repair & Service
                      </h3>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-success">
                        Confirmed
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-text-secondary">
                      with Vikas Verma
                    </p>
                  </div>
                </div>

                <p className="text-lg font-extrabold text-primary-900">
                  ₹599
                </p>
              </div>

              <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <CalendarDays
                    size={17}
                    className="text-text-muted"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Date
                    </p>

                    <p className="text-sm font-semibold text-text-primary">
                      16 Sep 2026
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock3
                    size={17}
                    className="text-text-muted"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Time
                    </p>

                    <p className="text-sm font-semibold text-text-primary">
                      10:00 AM
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-success"
                  />

                  <div>
                    <p className="text-xs text-text-muted">
                      Status
                    </p>

                    <p className="text-sm font-semibold text-success">
                      Confirmed
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/bookings"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                  style={{ color: "#ffffff" }}
                >
                  <span style={{ color: "#ffffff" }}>
                    View Booking
                  </span>
                  <ArrowRight size={16} color="#ffffff" />
                </Link>

                <Link
                  to="/messages"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
                >
                  Message Professional
                </Link>
              </div>
            </div>
          </Card>

          {/* Account */}
          <Card padding="lg">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <UserRound size={25} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-text-primary">
              Your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Your FixMate account details are managed securely through
              Clerk.
            </p>

            <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
              <div>
                <p className="text-xs text-text-muted">
                  Name
                </p>

                <p className="mt-1 text-sm font-semibold text-text-primary">
                  {fullName}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-text-primary">
                  {email}
                </p>
              </div>
            </div>

            <Link
              to="/profile"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-accent-600"
            >
              View profile
              <ArrowRight size={16} />
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-10">
          <Card padding="lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-accent-600">
                  Activity
                </p>

                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  Recent activity
                </h2>
              </div>

              <Link
                to="/bookings"
                className="text-sm font-semibold text-primary-600 transition-colors hover:text-accent-600"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 divide-y divide-slate-100">
              <div className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-success">
                  <CheckCircle2 size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    Booking confirmed
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Your AC Repair & Service booking was confirmed.
                  </p>
                </div>

                <span className="hidden text-xs text-text-muted sm:block">
                  Today
                </span>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Wrench size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    Service searched
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    You explored AC Repair & Service.
                  </p>
                </div>

                <span className="hidden text-xs text-text-muted sm:block">
                  Yesterday
                </span>
              </div>

              <div className="flex items-center gap-4 py-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-accent-600">
                  <UserRound size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    Account created
                  </p>

                  <p className="mt-1 text-xs text-text-muted">
                    Welcome to FixMate.
                  </p>
                </div>

                <span className="hidden text-xs text-text-muted sm:block">
                  Recently
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;