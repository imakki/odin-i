import React, { useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import FileUploadButton from "./FileUpload";
import Modal from "./Modal";
import { TextField } from "@mui/material";

const CustomDivider = styled(Divider)({
  margin: "20px 0",
});

const DividerWithText = () => (
  <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
    <Box sx={{ flex: 1 }}>
      <CustomDivider />
    </Box>
    <Box sx={{ px: 2 }}>
      <Typography variant="body1">OR</Typography>
    </Box>
    <Box sx={{ flex: 1 }}>
      <CustomDivider />
    </Box>
  </Box>
);
const BASE_URL = "https://94f2-171-76-83-95.ngrok-free.app";

const UserInput = ({ handleSummarize, isPending, file, setFile }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleChange = (event) => {
    const inputLines = event.target.value.split("\n");
    if (inputLines.length <= 10) {
      setText(event.target.value);
    } else {
      // If more than 10 lines, limit the text to the first 10 lines.
      setText(inputLines.slice(0, 10).join("\n"));
    }
  };

  const summarisePost = async () => {
    const formdata = new FormData();
    console.log(file);
    formdata.append("file", file);
    const response = await fetch(`${BASE_URL}/document`, {
      method: "POST",
      body:
        formdata ??
        JSON.stringify({
          text: text,
        }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  return (
    <div
      style={{
        height: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <FileUploadButton file={file} setFile={setFile} />
      <DividerWithText />
      <Button
        variant="contained"
        sx={{ display: "block", margin: "0 auto" }}
        onClick={() => setOpen(true)}
      >
        Text
      </Button>
      {open ? (
        <Modal
          open={open}
          setOpen={setOpen}
          title="Text Input"
          content={
            <div>
              <TextField
                multiline
                fullWidth
                rows={10}
                value={text}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter text to summarise here..."
                // This style ensures the TextField visually indicates it can contain multiple lines.
                style={{ marginBottom: "20px" }}
              />
            </div>
          }
          cancelAction={() => {}}
          submitAction={() => {
            summarisePost();
          }}
        />
      ) : null}
      <Button variant="contained" onClick={summarisePost} disabled={isPending}>
        Submit
      </Button>
    </div>
  );
};

export default UserInput;
