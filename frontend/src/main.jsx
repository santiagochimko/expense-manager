import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { store } from "./app/store.js";
import { createAppTheme } from "./theme/theme.js";
import { ThemeModeContext } from "./theme/ThemeModeContext.js";
import App from "./App.jsx";
import "./index.css";

const getInitialMode = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.localStorage.getItem("themeMode") || "light";
};

const Root = () => {
  const [mode, setMode] = useState(getInitialMode);

  const themeMode = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        setMode((currentMode) => {
          const nextMode = currentMode === "light" ? "dark" : "light";
          window.localStorage.setItem("themeMode", nextMode);
          return nextMode;
        });
      },
    }),
    [mode],
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <Provider store={store}>
      <ThemeModeContext.Provider value={themeMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
