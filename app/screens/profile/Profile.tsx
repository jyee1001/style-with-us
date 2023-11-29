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
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { getAuth, updateProfile } from "firebase/auth";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const Profile = () => {};

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
