import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, Text } from 'react-native-paper';
import Home from "./home";
import Rojmel from "./rojmel";
import More from "./more";
import Report from "./report";
export default function TabLayout() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'હેડ', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'rojmel', title: 'રોજમેળ', focusedIcon: 'store',unfocusedIcon: 'store-outline' },
    { key: 'report', title: 'રિપોર્ટ્સ', focusedIcon: 'book', unfocusedIcon: 'book-outline' },
    { key: 'more', title: 'વધુ', focusedIcon: 'more', unfocusedIcon: 'more' },
  ]);
  const renderScene = BottomNavigation.SceneMap({
    home: Home,
    rojmel: Rojmel,
    report: Report,
    more: More,
  });
  return (
    <BottomNavigation
    barStyle={{
      backgroundColor:'#E3F2FD'
    }}
  activeIndicatorStyle={{
    backgroundColor:'#1976D2',
    opacity:0.4
  }}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
