import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Edit3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/react";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

import { createAuthApi } from "../api/api";

const emptyAddress = {
  house: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
};

const defaultPreferences = {
  bookingUpdates: true,
  offersRecommendations: true,
};

const Profile = () => {
  const {
    isLoaded,
    isSignedIn,
    user,
  } = useUser();

  const { getToken } = useAuth();

  const [isEditing, setIsEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [loadingProfile, setLoadingProfile] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [saveError, setSaveError] =
    useState("");

  // ======================================================
  // CURRENT EDITABLE PROFILE
  // ======================================================

  const [profile, setProfile] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
    });

  const [address, setAddress] =
    useState(emptyAddress);

  const [preferences, setPreferences] =
    useState(defaultPreferences);

  // ======================================================
  // LAST SAVED SNAPSHOT
  // Used when user clicks Cancel Editing
  // ======================================================

  const [savedProfile, setSavedProfile] =
    useState({
      firstName: "",
      lastName: "",
      phone: "",
    });

  const [savedAddress, setSavedAddress] =
    useState(emptyAddress);

  const [savedPreferences, setSavedPreferences] =
    useState(defaultPreferences);

  // ======================================================
  // LOAD CLERK + MONGODB USER DATA
  // ======================================================

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) {
      return;
    }

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        setSaveError("");

        const clerkProfile = {
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone:
            user.primaryPhoneNumber?.phoneNumber || "",
        };

        setProfile(clerkProfile);

        const authApi =
          createAuthApi(getToken);

        const response =
          await authApi.get("/api/users/me");

        if (!response.data?.success) {
          throw new Error(
            response.data?.message ||
              "Unable to load saved profile data."
          );
        }

        const mongoUser =
          response.data?.user || {};

        const mongoAddress =
          mongoUser.address || {};

        const mongoPreferences =
          mongoUser.preferences || {};

        const finalProfile = {
          firstName:
            clerkProfile.firstName ||
            mongoUser.firstName ||
            "",

          lastName:
            clerkProfile.lastName ||
            mongoUser.lastName ||
            "",

          phone:
            mongoUser.phone ||
            clerkProfile.phone ||
            "",
        };

        const finalAddress = {
          house:
            mongoAddress.house || "",

          street:
            mongoAddress.street || "",

          city:
            mongoAddress.city || "",

          state:
            mongoAddress.state || "",

          pincode:
            mongoAddress.pincode || "",
        };

        const finalPreferences = {
          bookingUpdates:
            typeof mongoPreferences.bookingUpdates ===
            "boolean"
              ? mongoPreferences.bookingUpdates
              : true,

          offersRecommendations:
            typeof mongoPreferences.offersRecommendations ===
            "boolean"
              ? mongoPreferences.offersRecommendations
              : true,
        };

        // Current editable state
        setProfile(finalProfile);
        setAddress(finalAddress);
        setPreferences(finalPreferences);

        // Last saved snapshot
        setSavedProfile(finalProfile);
        setSavedAddress(finalAddress);
        setSavedPreferences(finalPreferences);
      } catch (error) {
        console.error(
          "Profile fetch failed:",
          error
        );

        setSaveError(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to load saved profile data."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [
    isLoaded,
    isSignedIn,
    user,
    getToken,
  ]);

  // ======================================================
  // PROFILE CHANGE
  // ======================================================

  const handleProfileChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setProfile((current) => ({
      ...current,
      [name]:
        name === "phone"
          ? value
              .replace(/[^\d+()\-\s]/g, "")
              .slice(0, 16)
          : value,
    }));

    setSaved(false);
    setSaveError("");
  };

  // ======================================================
  // ADDRESS CHANGE
  // ======================================================

  const handleAddressChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setAddress((current) => ({
      ...current,
      [name]:
        name === "pincode"
          ? value
              .replace(/\D/g, "")
              .slice(0, 6)
          : value,
    }));

    setSaved(false);
    setSaveError("");
  };

  // ======================================================
  // PREFERENCE CHANGE
  // ======================================================

  const handlePreferenceChange = (
    event
  ) => {
    const {
      name,
      checked,
    } = event.target;

    setPreferences((current) => ({
      ...current,
      [name]: checked,
    }));

    setSaved(false);
    setSaveError("");
  };

  // ======================================================
  // CANCEL EDITING
  // Restores the last successfully saved state
  // ======================================================

  const handleCancelEditing = () => {
    setProfile({
      firstName:
        savedProfile.firstName,

      lastName:
        savedProfile.lastName,

      phone:
        savedProfile.phone,
    });

    setAddress({
      house:
        savedAddress.house,

      street:
        savedAddress.street,

      city:
        savedAddress.city,

      state:
        savedAddress.state,

      pincode:
        savedAddress.pincode,
    });

    setPreferences({
      bookingUpdates:
        savedPreferences.bookingUpdates,

      offersRecommendations:
        savedPreferences.offersRecommendations,
    });

    setIsEditing(false);
    setSaved(false);
    setSaveError("");
  };

  // ======================================================
  // SAVE PROFILE + PHONE + ADDRESS + PREFERENCES
  // ======================================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      setSaveError("");

      if (!user) {
        throw new Error(
          "User profile is not available."
        );
      }

      const authApi =
        createAuthApi(getToken);

      // -----------------------------------------------
      // 1. Update name in Clerk
      // -----------------------------------------------

      await user.update({
        firstName:
          profile.firstName.trim(),

        lastName:
          profile.lastName.trim(),
      });

      // -----------------------------------------------
      // 2. Sync name + phone with MongoDB
      // -----------------------------------------------

      const email =
        user.primaryEmailAddress?.emailAddress ||
        "";

      const syncResponse =
        await authApi.post(
          "/api/users/sync",
          {
            email,

            firstName:
              profile.firstName.trim(),

            lastName:
              profile.lastName.trim(),

            phone:
              profile.phone.trim(),

            avatar:
              user.imageUrl || "",
          }
        );

      if (!syncResponse.data?.success) {
        throw new Error(
          syncResponse.data?.message ||
            "Unable to save profile information."
        );
      }

      // -----------------------------------------------
      // 3. Save address
      // -----------------------------------------------

      const addressResponse =
        await authApi.put(
          "/api/users/address",
          {
            house:
              address.house.trim(),

            street:
              address.street.trim(),

            city:
              address.city.trim(),

            state:
              address.state.trim(),

            pincode:
              address.pincode.trim(),
          }
        );

      if (!addressResponse.data?.success) {
        throw new Error(
          addressResponse.data?.message ||
            "Unable to save address."
        );
      }

      // -----------------------------------------------
      // 4. Save preferences
      // -----------------------------------------------

      const preferencesResponse =
        await authApi.put(
          "/api/users/preferences",
          {
            bookingUpdates:
              preferences.bookingUpdates,

            offersRecommendations:
              preferences.offersRecommendations,
          }
        );

      if (!preferencesResponse.data?.success) {
        throw new Error(
          preferencesResponse.data?.message ||
            "Unable to save account preferences."
        );
      }

      // -----------------------------------------------
      // 5. Backend returned data
      // -----------------------------------------------

      const backendUser =
        syncResponse.data?.user || {};

      const backendAddress =
        addressResponse.data?.address ||
        {};

      const backendPreferences =
        preferencesResponse.data?.preferences ||
        preferences;

      const finalSavedProfile = {
        firstName:
          backendUser.firstName ||
          profile.firstName.trim(),

        lastName:
          backendUser.lastName ||
          profile.lastName.trim(),

        phone:
          backendUser.phone ||
          profile.phone.trim(),
      };

      const finalSavedAddress = {
        house:
          backendAddress.house ||
          address.house.trim(),

        street:
          backendAddress.street ||
          address.street.trim(),

        city:
          backendAddress.city ||
          address.city.trim(),

        state:
          backendAddress.state ||
          address.state.trim(),

        pincode:
          backendAddress.pincode ||
          address.pincode.trim(),
      };

      const finalSavedPreferences = {
        bookingUpdates:
          typeof backendPreferences.bookingUpdates ===
          "boolean"
            ? backendPreferences.bookingUpdates
            : preferences.bookingUpdates,

        offersRecommendations:
          typeof backendPreferences.offersRecommendations ===
          "boolean"
            ? backendPreferences.offersRecommendations
            : preferences.offersRecommendations,
      };

      // Current state
      setProfile(finalSavedProfile);
      setAddress(finalSavedAddress);
      setPreferences(finalSavedPreferences);

      // Update snapshot for future Cancel
      setSavedProfile(finalSavedProfile);
      setSavedAddress(finalSavedAddress);
      setSavedPreferences(finalSavedPreferences);

      setIsEditing(false);
      setSaved(true);
    } catch (error) {
      console.error(
        "Profile save failed:",
        error
      );

      setSaveError(
        error?.response?.data?.message ||
          error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Unable to save profile changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

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

  // ======================================================
  // AUTH
  // ======================================================

  if (!isSignedIn || !user) {
    return (
      <section className="min-h-[70vh] bg-background px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[55vh] max-w-2xl items-center justify-center">
          <Card
            padding="lg"
            className="w-full text-center"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <UserRound size={25} />
            </div>

            <h1 className="mt-5 text-3xl font-extrabold text-primary-900">
              Sign in to view your profile
            </h1>

            <p className="mt-3 text-text-secondary">
              Your personal information and saved
              address are available after signing in.
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

  // ======================================================
  // DERIVED USER DATA
  // ======================================================

  const displayName =
    `${profile.firstName} ${profile.lastName}`.trim() ||
    user.username ||
    user.primaryEmailAddress?.emailAddress?.split(
      "@"
    )[0] ||
    "Customer";

  const email =
    user.primaryEmailAddress?.emailAddress ||
    "No email available";

  const initial =
    displayName
      .charAt(0)
      .toUpperCase() || "C";

  // ======================================================
  // UI
  // ======================================================

  return (
    <section className="min-h-screen bg-background">
      {/* =====================================================
          HEADER
      ====================================================== */}

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
        {/* =====================================================
            HEADING
        ====================================================== */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-accent-600">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-primary-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-text-secondary">
              Manage your personal information, contact details,
              service address, and account preferences.
            </p>
          </div>

          <button
            type="button"
            disabled={
              saving ||
              loadingProfile
            }
            onClick={() => {
              if (isEditing) {
                handleCancelEditing();
                return;
              }

              setIsEditing(true);
              setSaved(false);
              setSaveError("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Edit3 size={17} />

            {isEditing
              ? "Cancel Editing"
              : "Edit Profile"}
          </button>
        </div>

        {/* =====================================================
            PROFILE LOADING
        ====================================================== */}

        {loadingProfile && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-700">
            <LoaderCircle
              size={18}
              className="animate-spin"
            />

            Loading your saved profile data...
          </div>
        )}

        {/* =====================================================
            SUCCESS
        ====================================================== */}

        {saved && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={18} />

            Profile, phone number, address and preferences
            saved successfully.
          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}

        {saveError && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {saveError}
          </div>
        )}

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* =====================================================
              PROFILE OVERVIEW
          ====================================================== */}

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
                      {profile.phone ||
                        "Not added"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* ACCOUNT SHORTCUTS */}

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

          {/* =====================================================
              MAIN DETAILS
          ====================================================== */}

          <div className="space-y-6">
            {/* PERSONAL INFORMATION */}

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
                  onChange={
                    handleProfileChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  placeholder="Enter first name"
                />

                <Input
                  label="Last Name"
                  name="lastName"
                  value={profile.lastName}
                  onChange={
                    handleProfileChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
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
                  onChange={
                    handleProfileChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  type="tel"
                  placeholder="Enter phone number"
                  inputMode="tel"
                />
              </div>

              <p className="mt-4 text-xs leading-5 text-text-muted">
                Email is managed through your Clerk account.
                Phone number is stored in your FixMate MongoDB
                profile.
              </p>
            </Card>

            {/* SERVICE ADDRESS */}

            <Card padding="lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                      <MapPin size={19} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-primary-900">
                        Service Address
                      </h2>

                      <p className="mt-1 text-sm text-text-muted">
                        This address is stored in your FixMate
                        account for faster bookings.
                      </p>
                    </div>
                  </div>
                </div>

                <span className="hidden rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 sm:inline-flex">
                  Saved to account
                </span>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Input
                  label="House / Flat / Building"
                  name="house"
                  value={address.house}
                  onChange={
                    handleAddressChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  placeholder="Enter house / flat / building"
                />

                <Input
                  label="Street / Area"
                  name="street"
                  value={address.street}
                  onChange={
                    handleAddressChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  placeholder="Enter street / area"
                />

                <Input
                  label="City"
                  name="city"
                  value={address.city}
                  onChange={
                    handleAddressChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  placeholder="Enter city"
                />

                <Input
                  label="State"
                  name="state"
                  value={address.state}
                  onChange={
                    handleAddressChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  placeholder="Enter state"
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={
                    handleAddressChange
                  }
                  disabled={
                    !isEditing ||
                    saving ||
                    loadingProfile
                  }
                  placeholder="6-digit pincode"
                  inputMode="numeric"
                  maxLength={6}
                />
              </div>

              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs leading-5 text-blue-800">
                  Your address is loaded from MongoDB and will be
                  available again when you reopen your profile.
                </p>
              </div>
            </Card>

            {/* PREFERENCES */}

            <Card padding="lg">
              <h2 className="text-xl font-bold text-primary-900">
                Account Preferences
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                Choose which FixMate notifications and
                recommendations you want to receive.
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
                    name="bookingUpdates"
                    checked={
                      preferences.bookingUpdates
                    }
                    onChange={
                      handlePreferenceChange
                    }
                    disabled={
                      !isEditing ||
                      saving ||
                      loadingProfile
                    }
                    className="h-5 w-5 rounded border-slate-300 accent-primary-600"
                  />
                </label>

                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-background p-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Offers & recommendations
                    </p>

                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      Receive useful service recommendations and
                      offers.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    name="offersRecommendations"
                    checked={
                      preferences.offersRecommendations
                    }
                    onChange={
                      handlePreferenceChange
                    }
                    disabled={
                      !isEditing ||
                      saving ||
                      loadingProfile
                    }
                    className="h-5 w-5 rounded border-slate-300 accent-primary-600"
                  />
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-xs leading-5 text-text-muted">
                  These preferences are saved to your FixMate
                  MongoDB account and remain available after
                  signing in again.
                </p>
              </div>
            </Card>

            {/* SAVE */}

            {isEditing && (
              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={handleSave}
                  disabled={
                    saving ||
                    loadingProfile
                  }
                >
                  {saving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
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