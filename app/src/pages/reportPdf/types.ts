export type CellStyle = string;

export interface JSSColumn {
  width?: number;
}

export interface JSSRow {
  height?: number;
}

export type JSSCell = string | number | null;

export type JSSData = JSSCell[][];

export type JSSMergeCells = {
  [cellRef: string]: [colspan: number, rowspan: number, mergedCells: any[]];
};

export interface JSSStyle {
  [cellRef: string]: CellStyle;
}

export interface JspreadsheetConfig {
  minDimensions?: [number, number];
  data: JSSData;
  mergeCells?: JSSMergeCells;
  name?: string;
  worksheetName?: string;
  columns?: JSSColumn[];
  rows?: JSSRow[];
  style?: JSSStyle;
}
