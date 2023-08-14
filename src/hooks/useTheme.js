import { useContext } from "react";
import ThemeContext from "../context/theme/theme.provider";

const useTheme = () => {
    return useContext(ThemeContext)
}

export default useTheme;