// Header.jsx
import React from "react";
import { RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/primehire_logo.png";
import "./Header.css";

const Header = ({ onRefresh }) => {
  return (
    <header className="ph-header">
      <div className="ph-header-inner">

        {/* LEFT — LOGO (unchanged, raw file, no styling) */}
        <Link to="/" className="ph-logo-wrap">
          <img src={logo} alt="PrimeHire" className="ph-logo" />
        </Link>

        {/* RIGHT — ACTION BUTTONS */}
        <div className="ph-header-actions">

          <button className="ph-btn-outline" onClick={onRefresh}>
            <RefreshCcw className="ph-btn-icon" />
            Refresh
          </button>

          <button className="ph-btn-primary">
            Sign In
          </button>

        </div>

      </div>
    </header>
  );
};

export default Header;
