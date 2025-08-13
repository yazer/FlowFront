import React, { useContext, createContext } from "react";

export type HomeContextType =
  | {
      [tableId: string]: {
        [key: string | number]: {
          column_name?: string;
          value?: string;
          row_id?: string | number;
        };
      };
    }
  | {};

const homeContext = createContext<HomeContextType | undefined>(undefined);

type useContextReturnType = {
  tableStatus?: HomeContextType;
  setTableStatus?: React.Dispatch<React.SetStateAction<HomeContextType>>;
  error?: string;
};
export const useHomeContext = (): useContextReturnType => {
  const context = useContext(homeContext);
  if (!context) {
    return {
      error: "useHomeContext must be used within a HomeContextProvider",
    };
  }
  return context;
};

export const HomeContextProvider = ({
  children,
  tableStatus,
  setTableStatus,
}: {
  children: React.ReactNode;
  tableStatus: HomeContextType;
  setTableStatus: React.Dispatch<React.SetStateAction<HomeContextType>>;
}) => {
  return (
    <homeContext.Provider value={{ tableStatus, setTableStatus }}>
      {children}
    </homeContext.Provider>
  );
};
