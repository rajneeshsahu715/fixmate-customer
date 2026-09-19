import { ArrowRight, ShieldCheck } from "lucide-react";
import Button from "./Button";

const FinalCTA = () => {
  return (
    <section className="border-t border-slate-200 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary-900 px-6 py-12 text-center sm:px-10 sm:py-16">
          {/* Decorative Shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary-500/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-3xl">
            {/* Small Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-orange-300">
              <ShieldCheck size={16} />
              Trusted home services
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to get your home sorted?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Find the right professional, choose a convenient time,
              and book your service with confidence.
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-accent-500 hover:bg-accent-600 focus:ring-accent-500"
              >
                Find Professionals
                <ArrowRight size={18} />
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white/15"
              >
                Explore Services
              </Button>
            </div>

            {/* Trust Note */}
            <p className="mt-6 text-xs text-slate-400">
              Simple booking • Verified professionals • Clear pricing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;