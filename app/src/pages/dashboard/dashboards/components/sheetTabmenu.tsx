import { Tab, Tabs, Box, IconButton, Typography } from "@mui/material";
import { sheetType } from "../dashboards";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { styled } from "@mui/material/styles";
import { useState } from "react";

type TabPanelProps = {
  children: React.ReactNode;
  selectedTab: number;
  setSelectedTab: React.Dispatch<React.SetStateAction<number>>;
  sheets: sheetType[];
  setSheets: React.Dispatch<React.SetStateAction<sheetType[]>>;
  updateSheetList: (payload : sheetType[]) => Promise<void>  
  fetchSheetsList: () => Promise<void> 
};

const CustomTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
  minHeight: 29,
  "& .MuiTabs-flexContainer": {
    // background: "linear-gradient(83.2deg, #121212 6.52%, #202020 118.43%)",
    // border: "0.5px solid #494949",
    // width: "fit-content",
    padding: "8px 8px 0 8px",
    // borderRadius: "16px",
    // boxShadow: "0px 0px 20px 0px #00000080 inset",
  },
}));

const CustomTab = styled(Tab)(({ theme }) => ({
  cursor: "pointer",
  textTransform: "none",
  minHeight: 34,
  height: "34px",
  borderRadius: "4px 4px 0 0",
  padding: "6px 8px 10px 8px",
  [theme.breakpoints.up("sm")]: {
    minWidth: 110,
  },
  fontSize: "1rem",
  fontWeight: theme.typography.fontWeightRegular,
  color: theme.palette.text.secondary,
  "&:hover": {
    opacity: 3,
    color: theme.palette.text.primary,
  },
  "&.Mui-selected": {
    // paddingBottom: "8px",
    color: theme.palette.text.primary,
    background: "#f8f5f5",
    border: "1px solid #ccc",
    borderBottom: "none",
  },
  "&.Mui-focusVisible": {
    // backgroundColor: "#d1eaff",
  },
  transition: "all 0.3s ease",
}));

const SheetTabMenu = ({
  children,
  selectedTab,
  sheets,
  setSelectedTab,
  setSheets,
  updateSheetList,
  fetchSheetsList
}: TabPanelProps) => {
  const [isDoubleClicked, setIsDoubleClicked] = useState(0);

  const handleTabChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ): void => {
    setIsDoubleClicked(0);
    setSelectedTab(newValue);
  };
  const addNewTab = () => {
    const newTab = {
      sheetId: sheets.length + 1,
      sheetName: `Sheet ${sheets.length + 1}`,
    };
    setSheets([...sheets, newTab]);
    setSelectedTab(newTab.sheetId)
    // updateSheetList([...sheets, newTab])
  };

  const removeTab = (tabValue: number) => {

    let filteredSheets = sheets.filter((tab) => tab.sheetId !== tabValue)
    // updateSheetList(filteredSheets)
    setSheets(filteredSheets);

    if (selectedTab === tabValue) {
      const newTabs = sheets.filter((tab) => tab.sheetId !== tabValue);
      setSelectedTab(newTabs.length > 0 ? newTabs[0].sheetId : 0);
    }
  };

  const handleSheetNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    sheetId: number
  ) => {
    const value = e.target.value;
    let editedSheets = sheets.map((x) =>
      x.sheetId === sheetId ? { ...x, sheetName: value } : x
    )
    setSheets(
      editedSheets
    );
    // updateSheetList(editedSheets)
  };

  const handleKeyDown = (event : React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsDoubleClicked(0)
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CustomTabs
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="dynamic tab menu"
          scrollButtons={"auto"}
        >
          {sheets.map((tab, index) => (
            <CustomTab
              disableTouchRipple
              disableFocusRipple
              label={
                isDoubleClicked === tab.sheetId ? (
                  <input
                    className="sheet_input"
                    value={tab.sheetName}
                    onChange={(e) => handleSheetNameChange(e, tab.sheetId)}
                    onBlur={() => setIsDoubleClicked(0)}
                    onKeyDown={handleKeyDown}
                  ></input>
                ) : (
                  <Box
                    width={"100%"}
                    display="flex"
                    alignItems="center"
                    justifyContent={"space-between"}
                    gap={"10px"}
                  >
                    <Typography
                      fontSize={"12px"}
                      onDoubleClick={() => setIsDoubleClicked(tab.sheetId)}
                    >
                      {tab.sheetName}
                    </Typography>
                    {sheets.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering tab change
                          removeTab(tab.sheetId);
                        }}
                      >
                        <CloseIcon sx={{ fontSize: "12px" }} />
                      </IconButton>
                    )}
                  </Box>
                )
              }
              value={tab.sheetId}
              key={tab.sheetId}
            />
          ))}
        </CustomTabs>
        <IconButton size="small" onClick={addNewTab} sx={{ padding: "4px" }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
};

export default SheetTabMenu;
