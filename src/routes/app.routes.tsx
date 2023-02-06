import { useTheme } from "native-base";
import { Platform, Pressable } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";
import { House, Tag, SignOut } from "phosphor-react-native";

import { useAuth } from "@hooks/useAuth";

import { Home } from "@screens/Home";
import { SignOut as SignOutScreen } from "@screens/SignOut";
import { Product } from "@screens/Product";
import { MyProducts } from "@screens/MyProducts";
import { NewProduct } from "@screens/NewProduct";
import { PreviewProduct } from "@screens/PreviewProducts";

type AppRoutes = {
  home: undefined;
  product: {
    isOwner: boolean;
    productId: string;
  };
  myProducts: undefined;

  newProduct: {
    isEdit: boolean;
    productId?: string;
  };

  previewProduct: {
    productId: string;
  };
  logout: undefined;
};

export type AppNavigatorProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
  const { signOut } = useAuth();
  const { sizes, colors } = useTheme();
  const iconSize = sizes[6];
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[200],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: Platform.OS === "android" ? 50 : 96,
          paddingBottom: sizes[5],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <House color={color} size={iconSize} weight="bold" />
          ),
        }}
      />
      <Screen
        name="myProducts"
        component={MyProducts}
        options={{
          tabBarIcon: ({ color }) => (
            <Tag color={color} size={iconSize} weight="bold" />
          ),
        }}
      />

      <Screen
        name="logout"
        component={SignOut}
        options={{
          tabBarIcon: ({ color }) => (
            <Pressable onPress={signOut}>
              <SignOut color={colors.red[50]} size={iconSize} weight="bold" />
            </Pressable>
          ),
        }}
      />

      <Screen
        name="newProduct"
        component={NewProduct}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Screen
        name="product"
        component={Product}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Screen
        name="previewProduct"
        component={PreviewProduct}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Navigator>
  );
}
