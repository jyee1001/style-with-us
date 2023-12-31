import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Closet from "../closet/Closet";
import Jackets from "../closet/Jackets";
import Pants from "../closet/Pants";
import Shorts from "../closet/Shorts";
import Shirts from "../closet/Shirts";
import Shoes from "../closet/Shoes";
import Hats from "../closet/Hats";
import Outfits from "../closet/Outfits";
import Dresses from "../closet/Dresses";
import Accessories from "../closet/Accessories";

const ClosetStack = createNativeStackNavigator();
const ClosetNavigator = () => {
  return (
    <ClosetStack.Navigator screenOptions={{ headerShown: false }}>
      <ClosetStack.Screen name="Closet" component={Closet} />
      <ClosetStack.Screen name="Shirts" component={Shirts} />
      <ClosetStack.Screen name="Shorts" component={Shorts} />
      <ClosetStack.Screen name="Pants" component={Pants} />
      <ClosetStack.Screen name="Hats" component={Hats} />
      <ClosetStack.Screen name="Jackets" component={Jackets} />
      <ClosetStack.Screen name="Shoes" component={Shoes} />
      <ClosetStack.Screen name="Dresses" component={Dresses} />
      <ClosetStack.Screen name="Accessories" component={Accessories} />

      <ClosetStack.Screen name="Outfits" component={Outfits} />
    </ClosetStack.Navigator>
  );
};

export default ClosetNavigator;
