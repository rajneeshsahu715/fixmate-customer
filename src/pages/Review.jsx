import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MessageSquareText,
  ShieldCheck,
  Star,
  UserRound,
  Wrench,
} from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../components/Button";
import Card from "../components/Card";

const Review = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const professional = {
    name: "Neha Sharma",
    initials: "NS",
    category: "Home Cleaning",
    service: "Home Deep Cleaning",
    date: "11 Sep 2026",
    bookingId: "FM-2026-00098",
  };

  const ratingLabels = {
    1: "Poor",
    2: "Below Average",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="min-h-[calc(100vh-72px)] bg-background px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[65vh] max-w-2xl items-center justify-center">
          <Card padding="lg" className="w-full text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-success">
              <CheckCircle2 size={32} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Thank You
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              Review submitted successfully
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary">
              Your feedback helps other customers choose the right
              professional and helps FixMate maintain service quality.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/bookings"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
              >
                <ArrowLeft size={17} />
                Back to Bookings
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
              >
                Explore Services
              </Link>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  const activeRating = hoverRating || rating;

  return (
    <section className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Bookings
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Rate Your Experience
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            How was your service?
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary">
            Your honest feedback helps us improve FixMate and helps other
            customers make better choices.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Review Form */}
          <Card padding="lg">
            {/* Professional */}
            <div className="flex items-center gap-4 rounded-2xl bg-background p-4 sm:p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-extrabold text-primary-700">
                {professional.initials}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-primary-900">
                    {professional.name}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-bold text-success">
                    <ShieldCheck size={11} />
                    Verified
                  </span>
                </div>

                <p className="mt-1 text-sm font-medium text-primary-600">
                  {professional.category}
                </p>

                <p className="mt-1 text-xs text-text-muted">
                  {professional.service}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-bold text-primary-900">
                Give a rating
              </h3>

              <p className="mt-1 text-sm text-text-muted">
                How would you rate your overall experience?
              </p>

              <div
                className="mt-5 flex justify-center gap-2"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    className="rounded-lg p-1 transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} out of 5`}
                  >
                    <Star
                      size={34}
                      strokeWidth={1.8}
                      className={
                        star <= activeRating
                          ? "text-accent-500"
                          : "text-slate-300"
                      }
                      fill={
                        star <= activeRating
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                ))}
              </div>

              <div className="mt-3 min-h-6">
                {activeRating > 0 && (
                  <p className="text-sm font-bold text-accent-600">
                    {ratingLabels[activeRating]}
                  </p>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div className="mt-8">
              <div className="flex items-center gap-2">
                <MessageSquareText
                  size={19}
                  className="text-primary-600"
                />

                <h3 className="text-lg font-bold text-primary-900">
                  Write your review
                </h3>
              </div>

              <p className="mt-1 text-sm text-text-muted">
                Tell us what you liked or what could be improved.
              </p>

              <textarea
                value={review}
                onChange={(event) =>
                  setReview(event.target.value.slice(0, 500))
                }
                rows={7}
                maxLength={500}
                placeholder="Share your experience with this professional..."
                className="mt-5 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-slate-400 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />

              <div className="mt-2 flex justify-end">
                <span className="text-xs text-text-muted">
                  {review.length}/500
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-7">
              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmit}
              >
                Submit Review
                <CheckCircle2 size={18} />
              </Button>
            </div>

            <p className="mt-4 text-center text-xs leading-5 text-text-muted">
              Reviews should be honest, respectful, and based on your
              actual FixMate service experience.
            </p>
          </Card>

          {/* Booking Summary */}
          <aside>
            <div className="sticky top-24 space-y-5">
              <Card padding="lg">
                <h2 className="text-lg font-bold text-primary-900">
                  Booking details
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Wrench
                      size={18}
                      className="mt-0.5 shrink-0 text-primary-600"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Service
                      </p>

                      <p className="mt-1 text-sm font-semibold text-text-primary">
                        {professional.service}
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
                        {professional.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDaysIcon />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                        Completed
                      </p>

                      <p className="mt-1 text-sm font-semibold text-text-primary">
                        {professional.date}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Booking ID
                  </p>

                  <p className="mt-1 text-sm font-bold text-primary-900">
                    {professional.bookingId}
                  </p>
                </div>
              </Card>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 shrink-0 text-success"
                />

                <div>
                  <p className="text-sm font-bold text-primary-900">
                    Your feedback matters
                  </p>

                  <p className="mt-1 text-xs leading-5 text-text-secondary">
                    Verified reviews help maintain trust across the FixMate
                    marketplace.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

const CalendarDaysIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 shrink-0 text-primary-600"
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
};

export default Review;