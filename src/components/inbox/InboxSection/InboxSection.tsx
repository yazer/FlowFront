import { Typography } from "@mui/material";
import { MdOutlineCreateNewFolder } from "react-icons/md";

export interface InboxSectionProps {
  // type: string;
  id: number | string;
  label: string;
  image: string;
  date: string;
  activeIndex: number;
  index: number;
  time: string;
  onClick: (index: number, id: string | number) => void;
}
export function InboxSection({
  id,
  label,
  image,
  date,
  activeIndex,
  index,
  onClick,
  time,
}: InboxSectionProps) {
  return (
    <>
      <div
        className={`px-2 py-4 flex  border-b border-gray-200 align-middle   cursor-pointer justify-between ${
          activeIndex === index
            ? "bg-[#0060AB] text-white"
            : "hover:bg-gray-100"
        }`}
        onClick={() => onClick(index, id)}
      >
        <div className="flex">
          <div className="px-2 overflow-hidden justify-center   ">
            <img
              src={"https://i.pravatar.cc/300"}
              width={35}
              height={35}
              alt="icon"
              className="rounded-full"
            />
          </div>
          <div>
            <Typography variant="h5" color={activeIndex === index ? "#ffffff" : "#000"}>{label}</Typography>
            <Typography variant="subtitle1" color={activeIndex === index ? "#ffffff" : "#000"}>Request Id: {id}</Typography>
            <Typography variant="caption" color={activeIndex === index ? "#ffffff" : "#000"}>{`${date} | ${time}`}</Typography>
          </div>
        </div>
        <div>
          <MdOutlineCreateNewFolder
            size={20}
            className={`${
              activeIndex === index ? "text-white" : "text-gray-400"
            }`}
          />
        </div>
      </div>
    </>
  );
}
export default InboxSection;