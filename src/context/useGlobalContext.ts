
import React, { useContext } from "react";
import { context } from "./GlobalContextProvider";

function useGlobalContext(): any {
  return useContext(context);
}

export default useGlobalContext;
