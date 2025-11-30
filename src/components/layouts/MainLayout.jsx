import React from "react";
import Header from "@/common/Header";
import "./MainLayout.css";

export default function MainLayout({ children }) {
    return (
        <div className="main-layout">

            {/* FIXED TOP HEADER */}
            <Header />

            {/* MAIN BODY BELOW THE HEADER */}
            <div className="main-body">
                {children}
            </div>
        </div>
    );
}
