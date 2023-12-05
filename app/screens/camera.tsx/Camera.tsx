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
      const pictureUri = "uri" in result ? (result as { uri: string }).uri : "";
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
      const pictureUri = "uri" in result ? (result as { uri: string }).uri : "";
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
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>ADD CLOTHING</Text>
      </View>
      <TouchableOpacity style={styles.pictureButton} onPress={takeNewPhoto}>
        {picture ? (
          <Image source={{ uri: picture }} style={styles.image} />
        ) : (
          <Image
            source={{ uri: "https://i.ibb.co/5jyBVbv/camera.png" }}
            style={styles.cameraIcon}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.galleryButton}
        onPress={selectFromGallery}
      >
        <Text style={styles.text}>Upload Photo</Text>
      </TouchableOpacity>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: " Select Clothing Type", value: "" }}
          onValueChange={(value) => setCategory(value)}
          items={[
            { label: " Hats", value: "Hats" },
            { label: " Jackets", value: "Jackets" },
            { label: " Shirts", value: "Shirts" },
            { label: " Pants", value: "Pants" },
            { label: " Shorts", value: "Shorts" },
            { label: " Shoes", value: "Shoes" },
          ]}
          style={{
            inputAndroid: {
              color: '#E5E5E5',
            },
            inputIOS: {
              color: '#E5E5E5',
            },
          }}
        />
      </View>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: " Select Clothing Style" }}
          onValueChange={(value) => setAttire(value)}
          items={[
            { label: " Casual", value: "Casual" },
            { label: " Formal/Elegant", value: "Formal/Elegant" },
            { label: " Sporty", value: "Sporty" },
            { label: " Streetwear", value: "Streetwear" },
            { label: " Retro", value: "Retro" },
            { label: " Waterproof", value: "Waterproof" },
            { label: " Snowwear", value: "Snowwear" },
          ]}
          style={{
            inputAndroid: {
              color: '#E5E5E5',
            },
            inputIOS: {
              color: '#E5E5E5',
            },
          }}
        />
      </View>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: " Select Main Color" }}
          onValueChange={(value) => setColor(value)}
          items={[
            { label: " White", value: "White" },
            { label: " Black", value: "Black" },
            { label: " Grey", value: "Grey" },
            { label: " Brown", value: "Brown" },
            { label: " Red", value: "Red" },
            { label: " Orange", value: "Orange" },
            { label: " Yellow", value: "Yellow" },
            { label: " Green", value: "Green" },
            { label: " Teal", value: "Teal" },
            { label: " Blue", value: "Blue" },
            { label: " Indigo", value: "Indigo" },
            { label: " Violet", value: "Violet" },
            { label: " Purple", value: "Purple" },
            { label: " Pink", value: "Pink" },
            { label: " Cyan", value: "Cyan" },
            { label: " Maroon", value: "Maroon" },
          ]}
          style={{
            inputAndroid: {
              color: '#E5E5E5',
            },
            inputIOS: {
              color: '#E5E5E5',
            },
          }}
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitToFirestore}>
        <Text style={styles.text}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#282b30",
    flex: 1,
    alignItems: "center",
  },
  pictureButton: {
    marginLeft: 10,
    marginRight: 10,
    width: "100%",
    height: 300,
    marginTop: 20,
    backgroundColor: "#E5E5E5",
    borderWidth: 5,
    borderColor: "#424549",
    alignItems: "center",
    justifyContent: "center",
  },
  galleryButton: {
    width: 110,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#008080",
    marginTop: 20,
    marginBottom: 10,
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 340,
    height: 50,

    color: "#E5E5E5",
    fontSize: 16,
    backgroundColor: "#424549",
    borderRadius: 10,
    marginTop: 10,
  },
  submitButton: {
    width: 110,
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#008080",
    marginTop: 20,
  },
  image: {
    flex: 1,
    width: "100%",
    length: "100%",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 30,
    marginTop: 30,
    color: "#E5E5E5",
    fontWeight: "500",
  },
  text: {
    color: "#E5E5E5",
  },
  cameraIcon: {
    height: 50,
    width: 50,
  },
});
