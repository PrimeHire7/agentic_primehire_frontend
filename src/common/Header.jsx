// import React from "react";
// import { Button } from "@/components/ui/button";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { RefreshCcw } from "lucide-react";
// import { Link } from "react-router-dom";
// import logo from "@/assets/primehire_logo.png";
// import "./Header.css";

// const Header = ({ onRefresh }) => {
//   return (
//     <header className="header">
//       <div className="header-container">
//         {/* Left side: Sidebar + Logo */}
//         <div className="header-left">
//           <SidebarTrigger />
//           <Link to={"/"} className="logo-link">
//             <img src={logo} alt="PrimeHire" className="logo" />
//           </Link>
//         </div>

//         {/* Right side: Refresh + Sign-in */}
//         <div className="header-right">
//           <Button
//             variant="outline"
//             size="sm"
//             className="refresh-button"
//             onClick={onRefresh}
//           >
//             <RefreshCcw className="refresh-icon" />
//             Refresh Chat
//           </Button>

//           <Button variant="default" size="sm" className="signin-button">
//             Sign in
//           </Button>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/primehire_logo.png";
import "./Header.css";

const Header = ({ onRefresh }) => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Left side: Sidebar + Logo */}
        <div className="header-left">
          <SidebarTrigger />
          <Link to={"/"} className="logo-link">
            <img src={logo} alt="PrimeHire" className="logo" />
          </Link>
        </div>

        {/* Right side: Refresh + Sign-in */}
        <div className="header-right">
          <Button
            variant="outline"
            size="sm"
            className="refresh-button"
            onClick={onRefresh}
          >
            <RefreshCcw className="refresh-icon" />
            Refresh Chat
          </Button>

          <Button variant="default" size="sm" className="signin-button">
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
