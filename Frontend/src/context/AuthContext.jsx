import React, { createContext, useContext, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";

const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const HAS_CLERK = Boolean(CLERK_KEY && (CLERK_KEY.startsWith("pk_test_") || CLERK_KEY.startsWith("pk_live_")));

const AuthContext = createContext(null);

function LocalAuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("resumate_user");
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });
    const [loading, setLoading] = useState(false);

    const signIn = async (email, password) => {
        setLoading(true);
        const newUser = { id: "user_" + Date.now(), email, fullName: email.split("@")[0] };
        setUser(newUser);
        localStorage.setItem("resumate_user", JSON.stringify(newUser));
        setLoading(false);
        return { user: newUser, error: null };
    };

    const signUp = async (email, password, fullName) => {
        setLoading(true);
        const newUser = { id: "user_" + Date.now(), email, fullName: fullName || email.split("@")[0] };
        setUser(newUser);
        localStorage.setItem("resumate_user", JSON.stringify(newUser));
        setLoading(false);
        return { user: newUser, error: null };
    };

    const signOut = async () => {
        setUser(null);
        localStorage.removeItem("resumate_user");
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

function ClerkAuthProvider({ children }) {
    const { isLoaded, isSignedIn, user: clerkUser } = useUser();
    const { signOut: clerkSignOut } = useClerk();

    const user = isSignedIn && clerkUser ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || "user@resumate.ai",
        fullName: clerkUser.fullName || clerkUser.firstName || clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] || "User",
        imageUrl: clerkUser.imageUrl,
    } : null;

    const value = {
        user,
        loading: !isLoaded,
        signIn: async () => {},
        signUp: async () => {},
        signOut: async () => clerkSignOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function AuthProvider({ children }) {
    if (HAS_CLERK) {
        return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
    }
    return <LocalAuthProvider>{children}</LocalAuthProvider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
