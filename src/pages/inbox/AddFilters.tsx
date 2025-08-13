import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RecursiveTreeView from "../../components/RecursiveTreeView";
import { FormattedMessage } from "react-intl";
import ColorCircle from "./ColorCircle";
import { useEffect, useMemo, useState } from "react";
import { addFilter, getFilterList, updateFilter } from "../../apis/flowBuilder";
import DialogCustomized from "../../components/Dialog/DialogCustomized";

const colorCodes: { [key: string]: string } = {
  green: "#4caf50",
  blue: "#2196f3",
  red: "#f44336",
  orange: "#ff9800",
  purple: "#9c27b0",
};
const colors = [
  colorCodes.green,
  colorCodes.blue,
  colorCodes.red,
  colorCodes.orange,
  colorCodes.purple,
];

const defaultvalue = { name: "", colour: "", is_default: false };

function AddFilters({
  open,
  handleClose,
  onCreateSuccess,
  value,
}: {
  open: boolean;
  handleClose: () => void;
  onCreateSuccess: () => void;
  value?: { name: string; colour: string; is_default?: boolean } | null | any;
}) {
  const [filterList, setFilterList] = useState([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState(value || defaultvalue);

  useEffect(() => {
    async function getList() {
      // API call to get the list of nodes
      try {
        const data = await getFilterList();
        setFilterList(data);

        const traverseNodes = (nodes: any) => {
          return nodes.map((node: any) => {
            if (node.nodes) {
              node.nodes = traverseNodes(node.nodes);
            }
            if (node.node_uuid) {
              node.process_id = node.node_uuid;
              node.process_name = node.node_name;
            }
            return node;
          });
        };

        const transformedData = traverseNodes(data);
        setFilterList(transformedData);
      } catch (e) {
        console.log(e);
      }
    }
    getList();
  }, []);

  const checkFormFilled = useMemo(() => {
    return form.name && form.colour && selected.length;
  }, [selected, form]);

  function handleFormChange(name: string, value: any) {
    setForm({ ...form, [name]: value });
  }

  async function createFilter() {
    if (form.uuid) {
      try {
        await updateFilter({ ...form, node: selected });
        handleClose();
        onCreateSuccess();
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await addFilter({ ...form, node: selected });
        handleClose();
        onCreateSuccess();
        setForm(defaultvalue);
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <DialogCustomized
      handleClose={handleClose}
      open={open}
      title="Create Filters"
      content={
        <Stack width={500} paddingRight={1} spacing={2}>
          <TextField
            size="small"
            label="Name"
            value={form.name}
            onChange={(e) => handleFormChange("name", e.target.value)}
            required
          />

          <Box>
            <Typography variant="caption" gutterBottom color={"text.secondary"}>
              <FormattedMessage id="selectcolor" /> *
            </Typography>
            <Stack direction="row" spacing={1}>
              {colors.map((color) => (
                <ColorCircle
                  key={color}
                  color={color}
                  selected={form.colour === color}
                  onClick={() => handleFormChange("colour", color)}
                />
              ))}
            </Stack>
          </Box>
          <div>
            <Typography variant="caption" color={"text.secondary"}>
              <FormattedMessage id="selectprefferednodetitle" /> *
            </Typography>
            {filterList.length ? (
              <RecursiveTreeView
                onChange={(e) => {
                  setSelected(e);
                }}
                data={filterList}
                checked={selected}
                id={"process_id"}
                label="process_name"
                childKey="nodes"
              />
            ) : (
              <></>
            )}
          </div>
        </Stack>
      }
      actions={
        <Stack
          width="100%"
          direction="row"
          spacing={1}
          justifyContent={"space-between"}
        >
          <FormControlLabel
            control={<Checkbox size="small" />}
            label={
              <Typography variant="caption" color="text.secondary">
                Default Filter
              </Typography>
            }
            value={form.is_default}
            onChange={(e: any) =>
              handleFormChange("is_default", e.target.checked)
            }
          />
          <div>
            <Button onClick={handleClose}>Cancel</Button>{" "}
            <Button
              disableElevation
              variant="contained"
              disabled={!checkFormFilled}
              onClick={createFilter}
            >
              Create
            </Button>
          </div>
        </Stack>
      }
    />
  );
}

export default AddFilters;
