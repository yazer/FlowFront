import React, { createContext, useState } from "react";

export const context = createContext({});

function GlobalContextProvider({ children }: { children: React.ReactNode }) {
  const [aiSideBox, setAiSideBox] = useState(false);

  function toggleAisideBox(val: boolean) {
    setAiSideBox(val);
  }

  return (
    <context.Provider value={{ aiSideBox, toggleAisideBox }}>
      {children}
    </context.Provider>
  );
}

export default GlobalContextProvider;
