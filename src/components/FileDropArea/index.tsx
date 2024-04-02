import { Delete } from "@mui/icons-material";
import { Grid, IconButton, Typography, useTheme } from "@mui/material";
import React, { SetStateAction, useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  setFile: React.Dispatch<SetStateAction<any[]>>;
  acceptFileType?: string[];
  customText?: string;
  showUploaded?: boolean;
  hideDropzoneAfterUpload?: boolean;
  multiple?: boolean;
  handleFileChange?: (file) => void;
  handleFileDelete?: (file) => void;
  uploadedFileStyles?: any;
  isLoading?: boolean;
}
const FileDropArea = ({
  setFile,
  acceptFileType,
  customText,
  showUploaded = true,
  multiple = false,
  hideDropzoneAfterUpload = false,
  handleFileChange,
  handleFileDelete,
  uploadedFileStyles = {},
  isLoading,
}: Props) => {
  const baseStyle = {
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: "4px",
    // borderColor: `${colors.greyBorderColor}`,
    borderStyle: "dashed",
    backgroundColor: "#F4F6FA",
    transition: "border .3s ease-in-out",
    cursor: "pointer",
    color: "#1D1D1D",
  };

  const activeStyle = {
    borderColor: "#2196f3",
  };

  const acceptStyle = {
    borderColor: "#00e676",
  };

  const rejectStyle = {
    borderColor: "#ff1744",
  };

  const [fileUploaded, setFileUploaded] = useState([]);
  const theme = useTheme();
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileChange?.(acceptedFiles[0]);
      }

      if (multiple) {
        const uniqueFiles = new Set(fileUploaded.map((file) => file?.name)); // Use the file name as a unique identifier
        const newFiles = acceptedFiles.filter(
          (file) => !uniqueFiles.has(file?.name)
        );
        setFileUploaded((prev) => [...prev, ...newFiles]);
        setFile((prev) => [...prev, ...newFiles]);
      } else {
        setFileUploaded(acceptedFiles);
        setFile(acceptedFiles);
      }
    },
    [fileUploaded, handleFileChange, multiple]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    // @ts-ignore
    accept: acceptFileType ? acceptFileType : "application/JSON",
    multiple: multiple,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <>
      {hideDropzoneAfterUpload && fileUploaded.length > 0 ? null : (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <Grid
            item
            container
            xs={12}
            alignItems="center"
            justifyContent="center"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* <UploadCsvFileIcon /> */}
            {isDragActive ? (
              <Typography>Drop the file here...</Typography>
            ) : (
              <Typography>Drag and drop to upload or Browse</Typography>
            )}
            <Typography color="textSecondary">
              {customText
                ? customText
                : "Make sure the file is in .pdf format (Max 5MB)"}
            </Typography>
          </Grid>
          <Grid></Grid>
        </div>
      )}
      <Grid style={{ ...uploadedFileStyles }}>
        {showUploaded && fileUploaded[0] ? (
          <Typography variant="body1" style={{ marginTop: "1rem" }}>
            {hideDropzoneAfterUpload && fileUploaded.length > 0
              ? null
              : "Uploaded File:"}
            {fileUploaded.map((file) => {
              return (
                <Grid
                  key={file?.name}
                  container
                  justifyContent="space-between"
                  item
                  style={{
                    border: `1px solid ${theme.palette.primary.main}`,
                    padding: ".5rem 1rem",
                    borderRadius: 8,
                    margin: " 0",
                  }}
                  alignItems="center"
                >
                  <Typography style={{ display: "inline" }} variant="body1">
                    {file?.name}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      handleFileDelete?.(file);
                      if (multiple) {
                        setFileUploaded((prev) =>
                          prev.filter((ele) => ele?.name !== file?.name)
                        );
                        return setFile((prev) =>
                          prev.filter((ele) => ele?.name !== file?.name)
                        );
                      }
                      setFileUploaded([]);
                      setFile([]);
                    }}
                    data-testid={`${file?.name}DeleteClick`}
                  >
                    {/* <DeleteIcon /> */}
                    <Delete />
                  </IconButton>
                </Grid>
              );
            })}
          </Typography>
        ) : null}
      </Grid>
    </>
  );
};

export default FileDropArea;
