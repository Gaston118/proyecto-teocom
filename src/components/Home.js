import React from 'react'
import { fetchDatos } from "../data/getDatos";
import { useEffect, useState } from "react";
import supabase from "../data/supabaseCliente";
import { DateTime } from "luxon";
import "./Home.css";
import LinesChart from "./LinesChart";
import Swal from 'sweetalert2';

function Home() {
    const [fetchError, setFetchError] = useState(null);
    const [datas, setdata] = useState(null);
    const [datos, setdato] = useState(null);

  const handleInsertChangeW = (payload) => {
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
  if (newDato.temperatura > 50) {
    Swal.fire({
      title: 'Alerta de Temperatura Alta',
      text: `La temperatura es ${newDato.temperatura}°C en el módulo ${newDato.id_modulo}`,
      icon: 'warning',
    });
  }
  if (newDato.humedad < 20) {
    Swal.fire({
      title: 'Alerta de Humedad Baja',
      text: `La humedad es ${newDato.humedad}% en el módulo ${newDato.id_modulo}`,
      icon: 'warning',
    });
  }
  };

  // Función para manejar eventos de actualización
  const handleUpdateChangeW = (payload) => {
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

  const handleInsertChangeL = (payload) => {
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
  setdato((prevDatos) => [...prevDatos, newDato]);
  if (newDato.temperatura > 50) {
    Swal.fire({
      title: 'Alerta de Temperatura Alta',
      text: `La temperatura es ${newDato.temperatura}°C en el módulo ${newDato.id_modulo}`,
      icon: 'warning',
    });
  }
  if (newDato.humedad < 20) {
    Swal.fire({
      title: 'Alerta de Humedad Baja',
      text: `La humedad es ${newDato.humedad}% en el módulo ${newDato.id_modulo}`,
      icon: 'warning',
    });
  }
  };

  const handleUpdateChangeL = (payload) => {
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
    setdato((prevDatos) =>
      prevDatos.map((dato) => {
        if (dato.id === payload.new.id) {
          // Reemplaza el dato anterior con el nuevo dato
          return updatedDato;
        }
        return dato;
      })
    );
  };

  const calculateAverage = (source, ToH) => {
    let data;
    if (source === 'wifi') {
      data = datas;
    } else if (source === 'lora') {
      data = datos;
    } else {
      return null;
    }
  
    if (data && data.length >= 10) {
      const lastTenData = data.slice(-10);
      const sumTemp = lastTenData.reduce((total, data) => total + data[ToH], 0);
      const averageTemp = sumTemp / 10;
      return averageTemp;
    } else {
      return null;
    }
  };
  
  useEffect(() => {
    async function fdeW(){
      const data = await fetchDatos("Datos");

      if (data.error) {
        setFetchError("ERROR EN OBTENCION DE DATOS WIFI");
        setdata(null);
      }
      else{
        console.log(data)
        setdata(data);
        setFetchError(null);
      }
    }
    fdeW();

    async function fdeL(){
      const data = await fetchDatos("Datos_Lora");

      if (data.error) {
        setFetchError("ERROR EN OBTENCION DE DATOS LoRa");
        setdato(null);
      }
      else{
        console.log(data)
        setdato(data);
        setFetchError(null);
      }
    }
   fdeL();


    console.log('Iniciando suscripciones a eventos en Supabase...');

supabase
  .channel('any')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Datos' }, handleInsertChangeW)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Datos' }, handleUpdateChangeW)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Datos_Lora' }, handleInsertChangeL)
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Datos_Lora' }, handleUpdateChangeL)
  .subscribe()
  }, []);
  return (
   <div className='Home'>
    {fetchError ? (<p>{fetchError}</p>) : (
      <>
      <div className='cards'>
      <div className="card-container">
      <div className="card">
      <div className="front-content">
      <p className='heading1'>Temperatura LoRa</p>
      <p className='tempLora'>{calculateAverage('lora', 'temperatura')}°C</p>
      </div>
      <div className="content">
      <p className="heading">Humedad LoRa</p>
      <p className='humLora'>{calculateAverage('lora', 'humedad')}%</p>
      </div>
      </div>
      </div>
      <div className="card-container2">
      <div className="card2">
      <div className="front-content2">
      <p className='heading2'>Temperatura Wifi</p>
      <p className='tempwifi'>{calculateAverage('wifi', 'temperatura')}°C</p>
      </div>
      <div className="content2">
      <p className="heading22">Humedad Wifi</p>
      <p className='humwifi'>{calculateAverage('wifi', 'humedad')}%</p>
      </div>
      </div>
      </div>
      </div>
      <div className='graficos'>
      <div className='lora-graficos'>
      <h3 className='lora-tit'>LoRa</h3>
      {datos && <LinesChart datos={datos.slice(-15)} />}
      </div>
      <div className='wifi-graficos'>
      <h3 className='wifi-tit'>Wifi</h3>
      {datas && <LinesChart datos={datas.slice(-15)} />}
      </div>
      </div>
      </>
    )}
   </div>
  );
}

export default Home
