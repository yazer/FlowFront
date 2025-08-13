import { Node } from "reactflow";

export const firstSelectedNode = (nodes: Node[]) => {
  nodes.find((node) => node.selected === true);
  return nodes.find((node) => node.selected === true);
};
