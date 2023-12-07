import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Planner from "../planner/Planner";
import Closet from "../closet/Closet";
import firebase from "firebase/app";
import "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import RNPickerSelect from "react-native-picker-select";
import WeatherComponent from "../../weather/WeatherComponent";

type ClothingType =
  | "Hats"
  | "Jackets"
  | "Shirts"
  | "Pants"
  | "Shorts"
  | "Shoes";
type ClothingStyle =
  | "Your Preferred Style"
  | "Casual"
  | "Formal/Elegant"
  | "Business Casual"
  | "Sporty"
  | "Relaxed"
  | "Streetwear"
  | "Retro"
  | "Waterproof"
  | "Snowwear";
type Weather =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Snowy"
  | "Hot (80\u00b0F or more)"
  | "Warm (70\u00b0F to 79\u00b0F)"
  | "Cool (60 \u00b0F to 69\u00b0F)"
  | "Cold (59\u00b0F or less)";

type ClothingItem = {
  id: string;
  category: ClothingType;
  attire: ClothingStyle;
  color: string;
  userId: string;
  picture: string;
};

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Home = ({ navigation }: RouterProps) => {
  const [outfit, setOutfit] = useState<{
    hat: ClothingItem | null;
    jacket: ClothingItem | null;
    shirt: ClothingItem | null;
    pants: ClothingItem | null;
    shorts: ClothingItem | null;
    shoes: ClothingItem | null;
  } | null>(null);
  const [outfitStyle, setOutfitStyle] = useState<ClothingStyle>("Your Preferred Style");
  const [weather, setWeather] = useState<Weather>("Sunny");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [welcome, setWelcome] = useState<string | null>("Style With Us!");

  const [userPreference, setUserPreference] = useState("");

  const getRandomClothingItem = async (
    type: ClothingType,
    attire: ClothingStyle
  ) => {
    try {
      const clothesRef = collection(FIRESTORE_DB, type);
      const q = query(
        clothesRef,
        where("attire", "==", attire),
        where("userUid", "==", getAuth().currentUser?.uid)
      );
      const querySnapshot = await getDocs(q);
      const items: ClothingItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as ClothingItem);
      });

      const randomItem = items[Math.floor(Math.random() * items.length)];
      return randomItem;
    } catch (error) {
      console.error("Error fetching clothing item: ", error);
      return null;
    }
  };

  const generateRandomOutfit = async () => {
    try {
      const authUser = getAuth().currentUser;
  
      if (authUser) {
        const userUid = authUser.uid;
        const userDocRef = doc(FIRESTORE_DB, 'ProfileSettings', userUid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const stylePreference = userDocSnapshot.data()?.stylePreference;
          console.log('User Style Preference:', stylePreference);

          if (stylePreference === "") {
            setErrorMessage(
              "Please choose a\nStyle Preference\nin the Profile Page."
            );
            setSuccessMessage(null);
            setWelcome(null);
            return;
          }
          setUserPreference(stylePreference);
          console.log("User Preference is: ");
          console.log(userPreference);

    let theHat = null;
    let theJacket = null;
    let theShirt = null;
    let thePants = null;
    let theShorts = null;
    let theShoes = null;

    if (weather === "Sunny") {
      if (outfitStyle === "Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual")) {
        theHat = await getRandomClothingItem("Hats", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual hat, shirt, pants, shorts, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Formal/Elegant" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant")) {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")) {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt and one Casual pants and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty shirt, pants, shorts, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual shirt and shoes and one Sporty pants and shorts to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theHat = await getRandomClothingItem("Hats", "Streetwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Streetwear hat, shirt, and shoes and one Casual pants and shorts to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theHat = await getRandomClothingItem("Hats", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShorts = await getRandomClothingItem("Shorts", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Retro hat, shirt, pants, shorts and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      }
    } else if (
      weather === "Cloudy" ||
      weather === "Cold (59\u00b0F or less)"
    ) {
      if (outfitStyle === "Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual")) {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Formal/Elegant" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant")) {
        theJacket = await getRandomClothingItem("Jackets", "Formal/Elegant");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")) {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, pants, and shoes and one Formal/Elegant shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket and pants and one Casual shirt and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket and pants and one Streetwear shirt and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theJacket = await getRandomClothingItem("Jackets", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Retro jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      }
    } else if (weather === "Rainy") {
      if (outfitStyle === "Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Waterproof");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and shoes and one Casual shirt and pants to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Formal/Elegant" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Waterproof");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and shoes, one Formal/Elegant shirt, and one Casual pants to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and one Sporty shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket, one Casual shirt and shoes, and one Sporty pants to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket, one Streetwear shirt and shoes, and one Casual pants to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and one Retro shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      }
    } else if (weather === "Snowy") {
      if (outfitStyle === "Casual" || outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual") || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Casual shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (
        outfitStyle === "Formal/Elegant" ||
        outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant") || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")
      ) {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Formal/Elegant shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Sporty shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Streetwear shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Retro shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      }
    } else if (weather === "Hot (80\u00b0F or more)") {
      if (outfitStyle === "Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual")) {
        theHat = await getRandomClothingItem("Hats", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual hat, shirt, shorts, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Formal/Elegant" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant")) {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")) {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt and one Casual pants and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat, shirt, shorts, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat and shorts and one Casual shirt and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theHat = await getRandomClothingItem("Hats", "Streetwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Streetwear hat, shirt, and shoes and one Casual shorts to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theHat = await getRandomClothingItem("Hats", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        theShorts = await getRandomClothingItem("Shorts", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Retro hat, shirt, shorts and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      }
    } else if (weather === "Warm (70\u00b0F to 79\u00b0F)") {
      if (outfitStyle === "Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual")) {
        theHat = await getRandomClothingItem("Hats", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual hat, shirt, pants, shorts, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
        if (Math.random() < 0.5) {
          theHat = null;
        }
      } else if (outfitStyle === "Formal/Elegant" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant")) {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")) {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt and one Casual pants and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat, shirt, pants, shorts, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
        if (Math.random() < 0.5) {
          theHat = null;
        }
      } else if (outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat, pants, and shorts and one Casual shirt and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
        if (Math.random() < 0.5) {
          theHat = null;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theHat = await getRandomClothingItem("Hats", "Streetwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Streetwear hat, shirt, and shoes and one Casual pants and shorts to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
        if (Math.random() < 0.5) {
          theHat = null;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theHat = await getRandomClothingItem("Hats", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShorts = await getRandomClothingItem("Shorts", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Retro hat, shirt, pants, shorts and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
        if (Math.random() < 0.5) {
          theHat = null;
        }
      }
    } else if (weather === "Cool (60 \u00b0F to 69\u00b0F)") {
      if (outfitStyle === "Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Casual")) {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Formal/Elegant" || (outfitStyle === "Your Preferred Style" && stylePreference === "Formal/Elegant")) {
        theJacket = await getRandomClothingItem("Jackets", "Formal/Elegant");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Business Casual" || (outfitStyle === "Your Preferred Style" && stylePreference === "Business Casual")) {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, pants, and shoes and one Formal/Elegant shirt to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Sporty" || (outfitStyle === "Your Preferred Style" && stylePreference === "Sporty")) {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Relaxed" || (outfitStyle === "Your Preferred Style" && stylePreference === "Relaxed")) {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket and pants and one Casual shirt and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Streetwear" || (outfitStyle === "Your Preferred Style" && stylePreference === "Streetwear")) {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket and pants and one Streetwear shirt and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Retro" || (outfitStyle === "Your Preferred Style" && stylePreference === "Retro")) {
        theJacket = await getRandomClothingItem("Jackets", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Retro jacket, shirt, pants, and shoes to complete this outfit."
          );
          setOutfit(null);
          setWelcome(null);
          setSuccessMessage(null);
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      }
    }

    setSuccessMessage(null);
    setErrorMessage(null);
    setWelcome(null);
    setOutfit({
      hat: theHat,
      jacket: theJacket,
      shirt: theShirt,
      pants: thePants,
      shorts: theShorts,
      shoes: theShoes,
    });

  } else {
    console.log('User document does not exist.');
  }
} else {
  console.log('User not authenticated.');
}
} catch (error) {
console.error('Error fetching user data:', error);
}
  };

  const saveOutfit = async () => {
    if (outfit) {
      try {
        if (outfitStyle === "Your Preferred Style") {
          if (userPreference === "Casual") {
            setOutfitStyle("Casual");
          }
          else if (userPreference === "Formal/Elegant") {
            setOutfitStyle("Formal/Elegant");
          }
          else if (userPreference === "Business Casual") {
            setOutfitStyle("Business Casual");
          }
          else if (userPreference === "Sporty") {
            setOutfitStyle("Sporty");
          }
          else if (userPreference === "Relaxed") {
            setOutfitStyle("Relaxed");
          }
          else if (userPreference === "Streetwear") {
            setOutfitStyle("Streetwear");
          }
          else if (userPreference === "Retro") {
            setOutfitStyle("Retro");
          }
        }

        const outfitsRef = collection(FIRESTORE_DB, "Outfits");
        const outfitData = {
          hatId: outfit.hat?.id || null,
          jacketId: outfit.jacket?.id || null,
          shirtId: outfit.shirt?.id || null,
          pantsId: outfit.pants?.category === "Pants" ? outfit.pants?.id : null,
          shortsId:
            outfit.shorts?.category === "Shorts" ? outfit.shorts?.id : null,
          shoesId: outfit.shoes?.id || null,
          style: outfitStyle,
          userId: getAuth().currentUser?.uid,
        };

        await addDoc(outfitsRef, outfitData);
        console.log("Outfit saved successfully!");
        setSuccessMessage("Outfit Saved\nto your Closet!");
        setOutfit(null);
      } catch (error) {
        console.error("Error adding outfit: ", error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.weatherContainer}>
        <Text style={styles.weatherText}>Today's Weather:</Text>
        <WeatherComponent></WeatherComponent>
      </View>

      {welcome && (
      <View style={styles.titleContainer}>
        <Text style={styles.welcomeMessage}>Welcome to</Text>
        <Text style={styles.welcomeMessageTitle}>{welcome}</Text>
        <Text style={styles.welcomeMessage}></Text>
        <Text style={styles.welcomeMessage}>What kind of outfit do you want to generate today?</Text>
    </View>
      )}

      {outfit && (
        <View style={styles.outfitContainer}>
          {outfit.hat && (
            <View style={styles.clothingItemContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: outfit.hat?.picture }}
                  style={styles.image}
                />
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.outfitText}>
                  {outfit.hat?.color} {outfit.hat?.attire}{" "}
                  {outfit.hat ? "Hat" : ""}
                </Text>
              </View>
            </View>
          )}

          {outfit.jacket && (
            <View style={styles.clothingItemContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: outfit.jacket?.picture }}
                  style={styles.image}
                />
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.outfitText}>
                  {outfit.jacket?.color} {outfit.jacket?.attire}{" "}
                  {outfit.jacket ? "Jacket" : ""}
                </Text>
              </View>
            </View>
          )}

          {outfit.shirt && (
            <View style={styles.clothingItemContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: outfit.shirt?.picture }}
                  style={styles.image}
                />
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.outfitText}>
                  {outfit.shirt?.color} {outfit.shirt?.attire}{" "}
                  {outfit.shirt ? "Shirt" : ""}
                </Text>
              </View>
            </View>
          )}

          {(outfit.pants || outfit.shorts) && (
            <View style={styles.clothingItemContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: outfit.pants?.picture || outfit.shorts?.picture,
                  }}
                  style={styles.image}
                />
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.outfitText}>
                  {outfit.pants?.color || outfit.shorts?.color}{" "}
                  {outfit.pants?.attire || outfit.shorts?.attire}{" "}
                  {outfit.pants ? "Pants" : "Shorts"}
                </Text>
              </View>
            </View>
          )}

          {outfit.shoes && (
            <View style={styles.clothingItemContainer}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: outfit.shoes?.picture }}
                  style={styles.image}
                />
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.outfitText}>
                  {outfit.shoes?.color} {outfit.shoes?.attire}{" "}
                  {outfit.shoes ? "Shoes" : ""}
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity onPress={saveOutfit} style={[styles.saveButton, { backgroundColor: '#008080' }]}>
            <Text style={styles.buttonText}>Save Outfit</Text>
          </TouchableOpacity>
        </View>
      )}

      {errorMessage &&
      <View style={styles.titleContainer}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>}

      {successMessage &&
        <View style={styles.titleContainer}>
        <Text style={styles.successMessage}>{successMessage}</Text>
      </View>}

      <View style={styles.homeAdjusts}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: " Select Outfit Style", value: "" }}
            onValueChange={(value) => setOutfitStyle(value)}
            items={[
              { label: " Your Preferred Style", value: "Your Preferred Style" },
              { label: " Casual", value: "Casual" },
              { label: " Formal/Elegant", value: "Formal/Elegant" },
              { label: " Business Casual", value: "Business Casual" },
              { label: " Sporty", value: "Sporty" },
              { label: " Relaxed", value: "Relaxed" },
              { label: " Streetwear", value: "Streetwear" },
              { label: " Retro", value: "Retro" },
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
            placeholder={{ label: " Select Weather", value: "" }}
            onValueChange={(value) => setWeather(value)}
            items={[
              { label: " Sunny", value: "Sunny" },
              { label: " Cloudy", value: "Cloudy" },
              { label: " Rainy", value: "Rainy" },
              { label: " Snowy", value: "Snowy" },
              {
                label: " Hot (80\u00b0F or more)",
                value: "Hot (80\u00b0F or more)",
              },
              {
                label: " Warm (70\u00b0F to 79\u00b0F)",
                value: "Warm (70\u00b0F to 79\u00b0F)",
              },
              {
                label: " Cool (60 \u00b0F to 69\u00b0F)",
                value: "Cool (60 \u00b0F to 69\u00b0F)",
              },
              {
                label: " Cold (59\u00b0F or less)",
                value: "Cold (59\u00b0F or less)",
              },
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

        <TouchableOpacity
          onPress={generateRandomOutfit}
          style={[styles.generateButton, { backgroundColor: '#008080' }]}
        >
          <Text style={styles.buttonText}>Generate Outfit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#36393e",
    alignItems: "center",
    backgroundColor: "#282b30",
    justifyContent: "flex-start",
    flexDirection: "column",
  },

  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 40,
    flex: 1,
  },

  welcomeMessage: {
    fontSize: 30,
    color: "#E5E5E5",
    fontWeight: "500",
    textAlign: "center",
  },

  welcomeMessageTitle: {
    fontSize: 50,
    color: "#008080",
    fontWeight: "500",
    textAlign: "center",
  },

  errorMessage: {
    fontSize: 30,
    color: "#E5E5E5",
    fontWeight: "500",
    textAlign: "left",
  },

  successMessage: {
    fontSize: 40,
    color: "#008080",
    fontWeight: "500",
    textAlign: "center",
  },

  homeAdjusts: {
    alignItems: "center",
    marginBottom: 20,
  },

  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 340,
    height: 50,
    //backgroundColor: 'white',
    //borderRadius: 5,
    color: '#E5E5E5',
    fontSize: 16,
    backgroundColor: '#424549',
    borderRadius: 10,
    marginBottom: 10,
  },

  outfitContainer: {
    flex: 1,
    justifyContent: "center",
    //alignItems: "center",
    width: "50%",
    marginBottom: 20,
  },

  clothingItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  imageContainer: {
    width: 65,
    height: 65,
  },

  image: {
    width: 65,
    height: 65,
    resizeMode: "cover",
    borderColor: "#424549",
    borderRadius: 8,
    borderWidth: 3,
  },

  descriptionContainer: {
    flex: 1,
    marginLeft: 20,
  },

  outfitText: {
    color: "#E5E5E5",
    fontSize: 16,
    marginBottom: 10,
  },
  weatherContainer: {
    backgroundColor: "#008080",
    marginBottom: 20,
    width: "90%",
    height: "8%",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  generateButton: {
    //display: "flex",
    //flexDirection: "column",
    //alignItems: "center",
    //paddingVertical: 6,
    //paddingHorizontal: 14,
    //borderRadius: 6,
    //backgroundColor: "#fff",
    //borderColor: "transparent",
    //borderWidth: 0,
    //boxShadow: "0px 0.5px 1px rgba(0, 0, 0, 0.1)",
    //elevation: 2,
    //userSelect: "none",
    //touchAction: "manipulation",
    width: 120,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 30,
    marginLeft: 10,
    color: '#E5E5E5',
  },
  saveButton: {
    //display: "flex",
    //flexDirection: "column",
    //alignItems: "center",
    //paddingVertical: 6,
    //paddingHorizontal: 14,
    //borderRadius: 6,
    //backgroundColor: "#7289da",
    //borderColor: "transparent",
    //borderWidth: 0,
    //boxShadow: "0px 0.5px 1px rgba(0, 0, 0, 0.1)",
    //elevation: 2,
    //userSelect: "none",
    //touchAction: "manipulation",
    width: 120,
    height: 40,
    marginLeft: 37,
    marginTop: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#E5E5E5',
    fontSize: 14,
  },
});

export default Home;
