import {
  Search,
  UserCheck,
  CalendarCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Choose a service",
      description:
        "Tell us what you need and explore the right service for your home.",
      icon: Search,
    },
    {
      number: "02",
      title: "Pick a professional",
      description:
        "Compare verified professionals by rating, experience, price, and availability.",
      icon: UserCheck,
    },
    {
      number: "03",
      title: "Book a time",
      description:
        "Choose a convenient date and time slot that works for you.",
      icon: CalendarCheck,
    },
    {
      number: "04",
      title: "Get it done",
      description:
        "Your professional arrives, completes the job, and you can review the service.",
      icon: Sparkles,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="border-t border-slate-200 bg-background"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Simple process
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            Home services made simple
          </h2>

          <p className="mt-4 text-base leading-7 text-text-secondary">
            From finding the right professional to getting the job
            completed, FixMate keeps everything straightforward.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-12">
          {/* Connecting Line */}
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-slate-200 lg:block"
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative text-center"
                >
                  {/* Icon */}
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <Icon
                      size={28}
                      strokeWidth={2}
                      className="text-primary-600"
                    />

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 text-xs font-bold text-white shadow-sm">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-lg font-bold text-text-primary">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-text-secondary">
                    {step.description}
                  </p>

                  {/* Mobile/Tablet Arrow */}
                  {index < steps.length - 1 && (
                    <div className="mt-5 flex justify-center lg:hidden">
                      <ArrowRight
                        size={18}
                        className="text-slate-300"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-14 rounded-2xl border border-primary-100 bg-primary-50 px-5 py-5 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="font-bold text-primary-900">
                Need help choosing a service?
              </p>

              <p className="mt-1 text-sm text-text-secondary">
                FixMate can help you find the right professional for
                your needs.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              Get Started
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;