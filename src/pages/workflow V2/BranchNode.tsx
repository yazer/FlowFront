import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FormattedMessage } from "react-intl";
import {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  deleteWorkFlowNode,
  getBranchNodeOptions,
  getConditionsByField,
  getFieldsByConditionId,
  updateWorkFlowNode,
} from "../../apis/flowBuilder";
import DatePickerCustom from "../../components/FormElements/components/DatePicker";
import { elements_type } from "../../components/FormElements/constants";
import InputField from "../../components/FormElements/newcompnents/InputField";
import "./branch-node.scss";
import DropDownNode from "./DropDownNode";

interface CustomNodeData {
  label?: string;
}

type CustomNodeProps = NodeProps<CustomNodeData>;

type FormFieldListObj = {
  field_id: string;
  label: string;
  element_type: "TEXT_FIELD" | "DATE" | "DROPDOWN";
  input_type: "string" | "number" | "float";
};

type FormFieldListType = {
  form_id: string;
  fields: FormFieldListObj[];
};

type ConditionElement = {
  id: string;
  value: string;
};

type ElementListbyOperatorType = {
  id: string;
  field_name: string;
  placeholder: string;
  input_type: string; // Could be a union of specific values like 'string', 'number', etc.
  element_type: string; // Could be a union like 'TEXT_FIELD' | 'SELECT' | 'RADIO'
  condition: string; // Could be a union like 'equals' | 'contains', etc.
  additional_props: {
    required: boolean;
    default_value: any | null; // Adjust `any` if you know the exact type of the value
  };
};

type Condition = {
  condition_id: string;
  type: string; // Add other possible condition types if applicable
  field?: string;
  operator?: string;
  elements?: ConditionElement[]; // Optional since not all conditions have `elements`
};

type OperatorObject = {
  uuid: string;
  condition_name: string;
  condition_symbol: string;
};

