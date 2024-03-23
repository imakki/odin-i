import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import UserInput from "../UserInput";

const Content = ({
  summaryList,
  highlightedSections,
  isSummaryMode = true,
}) => {
  console.log("debug:summaryList", { summaryList });
  return (
    <Grid
      item
      xs={5}
      style={{
        backgroundColor: "hsla(0,0%,100%,.2)",
        borderRight: "1px solid",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        overflow: "scroll",
      }}
    >
      <Box>
        {summaryList?.map((summary) => {
          return (
            <Box
              id={`${summary.section_number}`}
              key={`${summary.section_number}`}
              style={{
                backgroundColor: highlightedSections.includes(
                  summary.section_number
                )
                  ? "yellow"
                  : "transparent",
                color: highlightedSections.includes(summary.section_number)
                  ? "black"
                  : "white",
              }}
            >
              {isSummaryMode ? (
                <Box display={"flex"}>
                  <Typography>{summary.section_number}</Typography>
                  <Typography>
                    {summary.summary ?? summary.section_text}
                  </Typography>
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
    </Grid>
  );
};

export default Content;
