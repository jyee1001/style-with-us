import { View, Text, Button, Image, StyleSheet } from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";

const Profile = () => {
  return (

    <View style={{ flex: 1, marginTop: 50, marginLeft: 15, marginRight: 15 }}>
      <View style={styles.container}>
        <View style={styles.circle} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>Age</Text>
        </View>
        <View>
          <Button title="Edit" onPress={() => /*handleEdit*/("Age")} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>Gender</Text>
        </View>
        <View>
          <Button title="Edit" onPress={() => /*handleEdit*/("Gender")} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>Race</Text>
        </View>
        <View>
          <Button title="Edit" onPress={() => /*handleEdit*/("Race")} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>Height</Text>
        </View>
        <View>
          <Button title="Edit" onPress={() => /*handleEdit*/("Height")} />
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40, marginBottom: 75 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: "black", fontSize: 16 }}>Weight</Text>
        </View>
        <View>
          <Button title="Edit" onPress={() => /*handleEdit*/("Weight")} />
        </View>
      </View>

    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 10,
  },
  circle: {
    width: 100, // Set the desired width for the circle
    height: 100, // Set the desired height for the circle
    backgroundColor: "gray", // Set the background color of the circle
    borderRadius: 100, // Set borderRadius to half of the width/height to make it a circle
  },
});
export default Profile;
