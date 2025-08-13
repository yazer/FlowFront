import React from "react";
import { useIntl } from "react-intl";

type props = { children: React.ReactNode };
function NodeWrapper({ children }: props) {
  const { locale } = useIntl();
  return <div dir={locale === "en" ? "ltr" : "rtl"}>{children}</div>;
}

export default NodeWrapper;
