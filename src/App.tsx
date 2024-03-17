import {
  ArrowRightAltSharp,
  ChevronLeft,
  ChevronRight,
  Close,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  makeStyles,
  useTheme,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Split from "react-split";
import "./App.css";
import FileUploadButton from "./FileUpload";
import FileDropArea from "./components/FileDropArea";

const document_names = [
  "Document 1",
  "Document 1",
  "Document 1",
  "Document 1",
  "Document 1",
];

const PRIMARY_COLOR = "#18181b";

const App = () => {
  const theme = useTheme();
  const [queryText, setQueryText] = useState("");
  const [isDocumentListDrawerOpen, setIsDocumentListDrawerOpen] =
    useState(false);
  const [isContentUploadModalOpen, setIsContentUploadModalOpen] =
    useState(false);
  const [contentText, setContentText] = useState("");
  const [file, setFile] = useState();

  const handleUploadContent = () => {
    if (contentText) {
      // do something for content text
      return;
    }
    // do something for files
    return;
  };

  return (
    <Grid container style={{ width: "100vw", height: "100vh" }}>
      {isDocumentListDrawerOpen ? (
        <Grid
          item
          container
          xs={2}
          style={{ background: "#342D35", padding: "1rem" }}
          justifyContent="center"
          alignContent="flex-start"
        >
          <Grid item xs={12}>
            <Button
              fullWidth
              onClick={() => setIsContentUploadModalOpen(true)}
              style={{
                fontWeight: 600,
                textTransform: "none",
                marginBottom: 8,
              }}
              variant="contained"
            >
              Upload new Document
            </Button>
          </Grid>
          {document_names?.map((documentName) => {
            return (
              <Grid
                item
                xs={12}
                sx={{
                  padding: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#553F5C",
                    borderRadius: 1,
                  },
                }}
              >
                <Typography color={"white"}>{documentName}</Typography>
              </Grid>
            );
          })}
        </Grid>
      ) : null}
      <Grid
        item
        container
        xs={isDocumentListDrawerOpen ? 10 : 12}
        style={{ background: theme.palette.background.default, height: "100%" }}
        direction="row"
      >
        <Grid
          item
          container
          alignItems="center"
          style={{
            background: "#FFF5FF",
            height: "-webkit-fill-available",
            margin: "1rem",
            borderRadius: 8,
            padding: "1rem",
          }}
        >
          <Grid item>
            <IconButton
              size="small"
              onClick={() =>
                setIsDocumentListDrawerOpen(!isDocumentListDrawerOpen)
              }
            >
              {isDocumentListDrawerOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Grid>
          <Grid
            xs
            item
            container
            style={{ height: "100%", width: "100%" }}
            alignContent="space-between"
          >
            <Split className="split">
              <div>dsds</div>
              <div>
                <Grid
                  item
                  container
                  xs={12}
                  paddingX={2}
                  style={{ height: "100%" }}
                  alignContent="space-between"
                >
                  <Grid item xs={12}>
                    dsd
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      sx={{
                        background: "white",
                        borderRadius: 8,
                        border: "null",
                        padding: "0.5rem",
                        paddingLeft: "1rem",
                      }}
                      multiline
                      maxRows={3}
                      variant="standard"
                      placeholder="Please enter your query here..."
                      size="medium"
                      InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              style={{ background: "#18181b", color: "white" }}
                            >
                              <ArrowRightAltSharp />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      color="error"
                      value={queryText}
                      onChange={(e) => setQueryText(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </div>
            </Split>
          </Grid>
        </Grid>
      </Grid>
      <Dialog
        open={isContentUploadModalOpen}
        onClose={() => setIsContentUploadModalOpen(false)}
        fullWidth
      >
        <DialogTitle>
          <Grid container>
            <Grid item>
              <Typography fontWeight={"bold"}>Upload Document</Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="close"
                onClick={() => setIsContentUploadModalOpen(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FileDropArea setFile={setFile} />
            </Grid>
            <Grid
              item
              container
              xs={12}
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item xs>
                <Divider />
              </Grid>
              <Grid item>
                <Typography>OR</Typography>
              </Grid>
              <Grid item xs>
                <Divider />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <TextField
                value={contentText}
                fullWidth
                variant="standard"
                multiline
                sx={{
                  background: "white",
                  borderRadius: 4,
                  padding: '1rem'
                }}
                InputProps={{
                  disableUnderline: true,
                }}
                maxRows={5}
                rows={5}
                placeholder="Enter text to summarise here..."
                onChange={(e) => setContentText(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Grid
            item
            container
            xs={12}
            paddingX={2}
            paddingY={0}
            spacing={2}
            justifyContent="flex-end"
          >
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => setIsContentUploadModalOpen(false)}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleUploadContent}>
                Upload
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default App;
