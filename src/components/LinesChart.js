// Componente LineChart.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);


export default function LinesChart({ datos }) {
  const [chartDataT, setChartDataT] = useState(null);
  const [chartDataH, setChartDataH] = useState(null);

  useEffect(() => {
    if (datos && Array.isArray(datos)) {
      // Extraer etiquetas de tiempo y datos de temperatura
      const labels = datos.map((dato) => dato.time);
      const temperaturaData = datos.map((dato) => dato.temperatura);

      // Crear el objeto de datos del gráfico
      const chartDataT = {
        labels: labels,
        datasets: [
          {
            label: "Temperatura",
            data: temperaturaData,
            tension: 0.5,
            fill: true,
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
            pointRadius: 5,
            pointBorderColor: "rgba(255, 99, 132)",
            pointBackgroundColor: "rgba(255, 99, 132)",
          },
        ],
      };

      const humedadData = datos.map((dato) => dato.humedad);
      const chartDataH = {
        labels: labels,
        datasets: [
          {
            label: "Humedad",
            data: humedadData,
            tension: 0.5,
            fill: true,
            borderColor: "rgb(128, 191, 255)",
            backgroundColor: "rgba(128, 191, 255, 0.5)",
            pointRadius: 5,
            pointBorderColor: "rgba(128, 191, 255)",
            pointBackgroundColor: "rgba(128, 191, 255)",
          },
        ],
      };


      setChartDataT(chartDataT);
      setChartDataH(chartDataH);
    }
  }, [datos]);

  const options = {
    scales: {
      y: {
        min: 0,
      },
      x: {
        ticks: {
          color: "rgb(255, 99, 132)",
        },
      },
    },
  };

  return (
    <div className="line-chart">
      {chartDataT && <Line data={chartDataT} options={options} />}
      {chartDataH && <Line data={chartDataH} options={options} />}
    </div>
  );
}
