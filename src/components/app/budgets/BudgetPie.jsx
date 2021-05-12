import React from "react";
import { Bar } from "react-chartjs-2";
import randomRgba from "../../../helpers/randomRgba";

export default function BudgetPie({ fluxes }) {
  const dataPie = formatData(fluxes);

  function formatData(fluxes) {
    let labels = [];
    let data = [];
    let backgroundColor = [];
    let hoverBackgroundColor = [];
    for (const flux of fluxes) {
      labels = [...labels, flux.name];
      data = [...data, flux.value];
      backgroundColor = [...backgroundColor, randomRgba()];
      hoverBackgroundColor = [...hoverBackgroundColor, randomRgba()];
    }
    return {
      labels,
      datasets: [
        {
          label: "Fluxes",
          backgroundColor,
          hoverBackgroundColor,
          data,
        },
      ],
    };
  }

  return (
    <>
      <Bar data={dataPie} />
    </>
  );
}
