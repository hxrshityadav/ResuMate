import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

function Root() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-[var(--bg)] transition-colors duration-300">
            <Navbar />
            <Outlet />
        </div>
    );
}

export default Root;
