import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Image,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Camera as ExpoCamera, CameraType } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import RNPickerSelect from "react-native-picker-select";

import { FIRESTORE_DB } from "../../../FirebaseConfig";

const Camera = () => {
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [picture, setPicture] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");
  const [attire, setAttire] = useState("");

  const user = getAuth().currentUser;

  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text>Permission Not Granted - {permission?.status}</Text>
        <StatusBar style="auto" />
        <Button title="Request Permission" onPress={requestPermission}></Button>
      </View>
    );
  }

  const selectFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const pictureUri = 'uri' in result ? (result as { uri: string }).uri : '';
      console.log(pictureUri);
      setPicture(pictureUri);
    }
  };

  const takeNewPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const pictureUri = 'uri' in result ? (result as { uri: string }).uri : '';
      console.log(pictureUri);
      setPicture(pictureUri);
    }
  };




  const submitToFirestore = async () => {
    if (user && picture && category && attire) {
      try {
        // Create a Firestore document with the data
        const docRef = await addDoc(collection(FIRESTORE_DB, category), {
          userUid: user.uid, // Link the data to the user
          picture,
          category,
          attire,
          color,
          timestamp: new Date().toISOString(), // You can use Firebase Server Timestamp here if needed
        });

        console.log("Document written with ID: ", docRef.id);

        // Reset the state after submission
        setPicture("");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      console.log("Please fill in all fields before submitting.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.pictureButton} onPress={takeNewPhoto}>
        {picture ? (
          <Image source={{ uri: picture }} style={styles.image} />
        ) : null}
      </TouchableOpacity>
      <TouchableOpacity style={styles.galleryButton} onPress={selectFromGallery}>
        <Text>Select From Gallery</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Clothing Type", value: "" }}
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: "Shirts", value: "Shirts" },
            { label: "Shorts", value: "Shorts" },
            { label: "Pants", value: "Pants" },
            { label: "Jackets", value: "Jackets" },
            { label: "Hats", value: "Hats" },
            { label: "Shoes", value: "Shoes" },
          ]}
        />
      </View>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Clothing Style" }}
          onValueChange={(value) => setAttire(value)}
          items={[
            { label: "Casual", value: "Casual" },
            { label: "Formal/Elegant", value: "Formal/Elegant" },
            { label: "Sporty", value: "Sporty" },
            { label: "Streetwear", value: "Streetwear" },
            { label: "Retro", value: "Retro" },
            { label: "Waterproof", value: "Waterproof" },
            { label: "Snowwear", value: "Snowwear" },
          ]}
        />
      </View>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Main Color" }}
          onValueChange={(value) => setColor(value)}
          items={[
            { label: "Blue", value: "Blue" },
            { label: "Red", value: "Red" },
            { label: "Green", value: "Green" },
            { label: "Pink", value: "Pink" },
            { label: "Yellow", value: "Yellow" },
            { label: "White", value: "White" },
            { label: "Black", value: "Black" },
            { label: "Grey", value: "Grey" },
            { label: "Brown", value: "Brown" },
          ]}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitToFirestore}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#36393e",
    flex: 1,
    alignItems: "center",
  },
  pictureButton: {
    marginLeft: 10,
    marginRight: 10,
    width: 300,
    height: 300,
    marginTop: 10,
    backgroundColor: "#fff",
    borderWidth: 5,
    borderColor: "black",
  },
  galleryButton: {
    backgroundColor: "grey",
    marginTop: 30,
  },
  pickerContainer: {
    marginTop: 50,
    width: 350,
    borderWidth: 2,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9F6",
  },
  submitButton: {
    backgroundColor: "grey",
    marginTop: 30,
  },
  image: {
    flex: 1,
    width: "100%",
    length: "100%",
  },
});
