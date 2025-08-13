import React from "react";

function LangTab({
  setActiveLanguage,
  activeLanguage,
}: {
  setActiveLanguage: (a: "en" | "ar" | any) => any;
  activeLanguage: "en" | "ar" | string;
}) {
  return (
    <>
      {" "}
      {/* Tabs for Language Selection */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Tabs">
          <button
            onClick={() => setActiveLanguage("en")}
            className={`px-3 py-2 text-sm font-medium ${
              activeLanguage === "en"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveLanguage("ar")}
            className={`px-3 py-2 text-sm font-medium ${
              activeLanguage === "ar"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Arabic
          </button>
        </nav>
      </div>
    </>
  );
}

export default LangTab;