const CustomNode: React.FC<CustomNodeProps> = ({
  data,
  id,
  selected,
  ...props
}: any) => {
  const reactFlowInstance = useReactFlow();
  const nodeData = reactFlowInstance.getNode(id);
  const { conditions }: { conditions: Condition[] } = nodeData?.data;

  const [isMinimized, setIsMinimized] = useState(true);
  const [loader, setLoader] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [fieldConditions, setFieldConditions] = useState<
    Record<string, OperatorObject[]>
  >({});
  const [elementsByCondition, setElementsByCondition] = useState<
    Record<string, ElementListbyOperatorType[]>
  >({});
  const [formDetails, setFormDetails] = useState<FormFieldListType>(
    {} as FormFieldListType
  );

  console.log(formDetails);

  const toggleMinimize = () => {
    if (
      reactFlowInstance
        ?.getEdges()
        // @ts-ignore
        ?.find((dat: any) => dat.target === id)?.uuid
    ) {
      setIsMinimized(!isMinimized);
      if (isMinimized) {
        getInitialConditionsAndElements(conditions);
      } else {
      }
    } else {
      toast.error("Please connect with workflow node for add conditions");
    }
  };

  useEffect(() => {
    (async () => {
      const edgeId = reactFlowInstance
        ?.getEdges()
        // @ts-ignore
        ?.find((dat: any) => dat.target === id)?.uuid;
      if (edgeId) {
        try {
          const data = await getBranchNodeOptions(edgeId || "");
          setFormDetails(data);
        } catch (error) {}
      }
    })();
  }, [reactFlowInstance.getEdges().length, isMinimized]);

  const updateNodeInternals = useUpdateNodeInternals();

  useEffect(() => {
    (() => {
      // if (!selected) return;
      getInitialConditionsAndElements(conditions ?? []);
      updateNodeInternals(id);
    })();
  }, [formDetails, conditions]);

  const getInitialConditionsAndElements = async (conditions: Condition[]) => {
    const updatedFieldConditions = { ...fieldConditions };
    const updatedElementsByCondition = { ...elementsByCondition };

    try {
      await Promise.all(
        conditions.map(async (item) => {
          if (item?.field && formDetails?.form_id) {
            try {
              const operatorList = await getConditionsByField(
                formDetails?.form_id,
                item?.field || ""
              );
              updatedFieldConditions[item?.condition_id] = operatorList;
            } catch (error) {
              console.error("Error fetching conditions:", error);
            }

            if (item?.operator) {
              try {
                const elementList = await getFieldsByConditionId(
                  item?.operator ?? ""
                );
                updatedElementsByCondition[item?.condition_id] = elementList;
              } catch (error) {
                console.error("Error fetching fields:", error);
              }
            }
          }
        })
      );

      setFieldConditions((prevState) => ({
        ...prevState,
        ...updatedFieldConditions,
      }));
      setElementsByCondition((prevState) => ({
        ...prevState,
        ...updatedElementsByCondition,
      }));
      setLoader(false);
    } finally {
    }
  };

  const updateNodeConditions = async (
    conditionsList: Condition[],
    isUpdateAPI: boolean = true
  ) => {
    const updatedNode = {
      ...nodeData,
      id: id,
      data: {
        ...nodeData?.data,
        conditions: conditionsList,
      },
    };
    if (isUpdateAPI) {
      await updateWorkFlowNode(updatedNode);
    }
    reactFlowInstance.setNodes(
      reactFlowInstance
        .getNodes()
        .map((node: any) =>
          node.id === id
            ? { ...node, data: { ...data, conditions: conditionsList } }
            : node
        )
    );
  };

  const addCondition = () => {
    const newCondition: Condition = {
      condition_id: `${Date.now()}`,
      type: "else if",
      elements: [],
    };

    let temp = [...conditions];
    temp.splice(conditions.length - 1, 0, newCondition);
    // setConditions(temp);

    // updateMasterConditions(temp);
    updateNodeConditions(temp);
  };

  const deleteCondition = (conditionId: string) => {
    let updated = conditions.filter(
      (item, i) => item.condition_id !== conditionId
    );
    if (updated.length > 1 && updated[updated.length - 1].type !== "else") {
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        type: "else",
      };
    }

    updateNodeData(updated);
  };

  const updateNodeData = async (conditions: Condition[]) => {
    updateNodeConditions(conditions);
    // updateMasterConditions(conditions);
  };

  const handleFieldChange = async (
    index: number,
    field: string,
    condition: any
  ) => {
    const data = await getConditionsByField(formDetails?.form_id, field);
    setFieldConditions({
      ...fieldConditions,
      [condition.condition_id]: Array.isArray(data) ? data : [],
    });

    let updatedValue = conditions.map((item, i) =>
      item.condition_id === condition.condition_id
        ? {
            ...condition,
            field: field,
            operator: undefined,
            value: undefined,
          }
        : item
    );
    updateNodeConditions(updatedValue);
    // updateMasterConditions(updatedValue);
  };

  const handleOperatorChange = async (
    index: number,
    operator: string,
    condition: any
  ) => {
    const updatedValue = conditions.map((item, i) =>
      item.condition_id === condition.condition_id
        ? { ...condition, operator, elements: [] }
        : item
    );
    setElementsByCondition({
      ...elementsByCondition,
      [condition.condition_id]: [],
    });
    updateNodeConditions(updatedValue);

    const data = await getFieldsByConditionId(operator);
    setElementsByCondition({
      ...elementsByCondition,
      [condition.condition_id]: Array.isArray(data) ? data : [],
    });

    // updateMasterConditions(updatedValue);
  };

  const handleDeleteNode = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkFlowNode(id);
      reactFlowInstance.deleteElements({ nodes: [{ id }] });
      setIsDeleting(false);
    } catch (e) {
      console.log(e);
      setIsDeleting(false);
    }
  };

  const handleChangeElements = (
    element: any,
    conditionId: string,
    index: number,
    value: any,
    elementsList: ElementListbyOperatorType[],
    isUpdateAPI: boolean = false
  ) => {
    const updatedValue = conditions.map((condition) =>
      condition.condition_id === conditionId
        ? {
            ...condition,
            elements:
              condition?.elements && condition?.elements?.length > 0
                ? condition?.elements?.map((el, i) =>
                    el.id === element.id ? { ...el, value } : el
                  )
                : elementsList.map((item) => ({
                    id: item.id,
                    value: item.id === element.id ? value : "",
                  })),
          }
        : condition
    );
    if (isUpdateAPI) {
      updateNodeConditions(updatedValue, true);
    } else {
      updateNodeConditions(updatedValue, false);
    }
  };

  return (
    <div
      className={`
          branchNode
          transform transition-all duration-300 ease-in-out 
          ${
            !isMinimized
              ? "px-3 py-2 rotate-0 rounded-lg"
              : "w-28 h-28 rotate-45 rounded-xl"
          } 
          bg-white cursor-pointer 
          flex items-center justify-center
          shadow-lg hover:shadow-xl
        `}
      style={{
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px",
        cursor: loader ? "wait" : "default",
      }}
      key={`${isMinimized}`}
    >
      {isDeleting && (
        <Box
          sx={{
            position: "absolute",
            top: "auto",
            bottom: "auto",
            left: "auto",
            right: "auto",
            backgroundColor: "white",
            rotate: "-48deg",
            width: "110%",
            zIndex: 4,
          }}
        >
          Deleting...
        </Box>
      )}
      <Handle
        type="target"
        id={`${id}-left`}
        position={Position.Left}
        style={
          isMinimized
            ? {
                left: -13,
                top: 120,
              }
            : {
                left: -20,
              }
        }
      />

      <div>
        {isMinimized &&
          conditions?.map((condition, index) => (
            <Handle
              key={condition.condition_id}
              type="source"
              id={condition.condition_id}
              position={Position.Right}
              isConnectable={index === 0}
              style={{
                top: -10,
                right: -18,
              }}
            />
          ))}
      </div>
      {!isMinimized ? (
        <>
          {loader && (
            <div
              style={{
                position: "absolute",
                top: "30px",
                left: 0,
                right: 0,
                height: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                pointerEvents: "none",
              }}
            >
              <CircularProgress size={20} />
            </div>
          )}
          <div>
            <div className="flex flex-row items-center justify-between">
              <div className="">
                <FormattedMessage id="addConditions"></FormattedMessage>
              </div>{" "}
              <button
                className="ml-1 p-1 hover:bg-slate-300 rounded-md"
                onClick={toggleMinimize}
              >
                <AiOutlineMinus />
              </button>
            </div>
            <div
              style={{
                transition: "opacity 0.3s ease",
                marginTop: "10px",
                marginBottom: "10px",
                position: "relative",
                pointerEvents: loader ? "none" : "auto",
              }}
            >
              {/* Rest of your existing code remains the same */}
              {Array.isArray(conditions) &&
                conditions?.map((condition: Condition, index) => (
                  <React.Fragment key={condition.condition_id}>
                    <div
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#ffffff",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                        transition: "box-shadow 0.3s ease, transform 0.3s ease",
                        marginBottom: "10px",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between">
                        <label
                          style={{
                            display: "block",
                            marginBottom: "8px",
                            color: "#333",
                            fontSize: "16px",
                            fontWeight: "600",
                          }}
                        >
                          {condition.type.toUpperCase()}
                        </label>
                        <Handle
                          type="source"
                          id={condition.condition_id}
                          position={Position.Right}
                        />
                      </Stack>
                      {condition.type !== "else" &&
                        (formDetails?.fields &&
                        Array.isArray(formDetails?.fields) &&
                        formDetails?.fields.length > 0 ? (
                          <Stack spacing={1.2}>
                            <DropDownNode
                              options={
                                formDetails?.fields &&
                                Array.isArray(formDetails?.fields)
                                  ? formDetails?.fields?.map((detail: any) => ({
                                      label: detail?.label || "",
                                      value: detail?.field_id,
                                    }))
                                  : []
                              }
                              value={condition.field}
                              id={id}
                              placeholder={
                                <FormattedMessage id="selectField" />
                              }
                              onChange={(e) =>
                                handleFieldChange(index, e || "", condition)
                              }
                            />
                            <DropDownNode
                              placeholder={
                                <FormattedMessage id="selectCondition" />
                              }
                              value={condition.operator}
                              options={
                                fieldConditions?.[condition?.condition_id] &&
                                Array.isArray(
                                  fieldConditions?.[condition?.condition_id]
                                )
                                  ? fieldConditions?.[
                                      condition?.condition_id
                                    ]?.map((detail: any) => ({
                                      label: detail?.condition_name || "",
                                      value: detail?.uuid,
                                    }))
                                  : []
                              }
                              disabled={!condition.field}
                              id={id}
                              onChange={(e) =>
                                handleOperatorChange(index, e || "", condition)
                              }
                            />
                            {/* Conditional branch dropdown populating dopdown and */}
                            {condition?.operator &&
                              elementsByCondition?.[condition?.condition_id] &&
                              Array.isArray(
                                elementsByCondition?.[condition?.condition_id]
                              ) &&
                              elementsByCondition?.[
                                condition?.condition_id
                              ]?.map((item) => (
                                <ElementByCondition
                                  element={item}
                                  condition={condition}
                                  conditionId={condition?.condition_id}
                                  index={index}
                                  handleChangeElements={(
                                    value: any,
                                    isUpdateAPI: boolean
                                  ) =>
                                    handleChangeElements(
                                      item,
                                      condition?.condition_id,
                                      index,
                                      value,
                                      elementsByCondition?.[
                                        condition?.condition_id
                                      ],
                                      isUpdateAPI
                                    )
                                  }
                                  updateConditions={() =>
                                    updateNodeConditions(conditions)
                                  }
                                />
                              ))}
                          </Stack>
                        ) : (
                          <div
                            style={{
                              padding: "12px",
                              backgroundColor: "#fdf4f4",
                              border: "1px solid #e0c4c4",
                              borderRadius: "6px",
                              color: "#a33",
                              fontSize: "14px",
                              marginTop: "8px",
                            }}
                          >
                            <FormattedMessage
                              id="noFieldsToAddCondition"
                              defaultMessage="No fields available to add conditions."
                            />
                          </div>
                        ))}

                      {/* Hide delete button for "if" and "else" conditions */}
                      {!["if", "else"].includes(condition.type) && (
                        <button
                          onClick={() =>
                            deleteCondition(condition.condition_id)
                          }
                          title="Delete Condition"
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "12px",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#e63946",
                            fontSize: "18px",
                            transition: "color 0.3s ease",
                          }}
                          onMouseEnter={(e: any) =>
                            (e.target.style.color = "#d72638")
                          }
                          onMouseLeave={(e: any) =>
                            (e.target.style.color = "#e63946")
                          }
                        >
                          <AiOutlineDelete />
                        </button>
                      )}
                    </div>
                  </React.Fragment>
                ))}

              <button
                onClick={addCondition}
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#007BFF",
                  color: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                <FormattedMessage id={"addConditions"} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          className="rotate-[-45deg]"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" gap={1} alignItems="center">
            {/* <LuDiamond color="blue" /> */}

            <button
              className="ml-1 p-1 hover:bg-slate-300 rounded-md"
              onClick={toggleMinimize}
              title={isMinimized ? "Expand Details" : "Collapse Details"}
            >
              {isMinimized ? <AiOutlinePlus /> : <AiOutlineMinus />}
            </button>
            <Typography variant="subtitle1">
              <FormattedMessage id={"conditions"} />
            </Typography>
            <button
              className="ml-1 p-1 hover:bg-slate-300 rounded-md"
              onClick={handleDeleteNode}
              title={"Delete"}
            >
              <AiOutlineDelete />
            </button>
          </Stack>
          <Stack direction="row"></Stack>
        </div>
        // <span className="text-white font-bold rotate-[-45deg]">Click to Expand</span>
      )}
    </div>
  );
};

