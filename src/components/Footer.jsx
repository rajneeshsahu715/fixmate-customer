import {
  Wrench,
  Mail,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

const Footer = () => {
  const serviceLinks = [
    "Electrician",
    "Plumber",
    "AC Repair",
    "Home Cleaning",
    "Carpenter",
  ];

  const companyLinks = [
    {
      label: "About FixMate",
      to: "/",
    },
    {
      label: "How It Works",
      to: "/how-it-works",
    },
    {
      label: "Become a Provider",
      to: "/",
    },
    {
      label: "Careers",
      to: "/",
    },
    {
      label: "Contact Us",
      to: "/",
    },
  ];

  const supportLinks = [
    {
      label: "Help Center",
      to: "/",
    },
    {
      label: "Safety",
      to: "/",
    },
    {
      label: "Cancellation Policy",
      to: "/",
    },
    {
      label: "Terms of Service",
      to: "/",
    },
    {
      label: "Privacy Policy",
      to: "/",
    },
  ];

  const linkStyle = {
    color: "#CBD5E1",
  };

  const iconStyle = {
    color: "#F8FAFC",
  };

  return (
    <footer className="border-t border-white/10 bg-primary-900">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
              aria-label="FixMate Home"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-white shadow-sm">
                <Wrench size={20} strokeWidth={2.5} />
              </span>

              <span className="text-xl font-extrabold tracking-tight text-white">
                FixMate
              </span>
            </Link>

            <p
              className="mt-5 max-w-sm text-sm leading-6"
              style={{ color: "#CBD5E1" }}
            >
              Trusted professionals for repairs, cleaning,
              appliance services, and everyday home maintenance.
            </p>

            <div
              className="mt-6 space-y-3 text-sm"
              style={{ color: "#CBD5E1" }}
            >
              <div className="flex items-center gap-2.5">
                <MapPin
                  size={16}
                  style={{ color: "#FDBA74" }}
                />
                <span>Serving homes across India</span>
              </div>

              <a
                href="mailto:rajneeshsahu715@gmail.com"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail
                  size={16}
                  style={{ color: "#FDBA74" }}
                />
                <span>rajneeshsahu715@gmail.com</span>
              </a>

              <a
                href="tel:7471147028"
                className="flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone
                  size={16}
                  style={{ color: "#FDBA74" }}
                />
                <span>7471147028</span>
              </a>
            </div>

            {/* Social / Contact */}
            <div className="mt-7 flex items-center gap-2.5">
              <a
                href="#"
                aria-label="Website"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
              >
                <Globe
                  size={17}
                  style={iconStyle}
                />
              </a>

              <Link
                to="/messages"
                aria-label="Messages"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
              >
                <MessageCircle
                  size={17}
                  style={iconStyle}
                />
              </Link>

              <a
                href="mailto:support@fixmate.com"
                aria-label="Email FixMate"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 transition hover:bg-white/10"
              >
                <Mail
                  size={17}
                  style={iconStyle}
                />
              </a>
            </div>
          </div>

          {/* Popular Services */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Popular Services
            </h3>

            <ul className="mt-5 space-y-3">
              {serviceLinks.map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-sm transition-colors hover:text-orange-300"
                    style={linkStyle}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm transition-colors hover:text-orange-300"
                    style={linkStyle}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Support
            </h3>

            <ul className="mt-5 space-y-3">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-sm transition-colors hover:text-orange-300"
                    style={linkStyle}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-xs"
            style={{ color: "#CBD5E1" }}
          >
            © 2026 FixMate. All rights reserved.
          </p>

          <p
            className="text-xs"
            style={{ color: "#CBD5E1" }}
          >
            Trusted professionals. Right at your doorstep.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;