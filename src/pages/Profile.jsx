import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useUser } from "@clerk/react";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

const Profile = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [address, setAddress] = useState({
    house: "",
    street: "",
    city: "",
    pincode: "",
  });

  const [saved, setSaved] = useState(false);

  const initializeProfile = () => {
    if (!user) return;

    setProfile({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.primaryPhoneNumber?.phoneNumber || "",
    });
  };

  if (isLoaded && isSignedIn && profile.firstName === "" && profile.lastName === "") {
    initializeProfile();
  }

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;

    setAddress((current) => ({
      ...current,
      [name]:
        name === "pincode"
          ? value.replace(/\D/g, "").slice(0, 6)
          : value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSaved(true);
  };

  if (!isLoaded) {
    return (
      <section className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-slate-200" />
            <div className="h-10 w-64 rounded bg-slate-200" />

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="h-80 rounded-2xl bg-slate-200" />
              <div className="h-80 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isSignedIn) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card padding="lg" className="w-full text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <UserRound size={25} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-primary-900">
              Sign in to view your profile
            </h1>

            <p className="mt-3 text-text-secondary">
              Your personal information and saved preferences are available
              after signing in.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold !text-white transition-colors hover:bg-primary-700"
            >
              Sign In
            </Link>
          </Card>
        </div>
      </section>
    );
  }

  const displayName =
    `${profile.firstName} ${profile.lastName}`.trim() ||
    user?.username ||
    "Customer";

  const email =
    user?.primaryEmailAddress?.emailAddress || "No email available";

  const initial = displayName.charAt(0).toUpperCase() || "C";

  return (
    <section className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6 lg:px-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary-600"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8 lg:py-14">
        {/* Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
              Manage your personal information, contact details, and saved
              service address.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsEditing((current) => !current);
              setSaved(false);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50"
          >
            <Edit3 size={17} />
            {isEditing ? "Cancel Editing" : "Edit Profile"}
          </button>
        </div>

        {saved && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />
            Profile changes saved successfully.
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile Overview */}
          <div className="space-y-6">
            <Card padding="lg">
              <div className="text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary-100 text-3xl font-extrabold text-primary-700">
                  {initial}
                </div>

                <h2 className="mt-5 text-xl font-bold text-primary-900">
                  {displayName}
                </h2>

                <p className="mt-1 break-all text-sm text-text-secondary">
                  {email}
                </p>

                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-success">
                  <ShieldCheck size={14} />
                  Customer Account
                </span>
              </div>

              <div className="mt-7 border-t border-slate-100 pt-6">
                <div className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-text-primary">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-start gap-3">
                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-primary-600"
                  />

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-text-primary">
                      {profile.phone || "Not added"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Account Shortcuts */}
            <Card padding="lg">
              <h2 className="text-base font-bold text-primary-900">
                Account Shortcuts
              </h2>

              <div className="mt-4 space-y-2">
                <Link
                  to="/dashboard"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-slate-50 hover:text-primary-600"
                >
                  <span className="flex items-center gap-3">
                    <UserRound size={17} />
                    Dashboard
                  </span>

                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/bookings"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-slate-50 hover:text-primary-600"
                >
                  <span className="flex items-center gap-3">
                    <CalendarDays size={17} />
                    My Bookings
                  </span>

                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/messages"
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold text-text-secondary transition-colors hover:bg-slate-50 hover:text-primary-600"
                >
                  <span className="flex items-center gap-3">
                    <MessageCircle size={17} />
                    Messages
                  </span>

                  <ArrowRight size={16} />
                </Link>
              </div>
            </Card>
          </div>

          {/* Main Details */}
          <div className="space-y-6">
            {/* Personal Information */}
            <Card padding="lg">
              <div>
                <h2 className="text-xl font-bold text-primary-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  Keep your account information up to date.
                </p>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Input
                  label="First Name"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  placeholder="Enter first name"
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  placeholder="Enter last name"
                />

                <Input
                  label="Email Address"
                  name="email"
                  value={email}
                  disabled
                  type="email"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  inputMode="tel"
                />
              </div>
            </Card>

            {/* Saved Address */}
            <Card padding="lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-primary-900">
                        Saved Address
                      </h2>

                      <p className="mt-1 text-sm text-text-muted">
                        Use this address for faster bookings.
                      </p>
                    </div>
                  </div>
                </div>

                <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-text-muted sm:inline-flex">
                  Default
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Input
                  label="House / Flat / Building"
                  name="house"
                  value={address.house}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="e.g. Flat 201, ABC Apartments"
                />

                <Input
                  label="Street / Area"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="e.g. Arera Colony"
                />

                <Input
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="e.g. Bhopal"
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleAddressChange}
                  disabled={!isEditing}
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>
            </Card>

            {/* Preferences */}
            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary-900">
                Account Preferences
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                These preferences will later be connected to your
                notification settings.
              </p>

              <div className="mt-6 space-y-4">
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-background p-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Booking updates
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      Receive updates about your service bookings.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    defaultChecked
                    disabled={!isEditing}
                    className="h-5 w-5 rounded border-slate-300 accent-primary-600"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-background p-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Offers & recommendations
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      Receive useful service recommendations and offers.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    defaultChecked
                    disabled={!isEditing}
                    className="h-5 w-5 rounded border-slate-300 accent-primary-600"
                  />
                </label>
              </div>
            </Card>

            {isEditing && (
              <div className="flex justify-end">
                <Button size="lg" onClick={handleSave}>
                  <Save size={18} />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;