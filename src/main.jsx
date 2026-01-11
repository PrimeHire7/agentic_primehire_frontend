// // import React from "react";
// // import ReactDOM from "react-dom/client";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import App from "./App";
// // import "./global.css";

// // // import Apply from "./pages/Apply";


// // ReactDOM.createRoot(document.getElementById("root")).render(
// //     <React.StrictMode>
// //         <BrowserRouter>
// //             <Routes>
// //                 <Route path="/" element={<App />} />
// //                 {/* <Route path="/apply" element={<Apply />} /> */}
// //             </Routes>
// //         </BrowserRouter>
// //     </React.StrictMode>
// // );
// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';


// import "@/styles/global.css";
// // import "@/styles/chat-layout.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
