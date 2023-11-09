import { View, Text, Button, StyleSheet, Image, ScrollView } from "react-native";
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

type ClothingType = "Hats" | "Jackets" | "Shirts" | "Pants" | "Shorts" | "Shoes";
type ClothingStyle = "Formal" | "Casual" | "Athletic";
type Weather = "Hot" | "Cold";

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
    shirt: ClothingItem;
    pants: ClothingItem | null;
    shorts: ClothingItem | null;
    shoes: ClothingItem;
  } | null>(null);
  const [outfitStyle, setOutfitStyle] = useState<ClothingStyle>("Casual");
  const [weather, setWeather] = useState<Weather>("Hot");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    let hat = null;
    if (weather === "Hot" && outfitStyle === "Casual") {
      hat = await getRandomClothingItem("Hats", outfitStyle);
    }

    let jacket = null;
    if (weather === "Cold") {
      jacket = await getRandomClothingItem("Jackets", outfitStyle);
    }

    const shirt = await getRandomClothingItem("Shirts", outfitStyle);

    let pants: ClothingItem | null = null;
    let shorts: ClothingItem | null = null;
    if (outfitStyle === "Formal") {
      pants = await getRandomClothingItem("Pants", outfitStyle);
    } else {
      if (weather === "Hot") {
        shorts = await getRandomClothingItem("Shorts", outfitStyle);
        pants = await getRandomClothingItem("Pants", outfitStyle);

        if (pants && shorts) {
          if (Math.random() < 0.5) {
            pants = null;
          } else {
            shorts = null;
          }
        }
      } else {
        pants = await getRandomClothingItem("Pants", outfitStyle);
      }
    }

    const shoes = await getRandomClothingItem("Shoes", outfitStyle);

    if (!shirt || !shoes || (!pants && !shorts)) {
      setErrorMessage("You must have at least one hat, jacket, shirt, pants, shorts, and shoes for each Outfit Style. (Except you do NOT need to have a Formal/Athletic hat and Formal shorts)");
      return;
    }
    else {
      setErrorMessage(null);
    }

    setOutfit({ hat, jacket, shirt, pants, shorts, shoes });
  };

  const saveOutfit = async () => {
    if (outfit) {
      try {
        const outfitsRef = collection(FIRESTORE_DB, "Outfits");
        const outfitData = {
          hatId: outfit.hat?.id || null,
          jacketId: outfit.jacket?.id || null,
          shirtId: outfit.shirt.id,
          pantsId: outfit.pants?.category === "Pants" ? outfit.pants?.id : null,
          shortsId: outfit.shorts?.category === "Shorts" ? outfit.shorts?.id : null,
          shoesId: outfit.shoes.id,
          style: outfitStyle,
          userId: getAuth().currentUser?.uid,
        };

        await addDoc(outfitsRef, outfitData);
        console.log("Outfit saved successfully!");
      } catch (error) {
        console.error("Error adding outfit: ", error);
      }
    }
  };

  return (
      <View style={styles.container}>

        {outfit && (
          <View style={(styles.outfitContainer)}>

            {outfit.hat && (
              <View style={styles.clothingItemContainer}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: outfit.hat?.picture }} style={styles.image} />
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.outfitText}>
                    {outfit.hat ? "Hat:" : ""} {outfit.hat?.color} {outfit.hat?.attire}
                  </Text>
                </View>
              </View>
            )}

            {outfit.jacket && (
              <View style={styles.clothingItemContainer}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: outfit.jacket?.picture }} style={styles.image} />
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.outfitText}>
                    {outfit.jacket ? "Jacket:" : ""} {outfit.jacket?.color} {outfit.jacket?.attire}
                  </Text>
                </View>
              </View>
            )}

            {outfit.shirt && (
              <View style={styles.clothingItemContainer}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: outfit.shirt?.picture }} style={styles.image} />
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.outfitText}>
                    {outfit.shirt ? "Shirt:" : ""} {outfit.shirt?.color} {outfit.shirt?.attire}
                  </Text>
                </View>
              </View>
            )}

            {(outfit.pants || outfit.shorts) && (
              <View style={styles.clothingItemContainer}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: outfit.pants?.picture || outfit.shorts?.picture }} style={styles.image} />
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.outfitText}>
                    {outfit.pants ? "Pants: " : "Shorts: "}
                    {outfit.pants?.color || outfit.shorts?.color} {outfit.pants?.attire || outfit.shorts?.attire}
                  </Text>
                </View>
              </View>
            )}

            {outfit.shoes && (
              <View style={styles.clothingItemContainer}>
                <View style={styles.imageContainer}>
                  <Image source={{ uri: outfit.shoes?.picture }} style={styles.image} />
                </View>
                <View style={styles.descriptionContainer}>
                  <Text style={styles.outfitText}>
                    {outfit.shoes ? "Shoes:" : ""} {outfit.shoes?.color} {outfit.shoes?.attire}
                  </Text>
                </View>
              </View>
            )}

            <Button onPress={saveOutfit} title="Save Outfit" />
          </View>
        )}

        {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

        <View style={styles.homeAdjusts}>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              placeholder={{ label: "Select Outfit Style", value: "" }}
              onValueChange={(value) => setOutfitStyle(value)}
              items={[
                { label: "Formal", value: "Formal" },
                { label: "Casual", value: "Casual" },
                { label: "Athletic", value: "Athletic" },
              ]}
            />
          </View>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              placeholder={{ label: "Select Weather", value: "" }}
              onValueChange={(value) => setWeather(value)}
              items={[
                { label: "Hot", value: "Hot" },
                { label: "Cold", value: "Cold" },
              ]}
            />
          </View>
          
          <Button onPress={generateRandomOutfit} title="Generate Outfit" />
          <Button
            onPress={() => console.log(getAuth().currentUser?.uid)}
            title="open page"
          />
          <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign Out" />
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
