import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Planner from "../planner/Planner";
import OutfitScreen from "../planner/OutfitScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Planner" component={Planner} />
        <Stack.Screen name="Outfit" component={OutfitScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;