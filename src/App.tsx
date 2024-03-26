import {
  ArrowRightAltSharp,
  ChevronLeft,
  ChevronRight,
  Close,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Split from "react-split";
import "./App.css";
import FileUploadButton from "./FileUpload";
import FileDropArea from "./components/FileDropArea";
import { apiClient } from "./utils/apiClient";
import ChatInterface from "./components/ChatInterface";

const scrollToElementById = (elementId) => {
  // Find the element
  const element = document.getElementById(elementId);

  // Scroll to the element if it exists
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const App = () => {
  const theme = useTheme();
  const [queryText, setQueryText] = useState("");
  const [textfieldQuery, setTextFieldQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState();
  const [isDocumentListDrawerOpen, setIsDocumentListDrawerOpen] =
    useState(false);
  const [isContentUploadModalOpen, setIsContentUploadModalOpen] =
    useState(false);
  const [contentText, setContentText] = useState("");
  const [file, setFile] = useState();
  const [sectionToHighlight, setSectionToHighlight] = useState([]);

  const queryClient = useQueryClient();

  const {
    data: documentsList,
    isError: isFetchDocumentsListError,
    isLoading: isfetchDocumentsListLoading,
  } = useQuery({
    queryKey: ["documentsList", {}],
    queryFn: async () => {
      return await apiClient.get("/documents");
    },
  });

  const {
    mutate: uploadDocument,
    data: uploadedDocument,
    isError: isUploadDocumentError,
    isPending: isUploadDocumentPending,
  } = useMutation({
    mutationKey: ["uploadDocument", {}],
    mutationFn: async () => {
      const formData = new FormData();
      if (contentText) {
        formData.append("text", contentText);
      } else {
        formData.append("file", file[0]);
      }
      return await apiClient.post("/document", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onSuccess: (data) => {
      console.log("Document uploaded successfully", data);
      queryClient.invalidateQueries("documentsList");
      setIsContentUploadModalOpen(false);
    },
    onError: (error) => {
      console.error("Error uploading document", error);
    },
  });

  const {
    mutate: createQuery,
    data: queryData,
    isError: isCreateQueryError,
    isPending: isCreateQueryPending,
  } = useMutation({
    mutationKey: ["createQuery", {}],
    mutationFn: async () => {
      return await apiClient.post("/query", {
        document_id: selectedDocument,
        query: queryText,
      });
    },
    onMutate: () => {
      setQueryText(textfieldQuery);
      setTextFieldQuery("");
    },
    onSuccess: (data) => {
      console.log("Query created successfully", data);
      queryClient.invalidateQueries("documentsList");
      setQueryText("");
    },
    onError: (error) => {
      console.error("Error while creating query", error);
    },
  });

  const handleUploadContent = () => {
    console.log("inside");
    uploadDocument();
    if (contentText) {
      // do something for content text
      return;
    }
    // do something for files
    return;
  };

  const renderDocument = () => {
    try {
      return documentsList?.data
        ?.find((document) => document.id === selectedDocument)
        ?.raw?.map((elem) => {
          return JSON.parse(elem);
        })
        .flat()
        ?.map((documentData) => {
          return (
            <>
              <h4 id={documentData.section_id}>{documentData?.section_title}</h4>
              <div
                dangerouslySetInnerHTML={{
                  __html: documentData?.section_content,
                }}
              />
            </>
          );
        });
    } catch (e) {
      return documentsList?.data
        ?.find((document) => document.id === selectedDocument)
        ?.raw?.map((elem) => {
          return elem;
        })
        ?.map((documentData) => {
          return (
            <>
              <div
                dangerouslySetInnerHTML={{
                  __html: documentData,
                }}
              />
            </>
          );
        });
    }
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
          {documentsList?.data?.map((document) => {
            return (
              <Grid
                item
                xs={12}
                onClick={() => setSelectedDocument(document?.id)}
                sx={{
                  borderRadius: 1,
                  padding: "0.5rem",
                  "&:hover": {
                    backgroundColor: "#553F5C",
                  },
                  ...{
                    backgroundColor:
                      selectedDocument === document?.id ? "#553F5C" : null,
                  },
                }}
              >
                <Typography color={"white"}>Document {document?.id}</Typography>
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
              <div style={{ color: "black" }}>
                <div
                  style={{
                    height: "calc(100% - 2rem)",
                    padding: "1rem",
                    marginRight: "1rem",
                    overflow: "auto",
                    background: "white",
                    borderRadius: 4,
                  }}
                >
                  {renderDocument()}
                </div>
              </div>
              <div>
                <Grid
                  item
                  container
                  xs={12}
                  paddingX={2}
                  style={{ height: "100%" }}
                  alignContent="space-between"
                >
                  <Grid item xs={12} style={{ height: "calc(100% - 4rem)" }}>
                    <ChatInterface
                      queries={
                        documentsList?.data?.find(
                          (document) => document.id === selectedDocument
                        )?.queries
                      }
                      isCreatingQuery={isCreateQueryPending}
                      setSectionToHighlight={(sectionNumber) => {
                        scrollToElementById(sectionNumber);
                        if (sectionToHighlight.includes(sectionNumber)) {
                          setSectionToHighlight([]);
                          return;
                        } else {
                          setSectionToHighlight([sectionNumber]);
                        }
                      }}
                      queryText={queryText}
                    />
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          createQuery();
                        }
                      }}
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
                              onClick={() => createQuery()}
                            >
                              <ArrowRightAltSharp />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      color="error"
                      value={textfieldQuery}
                      onChange={(e) => setTextFieldQuery(e.target.value)}
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
                  padding: "1rem",
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
                {isUploadDocumentPending ? <CircularProgress /> : "Upload"}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default App;
