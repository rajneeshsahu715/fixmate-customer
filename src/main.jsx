import React from "react";
import ReactDOM from "react-dom/client";

import { ClerkProvider } from "@clerk/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "VITE_CLERK_PUBLISHABLE_KEY is missing in .env"
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);