import { useEffect } from "react";

import {
  useAuth,
  useUser,
} from "@clerk/react";

import { createAuthApi } from "../api/api";

const UserSync = () => {
  const { isLoaded, isSignedIn, getToken } =
    useAuth();

  const { user } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (
        !isLoaded ||
        !isSignedIn ||
        !user
      ) {
        return;
      }

      try {
        const authApi =
          createAuthApi(getToken);

        const primaryEmail =
          user.primaryEmailAddress
            ?.emailAddress || "";

        const response =
          await authApi.post(
            "/api/users/sync",
            {
              email: primaryEmail,
              firstName:
                user.firstName || "",
              lastName:
                user.lastName || "",
              phone:
                user.primaryPhoneNumber
                  ?.phoneNumber || "",
              avatar:
                user.imageUrl || "",
            }
          );

        console.log(
          "FixMate user sync:",
          response.data
        );
      } catch (error) {
        console.error(
          "FixMate user sync failed:",
          error?.response?.data ||
            error.message
        );
      }
    };

    syncUser();
  }, [
    isLoaded,
    isSignedIn,
    user,
    getToken,
  ]);

  return null;
};

export default UserSync;