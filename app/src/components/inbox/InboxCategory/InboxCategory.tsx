import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

export interface InboxCategoryProps {
  name: string;
  label: string;
  icon: React.ReactNode;
  activeIndex: number;
  index: number;
  onClick: (index: number, name: string) => void;
}
export function InboxCategory({
  name,
  label,
  icon,
  activeIndex,
  index,
  onClick,
}: InboxCategoryProps) {
  return (
    <div
      className={`flex flex-row px-2 py-3 my-1  hover:cursor-pointer rounded-md ${
        activeIndex === index
          ? "bg-[#0060AB] hover:bg-[#0060AB] text-white font-bold"
          : "hover:bg-gray-100 font-semibold"
      }`}
      onClick={() => onClick(index, name)}
    >
      <span className=" px-2">
        <div>{icon}</div>
      </span>
      <h6 className="text-sm ml-3">
        <Typography variant='h5' color={activeIndex === index ? "#ffffff" : "#000"}>{label}</Typography>
      </h6>
    </div>
  );
}
