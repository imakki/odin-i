import { Send } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

const Query = ({ queries, setSectionToHighlight }) => {
  return (
    <Grid
      item
      xs={4}
      style={{
        backgroundColor: "hsla(0,0%,100%,.1)",

        overflow: "scroll",
        padding: "16px",
      }}
    >
      <Box
        sx={{
          height: "calc(100vh - 95px)",
          overflow: "scroll",
        }}
      >
        <ChatInterface
          queries={queries}
          setSectionToHighlight={setSectionToHighlight}
        />
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
          value={""}
          onChange={() => {}}
          placeholder="Type your question here..."
          InputProps={{
            endAdornment: (
              <IconButton
                onClick={() => {}}
                sx={{ marginLeft: "8px" }}
                variant="contained"
                // disabled={mutateQuery.isPending}
              >
                {/* {mutateQuery.isPending ? "..." : "Submit"} */}
                <Send />
              </IconButton>
            ),
          }}
        />
      </Box>
    </Grid>
  );
};

const ChatInterface = ({ queries, setSectionToHighlight }) => {
  return (
    <Box style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      {queries.map((query, queryIndex) => (
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
                style={{ maxWidth: "80%", backgroundColor: "#f0f0f0" }}
              >
                <CardContent>
                  <Typography variant="body2">{query.query}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Answer section */}
          <Grid container spacing={2} style={{ marginBottom: "40px" }}>
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
                <Card variant="outlined" style={{ maxWidth: "80%" }}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Answer {answer.section_number}
                    </Typography>
                    <Typography variant="body2">
                      {answer.explaination_in_English_language}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default Query;
