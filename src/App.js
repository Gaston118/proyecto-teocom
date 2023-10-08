import supabase from "./supabaseCliente";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

const App = () => {
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
    const insertSubscription = supabase
      .channel('any')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Datos' }, handleInsertChange)
      .subscribe();

    // Suscribirte a eventos de actualización
    const updateSubscription = supabase
      .channel('any')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'Datos' }, handleUpdateChange)
      .subscribe();

    // Limpia las suscripciones cuando el componente se desmonta
    return () => {
      insertSubscription.unsubscribe();
      updateSubscription.unsubscribe();
    };

  }, []);

  return (
    <div className="app">
      {fetchError ? (
        <p>{fetchError}</p>
      ) : (
        <div>
          <h3>Datos obtenidos:</h3>
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
        </div>
      )}
    </div>
  );
};

export default App;

