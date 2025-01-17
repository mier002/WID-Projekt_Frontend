import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { VegaLite } from "react-vega";
import axios from "axios";
import { VisualizationSpec } from 'vega-embed';
import Selectbox from "./selectbox.tsx";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [showChart, setShowChart] = useState(false);


  // Verscheidene URL für Bearbeitung localhost:8000 oder direkt auf URL
  //const URL_METEO="http://127.0.0.1:8000/api/"
  const URL_METEO="https://wid-projekt-backend.onrender.com/api/"

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(URL_METEO+"py/meteodaten");
        setData(response.data);
      } catch (error) {
        console.error("Fehler beim Laden der JSON-Daten:", error);
      }
    };

    fetchData();
  }, []);

  const handleShowChart = () => {
    if (selectedLocation && selectedOption) {
      const locationData = data.filter((item) => item["Standort"] === selectedLocation);
      const mappedData = locationData.map((item) => ({
        date: new Date(item["Datum"]).toISOString().split("T")[0],
        value: item[selectedOption],
      }));
      
      setFilteredData(mappedData);
      
      setShowChart(true);
    } else {
      setShowChart(false);
    }
  };

  const handleReset = () => {
    setSelectedLocation(""); 
    setSelectedOption(""); 
    setFilteredData([]); 
    setShowChart(false); 
  };

  const chartSpec: VisualizationSpec= {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    description: "Gefilterte Daten im Diagramm",
    data: { values: filteredData },
    mark: "line",
    encoding: {
      x: { field: "date", type: "temporal", title: "Datum" }, 
      y: { field: "value", type: "quantitative", title: selectedOption === "T" ? "Temperatur (°C)" : "Regendauer (min)" }, 
    },
  };

  return (
    <Box sx={{ p: 4 }}>
      <h1>WID-project from 17.01.2025 (Erci Micha)</h1>
      <div> In diesem App können anhand der Metodaten von 2023 verscheidene Abfrage getätigt werden und diese durch das betätigen des Button in einer Grafik angezeigt werden.
        Damit die Grafik angezeigt werden kann, müssen beide Selektionsboxxen ausgefüsllt werden. In der ersten Box kann zwischen drei Standorten in Zürich ausgewählt werden.
        In der zweiten Box ob einem die Regen- oder Temperaturdaten intressiert. Mit der Button Zurücksetzten können die Eingabedaten gelöscht werden und mit dem anderen Button
        die Grafik eingeblendet werden. 
      </div>

      <Selectbox selectedLocation={selectedLocation} selectedOption={selectedOption} setSelectedLocation={setSelectedLocation} setSelectedOption={setSelectedOption}></Selectbox>
      
      {/* Button */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button variant="contained" onClick={handleShowChart}>
          Diagramm anzeigen
        </Button>
        <Button variant="contained" onClick={handleReset}>
          Zurücksetzen
        </Button>
      </Box>

      {/* Diagramm  */}
      {showChart && Object.keys(filteredData).length && <VegaLite spec={chartSpec} />}
    </Box>
  );
}

export default App;