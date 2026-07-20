import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { setClerkTokenGetter } from "../api/axiosClient";

export default function ClerkAuthAdapter({ children }) {
  try {
    const { getToken } = useAuth();
    useEffect(() => {
      if (getToken) {
        setClerkTokenGetter(getToken);
      }
    }, [getToken]);
  } catch (e) {
    console.warn("ClerkAuthAdapter: Clerk context not active.", e.message);
  }

  return children;
}
