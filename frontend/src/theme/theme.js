import { createTheme } from "@mui/material/styles";

const palettes = {
  light: {
    ink: "#0f172a",
    inkSoft: "#1e293b",
    muted: "#64748b",
    bg: "#f5f8ff",
    paper: "#ffffff",
    paperSoft: "#f8fbff",
    primary: "#0f172a",
    primaryLight: "#1e293b",
    primaryDark: "#020617",
    secondary: "#2563eb",
    secondaryLight: "#60a5fa",
    secondaryDark: "#1d4ed8",
    accent: "#06b6d4",
    line: "rgba(15, 23, 42, 0.1)",
    softLine: "rgba(15, 23, 42, 0.08)",
    input: "rgba(255, 255, 255, 0.88)",
    bodyBackground:
      "radial-gradient(circle at top left, rgba(37, 99, 235, 0.16), transparent 28%), radial-gradient(circle at 90% 10%, rgba(6, 182, 212, 0.14), transparent 26%), linear-gradient(135deg, #f5f8ff 0%, #eef6ff 48%, #f8fbff 100%)",
    surfaceGradient:
      "linear-gradient(160deg, rgba(255, 255, 255, 0.98), rgba(241, 247, 255, 0.88))",
    buttonGradient: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 58%, #06b6d4 100%)",
    focusRing: "rgba(37, 99, 235, 0.16)",
    selection: "rgba(37, 99, 235, 0.24)",
    shadow: "0 24px 70px rgba(15, 23, 42, 0.1)",
    shadowStrong: "0 18px 44px rgba(15, 23, 42, 0.22)",
  },
  dark: {
    ink: "#e5edff",
    inkSoft: "#cbd5e1",
    muted: "#94a3b8",
    bg: "#020617",
    paper: "#08111f",
    paperSoft: "#0f172a",
    primary: "#38bdf8",
    primaryLight: "#7dd3fc",
    primaryDark: "#0ea5e9",
    secondary: "#60a5fa",
    secondaryLight: "#93c5fd",
    secondaryDark: "#2563eb",
    accent: "#22d3ee",
    line: "rgba(148, 163, 184, 0.16)",
    softLine: "rgba(148, 163, 184, 0.1)",
    input: "rgba(15, 23, 42, 0.82)",
    bodyBackground:
      "radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 30%), radial-gradient(circle at 88% 8%, rgba(37, 99, 235, 0.2), transparent 26%), linear-gradient(135deg, #020617 0%, #07111f 48%, #0f172a 100%)",
    surfaceGradient:
      "linear-gradient(160deg, rgba(15, 23, 42, 0.96), rgba(8, 17, 31, 0.92))",
    buttonGradient: "linear-gradient(135deg, #38bdf8 0%, #2563eb 58%, #22d3ee 100%)",
    focusRing: "rgba(56, 189, 248, 0.18)",
    selection: "rgba(56, 189, 248, 0.3)",
    shadow: "0 24px 70px rgba(0, 0, 0, 0.28)",
    shadowStrong: "0 18px 44px rgba(14, 165, 233, 0.2)",
  },
};

export const createAppTheme = (mode = "light") => {
  const isDark = mode === "dark";
  const palette = palettes[mode] || palettes.light;

  return createTheme({
    palette: {
      mode,
      primary: {
        main: palette.primary,
        light: palette.primaryLight,
        dark: palette.primaryDark,
        contrastText: isDark ? "#020617" : "#ffffff",
      },
      secondary: {
        main: palette.secondary,
        light: palette.secondaryLight,
        dark: palette.secondaryDark,
        contrastText: "#ffffff",
      },
      success: {
        main: isDark ? "#34d399" : "#059669",
      },
      error: {
        main: isDark ? "#f87171" : "#dc2626",
      },
      text: {
        primary: palette.ink,
        secondary: palette.muted,
      },
      background: {
        default: palette.bg,
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
            background: palette.bodyBackground,
          },
          "::selection": {
            backgroundColor: palette.selection,
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
            boxShadow: palette.shadow,
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
            background: palette.surfaceGradient,
            boxShadow: palette.shadow,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          size: "medium",
        },
        styleOverrides: {
          root: {
            borderRadius: 999,
            minHeight: 42,
            paddingInline: 22,
            boxShadow: "none",
          },
          sizeSmall: {
            minHeight: 36,
            paddingInline: 16,
          },
          sizeLarge: {
            minHeight: 48,
            paddingInline: 26,
          },
          contained: {
            background: palette.buttonGradient,
            color: isDark ? "#020617" : "#ffffff",
            boxShadow: palette.shadowStrong,
            "&:hover": {
              boxShadow: palette.shadowStrong,
            },
          },
          outlined: {
            borderColor: isDark
              ? "rgba(148, 163, 184, 0.28)"
              : "rgba(15, 23, 42, 0.18)",
            color: palette.ink,
            backgroundColor: isDark ? "rgba(15, 23, 42, 0.5)" : "rgba(255, 255, 255, 0.56)",
            "&:hover": {
              borderColor: isDark
                ? "rgba(56, 189, 248, 0.55)"
                : "rgba(37, 99, 235, 0.46)",
              backgroundColor: isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(37, 99, 235, 0.08)",
            },
          },
          text: {
            color: palette.muted,
            "&:hover": {
              color: palette.ink,
              backgroundColor: isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(37, 99, 235, 0.08)",
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: palette.input,
            transition: "box-shadow 160ms ease, background-color 160ms ease",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: isDark
                ? "rgba(148, 163, 184, 0.34)"
                : "rgba(15, 23, 42, 0.32)",
            },
            "&.Mui-focused": {
              boxShadow: `0 0 0 4px ${palette.focusRing}`,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: palette.secondary,
            },
          },
          notchedOutline: {
            borderColor: isDark
              ? "rgba(148, 163, 184, 0.18)"
              : "rgba(15, 23, 42, 0.14)",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: palette.muted,
            "&.Mui-focused": {
              color: palette.secondary,
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
            backgroundColor: isDark ? "rgba(148, 163, 184, 0.06)" : "rgba(15, 23, 42, 0.035)",
          },
          body: {
            borderColor: palette.softLine,
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
};

const theme = createAppTheme();

export default theme;
