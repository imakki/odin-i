import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function Modal({ title, content, submitAction, cancelAction, open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  const handleCancel = () => {
    handleClose();
    if (cancelAction) cancelAction();
  };

  const handleSubmit = () => {
    handleClose();
    if (submitAction) submitAction();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"lg"}
      PaperProps={{
        sx: {
          maxWidth: "700px", // Set the maximum width to 700px
          width: "700px", // Use 100% of the width up to the maximum
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Modal;
