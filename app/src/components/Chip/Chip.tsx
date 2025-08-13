import { CloseOutlined } from "@mui/icons-material";

const Chip = ({
  value,
  type = "info",
  isDelete = false,
  onDelete,
}: {
  value: any;
  type?: "info" | "error" | "success" | "grey";
  isDelete?: boolean;
  onDelete?: () => void;
}) => {
  const colors = {
    info: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
    grey: "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${colors[type]}`}
    >
      <span className="leading-none">{value}</span>
      {isDelete && (
        <div
          className="bg-gray-300 rounded-[50%] leading-none p-[1px] cursor-pointer hover:bg-gray-400"
          onClick={onDelete}
        >
          <CloseOutlined style={{ fontSize: "10px" }} />
        </div>
      )}
    </span>
  );
};

export default Chip;
