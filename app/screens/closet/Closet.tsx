import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Button,
  StyleSheet,
} from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import addClothes from "./addClothes";

const Stack = createNativeStackNavigator();

const Closet = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.captureButton}></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Closet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "red",
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  add: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});
