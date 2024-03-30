import React, { useState } from "react";
import {
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

function UserProfile({ username, onLogout }) {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = () => {
    onLogout();
    setOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
          p: "16px 12px",
          borderRadius: "8px",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Avatar sx={{ marginRight: 2 }} />{" "}
          {/* Dummy avatar; replace src with your user's image */}
          {username}
        </Box>
        <IconButton
          size="small"
          sx={{ marginLeft: 1, color: "white" }}
          onClick={handleToggle}
          ref={anchorRef}
        >
          {" "}
          <MoreVert />{" "}
        </IconButton>
      </Box>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        placement="top"
        transition
        disablePortal
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}

export default UserProfile;
