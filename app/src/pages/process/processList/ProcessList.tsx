import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { ButtonGroup } from "@mui/material";
import { listProcess } from "../../../apis/process";
import "./ProcessList.css"; // Import the CSS file
import { FormattedMessage } from "react-intl";

interface Process {
  uuid: string;
  name: string;
  description: string;
  created_by: string;
  current_runs: number;
  status: string;
}

export function ProcessList() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const navigate = useNavigate();
  const [tab, setTab] = useState("recentlyviewed");

  useEffect(() => {
    (async () => {
      try {
        const data = await listProcess();
        setProcesses(data);
      } catch (error) {
        console.error("Error fetching processes:", error);
      }
    })();
  }, []);

  return (
    <div className="process-list">
      {/* Button Group on the left */}
      <div className="button-group">
        <div className="flex flex-row gap-2">
          <ButtonGroup>
            <Button variant="outlined">Recently Viewed</Button>
            <Button variant="contained" disableElevation>
              Drafts
            </Button>
          </ButtonGroup>
        </div>

        <Link to="/process-list/create-process">
          <Button variant="contained" className="ml-4">
            + New Automation Flow
          </Button>
        </Link>
      </div>

      {/* Table layout for process data */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Process Name</th>
              <th>Description</th>
              <th>Category</th> {/* New Category Header */}
              <th>Created By</th>
              {/* <th>Current Runs</th> */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processes &&
              processes.map((process) => (
                <tr key={process.uuid}>
                  <td>{process.name}</td>
                  <td className="description-cell">
                    {process.description.length > 50
                      ? `${process.description.substring(0, 50)}...`
                      : process.description}
                  </td>
                  {/* New Category Data */}
                  {/* @ts-ignore */}
                  <td>{process?.category?.en.name}</td>{" "}
                  <td>{process.created_by}</td>
                  {/* <td>{process.current_runs}</td> */}
                  <td>
                    <FormattedMessage id="active" />
                  </td>
                  <td className="action-icons">
                    <Link to={`/process-list/flow-builder/${process.uuid}`}>
                      <img
                        src="https://img.icons8.com/ios-filled/20/0073e6/view-details.png"
                        alt="view"
                        className="action-icon"
                      />
                    </Link>
                    <img
                      src="https://img.icons8.com/ios-filled/20/ff4d4d/trash.png"
                      alt="delete"
                      className="action-icon"
                    />
                    <img
                      src="https://img.icons8.com/ios-filled/20/0073e6/edit.png"
                      alt="edit"
                      className="action-icon"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProcessList;
