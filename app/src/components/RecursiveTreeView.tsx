// @ts-nocheck
import React, { useState, useMemo, useEffect } from "react";
import { TreeItem, SimpleTreeView } from "@mui/x-tree-view";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";

interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

interface RecursiveTreeViewProps {
  data: TreeNode[];
  checked?: string[];
  onChange: (checked: string[]) => void;
  id?: string;
  label?: string;
  childKey?: string;
}

const RecursiveTreeView: React.FC<RecursiveTreeViewProps> = ({
  data,
  checked = [],
  onChange,
  id = "id",
  label = "label",
  childKey = "children",
}) => {
  const [selected, setSelected] = useState<string[]>(checked);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const parentMap = useMemo(() => {
    return generateParentMap(data);
  }, [data]);

  useEffect(() => {
    if (JSON.stringify(selected) !== JSON.stringify(checked)) {
      onChange(selected);
    }
  }, [selected, checked, onChange]);

  useEffect(() => {
    if (JSON.stringify(checked) !== JSON.stringify(selected)) {
      setSelected(checked);
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
            label={<Typography variant="body2">{node[label]}</Typography>}
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
      defaultExpandedItems={defaultExpanded}
    >
      {data.map((node) => renderTree(node))}
    </SimpleTreeView>
  );
};

export default RecursiveTreeView;
