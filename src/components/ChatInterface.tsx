import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

const ChatInterface = ({
  queries,
  setSectionToHighlight,
  isCreatingQuery,
  queryText,
}) => {
  return (
    <Box
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
                style={{ maxWidth: "80%", backgroundColor: "#18181b", color: 'white', borderRadius: '10px', padding: '1rem' }}
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
                onClick={() => setSectionToHighlight(answer.section_number)}
              >
                <Card elevation={0} style={{ maxWidth: "80%", background: 'white', color: '#18181b', borderRadius: '10px', padding: '1rem' }}>
                    {/* <Typography color="textSecondary" gutterBottom>
                      Answer {answer.section_number}
                    </Typography> */}
                    <Typography variant="body2">
                      {answer.explaination_in_English_language}
                    </Typography>
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
            <Card
              variant="outlined"
              style={{ maxWidth: "80%", backgroundColor: "#f0f0f0" }}
            >
              <CardContent>
                <Typography variant="body2">{queryText}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ChatInterface;
