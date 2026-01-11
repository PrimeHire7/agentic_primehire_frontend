// Header.jsx
import { useState } from 'react';
import { RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/primehire_logo.png";
import AppSidebar from "../components/AppSidebar/AppSidebar";
import "./Header.css";
import Button from 'react-bootstrap/Button';
import { FaBarsStaggered } from "react-icons/fa6";

const Header = ({ onRefresh }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);
  

  // ----

  const options = [
  {
    name: 'Enable backdrop (default)',
    scroll: false,
    backdrop: true,
  },
  {
    name: 'Disable backdrop',
    scroll: false,
    backdrop: false,
  },
  {
    name: 'Enable body scrolling',
    scroll: true,
    backdrop: false,
  },
  {
    name: 'Enable both scrolling & backdrop',
    scroll: true,
    backdrop: true,
  },
];


  return (
    <div>
    <header className="ph-header">
      <div className="ph-header-inner">

        {/* LEFT — LOGO (unchanged, raw file, no styling) */}
        <Link to="/" className="ph-logo-wrap">
          <img src={logo} alt="PrimeHire" className="ph-logo" />
        </Link>

        {/* RIGHT — ACTION BUTTONS */}
        <div className="ph-header-actions">

          <button className="ph-refresh-btn" onClick={onRefresh}>
            <RefreshCcw className="ph-btn-icon" />
            Refresh
          </button>
           {/* <Button  className="me-2">
        <FaBarsStaggered />
      </Button> */}

          {/* <button className="ph-btn-primary">
            Sign In
          </button> */}
        </div>

      </div>
    </header>
{/* <div className="mobile_menu">


   <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
         <AppSidebar className="test" />

        </Offcanvas.Body>
      </Offcanvas>

</div> */}
</div>
  );
};

export default Header;
