import { createContext, useContext } from "react";

export const ThemeModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
});

export const useThemeMode = () => {
  return useContext(ThemeModeContext);
};
