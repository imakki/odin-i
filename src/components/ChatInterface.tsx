import React, { useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

const ChatInterface = ({
  queries,
  setSectionToHighlight,
  isCreatingQuery,
  queryText,
}) => {
  // Ref for the container Box
  const scrollRef = useRef(null);

  // UseEffect to scroll to the bottom whenever queries change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [queries, isCreatingQuery]);

  return (
    <Box
      ref={scrollRef}
      style={{
        maxWidth: "800px",
        height: "100%",
        overflow: "auto",
        scrollbarWidth: "none",
      }}
    >
      {queries?.map((query, queryIndex) => (
        <React.Fragment key={queryIndex}>
          {/* Question section */}
          <Grid container spacing={2} style={{ marginBottom: "20px" }}>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Card
                variant="outlined"
                style={{
                  maxWidth: "80%",
                  backgroundColor: "#18181b",
                  color: "white",
                  borderRadius: "10px",
                  padding: "1rem",
                }}
              >
                <Typography variant="body2">{query.query}</Typography>
              </Card>
            </Grid>
          </Grid>

          {/* Answer section */}
          <Grid container spacing={1} style={{ marginBottom: "20px" }}>
            {query.answer.map((answer, answerIndex) => (
              <Grid
                item
                xs={12}
                key={answerIndex}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setSectionToHighlight(
                    answer.section_number,
                    answer.page_number
                  )
                }
              >
                <Card
                  elevation={0}
                  style={{
                    maxWidth: "80%",
                    background: "white",
                    color: "#18181b",
                    borderRadius: "10px",
                    padding: "1rem",
                  }}
                >
                  {/* <Typography color="textSecondary" gutterBottom>
                      Answer {answer.section_number}
                    </Typography> */}
                  <Typography variant="body2">{answer.answer}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ))}
      {isCreatingQuery && (
        <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress style={{ marginRight: "1rem" }} size={30} />
              <Card
                variant="outlined"
                style={{
                  backgroundColor: "#18181b",
                  color: "white",
                  borderRadius: "10px",
                  padding: "1rem",
                }}
              >
                <Typography variant="body2">{queryText}</Typography>
              </Card>
            </div>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ChatInterface;
