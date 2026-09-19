import { SignUp } from "@clerk/react";

const Signup = () => {
  return (
    <section className="min-h-[calc(100vh-72px)] bg-background px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Get Started
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900">
              Create your FixMate account
            </h1>

            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Book trusted professionals and manage your home services
              in one place.
            </p>
          </div>

          <div className="flex justify-center">
            <SignUp
              routing="path"
              path="/signup"
              signInUrl="/login"
              fallbackRedirectUrl="/"
              appearance={{
                variables: {
                  colorPrimary: "#173F65",
                  colorText: "#172033",
                  colorTextSecondary: "#667085",
                  colorBackground: "#FFFFFF",
                  colorInputBackground: "#FFFFFF",
                  colorInputText: "#172033",
                  borderRadius: "0.75rem",
                },
                elements: {
                  card: "border border-slate-200 shadow-sm",
                  headerTitle: "text-primary-900",
                  headerSubtitle: "text-text-secondary",
                  formButtonPrimary:
                    "bg-primary-600 hover:bg-primary-700",
                  formFieldInput:
                    "border-slate-300 focus:border-primary-500 focus:ring-primary-100",
                  footerActionLink:
                    "text-primary-600 hover:text-accent-600",
                },
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;