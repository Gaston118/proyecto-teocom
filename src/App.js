import React from "react";
import LinesChart from "./components/LinesChart";
import { fetchDatos } from "./data/getDatos";
import { useEffect, useState } from "react";

function App(){
  const [fetchError, setFetchError] = useState(null);
  const [datas, setdata] = useState(null);
  
  useEffect(() => {
    async function fde(){
      const data = await fetchDatos();

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
  }, []);

  return(
    <div className="App">
      {fetchError ? (<p>{fetchError}</p>): (datas && <LinesChart datos={datas} />)}
    </div>
  );
}

export default App;