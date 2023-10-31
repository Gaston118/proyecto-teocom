import React from "react";
import supabase from "./supabaseCliente";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import LinesChart from "../components/LinesChart";
import CustomTable from "../components/CustomTable";
import { fetchDatos } from "./getDatos";
import "./datosWifi.css";



function DatosWifi(){
    const [fetchError, setFetchError] = useState(null);
    const [Datos, setDatos] = useState(null);
    const [usuarios, setUsuarios]= useState([]);
    const [busqueda, setBusqueda]= useState("");
    const [isSearching, setIsSearching] = useState(false);

    const filtrar = (terminoBusqueda) => {
      if (terminoBusqueda.trim() === "") {
        // Si el campo de búsqueda está vacío, muestra la tabla original sin filtro
        setUsuarios(Datos.slice(-10));
        setIsSearching(false);
      } else {
        const resultadosBusqueda = Datos.filter((elemento) => {
          return elemento.id_modulo.toString() === terminoBusqueda;
        });
        setUsuarios(resultadosBusqueda);
        setIsSearching(true);
      }
    };    

    const handleChange=e=>{
      setBusqueda(e.target.value);
      filtrar(e.target.value);
    }

  // Función para manejar eventos de inserción
  const handleInsertChange = (payload) => {
    console.log('Insert change received!', payload);
    // Formatear la hora y convertirla al horario de Argentina (GMT-3)
  const newDato = {
    ...payload.new,
    time: DateTime.fromISO(payload.new.time, { zone: "utc" })
      .setZone("America/Argentina/Buenos_Aires")
      .toLocaleString(DateTime.TIME_SIMPLE),
    date: DateTime.fromISO(payload.new.time, { zone: "utc" })
      .setZone("America/Argentina/Buenos_Aires")
      .toLocaleString(DateTime.DATE_FULL),
  };
  // Actualiza el estado local de Datos con la nueva inserción
  setDatos((prevDatos) => [...prevDatos, newDato]);
  setUsuarios((prevDatos)=>[...prevDatos, newDato].slice(-10));

  };

  // Función para manejar eventos de actualización
  const handleUpdateChange = (payload) => {
    console.log("Update change received!", payload);
    // Formatear la hora y convertirla al horario de Argentina (GMT-3)
    const updatedDato = {
      ...payload.new,
      time: DateTime.fromISO(payload.new.time, { zone: "utc" })
        .setZone("America/Argentina/Buenos_Aires")
        .toLocaleString(DateTime.TIME_SIMPLE),
      date: DateTime.fromISO(payload.new.time, { zone: "utc" })
        .setZone("America/Argentina/Buenos_Aires")
        .toLocaleString(DateTime.DATE_FULL),
    };
    // Actualiza el estado local de Datos con los cambios
    setDatos((prevDatos) =>
      prevDatos.map((dato) => {
        if (dato.id === payload.new.id) {
          // Reemplaza el dato anterior con el nuevo dato
          return updatedDato;
        }
        return dato;
      })
    );
  };

  useEffect(() => {
    async function fd(){
      const data = await fetchDatos("Datos");

      if (data.error) {
        setFetchError("ERROR EN OBTENCION DE DATOS");
        setDatos(null);
        setUsuarios(null);
      }
      else{
        console.log(data)
        setDatos(data);
        setUsuarios(data.slice(-10));
        setFetchError(null);
      }

    }

    fd();
    console.log('Iniciando suscripciones a eventos en Supabase...');

supabase
  .channel('any')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Datos' }, handleInsertChange)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Datos' }, handleUpdateChange)
  .subscribe()

  }, []);

  return (
    <div className="datosWifi">
      {fetchError ? (
        <p>{fetchError}</p>
      ) : (
        <div>
          <div className="container">
            <h2 className="wifi-title">Wifi</h2>
            <div className="containerInput">
            <input
            className="form-control inputBuscar"
            value={busqueda}
            placeholder="Búsqueda por ID modulo"
            onChange={handleChange}
            />
            </div>
            </div>
          <div>
          {usuarios && usuarios.length > 0 ? ( 
            <CustomTable data={usuarios} /> 
          ) : ( 
            <p>No data to display</p> 
          )} 
     </div>
     {Datos && <LinesChart datos={isSearching ? usuarios : Datos.slice(-48)} />}
        </div>
      )}
    </div>
  );
}

export default DatosWifi;