import { Platform } from "react-native";
import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from "@react-navigation/bottom-tabs";

import { useTheme } from "native-base";

import { House, Tag, SignOut } from "phosphor-react-native";

import { Home } from "@screens/Home";
import { Teste } from "@screens/Teste";
import { Announcement } from "@screens/Announcement";
import { MyAnnouncement } from "@screens/MyAnnouncement";
import { MyAnnouncements } from "@screens/MyAnnouncements";
import { NewAnnouncement } from "@screens/NewAnnouncement";

type AppRoutes = {
  home: undefined;
  myAnnouncement: undefined;
  myAnnouncements: undefined;
  newAnnouncement: undefined;
  logout: undefined;
  announcement: undefined;
};

export type AppNavigatorProps = BottomTabNavigationProp<AppRoutes>;

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>();

export function AppRoutes() {
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
        name="myAnnouncements"
        component={MyAnnouncements}
        options={{
          tabBarIcon: ({ color }) => (
            <Tag color={color} size={iconSize} weight="bold" />
          ),
        }}
      />

      <Screen
        name="logout"
        component={Teste}
        options={{
          tabBarIcon: ({ color }) => (
            <SignOut color={colors.red[50]} size={iconSize} weight="bold" />
          ),
        }}
      />

      <Screen
        name="newAnnouncement"
        component={NewAnnouncement}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Screen
        name="announcement"
        component={Announcement}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Screen
        name="myAnnouncement"
        component={MyAnnouncement}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: "none" },
        }}
      />
    </Navigator>
  );
}
