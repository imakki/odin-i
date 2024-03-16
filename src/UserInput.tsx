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

const UserInput = ({ text, handleChange, handleSummarize, isPending }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        height: "50%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "end",
      }}
    >
      <FileUploadButton />
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
          submitAction={() => {}}
        />
      ) : null}
    </div>
  );
};

export default UserInput;
