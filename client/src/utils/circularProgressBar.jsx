import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

// Enregistrement des éléments pour Chart.js
Chart.register(ArcElement, Tooltip, Legend);

function CircularProgressBar({ percentage }) {
  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage], // Pourcentage d'utilisateurs et reste
        backgroundColor: ["#f05454", "#e0e0e0"], // Couleurs: vert pour l'usage, gris pour le reste
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "70%", // Pour rendre le cercle un anneau
    plugins: {
      tooltip: { enabled: false }, // Désactiver les infobulles
    },
    responsive: true,
  };

  return (
    <div
      style={{
        position: "relative",
        width: "200px",
        height: "200px",
        margin: "auto",
      }}
    >
      <Doughnut data={data} options={options} />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", // Centre horizontalement et verticalement
          fontSize: "25px",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {percentage}%
      </div>
    </div>
  );
}

export default CircularProgressBar;
