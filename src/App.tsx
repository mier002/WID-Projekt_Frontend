import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { VegaLite } from "react-vega";
import axios from "axios";
import { VisualizationSpec } from 'vega-embed';

export default function App() {
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

  const handleLocationChange = (event: any) => {
    const location = event.target.value;
    setSelectedLocation(location);
  };

  const handleOptionChange = (event: any) => {
    const option = event.target.value;
    setSelectedOption(option);
  };

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

      <h2>Auswahl Standorte:</h2>
      {/* Selection  Standort */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="location-select-label">Standort auswählen</InputLabel>
        <Select
          labelId="location-select-label"
          id="location-select"
          value={selectedLocation}
          label="Standort auswählen"
          onChange={handleLocationChange}
        >
          <MenuItem value={"Zch_Rosengartenstrasse"}>Rosengartenstrasse</MenuItem>
          <MenuItem value={"Zch_Schimmelstrasse"}>Schimmelstrasse</MenuItem>
          <MenuItem value={"Zch_Stampfenbachstrasse"}>Stampfenbachstrasse</MenuItem>
        </Select>
      </FormControl>

      {/* Selecton Option */}
      <h2>Auswahl Optionen:</h2>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="option-select-label">Option auswählen</InputLabel>
        <Select
          labelId="option-select-label"
          id="option-select"
          value={selectedOption}
          label="Option auswählen"
          onChange={handleOptionChange}
        >
          <MenuItem value={"T"}>Temperatur</MenuItem>
          <MenuItem value={"RainDur"}>Regendauer</MenuItem>
        </Select>
      </FormControl>

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
