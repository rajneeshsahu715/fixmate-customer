import { useState } from "react";
import {
  Search,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import Button from "./Button";

const Hero = () => {
  const navigate = useNavigate();

  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [error, setError] = useState("");

  const handleFindProfessionals = () => {
    const service = serviceQuery.trim();
    const location = locationQuery.trim();

    if (!service && !location) {
      setError("Please enter a service and your location.");
      return;
    }

    if (!service) {
      setError("Please enter the service you need.");
      return;
    }

    if (!location) {
      setError("Please enter your location.");
      return;
    }

    setError("");

    navigate(
      `/professionals?search=${encodeURIComponent(
        service
      )}&location=${encodeURIComponent(location)}`
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleFindProfessionals();
    }
  };

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent-100/60 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-primary-100/60 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          {/* Left Content */}
          <div>
            {/* Trust Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent-100 bg-accent-50 px-4 py-2 text-sm font-semibold text-accent-700">
              <ShieldCheck size={16} />
              Trusted & verified professionals
            </div>

            {/* Heading */}
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
              Trusted professionals.
              <span className="mt-2 block text-primary-600">
                Right at your doorstep.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              Book reliable professionals for repairs, cleaning,
              appliance services, and everyday home maintenance —
              all from one trusted platform.
            </p>

            {/* Search Box */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/40">
              <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_auto]">
                {/* Service Input */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                  <Search
                    size={20}
                    className="shrink-0 text-text-muted"
                  />

                  <input
                    type="text"
                    value={serviceQuery}
                    onChange={(event) => {
                      setServiceQuery(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="What service do you need?"
                    className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Location Input */}
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5">
                  <MapPin
                    size={20}
                    className="shrink-0 text-text-muted"
                  />

                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(event) => {
                      setLocationQuery(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter your location"
                    className="min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* CTA */}
                <Button
                  size="lg"
                  type="button"
                  onClick={handleFindProfessionals}
                >
                  Find Professionals
                </Button>
              </div>

              {/* Validation */}
              {error && (
                <div className="mt-3 flex items-center gap-2 px-1 text-sm font-medium text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}
            </div>

            {/* Trust Stats */}
            <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4 text-sm text-text-secondary">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="text-success"
                />
                <span>Verified providers</span>
              </div>

              <div className="flex items-center gap-2">
                <Star
                  size={17}
                  className="text-accent-500"
                  fill="currentColor"
                />
                <span>Trusted ratings</span>
              </div>

              <div className="flex items-center gap-2">
                <Users
                  size={17}
                  className="text-primary-600"
                />
                <span>Local professionals</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-6">
              {/* Visual */}
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-primary-50">
                <div className="text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-900 text-4xl shadow-md">
                    🛠️
                  </div>

                  <p className="mt-5 text-lg font-bold text-primary-900">
                    Your home, taken care of.
                  </p>

                  <p className="mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                    Skilled professionals for the jobs that
                    matter most.
                  </p>
                </div>
              </div>

              {/* Provider Preview */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700">
                      RK
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-text-primary">
                          Verified Professional
                        </p>

                        <ShieldCheck
                          size={15}
                          className="text-success"
                        />
                      </div>

                      <p className="mt-0.5 text-xs text-text-muted">
                        Available near you
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-bold text-text-primary">
                      <Star
                        size={15}
                        className="text-accent-500"
                        fill="currentColor"
                      />
                      4.8
                    </div>

                    <p className="mt-0.5 text-xs text-text-muted">
                      Top rated
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg sm:flex sm:items-center sm:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-text-muted">
                  Safety first
                </p>

                <p className="text-sm font-bold text-text-primary">
                  Verified professionals
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;