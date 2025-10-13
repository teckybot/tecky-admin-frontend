import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // ✅ import these
import "./App.css";
import Home from "./Pages/Home"; // ✅ make sure you have a Home component
import Navbar from "./Components/Navbar";


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ route to Home page */}
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
