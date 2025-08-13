import { MdOutlineMoreVert } from "react-icons/md";
import './automationCard.css';

interface CardProps {
  iconSrc?: string;
  processName: string;
  description?: string;
  createdBy?: string;
  createdOn?: string;
  currentRuns?: number;
}

export function Card({
  iconSrc,
  processName,
  description,
  createdBy,
  createdOn,
  currentRuns
}: CardProps) {
  return (
    <div className="automation-card">
      <div className="card-icon">
        {iconSrc ? (
          <img src={iconSrc} alt="Automation Icon" />
        ) : (
          <div className="default-icon">
            {/* Default placeholder or an icon */}
            <MdOutlineMoreVert size={50} />
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="automation-title">{processName}</h3>
        <p className="automation-description">{description}</p>
        <div className="automation-meta">
          <p><strong>Created By:</strong> {createdBy}</p>
          <p><strong>Date/Time:</strong> {createdOn}</p>
          <p><strong>Current Runs:</strong> {currentRuns}</p>
        </div>
      </div>
    </div>
    // <div className="border-2 border-secondary rounded-md p-4 bg-bglight ">
    //   <h2 className="font-bold text-sm">{name}</h2>
    //   <p className="text-xs mt-2 text-gray-400 line-clamp-2">
    //     {description ||
    //       "Passport verification is crucial for confirming passport legitamicy Passport verification is crucial for confirming passport legitamicy"}
    //   </p>
    //   <div className="relative mt-4">
    //     <button className="hover:bg-gray-300 p-1 absolute right-0 rounded-lg">
    //       <MdOutlineMoreVert />
    //     </button>
    //     <p className="text-xs">Created By: Yazar</p>
    //     <p className="text-xs">Created on: 19/11/2023</p>
    //   </div>
    // </div>
  );
}
