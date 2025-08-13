import React from "react";

type directionBased = {
  language: string;
  children: React.ReactNode;
};

function DirectionBasedOnLanguage({ language, children }: directionBased) {
  return <div dir={language === "ar" ? "rtl" : "ltr"}>{children}</div>;
}

export default DirectionBasedOnLanguage;
