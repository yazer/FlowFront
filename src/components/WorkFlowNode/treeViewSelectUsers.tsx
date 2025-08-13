// @ts-nocheck
import React, { useState, useMemo, useEffect } from "react";
import { TreeItem, SimpleTreeView } from "@mui/x-tree-view";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import { isEqual } from "lodash";
import { useIntl } from "react-intl";

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface GroupedSelection {
  [parentId: string]: string[];
}

interface RecursiveTreeViewProps {
  data: TreeNode[];
  checked?: GroupedSelection;
  onChange: (checked: GroupedSelection) => void;
  id?: string;
  label?: string;
  childKey?: string;
}

const TreeViewUsers: React.FC<RecursiveTreeViewProps> = ({
  data,
  checked = {},
  onChange,
  id = "id",
  label = "label",
  childKey = "children",
}) => {
  const { locale } = useIntl();
  // Convert grouped selection to flat array for internal use
  const flattenSelection = (groupedSelection: GroupedSelection): string[] => {
    return Object.values(groupedSelection).flat();
  };

  // Group flat selection by parent
  const groupSelection = (flatSelection: string[]): GroupedSelection => {
    const result: GroupedSelection = {};

    // Function to find parent of a node
    const findParentId = (nodeId: string): string | null => {
      for (const parent of Object.keys(parentMap)) {
        if (parentMap[parent].includes(nodeId)) {
          return parent;
        }
        // If the node itself is a parent
        if (parent === nodeId) {
          // Find the top-level parent
          for (const rootNode of data) {
            if (rootNode[id] === nodeId) {
              return nodeId; // It's a top-level node
            }

            // Check if it's a child of a top-level node
            if (rootNode[childKey]) {
              for (const topChild of rootNode[childKey]) {
                if (topChild[id] === nodeId) {
                  return rootNode[id]; // Return the top parent's ID
                }
              }
            }
          }
        }
      }

      // If no parent found, try to find in top-level items
      for (const rootNode of data) {
        if (rootNode[id] === nodeId) {
          return rootNode[id];
        }
      }

      return null;
    };

    // Group each selected node under its parent
    flatSelection.forEach((nodeId) => {
      const parentId = findParentId(nodeId);
      if (parentId) {
        if (!result[parentId]) {
          result[parentId] = [];
        }
        if (!result[parentId].includes(nodeId)) {
          result[parentId].push(nodeId);
        }
      } else {
        // If no parent found, put in a special group
        if (!result["uncategorized"]) {
          result["uncategorized"] = [];
        }
        if (!result["uncategorized"].includes(nodeId)) {
          result["uncategorized"].push(nodeId);
        }
      }
    });

    return result;
  };

  const [selected, setSelected] = useState<string[]>(flattenSelection(checked));
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const parentMap = useMemo(() => {
    return generateParentMap(data);
  }, [data]);

  useEffect(() => {
    const groupedSelection = groupSelection(selected);

    const flatGrouped = flattenSelection(groupedSelection);
    const flatChecked = flattenSelection(checked);

    if (!isEqual(flatGrouped.sort(), flatChecked.sort())) {
      onChange(groupedSelection);
    }
  }, [selected]);

  useEffect(() => {
    const flatChecked = flattenSelection(checked);
    if (!isEqual(flatChecked, selected)) {
      setSelected(flatChecked);
    }
  }, [checked]);

  function getAllChild(childNode: TreeNode, collectedNodes: string[] = []) {
    if (!childNode) return collectedNodes;

    collectedNodes.push(childNode[id]);
    if (Array.isArray(childNode[childKey])) {
      childNode[childKey].forEach((node) => getAllChild(node, collectedNodes));
    }

    return collectedNodes;
  }

  function generateParentMap(
    nodes: TreeNode[],
    map: Record<string, string[]> = {}
  ) {
    nodes.forEach((item) => {
      if (!item[childKey]) {
        return;
      }
      map[item[id]] = getAllChild(item).slice(1);
      item[childKey].forEach((childNode) => {
        generateParentMap([childNode], map);
      });
    });
    return map;
  }

  const getNodeInfoById = (
    nodes: TreeNode[],
    targetId: string
  ): { childNodesToToggle: string[]; path: string[] } => {
    let childNodesToToggle: string[] = [];
    let path: string[] = [];

    const traverse = (
      node: TreeNode,
      parentsPath: string[]
    ): TreeNode | null => {
      if (node[id] === targetId) return node;

      if (node[childKey]) {
        for (let childNode of node[childKey]) {
          const result = traverse(childNode, parentsPath);
          if (result) {
            parentsPath.push(node[id]);
            return result;
          }
        }
      }
      return null;
    };

    let targetNode: TreeNode | null = null;
    nodes.forEach((node) => {
      if (!targetNode) {
        const result = traverse(node, path);
        if (result) targetNode = result;
      }
    });

    if (targetNode) {
      childNodesToToggle = getAllChild(targetNode);
    }

    return { childNodesToToggle, path };
  };

  const defaultExpanded = useMemo(() => {
    const result: string[] = [];
    data.forEach((node) => {
      result.push(node[id]);
      node[childKey]?.forEach((child) => result.push(child[id]));
    });
    return result;
  }, [data]);

  const handleCheckboxChange = (isChecked: boolean, node: TreeNode) => {
    const { childNodesToToggle, path } = getNodeInfoById(data, node[id]);

    let updatedSelection = isChecked
      ? [...selected, ...childNodesToToggle]
      : selected
          .filter((value) => !childNodesToToggle.includes(value))
          .filter((value) => !path.includes(value));

    updatedSelection = Array.from(new Set(updatedSelection));
    setSelected(updatedSelection);
  };

  const renderTree = (node: TreeNode) => {
    const allChildrenSelected =
      parentMap[node[id]]?.length > 0 &&
      parentMap[node[id]]?.every((childId) => selectedSet.has(childId));

    const isChecked = selectedSet.has(node[id]) || allChildrenSelected;
    const isIndeterminate =
      parentMap[node[id]]?.some((childId) => selectedSet.has(childId)) || false;

    return (
      <TreeItem
        key={node[id]}
        itemId={node[id]}
        sx={{
          ".MuiTreeItem-content": {
            padding: "0px 8px",
          },
        }}
        label={
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={isChecked}
                indeterminate={!isChecked && isIndeterminate}
                onChange={(event) =>
                  handleCheckboxChange(event.target.checked, node)
                }
                onClick={(e) => e.stopPropagation()}
                size="small"
              />
            }
            className="ltr:mr-[16px] rtl:mr-[0px]"
            label={
              <Typography variant="body2" className="p-2">
                {node?.[label]?.[locale]?.name}
              </Typography>
            }
          />
        }
      >
        {node[childKey]?.map((childNode) => renderTree(childNode))}
      </TreeItem>
    );
  };

  return (
    <SimpleTreeView
      key={defaultExpanded.join(",")}
      // defaultExpandedItems={defaultExpanded}
    >
      {data.map((node) => renderTree(node))}
    </SimpleTreeView>
  );
};

export default TreeViewUsers;
