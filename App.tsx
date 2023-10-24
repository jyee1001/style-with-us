import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./app/screens/auth/Login";
import Home from "./app/screens/home/Home";
import { User, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import Planner from "./app/screens/planner/Planner";
import Closet from "./app/screens/closet/Closet";
import Inside from "./app/screens/navigators/InsideNavigator";

const Stack = createNativeStackNavigator();

// const InsideStack = createNativeStackNavigator();

// function InsideLayout() {
//   return (
//     <InsideStack.Navigator >
//       <InsideStack.Screen name="Inside" component={Inside} />
//       {/* <InsideStack.Screen name="Home" component={Home} />
//       <InsideStack.Screen name="Planner" component={Planner} />
//       <InsideStack.Screen name="Closet" component={Closet} /> */}

//     </InsideStack.Navigator>
//   )
// }
export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={Inside}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
