import React, { useState } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Delete } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { uploadDocumentFile } from "./apis";
import { queryClient } from "./main";

const FileUploadButton = () => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const { mutateAsync, isLoading, error, data } = useMutation({
    mutationFn: uploadDocumentFile,
    onSuccess: (response) => {
      console.log(response);
      // Optional: Invalidate and refetch
      queryClient.invalidateQueries(["docHistory"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleFileChange = (event) => {
    console.log("debug:event", { event: event.target.files });
    // Prevent the browser from opening the file
    event.preventDefault();

    setDragOver(false); // Reset drag over state

    const files = event.target.files || event.dataTransfer.files;
    if (!files.length) return;
    mutateAsync({
      file: files[0],
    });
    setFile(files[0]); // Store the selected or dropped file in the state
  };

  console.log("debug:file", { file });

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleFileChange}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <input
          accept="*/*"
          style={{ display: "none" }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button
            variant="outlined"
            component="span"
            sx={{
              borderRadius: "50%",
              minWidth: "40px",
              width: "40px",
              height: "40px",
              minHeight: "40px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderColor: dragOver ? "primary.main" : "inherit", // Change border color when file is dragged over
            }}
          >
            <AddIcon />
          </Button>
        </label>
      </div>
      {file && (
        <Box display="flex" justifyContent={"center"} alignItems={"center"}>
          <Typography
            style={{
              textAlign: "center",
            }}
          >
            File uploaded: {file.name}
          </Typography>
          <IconButton
            onClick={() => {
              setFile(null);
            }}
            sx={{ marginLeft: "8px" }}
          >
            <Delete
              style={{
                color: "white",
              }}
            />
          </IconButton>
        </Box>
      )}
    </>
  );
};

export default FileUploadButton;
