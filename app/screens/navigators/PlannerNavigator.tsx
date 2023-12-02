import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Planner from "../planner/Planner";
import ChooseOutfitScreen from "../planner/ChooseOutfitScreen";

const PlannerStack = createNativeStackNavigator();
const PlannerNavigator = () => {
  return (
    <PlannerStack.Navigator screenOptions={{ headerShown: false }}>
      <PlannerStack.Screen name="Planner" component={Planner} />
      <PlannerStack.Screen
        name="Choose Outfit"
        component={ChooseOutfitScreen}
      />
    </PlannerStack.Navigator>
  );
};

export default PlannerNavigator;
