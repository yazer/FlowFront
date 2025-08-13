// REPLACEMENT COMPONENT USING contentEditable

import React, { useState, useEffect, useRef } from "react";
import DropDownNode from "../../pages/workflow V2/DropDownNode";
import { FormattedMessage, useIntl } from "react-intl";
import { getMethod } from "../../apis/ApiMethod";
import { GET_NODE_FIELD_LIST, GET_NODE_LIST } from "../../apis/urls";
import { useParams } from "react-router";
import { fetchProcessDetails } from "../../apis/process";
import { NotificationPayload } from "../../containers/nodeNotificationDrawer/notificationDrawer";
import { isEqual } from "lodash";
import useTranslation from "../../hooks/useTranslation";
import { Button } from "@mui/material";

export default function EmailTemplateEditor({
  notifications,
  updateNodeNotifications,
  currentItem,
}: {
  notifications: any[];
  updateNodeNotifications: (
    notifications: any[],
    isUpdateAPI?: boolean
  ) => void;
  currentItem: any;
}) {
  const { processId } = useParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const { translate } = useTranslation();
  const { locale } = useIntl();

  const [emailBodyHTML, setEmailBodyHTML] = useState<string>("");
  const [textAreaPayload, setTextAreaPayload] = useState<any>({});
  const [processDetails, setProcessDetails] = useState<any>({});
  const [nodeList, setNodeList] = useState<any[]>([]);
  const [fieldList, setFieldList] = useState<any>({});
  const [selectedNode, setSelectedNode] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const selectionRef = useRef<Range | null>(null);

  useEffect(() => {
    if (currentItem?.email_body?.[locale]) {
      setEmailBodyHTML(convertTokensToSpans(currentItem.email_body[locale]));
    }
    setTextAreaPayload(currentItem?.meta_data ?? {});
  }, [currentItem]);

  const handleEditorClick = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      selectionRef.current = sel.getRangeAt(0);
    }
    setShowPopup(!showPopup)
  };

  const handleEditorInput = () => {
    handleEditorClick(); // same as above
    const updatedText = convertSpansToTokens();
    setEmailBodyHTML(editorRef.current?.innerHTML || "");
    updateBody(updatedText);
  };

  const convertTokensToSpans = (text: string) => {
    return text.replace(/\{\{(.*?)\}\}/g, (_, tokenId) => {
      return `<span contenteditable="false" class="token" data-token-id="${tokenId}">{{${tokenId}}}</span>`;
    });
  };

  const convertSpansToTokens = () => {
    const editor = editorRef.current;
    if (!editor) return "";

    let result = "";
    editor.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        result += node.textContent;
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node as HTMLElement).dataset.tokenId
      ) {
        result += `{{${(node as HTMLElement).dataset.tokenId}}}`;
      }
    });
    return result.trim();
  };

  const fetchProcessById = async () => {
    try {
      const res = await fetchProcessDetails(processId);
      setProcessDetails(res);
    } catch (error) {}
  };

  useEffect(() => {
    fetchProcessById();
    getNodeList();
  }, []);

  const getNodeList = async () => {
    try {
      const res = await getMethod(GET_NODE_LIST + processId);
      setNodeList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getFieldList = async (nodeId: string | null) => {
    try {
      const res = await getMethod(GET_NODE_FIELD_LIST + nodeId + "/");
      setFieldList(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeNode = (value: string | null) => {
    setSelectedNode(value ?? "");
    setSelectedField("");
    setFieldList({});
    getFieldList(value);
  };

  const handleChangeField = (value: string | null) => {
    setSelectedField(value ?? "");
    insertToken(value ?? "");
  };

  const insertToken = (fieldId: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const fieldName =
      fieldList?.fields?.find((item: any) => item.field_id === fieldId)
        ?.label?.[locale]?.label ?? fieldId;
    const formId = fieldList?.form_id;
    const templateId = `${fieldName}_${
      (Object?.values(currentItem?.meta_data ?? {})?.length ?? 0) + 1
    }`;

    const payload = {
      ...textAreaPayload,
      [templateId]: {
        processId: processId,
        nodeId: selectedField,
        formId: formId,
        fieldId: fieldId,
      },
    };

    setTextAreaPayload(payload);

    const span = document.createElement("span");
    span.textContent = `{{${fieldName}}}`;
    span.setAttribute("data-token-id", fieldName);
    span.setAttribute("contenteditable", "false");
    span.className = "token";

    // 🔁 Restore last saved selection
    const sel = window.getSelection();
    if (!sel) return;

    sel.removeAllRanges();

    if (selectionRef.current) {
      sel.addRange(selectionRef.current);
    }

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(span);

    const space = document.createTextNode(" ");
    range.insertNode(space);
    range.setStartAfter(space);
    range.setEndAfter(space);
    selectionRef.current = range;

    setShowPopup(false); 
  };

  const handleInput = () => {
    const updatedText = convertSpansToTokens();
    setEmailBodyHTML(editorRef.current?.innerHTML || "");
    updateBody(updatedText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const { startContainer, startOffset } = range;

    if (e.key === "Backspace") {
      if (
        startContainer.nodeType === Node.TEXT_NODE &&
        startOffset === 0 &&
        startContainer.previousSibling?.nodeType === Node.ELEMENT_NODE
      ) {
        const prev = startContainer.previousSibling as HTMLElement;
        if (prev.classList.contains("token")) {
          e.preventDefault();
          prev.remove();
          handleInput();
        }
      }
    }
  };

  const updateBody = (text: string) => {
    const updated = notifications.map((item) =>
      item.notification_id === currentItem?.notification_id
        ? {
            ...item,
            email_body: { [locale]: text },
            meta_data: textAreaPayload,
          }
        : item
    );
    if (!isEqual(notifications, updated)) {
      updateNodeNotifications(updated);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div className="flex items-center gap-2">
        <h2>
          <FormattedMessage id="notificationBody" />
        </h2>
        <Button onClick={() => setShowPopup(!showPopup)}>
          <FormattedMessage id="addPlaceholder" />
        </Button>
      </div>

      <div
        contentEditable
        ref={editorRef}
        onInput={handleEditorInput}
        onClick={handleEditorClick}
        onKeyDown={handleKeyDown}
        className="border p-2 rounded min-h-[120px] mt-2"
        style={{ whiteSpace: "pre-wrap" }}
        // placeholder={translate("emailBodyPlacehoder")}
      ></div>

      {showPopup && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            left: "10px",
            zIndex: 100,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "6px",
            padding: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <strong>
            <FormattedMessage id="insertPlaceholder" />
          </strong>

          <div className="flex flex-col gap-2 mt-2">
            <DropDownNode
              options={nodeList?.map((item: any) => ({
                value: item?.uuid ?? "",
                label: item?.name?.[locale] ?? "",
              }))}
              id="node_selection"
              value={selectedNode}
              placeholder={<FormattedMessage id="selectNode" />}
              onChange={handleChangeNode}
            />

            <DropDownNode
              options={fieldList?.fields?.map((item: any) => ({
                value: item?.field_id ?? "",
                label: item?.label?.[locale]?.label ?? "",
              }))}
              id="node_field_selection"
              value={selectedField}
              placeholder={<FormattedMessage id="selectField" />}
              onChange={handleChangeField}
              disabled={!selectedNode}
            />
          </div>
        </div>
      )}
    </div>
  );
}
