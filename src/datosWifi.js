import React from "react";
import supabase from "./supabaseCliente";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import LinesChart from "./LinesChart";

function DatosWifi(){
    const [fetchError, setFetchError] = useState(null);
    const [Datos, setDatos] = useState(null);

  // Función para manejar eventos de inserción
  const handleInsertChange = (payload) => {
    console.log('Insert change received!', payload);
    // Actualiza el estado local de Datos con la nueva inserción
    setDatos((prevDatos) => [...prevDatos, payload.new]);
  };

  // Función para manejar eventos de actualización
  const handleUpdateChange = (payload) => {
    console.log('Update change received!', payload);
    // Actualiza el estado local de Datos con los cambios
    setDatos((prevDatos) =>
      prevDatos.map((dato) => {
        if (dato.id === payload.new.id) {
          // Reemplaza el dato anterior con el nuevo dato
          return payload.new;
        }
        return dato;
      })
    );
  };

  useEffect(() => {
    const fetchDatos = async () => {
    const { data, error } = await supabase.from("Datos").select("*");

      if (error) {
        setFetchError("ERROR EN OBTENCION DE DATOS");
        setDatos(null);
        console.log(error);
      }
      if (data) {
        // Formatear la hora y convertirla al horario de Argentina (GMT-3)
        const datosConHoraArg = data.map((dato) => ({
          ...dato,
          time: DateTime.fromISO(dato.time, { zone: "utc" })
            .setZone("America/Argentina/Buenos_Aires")
            .toLocaleString(DateTime.TIME_SIMPLE),
        }));
        setDatos(datosConHoraArg);
        setFetchError(null);
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
          <h3>Datos WIFI:</h3>
          <ul>
            {Datos &&
              Datos.map((dato) => (
                <li key={dato.id}>
                  <strong>ID:</strong> {dato.id}, <strong>Time:</strong> {dato.time},{" "}
                  <strong>Temperatura:</strong> {dato.temperatura},{" "}
                  <strong>Humedad:</strong> {dato.humedad},{" "}
                  <strong>ID Módulo:</strong> {dato.id_modulo}
                </li>
              ))}
          </ul>
          {Datos && <LinesChart datos={Datos} />}
        </div>
      )}
    </div>
  );
}

export default DatosWifi;