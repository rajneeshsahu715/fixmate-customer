import {
  ShieldCheck,
  BadgeCheck,
  ReceiptText,
  Headphones,
  ArrowUpRight,
} from "lucide-react";

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: BadgeCheck,
      title: "Verified professionals",
      description:
        "We help you connect with professionals whose profiles and service information have been reviewed.",
    },
    {
      icon: ReceiptText,
      title: "Transparent pricing",
      description:
        "See the expected service cost clearly before you confirm your booking.",
    },
    {
      icon: ShieldCheck,
      title: "Built for peace of mind",
      description:
        "Booking details, service status, payments, and reviews stay organized in one place.",
    },
    {
      icon: Headphones,
      title: "Reliable support",
      description:
        "Get help when you need it with a dedicated support experience for your bookings.",
    },
  ];

  return (
    <section className="border-t border-slate-200 bg-primary-900">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <ShieldCheck size={16} />
              Why FixMate
            </div>

            <h2 className="mt-5 max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              A better way to take care of your home
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              FixMate brings trusted professionals, convenient
              bookings, clear pricing, and service tracking into one
              simple experience.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-900 bg-primary-100 text-xs font-bold text-primary-700">
                  RK
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-900 bg-orange-100 text-xs font-bold text-orange-700">
                  AS
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary-900 bg-slate-200 text-xs font-bold text-slate-700">
                  MP
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  Trusted by homeowners
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  Simple, reliable, and professional
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-300">
                    <Icon size={22} strokeWidth={2} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">
                    {benefit.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {benefit.description}
                  </p>

                  <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-orange-300">
                    Learn more
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;