import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Box, useTheme } from "native-base";

import { useAuth } from "@hooks/useAuth";
import { AppRoutes } from "./app.routes";
import { AuthRoutes } from "./auth.routes";

export function Routes() {
  const theme = DefaultTheme;
  const { user } = useAuth();
  const { colors } = useTheme();

  theme.colors.background = colors.gray[600];

  return (
    <Box flex={1} bg="gray.100">
      <NavigationContainer>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