export default React.memo(CustomNode);

const ElementByCondition = ({
  element,
  index,
  handleChangeElements,
  conditionId,
  condition,
  updateConditions,
}: {
  element: ElementListbyOperatorType;
  index: number;
  handleChangeElements: Function;
  conditionId: string;
  condition: Condition;
  updateConditions: Function;
}) => {
  // let fieldValue = condition?.elements?.find((item: any) => item.id === element.id)
  // ?.value ?? ""

  const fieldValue = useMemo(() => {
    return (
      condition?.elements?.find((item: any) => item.id === element.id)?.value ??
      ""
    );
  }, [condition?.elements, element.id]);

  switch (element?.element_type) {
    case elements_type.TEXTFIELD:
      return (
        <InputField
          label={element.field_name}
          placeholder={element.placeholder}
          value={fieldValue}
          onBlur={() => updateConditions()}
          onChange={(value) => handleChangeElements(value)}
        />
      );
    case elements_type.DATE:
      return (
        <DatePickerCustom
          label={element.field_name}
          value={fieldValue}
          name=""
          onChange={(e) => {
            handleChangeElements(e.target.value, true);
          }}
        />
      );
    default:
      return (
        <InputField
          label={""}
          placeholder={"Placeholder"}
          value={""}
          onBlur={() => updateConditions()}
          onChange={(value) => handleChangeElements(value)}
        />
      );
  }
};
