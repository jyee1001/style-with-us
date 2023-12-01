import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  ScrollView,
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

type ClothingType =
  | "Hats"
  | "Jackets"
  | "Shirts"
  | "Pants"
  | "Shorts"
  | "Shoes";
type ClothingStyle =
  | "Casual"
  | "Formal/Elegant"
  | "Business Casual"
  | "Sporty"
  | "Relaxed"
  | "Streetwear"
  | "Retro"
  | "Waterproof"
  | "Snowwear";
//Dont forget to make (camera) based on this criteria^ but Remove business casual and relaxed from the camera.
type Weather =
  | "Sunny"
  | "Cloudy"
  | "Rainy"
  | "Snowy"
  | "Hot (80\u00b0F or more)"
  | "Warm (70\u00b0F to 80\u00b0F)"
  | "Cool (60 \u00b0F to 70\u00b0F)"
  | "Cold (less than 60\u00b0F)";

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
  const [outfitStyle, setOutfitStyle] = useState<ClothingStyle>("Casual");
  const [weather, setWeather] = useState<Weather>("Sunny");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    let theHat = null;
    let theJacket = null;
    let theShirt = null;
    let thePants = null;
    let theShorts = null;
    let theShoes = null;

    setSuccessMessage(null);

    if (weather === "Sunny") {
      if (outfitStyle === "Casual") {
        theHat = await getRandomClothingItem("Hats", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual hat, shirt, pants, shorts, and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Formal/Elegant") {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Business Casual") {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt and one Casual pants and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Sporty") {
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty shirt, pants, shorts, and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Relaxed") {
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual shirt and shoes and one Sporty pants and shorts to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Streetwear") {
        theHat = await getRandomClothingItem("Hats", "Streetwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Streetwear hat, shirt, and shoes and one Casual pants and shorts to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          thePants = null;
        } else {
          theShorts = null;
        }
      } else if (outfitStyle === "Retro") {
        theHat = await getRandomClothingItem("Hats", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShorts = await getRandomClothingItem("Shorts", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Retro hat, shirt, pants, shorts and shoes to complete this outfit."
          );
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
      weather === "Cold (less than 60\u00b0F)"
    ) {
      if (outfitStyle === "Casual") {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Formal/Elegant") {
        theJacket = await getRandomClothingItem("Jackets", "Formal/Elegant");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Business Casual") {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, pants, and shoes and one Formal/Elegant shirt to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Sporty") {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Relaxed") {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket and pants and one Casual shirt and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Streetwear") {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket and pants and one Streetwear shirt and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Retro") {
        theJacket = await getRandomClothingItem("Jackets", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Retro jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      }
    } else if (weather === "Rainy") {
      if (outfitStyle === "Casual") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Waterproof");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and shoes and one Casual shirt and pants to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Formal/Elegant") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Business Casual") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Waterproof");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and shoes, one Formal/Elegant shirt, and one Casual pants to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Sporty") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and one Sporty shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Relaxed") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket, one Casual shirt and shoes, and one Sporty pants to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Streetwear") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket, one Streetwear shirt and shoes, and one Casual pants to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Retro") {
        theJacket = await getRandomClothingItem("Jackets", "Waterproof");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Waterproof jacket and one Retro shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      }
    } else if (weather === "Snowy") {
      if (outfitStyle === "Casual" || outfitStyle === "Relaxed") {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Casual shirt to complete this outfit."
          );
          return;
        }
      } else if (
        outfitStyle === "Formal/Elegant" ||
        outfitStyle === "Business Casual"
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
          return;
        }
      } else if (outfitStyle === "Sporty") {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Sporty shirt to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Streetwear") {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Streetwear shirt to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Retro") {
        theHat = await getRandomClothingItem("Hats", "Snowwear");
        theJacket = await getRandomClothingItem("Jackets", "Snowwear");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Snowwear");
        theShoes = await getRandomClothingItem("Shoes", "Snowwear");
        if (!theHat || !theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Snowwear hat, jacket, pants, and shoes and one Retro shirt to complete this outfit."
          );
          return;
        }
      }
    } else if (weather === "Hot (80\u00b0F or more)") {
      if (outfitStyle === "Casual") {
        theHat = await getRandomClothingItem("Hats", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual hat, shirt, shorts, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Formal/Elegant") {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Business Casual") {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt and one Casual pants and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Sporty") {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat, shirt, shorts, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Relaxed") {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat and shorts and one Casual shirt and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Streetwear") {
        theHat = await getRandomClothingItem("Hats", "Streetwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Streetwear hat, shirt, and shoes and one Casual shorts to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Retro") {
        theHat = await getRandomClothingItem("Hats", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        theShorts = await getRandomClothingItem("Shorts", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theHat || !theShirt || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Retro hat, shirt, shorts and shoes to complete this outfit."
          );
          return;
        }
      }
    } else if (weather === "Warm (70\u00b0F to 80\u00b0F)") {
      if (outfitStyle === "Casual") {
        theHat = await getRandomClothingItem("Hats", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Casual hat, shirt, pants, shorts, and shoes to complete this outfit."
          );
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
      } else if (outfitStyle === "Formal/Elegant") {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Business Casual") {
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant shirt and one Casual pants and shoes to complete this outfit."
          );
          return;
        }
      } else if (outfitStyle === "Sporty") {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat, shirt, pants, shorts, and shoes to complete this outfit."
          );
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
      } else if (outfitStyle === "Relaxed") {
        theHat = await getRandomClothingItem("Hats", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShorts = await getRandomClothingItem("Shorts", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty hat, pants, and shorts and one Casual shirt and shoes to complete this outfit."
          );
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
      } else if (outfitStyle === "Streetwear") {
        theHat = await getRandomClothingItem("Hats", "Streetwear");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShorts = await getRandomClothingItem("Shorts", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Streetwear hat, shirt, and shoes and one Casual pants and shorts to complete this outfit."
          );
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
      } else if (outfitStyle === "Retro") {
        theHat = await getRandomClothingItem("Hats", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShorts = await getRandomClothingItem("Shorts", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theHat || !theShirt || !thePants || !theShorts || !theShoes) {
          setErrorMessage(
            "Need at least one Retro hat, shirt, pants, shorts and shoes to complete this outfit."
          );
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
    } else if (weather === "Cool (60 \u00b0F to 70\u00b0F)") {
      if (outfitStyle === "Casual") {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Formal/Elegant") {
        theJacket = await getRandomClothingItem("Jackets", "Formal/Elegant");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Formal/Elegant");
        theShoes = await getRandomClothingItem("Shoes", "Formal/Elegant");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Formal/Elegant jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Business Casual") {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Formal/Elegant");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket, pants, and shoes and one Formal/Elegant shirt to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Sporty") {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Sporty");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Sporty");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Relaxed") {
        theJacket = await getRandomClothingItem("Jackets", "Sporty");
        theShirt = await getRandomClothingItem("Shirts", "Casual");
        thePants = await getRandomClothingItem("Pants", "Sporty");
        theShoes = await getRandomClothingItem("Shoes", "Casual");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Sporty jacket and pants and one Casual shirt and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Streetwear") {
        theJacket = await getRandomClothingItem("Jackets", "Casual");
        theShirt = await getRandomClothingItem("Shirts", "Streetwear");
        thePants = await getRandomClothingItem("Pants", "Casual");
        theShoes = await getRandomClothingItem("Shoes", "Streetwear");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Casual jacket and pants and one Streetwear shirt and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      } else if (outfitStyle === "Retro") {
        theJacket = await getRandomClothingItem("Jackets", "Retro");
        theShirt = await getRandomClothingItem("Shirts", "Retro");
        thePants = await getRandomClothingItem("Pants", "Retro");
        theShoes = await getRandomClothingItem("Shoes", "Retro");
        if (!theJacket || !theShirt || !thePants || !theShoes) {
          setErrorMessage(
            "Need at least one Retro jacket, shirt, pants, and shoes to complete this outfit."
          );
          return;
        }
        if (Math.random() < 0.5) {
          theJacket = null;
        }
      }
    }

    setErrorMessage(null);
    setOutfit({
      hat: theHat,
      jacket: theJacket,
      shirt: theShirt,
      pants: thePants,
      shorts: theShorts,
      shoes: theShoes,
    });
  };

  const saveOutfit = async () => {
    if (outfit) {
      try {
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
        setSuccessMessage("Outfit Saved Sucessfully!");
      } catch (error) {
        console.error("Error adding outfit: ", error);
      }
    }
  };

  return (
    <View style={styles.container}>
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

          <Button onPress={saveOutfit} title="Save Outfit" />
        </View>
      )}

      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}
      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}

      <View style={styles.homeAdjusts}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: "Select Outfit Style", value: "" }}
            onValueChange={(value) => setOutfitStyle(value)}
            items={[
              { label: "Casual", value: "Casual" },
              { label: "Formal/Elegant", value: "Formal/Elegant" },
              { label: "Business Casual", value: "Business Casual" },
              { label: "Sporty", value: "Sporty" },
              { label: "Relaxed", value: "Relaxed" },
              { label: "Streetwear", value: "Streetwear" },
              { label: "Retro", value: "Retro" },
            ]}
          />
        </View>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: "Select Weather", value: "" }}
            onValueChange={(value) => setWeather(value)}
            items={[
              { label: "Sunny", value: "Sunny" },
              { label: "Cloudy", value: "Cloudy" },
              { label: "Rainy", value: "Rainy" },
              { label: "Snowy", value: "Snowy" },
              {
                label: "Hot (80\u00b0F or more)",
                value: "Hot (80\u00b0F or more)",
              },
              {
                label: "Warm (70\u00b0F to 80\u00b0F)",
                value: "Warm (70\u00b0F to 80\u00b0F)",
              },
              {
                label: "Cool (60 \u00b0F to 70\u00b0F)",
                value: "Cool (60 \u00b0F to 70\u00b0F)",
              },
              {
                label: "Cold (less than 60\u00b0F)",
                value: "Cold (less than 60\u00b0F)",
              },
            ]}
          />
        </View>

        <Button onPress={generateRandomOutfit} title="Generate Outfit" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },

  errorMessage: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },

  successMessage: {
    color: "blue",
    fontSize: 16,
    marginBottom: 10,
  },

  homeAdjusts: {
    alignItems: "center",
    marginBottom: 20,
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

  outfitContainer: {
    flex: 1,
    width: "50%",
    justifyContent: "center",
    marginTop: 60,
  },

  clothingItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  imageContainer: {
    width: 75,
    height: 75,
  },

  image: {
    width: 75,
    height: 75,
    resizeMode: "cover",
  },

  descriptionContainer: {
    flex: 1,
    marginLeft: 20,
  },

  outfitText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Home;
