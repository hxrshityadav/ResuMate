import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PageMotion } from "../components/PageMotion";

function Root() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [location.pathname]);

    return (
        <div className={`${location.pathname === "/" ? "" : "resumate-shell"} min-h-screen bg-[var(--bg)] transition-colors duration-300`}>
            {location.pathname !== "/" && <Navbar />}
            <PageMotion routeKey={location.pathname}>
                <Outlet />
            </PageMotion>
        </div>
    );
}

export default Root;
