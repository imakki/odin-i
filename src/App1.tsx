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
import { useMutation } from "@tanstack/react-query";
import summariesList from "./data.json";
import queryData from "./queryData.json";
import UserInput from "./UserInput";

const BASE_URL = "https://94f2-171-76-83-95.ngrok-free.app";

const summarisePost = async (text) => {
  const response = await fetch(`${BASE_URL}/document`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const querySummary = async ({ context, question }) => {
  const response = await fetch(`${BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // contexts: [context],
      // questions: [question],
      document_id: "26",
      query: question,
    }),
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

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
  const [file, setFile] = useState(null);

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
    mutateQuery.data?.answer?.flatMap((query) => {
      console.log(query);
      return query.section_number;
    }) ?? [];

  console.log("debug:highlightedSections", { data: data });

  return (
    <Grid container style={{ height: "100vh", width: "100vw" }}>
      {/* <Grid
        item
        xs={2}
        style={{
          backgroundColor: "hsla(0,0%,100%,.1)",
          borderRight: "1px solid",
        }}
      >
        History
      </Grid> */}
      <Grid
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
          file={file}
          setFile={setFile}
        />
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
      </Grid>
      <Grid
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
            {/* <div
      dangerouslySetInnerHTML={{__html: "You can acquire Content on our Services for free or for a charge, either\nof which is referred to as a \"Transaction.\" By each Transaction you\nacquire a license to use the Content only. Each Transaction is an\nelectronic contract between you and Apple, and/or you and the entity\nproviding the Content on our Services. However, if you are a customer of\nApple Distribution International Ltd., then Apple Distribution\nInternational Ltd. is the merchant of record for some Content you\nacquire from Apple Books, Apple Podcasts, or App Store as displayed on\nthe product page and/or during the acquisition process for the relevant\nService. In such case, you acquire the Content from Apple Distribution\nInternational Ltd., which is licensed by the Content provider (e.g., App\nProvider (as defined below), book publisher, etc.). When you make your\nfirst Transaction, we will ask you to choose how frequently we should\nask for your password for future Transactions. On applicable Apple\nhardware, if you enable Touch ID for Transactions, we will ask you to\nauthenticate all Transactions with your fingerprint, and if you enable\nFace ID for Transactions, we will ask you to authenticate all\nTransactions using facial recognition. Manage your password settings at\nany time by following these instructions:\nhttps://support.apple.com/HT204030. Apple will charge your selected\npayment method for any paid Transactions, including any applicable\ntaxes. If you have also added it to your Apple Wallet, Apple may charge\nyour selected payment method in Apple Wallet using Apple Pay. You can\nassociate multiple payment methods with your Apple ID, and you agree\nthat Apple may store and charge those payment methods for Transactions.\nYour primary payment method appears at the top of your account settings\npayments page. If your primary payment method cannot be charged for any\nreason (such as expiration or insufficient funds), you authorize Apple\nto attempt to charge your other eligible payment methods in order from\ntop to bottom as they appear on your account settings payments page. If\nwe cannot charge you, you remain responsible for any uncollected\namounts, and we may attempt to charge you again or request that you\nprovide another payment method. If you pre-order Content, you will be\ncharged when the Content is delivered to you (unless you cancel prior to\nthe Content's availability). In accordance with local law, Apple may\nautomatically update your payment information regarding your payment\nmethods"}}
    /> */}
            <Box>
              {data.sumaary.pages.map((page) => (
                <Box>
                  <Typography>{page.page_number}</Typography>
                  {page.sections.map((section) => (
                    <Box
                      id={`${section.section_number}`}
                      key={`${section.section_number}`}
                      style={{
                        backgroundColor: highlightedSections.includes(
                          section.section_number
                        )
                          ? "yellow"
                          : "black",
                        color: highlightedSections.includes(
                          section.section_number
                        )
                          ? "black"
                          : "white",
                      }}
                    >
                      {isSummaryMode ? (
                        <Box display={"flex"}>
                          <Typography>{section.section_number}</Typography>
                          <Typography>{section.summary}</Typography>
                        </Box>
                      ) : (
                        <Box display={"flex"}>
                          <Typography>{section.section_number}</Typography>
                          <Typography>{section.section_text}</Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              ))}
              {/* {data?.summaries[0].map((summary) => {
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
              })} */}
            </Box>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

export default App;
