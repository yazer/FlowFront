import React from "react";
import { ButtonItem } from "../FreeMoveContainer";

const reportGenerationContext = React.createContext<{
  sections: ButtonItem[];
  setSections: React.Dispatch<React.SetStateAction<ButtonItem[]>>;
}>({
  sections: [],
  setSections: () => {},
});

function ReportGenerationContext({
  children,
  sections,
  setSections,
}: {
  children: React.ReactNode;
  sections: any[];
  setSections: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  return (
    <reportGenerationContext.Provider value={{ sections, setSections }}>
      {children}
    </reportGenerationContext.Provider>
  );
}

export default ReportGenerationContext;

export function useReportGenerationContext() {
  const context = React.useContext(reportGenerationContext);
  if (!context) {
    throw new Error(
      "useReportGenerationContext must be used within a ReportGenerationContext"
    );
  }
  return context;
}
