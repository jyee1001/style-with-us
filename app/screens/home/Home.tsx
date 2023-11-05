import { View, Text, Button, StyleSheet } from "react-native";
import React, { useState } from "react";
import { NavigationContainer, NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Planner from "../planner/Planner";
import Closet from "../closet/Closet";
<<<<<<< HEAD
import firebase from "firebase/app";
import "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
=======
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc, setDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";

type ClothingType = "hat" | "jacket" | "shirt" | "pants" | "shorts" | "shoes";
type ClothingStyle = "fancy" | "casual";
type Weather = "Hot" | "Cold";
type ClothingItem = {
  id: string;
  name: string;
  type: ClothingType;
  style: ClothingStyle;
  mainColor: string;
};
>>>>>>> updated_home_joel_branch

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
  const [outfitStyle, setOutfitStyle] = useState<ClothingStyle>("casual");
  const [weather, setWeather] = useState<Weather>("Hot");

  const getRandomClothingItem = async (type: ClothingType, style: ClothingStyle) => {
    try {
      const clothesRef = collection(FIRESTORE_DB, "clothes");
      const q = query(clothesRef, where("type", "==", type), where("style", "==", style));
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
    if (weather === "Hot" && outfitStyle === "casual") {
      hat = await getRandomClothingItem("hat", outfitStyle);
    }
  
    let jacket = null;
    if (weather === "Cold") {
      jacket = await getRandomClothingItem("jacket", outfitStyle);
    }
  
    const shirt = await getRandomClothingItem("shirt", outfitStyle);
    let pants: ClothingItem | null = null;
    let shorts: ClothingItem | null = null;
  
    if (outfitStyle === "fancy") {
      pants = await getRandomClothingItem("pants", outfitStyle);
    } else {
      if (weather === "Hot") {
        shorts = await getRandomClothingItem("shorts", outfitStyle);
        pants = await getRandomClothingItem("pants", outfitStyle);

        if (pants && shorts) {
          if (Math.random() < 0.5) {
            pants = null;
          } else {
            shorts = null;
          }
        }
      } else {
        pants = await getRandomClothingItem("pants", outfitStyle);
      }
    }
  
    const shoes = await getRandomClothingItem("shoes", outfitStyle);
    if (!shirt || !shoes || (!pants && !shorts)) {
      return;
    }
  
    setOutfit({ hat, jacket, shirt, pants, shorts, shoes });
  };

  const saveOutfit = async () => {
    if (outfit) {
      try {
        const outfitsRef = collection(FIRESTORE_DB, "outfits");
        const outfitData = {
          hatId: outfit.hat?.id || null,
          jacketId: outfit.jacket?.id || null,
          shirtId: outfit.shirt.id,
          pantsId: outfit.pants?.type === "pants" ? outfit.pants?.id : null,
          shortsId: outfit.shorts?.type === "shorts" ? outfit.shorts?.id : null,
          shoesId: outfit.shoes.id,
          style: outfitStyle,
          userId: "USER_ID",
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
      <Text style={styles.outfitText}>Outfit Style: {outfitStyle}</Text>
      <Text style={styles.outfitText}>Weather: {weather}</Text>
      {outfit && (
        <View style={styles.outfitContainer}>
          <Text style={styles.outfitText}>Hat: {outfit.hat?.mainColor || "N/A"} {outfit.hat?.type} {outfit.hat?.style}</Text>
          <Text style={styles.outfitText}>Jacket: {outfit.jacket?.mainColor || "N/A"} {outfit.jacket?.type} {outfit.jacket?.style}</Text>
          <Text style={styles.outfitText}>Shirt: {outfit.shirt.mainColor} {outfit.shirt.type} {outfit.shirt.style}</Text>
          <Text style={styles.outfitText}>Pants/Shorts: {outfit.pants?.mainColor || outfit.shorts?.mainColor || "N/A"} {outfit.pants?.type || outfit.shorts?.type} {outfit.pants?.style || outfit.shorts?.style}</Text>
          <Text style={styles.outfitText}>Shoes: {outfit.shoes.mainColor} {outfit.shoes.type} {outfit.shoes.style}</Text>
          <Button onPress={saveOutfit} title="Save Outfit" />
        </View>
      )}
      <Button onPress={() => setOutfitStyle(outfitStyle === "fancy" ? "casual" : "fancy")} title="Toggle Outfit Style" />
      <Button onPress={() => setWeather(weather === "Hot" ? "Cold" : "Hot")} title="Toggle Weather" />
      <Button onPress={generateRandomOutfit} title="Generate Outfit" />
      <Button
<<<<<<< HEAD
        onPress={() => console.log(getAuth().currentUser?.uid)}
        title="open page"
=======
        onPress={() => navigation.navigate("Planner")}
        title="Open Planner"
>>>>>>> updated_home_joel_branch
      />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Sign Out" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },

  outfitContainer: {
    marginTop: 20,
  },
  outfitText: {
    color: "white",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default Home;
