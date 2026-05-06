import { useContext } from "react";
import { UserSessionContext } from "./userContext";

export const useUserSession = () => {
  const context = useContext(UserSessionContext);

  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider.");
  }

  return context;
};
