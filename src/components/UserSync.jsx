import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const UserSync = () => {
  const {
    isLoaded,
    isSignedIn,
    getToken,
  } = useAuth();

  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;

    const syncUser = async () => {
      console.log("FixMate Customer auth state:", {
        isLoaded,
        isSignedIn,
        hasUser: Boolean(user),
        userId: user?.id || null,
      });

      if (!isLoaded) {
        return;
      }

      if (!isSignedIn || !user) {
        console.log(
          "FixMate Customer: user is not signed in. Skipping sync."
        );
        return;
      }

      try {
        let token = null;

        // Clerk token can occasionally take a moment
        // to become available after the session is restored.
        for (let attempt = 1; attempt <= 3; attempt++) {
          token = await getToken();

          console.log(
            `FixMate Customer token attempt ${attempt}:`,
            Boolean(token)
          );

          if (token || cancelled) {
            break;
          }

          await sleep(1000);
        }

        if (cancelled) {
          return;
        }

        if (!token) {
          console.error(
            "FixMate Customer: Clerk token is unavailable."
          );

          return;
        }

        const email =
          user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses?.[0]?.emailAddress ||
          "";

        const response = await axios.post(
          `${API_BASE_URL}/api/users/sync`,
          {
            email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone:
              user.primaryPhoneNumber?.phoneNumber ||
              "",
            avatar: user.imageUrl || "",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        console.log(
          "FixMate Customer user sync success:",
          response.data
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "FixMate Customer user sync failed:",
          error?.response?.data ||
            error?.message ||
            error
        );
      }
    };

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [
    isLoaded,
    isSignedIn,
    user,
    getToken,
  ]);

  return null;
};

export default UserSync;