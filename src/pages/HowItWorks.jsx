import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
} from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Choose a service",
      description:
        "Browse FixMate services and find the right solution for your home.",
    },
    {
      number: "02",
      icon: UserRound,
      title: "Select a professional",
      description:
        "Compare verified professionals by rating, experience, availability, and price.",
    },
    {
      number: "03",
      icon: CalendarDays,
      title: "Pick date & time",
      description:
        "Choose a convenient service date and available time slot.",
    },
    {
      number: "04",
      icon: CreditCard,
      title: "Confirm & pay",
      description:
        "Review your booking details and complete secure payment.",
    },
    {
      number: "05",
      icon: Wrench,
      title: "Get the service",
      description:
        "Your professional arrives at your selected location and completes the job.",
    },
    {
      number: "06",
      icon: Star,
      title: "Rate & review",
      description:
        "Share your experience to help other customers choose confidently.",
    },
  ];

  const trustPoints = [
    {
      icon: ShieldCheck,
      title: "Verified professionals",
      description:
        "Professionals are reviewed through our verification process before serving customers.",
    },
    {
      icon: CheckCircle2,
      title: "Clear service details",
      description:
        "Know the service, professional, timing, and estimated price before confirming.",
    },
    {
      icon: CreditCard,
      title: "Secure payments",
      description:
        "Payments are processed through a secure payment flow designed for FixMate.",
    },
    {
      icon: MapPin,
      title: "At your doorstep",
      description:
        "Book trusted home services for your preferred location and schedule.",
    },
  ];

  return (
    <section className="min-h-screen bg-background">
      {/* Hero */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            How It Works
          </p>

          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-extrabold tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
            Home services made simple
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            From finding the right professional to getting the job
            completed, FixMate keeps the entire home service journey
            simple and transparent.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold !text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              Explore Services
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/professionals"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
            >
              Find Professionals
            </Link>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Simple Process
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            Book a service in six simple steps
          </h2>

          <p className="mt-4 text-base leading-7 text-text-secondary">
            Everything is designed to make booking a home service
            straightforward from start to finish.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <Card
                key={step.number}
                padding="lg"
                className="group relative overflow-hidden transition-shadow duration-200 hover:shadow-md"
              >
                <div className="absolute right-5 top-4 text-5xl font-extrabold text-primary-50">
                  {step.number}
                </div>

                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-100">
                    <Icon size={22} />
                  </div>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.12em] text-accent-600">
                    Step {step.number}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-primary-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Journey Banner */}
      <div className="border-y border-slate-200 bg-primary-900">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-orange-300">
                One smooth journey
              </p>

              <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Find. Book. Relax.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
                FixMate brings trusted professionals, transparent
                booking, secure payments, and service communication
                together in one experience.
              </p>
            </div>

            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold !text-white transition-colors hover:bg-orange-600"
            >
              Book a Service
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Built Around Trust
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              Why customers can book with confidence
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
              FixMate is designed around a simple principle: customers
              should know who is coming, what they are booking, and
              what happens next.
            </p>

            <div className="mt-7">
              <Link
                to="/professionals"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-accent-600"
              >
                Browse verified professionals
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {trustPoints.map((point) => {
              const Icon = point.icon;

              return (
                <Card key={point.title} padding="lg">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-primary-900">
                    {point.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    {point.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="mx-auto max-w-7xl px-5 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-50 text-accent-600">
            <Wrench size={25} />
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-primary-900">
            Ready to get your home sorted?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base">
            Find a trusted professional and book your next home service
            with FixMate.
          </p>

          <Link
            to="/services"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
          >
            Explore Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;