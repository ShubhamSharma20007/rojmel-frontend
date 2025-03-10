import React from "react";
import { Alert, BackHandler, StyleSheet } from "react-native";
import { BottomNavigation } from "react-native-paper";
import Home from "./home";
import Rojmel from "./rojmel";
import More from "./more";
import Report from "./report";
import Entypo from "@expo/vector-icons/Entypo";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabLayout() {
  React.useEffect(() => {
    const onBackPress = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default back action
    };

    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "હેડ",
      focusedIcon: (props :any) => <Entypo name="graduation-cap" size={20} {...props} />,
      unfocusedIcon: (props :any) => <SimpleLineIcons name="graduation" size={20} {...props} />,
    },
    {
      key: "rojmel",
      title: "રોજમેળ",
      focusedIcon: (props :any) => <MaterialCommunityIcons name="store" size={20} {...props} />,
      unfocusedIcon: (props :any) => <MaterialCommunityIcons name="store-outline" size={20} {...props} />,
    },
    {
      key: "report",
      title: "રિપોર્ટ્સ",
      focusedIcon: (props :any) => <MaterialCommunityIcons name="book" size={20} {...props} />,
      unfocusedIcon: (props :any) => <MaterialCommunityIcons name="book-outline" size={20} {...props} />,
    },
    {
      key: "more",
      title: "વધુ",
      focusedIcon: (props :any) => <MaterialCommunityIcons name="dots-horizontal" size={20} {...props} />,
      unfocusedIcon: (props :any) => <MaterialCommunityIcons name="dots-horizontal" size={20} {...props} />,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    rojmel: Rojmel,
    report: Report,
    more: More,
  });

  return (
    <BottomNavigation
      barStyle={{ backgroundColor: "#E3F2FD" }}
      activeIndicatorStyle={{ backgroundColor: "#1976D2", opacity: 0.4 }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}