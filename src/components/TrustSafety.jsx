import {
  ShieldCheck,
  LockKeyhole,
  BadgeCheck,
  Star,
  ArrowRight,
} from "lucide-react";

const TrustSafety = () => {
  const trustPoints = [
    {
      icon: BadgeCheck,
      title: "Verified professionals",
      description:
        "Provider profiles go through a verification process before they become eligible for normal customer bookings.",
    },
    {
      icon: LockKeyhole,
      title: "Secure payments",
      description:
        "Payments are processed through a secure payment flow and verified by the FixMate backend.",
    },
    {
      icon: Star,
      title: "Real customer reviews",
      description:
        "Completed bookings can be reviewed so future customers can make informed decisions.",
    },
  ];

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-3xl bg-primary-900">
          <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
            {/* Left */}
            <div className="relative p-7 sm:p-10 lg:p-12">
              <div
                aria-hidden="true"
                className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-secondary-500/10 blur-3xl"
              />

              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-300">
                  <ShieldCheck size={28} />
                </div>

                <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-orange-300">
                  Your trust matters
                </p>

                <h2 className="mt-3 max-w-md text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Book with more confidence.
                </h2>

                <p className="mt-5 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                  FixMate is designed to keep your service experience
                  clear, organized, and trustworthy from booking to
                  completion.
                </p>

                <button
                  type="button"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-900 transition-colors hover:bg-slate-100"
                >
                  Learn about safety
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="border-t border-white/10 bg-white/[0.04] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
              <div className="space-y-7">
                {trustPoints.map((point, index) => {
                  const Icon = point.icon;

                  return (
                    <div key={point.title}>
                      <div className="flex gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-orange-300">
                          <Icon size={21} />
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white sm:text-lg">
                            {point.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {point.description}
                          </p>
                        </div>
                      </div>

                      {index < trustPoints.length - 1 && (
                        <div className="ml-[22px] mt-7 h-px bg-white/10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSafety;