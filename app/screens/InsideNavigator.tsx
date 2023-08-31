import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Planner from "./planner/Planner";
import Closet from "./closet/Closet";
import Home from "./home/Home";
import Profile from "./profile/Profile";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

const Inside = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.tabBarIconContainer}
              name="home-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Closet"
        component={Closet}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.tabBarIconContainer}
              name="body-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Planner"
        component={Planner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.tabBarIconContainer}
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.tabBarIconContainer}
              name="person-circle-outline"
              size={size}
              color={color}
            />
          ),
          tabBarLabel: "",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarIconContainer: {
    padding: 10,
  },
  tabBar: {
    backgroundColor: "black",
    height: 80,
  },
});

export default Inside;
