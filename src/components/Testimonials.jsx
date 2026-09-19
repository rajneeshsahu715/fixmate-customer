import { Quote, Star, CheckCircle2 } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Nikhil Singh",
      role: "Homeowner",
      initials: "NS",
      rating: 5,
      text: "Finding a reliable electrician used to be frustrating. FixMate made the whole process simple, from choosing a professional to booking a convenient time.",
    },
    {
      name: "Vipin Sahu",
      role: "Homeowner",
      initials: "VS",
      rating: 5,
      text: "I liked being able to compare professionals before booking. The experience felt organized, transparent, and much more trustworthy.",
    },
    {
      name: "Alok Prajapati",
      role: "Homeowner",
      initials: "AP",
      rating: 5,
      text: "Booked AC service through FixMate and everything was easy to understand. The professional arrived on time and the booking details were clear.",
    },
  ];

  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            Customer stories
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            Trusted by homeowners
          </h2>

          <p className="mt-4 text-base leading-7 text-text-secondary">
            A simple experience matters. Here is what customers say
            about getting their home services sorted with FixMate.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="relative rounded-2xl border border-slate-200 bg-background p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7"
            >
              {/* Quote */}
              <div className="absolute right-6 top-6 text-primary-100">
                <Quote size={38} fill="currentColor" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map(
                  (_, index) => (
                    <Star
                      key={index}
                      size={17}
                      className="text-accent-500"
                      fill="currentColor"
                    />
                  )
                )}
              </div>

              {/* Review */}
              <p className="mt-5 pr-8 text-sm leading-7 text-text-secondary">
                “{testimonial.text}”
              </p>

              {/* Customer */}
              <div className="mt-7 flex items-center gap-3 border-t border-slate-200 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                  {testimonial.initials}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-text-primary">
                      {testimonial.name}
                    </h3>

                    <CheckCircle2
                      size={15}
                      className="text-success"
                    />
                  </div>

                  <p className="mt-0.5 text-xs text-text-muted">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Rating Summary */}
        <div className="mx-auto mt-10 flex max-w-xl flex-col items-center justify-center gap-3 rounded-2xl border border-primary-100 bg-primary-50 px-6 py-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-1">
            <Star
              size={20}
              className="text-accent-500"
              fill="currentColor"
            />

            <span className="text-lg font-extrabold text-primary-900">
              4.8
            </span>
          </div>

          <div className="hidden h-5 w-px bg-primary-200 sm:block" />

          <p className="text-sm text-text-secondary">
            Rated highly by customers for quality, reliability, and
            overall service experience.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;