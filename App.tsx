import { NativeBaseProvider, StatusBar, useTheme } from "native-base";

import {
  useFonts,
  Karla_400Regular,
  Karla_700Bold,
} from "@expo-google-fonts/karla";

import { THEME } from "./src/theme";
import { Routes } from "@routes/index";
import { AuthContextProvider } from "@contexts/AuthContext";

export default function App() {
  const [fontLoaded] = useFonts({
    Karla_400Regular,
    Karla_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={"#EDECEE"}
        translucent
      />
      <AuthContextProvider>
        {fontLoaded ? <Routes /> : null}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
