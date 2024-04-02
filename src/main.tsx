import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App1.tsx";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.tsx";
import { Amplify } from "aws-amplify";
import { withAuthenticator, Button, Heading } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

// Configure Amplify in index file or root file
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: awsExports.USER_POOL_ID,
      userPoolClientId: awsExports.USER_POOL_APP_CLIENT_ID,
    },
  },
});

export const queryClient = new QueryClient();

const authConfig = {
  hideSignUp: true, // This hides the signup option
};

const AppwithAuth = withAuthenticator(App, authConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* @ts-ignore */}
        <AppwithAuth />
      </ThemeProvider>
    </QueryClientProvider>
  </>
);
