/* eslint-disable react-hooks/exhaustive-deps */
import { Spreadsheet, Worksheet } from "@jspreadsheet-ce/react";
import { useEffect, useMemo, useRef } from "react";

import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jsuites/dist/jsuites.css";
import { CONTAINER_WIDTH } from "./FreeMoveContainer";
import { useIntl } from "react-intl";
import "./JsReport.css";

function cellCoordsToName(x: number, y: number) {
  const base = 26;
  const char = String.fromCharCode(65 + (x % base)); // 65 = 'A'
  const suffix = Math.floor(x / base);

  const final = suffix === 0 ? char : `${char}${suffix - 1}`;
  return `${final}${Number(y) + 1}`; // Jspreadsheet is 1-based for rows
}

export default function Jspreadsheet({
  config,
  handleConfigUpdate,
  isPrint = false,
  formFields = [],
  isPreview,
}: {
  config: any;
  handleConfigUpdate?: (newConfig: any) => void;
  toolbar?: boolean;
  isPrint?: boolean;
  formFields?: any[];
  isPreview?: boolean;
}) {
  // Spreadsheet array of worksheets
  const spreadsheet: any = useRef();
  const { locale } = useIntl();
  const tableWidth = CONTAINER_WIDTH + 50;

  function getLabel(data: any) {
    return data.translate[locale].label || data.label || data.element_type;
  }

  const contextMenu = (
    worksheet: any,
    x: number,
    y: number,
    e: MouseEvent,
    items: any[]
  ) => {
    const submenu = formFields.map((field) => ({
      title: getLabel(field),
      onclick: () => {
        worksheet.setValueFromCoords(x, y, `{{${getLabel(field)}}}`);
        worksheet.setReadOnly(cellCoordsToName(x, y), true);
      },
    }));
    items.push({
      title: "DataBase Fields",
      submenu: submenu,
    });

    return items;
  };

  const Customtoolbar = (toolbar: any) => {
    // Add a new custom item in the end of my toolbar
    toolbar.items.push({
      tooltip: "Insert Row",
      content: `<div style="display: flex;  color:black; align-items: center; justify-content: center; height: 100%; width: 100%;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M20 6v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1m-8 9v4m2-2h-4"/>
      </svg>
      </div>`,
      onclick: function () {
        spreadsheet.current[0].insertRow();
        resizeColumnsEvenly(spreadsheet.current[0], CONTAINER_WIDTH);
      },
    });
    toolbar.items.push({
      tooltip: "Insert Column",
      content: `
      <div style="display: flex; color:black; align-items: center; justify-content: center; height: 100%; width: 100%;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M6 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1m9 8h4m-2-2v4"/></svg>
      </div>`,
      onclick: function () {
        spreadsheet.current[0].insertColumn();
        resizeColumnsEvenly(spreadsheet.current[0], CONTAINER_WIDTH);
      },
    });
    toolbar.items = toolbar.items.filter(
      (item: any) => item.content !== "save" && item.content !== "fullscreen"
    );

    return toolbar;
  };

  useEffect(() => {
    const time = setInterval(() => {
      handleConfigUpdate?.(spreadsheet.current[0].getConfig());
    }, 2000);

    return () => clearInterval(time);
  }, [spreadsheet]);

  function resizeColumnsEvenly(worksheet: any, containerWidth: number) {
    const colCount = worksheet.getData()[0]?.length || 1;
    const colWidth = Math.floor(containerWidth / colCount);
    for (let i = 0; i < colCount; i++) {
      worksheet.setWidth(i, colWidth);
    }
  }

  // Format row height according to jspreadsheet
  const formatRowHeight = useMemo(() => {
    return Array.isArray(config?.rows)
      ? (config?.rows || [])?.reduce((acc: any, curr: any, ind: number) => {
          return { ...acc, [ind]: { height: `${curr.height}px` } };
        }, {})
      : Object.entries(config?.rows ?? {}).reduce((acc: any, [key, value]: any) => {
          acc[key] = { height: `${value.height}px` };
          return acc;
        }, {}) || [];
  }, [config?.rows]);

  console.log(config)
  return (
    <div
      className={`${isPreview ? "no-headers" : ""}`}
      style={{
        width: `${isPreview ? CONTAINER_WIDTH : tableWidth}px`,
        overflow: "auto",
      }}
    >
      <Spreadsheet
        ref={spreadsheet}
        config={{
          readOnly: true,
          tableOverflow: true,
          columnDrag: true,
          defaultColWidth: 150,
          autoWidth: true, // ✅ make columns stretch to fit
          tableWidth: CONTAINER_WIDTH,
          editable: false,
        }}
        toolbar={isPrint ? Customtoolbar : false}
        contextMenu={contextMenu}
      >
        <Worksheet
          minDimensions={[4, 4]}
          name="Sheet Sanjay 1"
          {...config}
          rows={formatRowHeight}
        />
      </Spreadsheet>
    </div>
  );
}
