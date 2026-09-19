import { ArrowLeft, Wrench } from "lucide-react";
import Button from "../components/Button";

const PlaceholderPage = ({ title, description }) => {
  return (
    <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            <Wrench size={28} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
            FixMate
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-text-secondary">
            {description}
          </p>

          <div className="mt-8">
            <Button onClick={() => window.history.back()}>
              <ArrowLeft size={17} />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaceholderPage;