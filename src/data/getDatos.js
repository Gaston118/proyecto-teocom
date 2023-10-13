import supabase from "./supabaseCliente";
import { DateTime } from "luxon";

export async function fetchDatos(tabla){
  
    const { data, error } = await supabase
    .from(tabla)
    .select("*")

      if (error) {
        console.log(error);
        return(error)
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
      console.log("La base de datos está vacía");
      return { error: "La base de datos está vacía" };
    } 
      console.log(datosConHoraFechaArg)
      return datosConHoraFechaArg;
      }
};