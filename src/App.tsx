import {
  ArrowRightAltSharp,
  ChevronLeft,
  ChevronRight,
  Close,
} from "@mui/icons-material";
import {
  Box,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Split from "react-split";
import "./App.css";
import FileUploadButton from "./FileUpload";
import FileDropArea from "./components/FileDropArea";
import { apiClient } from "./utils/apiClient";
import ChatInterface from "./components/ChatInterface";
import UserProfile from "./components/UserProfile";

const scrollToElementById = (elementId) => {
  // Find the element
  const element = document.getElementById(elementId);

  // Scroll to the element if it exists
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function CompanyBrand({ name, version }) {
  // Use a theme hook if you have a custom theme for consistency
  // const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px",
        backgroundColor: "#f5f5f5", // This color is a placeholder, replace it with your actual color code
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // subtle shadow for depth
        marginTop: "16px",
        // Use theme.spacing for consistent spacing if using a custom MUI theme
        // padding: theme.spacing(2),
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
        {name}
      </Typography>
      <Typography variant="overline" fontSize={"10px"} sx={{ color: "#666" }}>
        {version} Release
      </Typography>
    </Box>
  );
}

const App = ({ signOut, user }) => {
  console.log("debug:user", { user });
  const theme = useTheme();
  const [queryText, setQueryText] = useState("");
  const [textfieldQuery, setTextFieldQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState();
  const [isDocumentListDrawerOpen, setIsDocumentListDrawerOpen] =
    useState(true);
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
      return await apiClient.get("/document?limit=30");
    },
  });

  const {
    data: userDetail,
    isError: isFetchUserDetailError,
    isLoading: isFetchUserDetailLoading,
  } = useQuery({
    queryKey: ["userDetail", {}],
    queryFn: async () => {
      return await apiClient.get("/user");
    },
  });

  console.log("debug:User email", { userDetail: userDetail?.data?.email });

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
        if (file) {
          formData.append("file", file?.[0]);
        }
      }
      return await apiClient.post(
        "/document",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
    },
    onSuccess: (data) => {
      console.log("Document uploaded successfully", data);
      console.log("Document ID", data.data.id);
      // @ts-ignore
      queryClient.invalidateQueries("documentsList");
      setIsContentUploadModalOpen(false);
      setSelectedDocument(data.data.id);
      setSectionToHighlight([]);
      setContentText("");
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
      return await apiClient.post("/async-query", {
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
      // @ts-ignore
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

  console.log("debug:documentsList", {
    selectedDoc: documentsList?.data?.find(
      (document) => document.id === selectedDocument
    ),
  });

  const renderDocument = () => {
    return documentsList?.data
      ?.find((document) => document.id === selectedDocument)
      ?.summary?.pages?.map((page) => (
        <Box
          sx={{
            marginBottom: 2,
            background: "white",
            padding: 2,
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            Page No: {page.page_number + 1}
          </Typography>
          {page.sections.map((section) => (
            <Box
              id={`${section.section_number}XXX${page.page_number}`}
              key={`${section.section_number}XXX${page.page_number}`}
              style={{
                backgroundColor: sectionToHighlight.includes(
                  section.section_number
                )
                  ? "#E6E6FA"
                  : "white",
                color: sectionToHighlight.includes(section.section_number)
                  ? "black"
                  : "black",
              }}
            >
              <Box display={"flex"} marginBottom={"1rem"}>
                {/* <Typography>{section.section_number}</Typography> */}
                <Typography>{section.section_text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ));
  };

  console.log("debug:sectionToHighlight", { sectionToHighlight });

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
                Upload New Document
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                height: "calc(100vh - 240px)",
                overflow: "auto",
              }}
            >
              {documentsList?.data?.map((document) => {
                return (
                  <Grid
                    item
                    xs={12}
                    onClick={() => {
                      setSelectedDocument(document?.id);
                      setSectionToHighlight([]);
                    }}
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
                    <Typography color={"white"}>
                      {document?.name.length > 27 + 3
                        ? `${document?.name.substring(0, 27)}...`
                        : document?.name}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
            <UserProfile
              username={userDetail?.data?.email.split("@")[0]}
              onLogout={signOut}
            />
            <CompanyBrand name="chatginie" version="Alpha" />
          </Grid>
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
            // margin: "1rem",
            borderRadius: 8,
            // padding: "1rem",
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
            style={{ height: "95vh", width: "100%" }}
            alignContent="space-between"
          >
            <Split className="split">
              <div style={{ color: "black" }}>
                <div
                  style={{
                    height: "100%",
                    padding: "1rem",
                    marginRight: "1rem",
                    overflow: "auto",

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
                      setSectionToHighlight={(sectionNumber, pageNumber) => {
                        scrollToElementById(`${sectionNumber}XXX${pageNumber}`);
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
                        if (e.key === "Enter" && !e.shiftKey) {
                          // Prevent new line on Enter unless Shift is also pressed
                          e.preventDefault(); // Prevent the default action (new line)
                          createQuery(); // Assume this updates the query list and clears the input
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
                {isUploadDocumentPending ? "Uploading..." : "Upload"}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default App;
