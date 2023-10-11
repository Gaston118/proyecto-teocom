import React from "react";
import supabase from "./supabaseCliente";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import LinesChart from "../components/LinesChart";
import CustomTable from "../components/CustomTable";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function DatosWifi(){
    const [fetchError, setFetchError] = useState(null);
    const [Datos, setDatos] = useState(null);
    const [usuarios, setUsuarios]= useState([]);
    const [busqueda, setBusqueda]= useState("");

    const filtrar = (terminoBusqueda) => {
      if (terminoBusqueda.trim() === "") {
        // Si el campo de búsqueda está vacío, muestra la tabla original sin filtro
        setUsuarios(Datos.slice(-10));
      } else {
        const resultadosBusqueda = Datos.filter((elemento) => {
          return elemento.id_modulo.toString() === terminoBusqueda;
        });
        setUsuarios(resultadosBusqueda);
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
    const fetchDatos = async () => {
    const { data, error } = await supabase
    .from("Datos")
    .select("*")

      if (error) {
        setFetchError("ERROR EN OBTENCION DE DATOS");
        setDatos(null);
        setUsuarios(null);
        console.log(error);
      }
      if (data) {
       // Formatear la hora y convertirla al horario de Argentina (GMT-3)
    const datosConHoraFechaArg = data.map((dato) => ({
      ...dato,
      time: DateTime.fromISO(dato.time, { zone: "utc" })
        .setZone("America/Argentina/Buenos_Aires")
        .toLocaleString(DateTime.TIME_SIMPLE),
      date: DateTime.fromISO(dato.time, { zone: "utc" })
        .setZone("America/Argentina/Buenos_Aires")
        .toLocaleString(DateTime.DATE_FULL),
    }));
    if (datosConHoraFechaArg.length === 0) {
      setFetchError("La base de datos está vacía");
      setDatos(null);
      setUsuarios(null);
    } else {
      console.log(datosConHoraFechaArg)
      setDatos(datosConHoraFechaArg);
      setUsuarios(datosConHoraFechaArg.slice(-10));
      setFetchError(null);
    }
      }
    };

    fetchDatos();

    console.log('Iniciando suscripciones a eventos en Supabase...');

    // Suscribirte a eventos de inserción 

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
          <div className="containerInput">
        <input
          className="form-control inputBuscar"
          value={busqueda}
          placeholder="Búsqueda por ID"
          onChange={handleChange}
        />
        <button className="btn btn-success">
          <FontAwesomeIcon icon={faSearch}/>
        </button>
      </div>
          <h3>Datos WIFI:</h3>
          <div>
          {usuarios && usuarios.length > 0 ? ( 
            <CustomTable data={usuarios} /> 
          ) : ( 
            <p>No data to display</p> 
          )} 
     </div>
          {Datos && <LinesChart datos={Datos} />}
        </div>
      )}
    </div>
  );
}

export default DatosWifi;