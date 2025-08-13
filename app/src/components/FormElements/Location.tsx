import { FC, useState } from "react";
import InputField from "./components/InputField";
import { elements_type } from "./constants";
import { activeLanguageData, updateTranslationData } from "./formTranslations";
import OpenLayersMap from "../../containers/map/OpenLayersMap";
import { Slider, Stack, Typography } from "@mui/material";
import FormElementPreviewContainer from "./FormElementPreviewContainer";
import FormLabel from "./components/FormLabel";

interface TextProps {
  onChange: (data: any, api_call: boolean) => void; // Pass api_call as a second argument
  formElement: any;
  activeLanguage: string;
  collapse: any;
}

const Location: FC<TextProps> = ({
  onChange,
  formElement,
  activeLanguage,
  collapse,
}) => {
  const [data, setData] = useState({
    input_type: elements_type.LOCATION,
    ...formElement,
  });

  const [apiCall, setApiCall] = useState(true); // State to track if API should be called

  // Handle changes in the title field
  const handleChange = (label: string, value: any) => {
    const updatedData = updateTranslationData(
      data,
      label,
      elements_type.LOCATION,
      value,
      activeLanguage
    );
    setData(updatedData);
    onChange(updatedData, apiCall); // Pass apiCall state to the parent
  };

  function getActiveLanguageData(key: string) {
    return activeLanguageData(data, activeLanguage, key);
  }

  const isExpanded = collapse === formElement.id;
  return (
    <>
      {!isExpanded && (
        <FormElementPreviewContainer>
          <Typography variant="subtitle1" gutterBottom>
            {getActiveLanguageData("label") || "Location"}
          </Typography>
          <OpenLayersMap height={data.map_height || 300} width="100%" />
        </FormElementPreviewContainer>
      )}

      {isExpanded && (
        <div className="border-[1px] rounded-md bg-white">
          <div className="p-4">
            <InputField
              value={getActiveLanguageData("label")}
              label="Label"
              id=""
              placeHolder={data.placeholder || "Label"}
              // Set apiCall to false before calling handleChange in onChange event
              onChange={(value: string) => {
                setApiCall(false);
                handleChange("label", value);
              }}
              // Set apiCall to true before calling handleChange in onBlur event
              onBlur={(e) => {
                setApiCall(true);
                handleChange("label", e.target.value);
              }}
            />

            <Stack mt={2} p={1}>
              <FormLabel label={"Map height"} />
              <Slider
                aria-label="Temperature"
                defaultValue={30}
                onChange={(_, value) => {
                  handleChange("map_height", value as number);
                }}
                value={data.map_height || 300}
                valueLabelDisplay="auto"
                shiftStep={100}
                step={100}
                marks
                min={200}
                max={600}
              />
            </Stack>
          </div>
        </div>
      )}
    </>
  );
};

export default Location;
