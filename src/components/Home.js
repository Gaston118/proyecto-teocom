import React from 'react'
import { fetchDatos } from "../data/getDatos";
import { useEffect, useState } from "react";
import supabase from "../data/supabaseCliente";
import { DateTime } from "luxon";

function Home() {
    const [fetchError, setFetchError] = useState(null);
  const [datas, setdata] = useState(null);

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
  setdata((prevDatos) => [...prevDatos, newDato]);
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
    setdata((prevDatos) =>
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
    async function fde(){
      const data = await fetchDatos("Datos");

      if (data.error) {
        setFetchError("ERROR EN OBTENCION DE DATOS");
        setdata(null);
      }
      else{
        console.log(data)
        setdata(data);
        setFetchError(null);
      }

    }
    fde();
console.log('Iniciando suscripciones a eventos en Supabase...');

supabase
  .channel('any')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Datos' }, handleInsertChange)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Datos' }, handleUpdateChange)
  .subscribe()
  }, []);
  return (
    <></>
  )
}

export default Home