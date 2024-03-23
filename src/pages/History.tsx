import {
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemButton,
} from "@mui/material";
import UserInput from "../UserInput";

const History = ({
  text,
  handleChange,
  handleSummarize,
  isPending,
  isLoading,
  historyList,
  setSelectedDocSummary,
  setSelectedDoc,
}) => {
  console.log("debug:historyList", { historyList });
  return (
    <Grid
      item
      xs={3}
      style={{
        backgroundColor: "hsla(0,0%,100%,.1)",
        borderRight: "1px solid",
        padding: "16px",
      }}
    >
      <UserInput
        text={text}
        handleChange={handleChange}
        handleSummarize={handleSummarize}
        isPending={isPending}
      />
      <Box
        sx={{
          height: "calc(100vh - 150px)",
          overflow: "scroll",
        }}
      >
        {isLoading ? (
          <CircularProgress size={"20"} />
        ) : (
          historyList.map((history) => {
            return (
              <List
                style={{
                  overflow: "scroll",
                }}
              >
                <ListItemButton
                  onClick={() => {
                    setSelectedDocSummary(history?.summary?.flat());
                    setSelectedDoc(history);
                  }}
                >
                  <ListItem key={history.id}>Document {history.id}</ListItem>
                </ListItemButton>
              </List>
            );
          })
        )}
      </Box>
    </Grid>
  );
};

export default History;
