import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
// import Apply from "./pages/Apply";
 

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                {/* <Route path="/apply" element={<Apply />} /> */}
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);
