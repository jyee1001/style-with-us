import { View, Text, Button, StyleSheet } from "react-native";
import React from "react";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Planner from "../planner/Planner";
import Closet from "../closet/Closet";
import firebase from "firebase/app";
import "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: RouterProps) => {
  return (
    <View style={styles.container}>
      <Button
        onPress={() => console.log(getAuth().currentUser?.uid)}
        title="open page"
      />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logo" />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
});
