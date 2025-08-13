import {
  GRAPH_BUILDER_CHART_DETAILS,
  GRAPH_BUILDER_DATA_SET,
  GRAPH_BUILDER_LIST_BY_DATASET,
  GRAPH_BUILDER_SHEET,
} from "./urls";

const token = localStorage.getItem("token");

export async function getGraphBuilderSheet() {
    return fetch(GRAPH_BUILDER_SHEET, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      }).catch((err) => {
        throw new Error(err);
      });
}

export async function getGraphDataSet() {
  return fetch(GRAPH_BUILDER_DATA_SET, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    }).catch((err) => {
      throw new Error(err);
    });
}

export async function getGraphListByDataSet(dataSet:string) {
  return fetch(GRAPH_BUILDER_LIST_BY_DATASET + dataSet , {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    }).catch((err) => {
      throw new Error(err);
    });
}

export async function getGraphBuilderChartDetails() {
    return fetch(GRAPH_BUILDER_CHART_DETAILS, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      }).catch((err) => {
        throw new Error(err);
      });
}

export async function UpdateGraphBuilderSheet(payload: any) {
    return fetch(GRAPH_BUILDER_CHART_DETAILS, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => response.json())
        .then((data) => data).catch((err) => {
            throw new Error(err);
          });
}

export async function UpdateGraphBuilderChartDetails(node: any) {
    return fetch(GRAPH_BUILDER_CHART_DETAILS, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ node: node }),
    })
      .then((response) => response.json())
      .then((data) => data).catch((err) => {
        throw new Error(err);
      });
  }