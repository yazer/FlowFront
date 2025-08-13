import { FC, useState } from "react";
import Heading from "./Heading";
import InputField from "./InputField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { elements_type } from "../constants";
import dayjs, { Dayjs } from "dayjs";

interface DateInputInterface {
  onDelete: () => void;
  onBlur: (value: string) => void;
  // onChange: (data: any, api_call: boolean) => void;
  label: string;
}

const DateInput: FC<DateInputInterface> = ({ onDelete, onBlur,label }) => {
  const [data, setData] = useState<{
    label: string;
    input_type: string;
    dateValue?: Dayjs | null; // Specify Dayjs type for dateValue
  }>({
    input_type: elements_type.DATE,
    label,
    dateValue: null,
  });

  // Handle changes to the label input
  function labelOnChange(value: string) {
    const updatedData = { ...data, label: value };
    setData(updatedData);
    // onChange(updatedData, false); // Send updated data with onChange
  }

  // Handle changes to the date picker
  function dateOnChange(newValue: Dayjs | null) {
    const updatedData = { ...data, dateValue: newValue };
    setData(updatedData);
    // onChange(updatedData, true); // Send updated data with onChange
  }

  // Handle blur event for the label input
  function labelOnBlur() {
    const updatedData = { ...data, label: data.label };
    setData(updatedData);
    // onChange(updatedData, true); // Send updated data with onChange

  }

  // Common props for DatePicker
  const commonProps = {
    label: "Select Date",
    value: data.dateValue,
    onChange: dateOnChange,
    slotProps: {
      textField: { fullWidth: true }, // This will apply props to the internal TextField
    },
  };

  return (
    <>
      <div className="border-[1px] rounded">
        <Heading type={elements_type.DATE} onDelete={onDelete} />
        <div className="p-4">
          {/* Label Input */}
          <InputField
            label="Date"
            placeholder="Enter Date"
            onChange={labelOnChange} // Send updated data on change
            onBlur={(e) => onBlur(e)}
            value={data.label}
          />
        </div>
      </div>
    </>
  );
};

export default DateInput;
