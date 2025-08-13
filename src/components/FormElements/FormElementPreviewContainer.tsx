import React from "react";

function FormElementPreviewContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="p-1.5 px-3">{children}</div>
    </div>
  );
}

export default FormElementPreviewContainer;
