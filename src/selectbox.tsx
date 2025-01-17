import { FormControl, MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

function Selectbox({selectedLocation, setSelectedLocation, selectedOption, setSelectedOption}: { selectedLocation: string, setSelectedLocation: any, selectedOption: string, setSelectedOption: any  }
) {
    const handleLocationChange = (event: any) => {
        const location = event.target.value;
        setSelectedLocation(location);
      };
    
      const handleOptionChange = (event: any) => {
        const option = event.target.value;
        setSelectedOption(option);
      };

return (
    <div>
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
    </div>
)
}
export default Selectbox;