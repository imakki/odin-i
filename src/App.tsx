import { useState } from "react";
import "./App.css";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import UserInput from "./UserInput";
import Home from "./pages/Home";
import Content from "./pages/Content";
import Query from "./pages/Query";
import History from "./pages/History";
import { getDocHistory, querySummary, summarisePost } from "./apis";

const scrollToElementById = (elementId) => {
  // Find the element
  const element = document.getElementById(elementId);

  // Scroll to the element if it exists
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function App() {
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [questions, setQuestion] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedDocSummary, setSelectedDocSummary] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [sectionToHighlight, setSectionToHighlight] = useState([]);

  const { data, error, isPending, mutateAsync } = useMutation({
    mutationFn: summarisePost,
    onSuccess: (response) => {
      console.log(response);
      // Optional: Invalidate and refetch
      // queryClient.invalidateQueries(["users"]);
    },
  });

  const mutateQuery = useMutation({
    mutationFn: querySummary,
    onSuccess: (response) => {
      console.log(response);
      // Optional: Invalidate and refetch
      // queryClient.invalidateQueries(["users"]);
    },
  });

  const { data: historyDetails, isLoading: loadingHistory } = useQuery({
    queryKey: ["docHistory"],
    queryFn: getDocHistory,
  });

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    // Implement the submit logic here.
    // For example, sending the inputText to an API or another component.
    console.log("Submitted text:", inputText);
    await mutateQuery.mutateAsync({
      context: text,
      question: inputText,
    });
  };

  const handleChange = (event) => {
    const inputLines = event.target.value.split("\n");
    if (inputLines.length <= 10) {
      setText(event.target.value);
    } else {
      // If more than 10 lines, limit the text to the first 10 lines.
      setText(inputLines.slice(0, 10).join("\n"));
    }
  };

  const handleSummarize = async () => {
    // Implement the summarization logic or function call here.
    console.log("Summarize the text:", text);
    const data = await mutateAsync(text);
    console.log("debug:data", { data });
  };

  const highlightedSections =
    mutateQuery.data?.query_answers.flatMap((query) => {
      return query.sections.map((section) => {
        return section.section_number;
      });
    }) ?? [];

  console.log("debug:sectionToHighlight", { data: selectedDoc });

  return (
    <Grid container style={{ height: "100vh", width: "100vw" }}>
      <History
        text={text}
        handleChange={handleChange}
        handleSummarize={handleSummarize}
        isPending={isPending}
        historyList={historyDetails}
        isLoading={loadingHistory}
        setSelectedDocSummary={setSelectedDocSummary}
        setSelectedDoc={setSelectedDoc}
      />
      <Content
        summaryList={selectedDocSummary}
        highlightedSections={sectionToHighlight}
        isSummaryMode={isSummaryMode}
      />
      <Query
        queries={selectedDoc?.queries ?? []}
        setSectionToHighlight={(sectionNumber) => {
          scrollToElementById(sectionNumber);
          if (sectionToHighlight.includes(sectionNumber)) {
            setSectionToHighlight([]);
            return;
          } else {
            setSectionToHighlight([sectionNumber]);
          }
        }}
      />
      {/* <Grid
        item
        xs={7}
        style={{
          backgroundColor: "hsla(0,0%,100%,.2)",
          borderRight: "1px solid",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <UserInput
          text={text}
          handleChange={handleChange}
          handleSummarize={handleSummarize}
          isPending={isPending}
        />
        {mutateQuery.isPending ? (
          <CircularProgress size={"20"} />
        ) : (
          <Box>
            {mutateQuery?.data?.query_answers?.length ? (
              <Typography>Answers</Typography>
            ) : null}
            {mutateQuery?.data?.query_answers?.map((query) => {
              return (
                <Box key={`${query.sections}`}>
                  <Typography>{query.query}</Typography>
                  {query.sections.map((section) => {
                    return (
                      <Box
                        onClick={() => {
                          scrollToElementById(section.section_number);
                        }}
                        key={`${section.section_number}`}
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        <Typography>{section.section_number}</Typography>
                        <Typography>
                          {section.explaination_in_English_language}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            borderRadius: "4px",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type your question here..."
            InputProps={{
              endAdornment: (
                <Button
                  onClick={handleSubmit}
                  sx={{ marginLeft: "8px" }}
                  variant="contained"
                  disabled={mutateQuery.isPending}
                >
                  {mutateQuery.isPending ? "..." : "Submit"}
                </Button>
              ),
            }}
          />
        </Box>
      </Grid> */}
      {/* <Grid
        item
        xs={5}
        style={{
          backgroundColor: "hsla(0,0%,100%,.1)",
          height: "100vh",
          overflow: "scroll",
        }}
      >
        {isPending ? (
          <CircularProgress size={20} />
        ) : (
          <Box>
            <Box>
              <Button
                onClick={() => {
                  setIsSummaryMode(!isSummaryMode);
                }}
              >
                Summary
              </Button>
            </Box>
            <Box>
              {data?.summaries[0].map((summary) => {
                return (
                  <Box
                    id={`${summary.section_number}`}
                    key={`${summary.section_number}`}
                    style={{
                      backgroundColor: highlightedSections.includes(
                        summary.section_number
                      )
                        ? "yellow"
                        : "black",
                      color: highlightedSections.includes(
                        summary.section_number
                      )
                        ? "black"
                        : "white",
                    }}
                  >
                    {isSummaryMode ? (
                      <Box display={"flex"}>
                        <Typography>{summary.section_number}</Typography>
                        <Typography>{summary.summary}</Typography>
                      </Box>
                    ) : (
                      <Box display={"flex"}>
                        <Typography>{summary.section_number}</Typography>
                        <Typography>{summary.section_text}</Typography>
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </Grid> */}
    </Grid>
  );
}

export default App;
