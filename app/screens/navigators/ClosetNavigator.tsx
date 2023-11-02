import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Bottoms from "../closet/Bottoms";
import Outerwear from "../closet/Outwear";
import Closet from "../closet/Closet";

const ClosetStack = createNativeStackNavigator();
const ClosetNavigator = () => {
  return (
    <ClosetStack.Navigator>
      <ClosetStack.Screen name="Closet" component={Closet} />
      <ClosetStack.Screen name="Bottoms" component={Bottoms} />
      <ClosetStack.Screen name="Outwear" component={Outerwear} />
    </ClosetStack.Navigator>
  );
};

export default ClosetNavigator;
