import React from "react";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import DatosWifi from "./data/datosWifi";
import DatosLora from "./data/datosLora";
import Home from "./components/Home";
import "./App.css"

function App(){
  

  return(
    <div className="App">
      <BrowserRouter>
        <nav>
          <h1>Teoria de las comunicaciones</h1>
          <Link to="/" className="nav"><span class="material-symbols-outlined">home</span></Link>
          <Link to="/data/datosWifi" className="nav"><span class="material-symbols-outlined">wifi</span></Link>
          <Link to="/data/datosLora" className="nav"><span class="material-symbols-outlined">wifi_tethering</span></Link> 
        </nav>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/data/datosLora" element={<DatosLora/>} /> 
          <Route path="/data/datosWifi" element={<DatosWifi />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;