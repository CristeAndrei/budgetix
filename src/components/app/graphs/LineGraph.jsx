import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { database } from "../../../firebase";
import moment from "moment";
import { Line } from "react-chartjs-2";
import randomRgba from "../../../helpers/randomRgba";
import Message from "../../utils/Message";
import LoadingScreen from "../../utils/LoadingScreen";

export default function LineGraph({ graph }) {
  const [fluxesGraph, setFluxesGraph] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (graph.fluxList && graph.fluxList.length > 0) {
      (async () => {
        setLoading(true);
        try {
          const linesQuerySnapshot = await database.lines
            .where("fluxId", "in", graph.fluxList)
            .orderBy("createdAt")
            .get();

          const linesDocs = linesQuerySnapshot.docs;

          let chartData = {
            labels: [],
            datasets: [
              {
                label: `Balance Change`,
                data: [0],
                fill: false,
                backgroundColor: randomRgba(),
                borderColor: randomRgba(),
              },
              {
                label: "Balance",
                data: [0],
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
              },
            ],
          };

          const verifyDate = (() => {
            switch (graph.timeFormat) {
              case "days":
                return (prevCreatedAt, createdAt) => {
                  return (
                    prevCreatedAt.getDate() === createdAt.getDate() &&
                    prevCreatedAt.getMonth() === createdAt.getMonth() &&
                    prevCreatedAt.getFullYear() === createdAt.getFullYear()
                  );
                };
              case "months":
                return (prevCreatedAt, createdAt) => {
                  return (
                    prevCreatedAt.getMonth() === createdAt.getMonth() &&
                    prevCreatedAt.getFullYear() === createdAt.getFullYear()
                  );
                };

              case "years":
                return (prevCreatedAt, createdAt) => {
                  return (
                    prevCreatedAt.getFullYear() === createdAt.getFullYear()
                  );
                };
              default:
                break;
            }
          })();

          const getLabel = (() => {
            switch (graph.timeFormat) {
              case "days":
                return (createdAt) => {
                  return moment(createdAt).format("Do MMMM YYYY");
                };
              case "months":
                return (createdAt) => {
                  return moment(createdAt).format("MMMM yyyy");
                };

              case "years":
                return (createdAt) => {
                  return moment(createdAt).format("yyyy");
                };
              default:
                break;
            }
          })();

          let prevCreatedAt = new Date(
            linesDocs[0].data().createdAt.toMillis()
          );

          chartData.labels = [...chartData.labels, getLabel(prevCreatedAt)];

          let index = 0;

          for (const lineDoc of linesDocs) {
            const line = lineDoc.data();
            const createdAt = new Date(line.createdAt.toMillis());
            if (verifyDate(prevCreatedAt, createdAt)) {
              chartData.datasets[0].data[index] += line.value;
              chartData.datasets[1].data[index] += line.value;
            } else {
              chartData.labels = [
                ...chartData.labels,
                getLabel(line.createdAt.toMillis()),
              ];

              chartData.datasets[0].data = [
                ...chartData.datasets[0].data,
                line.value,
              ];

              chartData.datasets[1].data = [
                ...chartData.datasets[1].data,
                chartData.datasets[1].data[index] + line.value,
              ];
              index++;
            }
            prevCreatedAt = createdAt;
          }

          setFluxesGraph(chartData);
        } catch (err) {
          setError("Something went wrong with the graph");
          console.log(err);
        }
        setLoading(false);
      })();
    }
  }, [graph]);

  const options = {
    scales: {
      yAxes: [
        {
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-1",
        },
        {
          type: "linear",
          display: true,
          position: "right",
          id: "y-axis-2",
          gridLines: {
            drawOnArea: false,
          },
        },
      ],
    },
  };

  if (!graph.fluxList) return <span>Loading</span>;

  return (
    <>
      <Typography align="center" variant="h6">
        Graph
        <div>
          {graph.fluxList.length > 0 && (
            <Line data={fluxesGraph} options={options} />
          )}
        </div>
      </Typography>
      {error && (
        <Message
          type="error"
          text={error}
          onCloseCo={() => setError("")}
          vertical="top"
          horizontal="center"
        />
      )}
      {loading && <LoadingScreen open={loading} />}
    </>
  );
}
