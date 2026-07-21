import { createTheme } from "@mui/material/styles";

const palette = {
  ink: "#14110f",
  inkSoft: "#2f2a25",
  muted: "#7b7166",
  ivory: "#fbf8f1",
  paper: "#fffdf8",
  champagne: "#c8a96a",
  champagneDark: "#9f7b35",
  line: "rgba(20, 17, 15, 0.1)",
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.ink,
      light: palette.inkSoft,
      dark: "#050505",
      contrastText: "#ffffff",
    },
    secondary: {
      main: palette.champagne,
      dark: palette.champagneDark,
      contrastText: palette.ink,
    },
    success: {
      main: "#476a53",
    },
    error: {
      main: "#9f3f36",
    },
    text: {
      primary: palette.ink,
      secondary: palette.muted,
    },
    background: {
      default: palette.ivory,
      paper: palette.paper,
    },
    divider: palette.line,
  },
  typography: {
    fontFamily:
      "Inter, Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.045em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "-0.035em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(200, 169, 106, 0.26), transparent 30%), linear-gradient(135deg, #fbf8f1 0%, #f4efe5 45%, #fbf8f1 100%)",
        },
        "::selection": {
          backgroundColor: "rgba(200, 169, 106, 0.35)",
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${palette.line}`,
          boxShadow: "0 24px 70px rgba(20, 17, 15, 0.08)",
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: `1px solid ${palette.line}`,
          background:
            "linear-gradient(160deg, rgba(255, 253, 248, 0.98), rgba(248, 243, 233, 0.88))",
          boxShadow: "0 24px 70px rgba(20, 17, 15, 0.08)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          minHeight: 42,
          paddingInline: 22,
          boxShadow: "none",
        },
        contained: {
          background:
            "linear-gradient(135deg, #14110f 0%, #2f2a25 55%, #14110f 100%)",
          color: "#ffffff",
          boxShadow: "0 14px 34px rgba(20, 17, 15, 0.18)",
          "&:hover": {
            boxShadow: "0 18px 44px rgba(20, 17, 15, 0.24)",
          },
        },
        outlined: {
          borderColor: "rgba(20, 17, 15, 0.18)",
          color: palette.ink,
          backgroundColor: "rgba(255, 253, 248, 0.55)",
          "&:hover": {
            borderColor: "rgba(20, 17, 15, 0.38)",
            backgroundColor: "rgba(200, 169, 106, 0.08)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundColor: "rgba(255, 253, 248, 0.86)",
          transition: "box-shadow 160ms ease, background-color 160ms ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(20, 17, 15, 0.32)",
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 4px rgba(200, 169, 106, 0.16)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: palette.champagne,
          },
        },
        notchedOutline: {
          borderColor: "rgba(20, 17, 15, 0.14)",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: palette.muted,
          "&.Mui-focused": {
            color: palette.champagneDark,
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          overflow: "hidden",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: palette.muted,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          backgroundColor: "rgba(20, 17, 15, 0.03)",
        },
        body: {
          borderColor: "rgba(20, 17, 15, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 700,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
  },
});

export default theme;
