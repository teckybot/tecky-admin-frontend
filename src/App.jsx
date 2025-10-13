import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import "./App.css";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import AddPositions from "./Pages/AddPositions"; 


function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/add-positions" element={<AddPositions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
