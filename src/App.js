import React from "react";
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import DatosWifi from "./data/datosWifi";
import DatosLora from "./data/datosLora";
import Home from "./components/Home";
import "./App.css"
import Imagen from './simbolo-blanco.png';


function App(){
  

  return(
    <div className="App">
      <BrowserRouter>
        <nav>
          <img src={Imagen} alt="Mi Icono" />
          <h1>Teoria de las Comunicaciones</h1>
          <div className="iconos">
          <Link to="/" className="nav"><span className="material-symbols-outlined">home</span></Link>
          <Link to="/data/datosWifi" className="nav"><span className="material-symbols-outlined">wifi</span></Link>
          <Link to="/data/datosLora" className="nav"><span className="material-symbols-outlined">wifi_tethering</span></Link> 
          </div>
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