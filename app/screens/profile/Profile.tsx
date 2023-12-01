import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../FirebaseConfig";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const authUser = getAuth().currentUser;

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [birthdate, setBirthdate] = useState(new Date());
  const [bio, setBio] = useState("");

  const [genderText, setGenderText] = useState("");
  const [favoriteColorText, setFavoriteColorText] = useState("");

  const [picture, setPicture] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPicture(userData.picture || "");
        setName(userData.name || authUser?.displayName || "");
        setGender(userData.gender || "");
        setFavoriteColor(userData.favoriteColor || "");
        setBirthdate(userData.birthdate || new Date());
        setBio(userData.bio || "");

        if (userData.gender) {
          setGenderText(`Selected Gender: ${userData.gender}`);
        }
        if (userData.favoriteColor) {
          setFavoriteColorText(`Selected Color: ${userData.favoriteColor}`);
        }
      }
      else {
        await setDoc(userDocRef, {
          userUid: authUser?.uid || "",
          name: authUser?.displayName || "",
          bio: "",
          birthdate: "",
          favoriteColor: "",
          gender: "",
          picture: "",
        });
      }
    };

    fetchProfile();
  }, [authUser]);

  const takePhoto = async () => {
    const cameraResp = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!cameraResp.canceled) {
      console.log(cameraResp.assets[0].uri);
      setPicture(cameraResp.assets[0].uri);
    }
  };

  const handleSavePicture = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      await updateDoc(userDocRef, { picture });
      console.log("Picture updated successfully!");
    } catch (error) {
      console.error("Error updating picture:", error);
    }
  };

  const handleSaveName = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      await updateDoc(userDocRef, { name });
      console.log("Name updated successfully!");
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleSaveGender = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      await updateDoc(userDocRef, { gender });
      console.log("Gender updated successfully!");
      setGenderText(`Selected Gender: ${gender}`);
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };

  const handleSaveFavoriteColor = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      await updateDoc(userDocRef, { favoriteColor });
      console.log("Favorite color updated successfully!");
      setFavoriteColorText(`Selected Color: ${favoriteColor}`);
    } catch (error) {
      console.error("Error updating favorite color:", error);
    }
  };

  const handleSaveBirthdate = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      await updateDoc(userDocRef, { birthdate });
      console.log("Birthdate updated successfully!");
    } catch (error) {
      console.error("Error updating birthdate:", error);
    }
  };

  const handleSaveBio = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      await updateDoc(userDocRef, { bio });
      console.log("Bio updated successfully!");
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.pictureButton} onPress={takePhoto}>
        {picture ? (
          <Image source={{ uri: picture }} style={styles.image} />
        ) : null}
      </TouchableOpacity>
      <Button title="Save Picture" onPress={handleSavePicture} />

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Button title="Save Name" onPress={handleSaveName} />

      <Text>{genderText}</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Gender", value: "" }}
          onValueChange={(itemValue: string) => setGender(itemValue)}
          items={[
            { label: "Male", value: "Male" },
            { label: "Female", value: "Female" },
            { label: "Non-binary", value: "Non-binary" },
            { label: "Genderqueer", value: "Genderqueer" },
            { label: "Prefer not to say", value: "Prefer not to say" },
          ]}
        />
      </View>
      <Button title="Save Gender" onPress={handleSaveGender} />

      <Text>{favoriteColorText}</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          placeholder={{ label: "Select Main Color" }}
          onValueChange={(value) => setFavoriteColor(value)}
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
      <Button title="Save Favorite Color" onPress={handleSaveFavoriteColor} />

      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={(text) => setBio(text)}
      />
      <Button title="Save Bio" onPress={handleSaveBio} />

      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign Out" />
    </SafeAreaView>
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
    width: 100,
    height: 100,
    backgroundColor: "gray",
    borderRadius: 100,
  },
  pictureButton: {
    marginLeft: 10,
    marginRight: 10,
    width: 300,
    height: 300,
    marginTop: 10,
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "black",
  },
  pickerContainer: {
    width: 350,
    borderWidth: 2,
    height: 40,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF9F6",
  },
  image: {
    // width: 200,
    // height: 200,
    flex: 1,
    width: "100%",
    length: "100%",
  },
});

export default Profile;
