import {
  Close,
  KeyboardVoiceOutlined,
  MoreVert,
  RepeatOne,
  Send,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { useState } from "react";
import message from "../../assets/message.png";
import useGlobalContext from "../../context/useGlobalContext";
import "./AIWorkFlow.css";
import AiMessage from "./AiMessage";
import Aisuggesions from "./Aisuggesions";

function AIworkFlowIndex() {
  const [chat, setChat] = useState("");
  const { aiSideBox: open, toggleAisideBox } = useGlobalContext();

  if (open)
    return (
      <div
        style={{
          width: "410px",
          display: "flex",
          backgroundColor: "white",
        }}
      >
        <div className="h-[100%] relative border-l-2 p-2">
          <div>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <IconButton onClick={() => toggleAisideBox(false)}>
                  <Close sx={{ fontSize: "14px" }} />
                </IconButton>

                <Typography color="inherit" variant="h5">
                  Ai Workflow Builder
                </Typography>
              </Stack>
              <IconButton>
                <MoreVert sx={{ fontSize: "14px" }} />
              </IconButton>
            </Stack>

            <div className="ai-message-container">
              <Stack
                minHeight="100%"
                justifyContent="flex-end"
                spacing={1}
                paddingBottom={1}
              >
                <Stack alignItems="center">
                  <img src={message} height="50px" width="50px" />
                  <Typography variant="h3">Welcome, John</Typography>
                </Stack>
                <br />
                <AiMessage message="I'm Here to help you build the workflow you want more efficiently." />
                <AiMessage message="Here are some common tasks you try:" />
                <Aisuggesions message="Create a workflow for applying for passport" />
                <Aisuggesions message="loresm asd masd masd masdas" />
              </Stack>
            </div>
            <div className="ai-input-box-container">
              <textarea
                placeholder="What work flow you want to create today?"
                name="Text1"
                cols={40}
                rows={3}
                onChange={(e: any) => setChat(e.target.value)}
              >
                {chat}
              </textarea>

              <Stack
                alignItems="center"
                direction="row"
                justifyContent="flex-end"
              >
                <Typography variant="h6">{chat.length}/2000</Typography>
                <IconButton>
                  <KeyboardVoiceOutlined color="primary" />
                </IconButton>
                <IconButton>
                  <Send color="primary" />
                </IconButton>
              </Stack>
            </div>
          </div>
        </div>
        <div className="w-[40px] h-[100%] border-l-2 p-2 pt-5">
          <Stack alignItems="center" spacing={1}>
            <img src={message} height="20px" width="20px" />
            <IconButton>
              <RepeatOne />
            </IconButton>
          </Stack>
        </div>
      </div>
    );

  return <></>;
}

export default AIworkFlowIndex;
