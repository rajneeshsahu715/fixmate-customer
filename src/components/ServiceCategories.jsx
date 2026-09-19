import {
  Home,
  Refrigerator,
  Sparkles,
  Wrench,
  ArrowRight,
} from "lucide-react";

import { Link } from "react-router-dom";

const ServiceCategories = () => {
  const categories = [
    {
      title: "Home Repair",
      description:
        "Electrician, plumber, carpenter, painter and everyday repairs.",
      services: "12+ services",
      icon: Home,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
      query: "Home Repair",
    },
    {
      title: "Appliance Services",
      description:
        "AC, refrigerator, washing machine, TV repair and installation.",
      services: "10+ services",
      icon: Refrigerator,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
      query: "Appliances",
    },
    {
      title: "Cleaning Services",
      description:
        "Home, bathroom, kitchen, sofa and deep cleaning services.",
      services: "8+ services",
      icon: Sparkles,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      query: "Cleaning",
    },
    {
      title: "Maintenance",
      description:
        "Pest control, car wash, moving assistance and general maintenance.",
      services: "10+ services",
      icon: Wrench,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
      query: "Maintenance",
    },
  ];

  return (
    <section className="border-t border-slate-200 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Browse by category
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              Find the right service for your home
            </h2>

            <p className="mt-4 text-base leading-7 text-text-secondary">
              Explore our service categories and find the professional
              you need for the job.
            </p>
          </div>

          {/* Explore All */}
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 transition-colors hover:text-accent-600"
          >
            Explore all
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Categories */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <article
                key={category.title}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-7"
              >
                <div>
                  <div
                    className={`flex h-13 w-13 items-center justify-center rounded-xl ${category.iconBg} ${category.iconColor}`}
                  >
                    <Icon size={25} strokeWidth={2} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-text-primary">
                    {category.title}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
                    {category.description}
                  </p>
                </div>

                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="text-xs font-semibold text-text-muted">
                    {category.services}
                  </span>

                  {/* View Services */}
                  <Link
                    to={`/services?category=${encodeURIComponent(
                      category.query
                    )}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 transition-colors hover:text-accent-600"
                  >
                    View services
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;