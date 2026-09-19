import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserSync from "./components/UserSync";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Professionals from "./pages/Professionals";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Booking from "./pages/Booking";
import BookingDetails from "./pages/BookingDetails";
import Bookings from "./pages/Bookings";
import Review from "./pages/Review";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import HowItWorks from "./pages/HowItWorks";
import PlaceholderPage from "./pages/PlaceholderPage";

const App = () => {
  return (
    <>
      <UserSync />

      <Navbar />

      <main className="min-h-screen">
        <Routes>
          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/services/:serviceId"
            element={<ServiceDetails />}
          />

          <Route
            path="/professionals"
            element={<Professionals />}
          />

          <Route
            path="/professionals/:professionalId"
            element={<ProfessionalProfile />}
          />

          <Route
            path="/services/:serviceId/book"
            element={<Booking />}
          />

          <Route
            path="/how-it-works"
            element={<HowItWorks />}
          />

          {/* =========================
              AUTH ROUTES
          ========================= */}

          <Route
            path="/login/*"
            element={<Login />}
          />

          <Route
            path="/signup/*"
            element={<Signup />}
          />

          {/* =========================
              USER ROUTES
          ========================= */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/messages"
            element={<Messages />}
          />

          {/* =========================
              BOOKING ROUTES
          ========================= */}

          <Route
            path="/bookings"
            element={<Bookings />}
          />

          <Route
            path="/bookings/:bookingId"
            element={<BookingDetails />}
          />

          <Route
            path="/review/:bookingId"
            element={<Review />}
          />

          {/* =========================
              FALLBACK
          ========================= */}

          <Route
            path="*"
            element={<PlaceholderPage />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

export default App;