import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../../FirebaseConfig";
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
import GridView from "../GridView";
import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';

type ChooseOutfitScreenProps = {
  navigation: NavigationProp<any, any>;
};

interface Outfit {
  id: string;
  hatId: string;
  jacketId: string;
  shirtId: string;
  pantsId: string;
  shortsId: string;
  shoesId: string;
  style: string;
  userId: string;
  hatUrl?: string;
  jacketUrl?: string;
  shirtUrl?: string;
  pantsUrl?: string;
  shortsUrl?: string;
  shoesUrl?: string;
}

type OutfitClothingItems = "Hats" | "Jackets" | "Shirts" | "Pants" | "Shorts" | "Shoes";

interface RouteParams {
  date?: string;
}

const ChooseOutfitScreen: React.FC<ChooseOutfitScreenProps> = ({ navigation }) => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, 'Choose Outfit'>>();
  const theDate = route.params?.date || "";

  const userID = getAuth().currentUser?.uid;
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const getOutfitsFromFirestore = async () => {
    try {
      const outfitsCollectionRef = collection(FIRESTORE_DB, "Outfits");
      const q = query(outfitsCollectionRef, where("userId", "==", userID));
      const querySnapshot = await getDocs(q);

      const outfitsData: Outfit[] = [];

      querySnapshot.forEach(async (doc) => {
        const outfitData = doc.data() as Outfit;
        const outfitWithUrls: Outfit = {
          ...outfitData,
          id: doc.id,
          hatUrl: await fetchImageUrl(outfitData.hatId, "Hats"),
          jacketUrl: await fetchImageUrl(outfitData.jacketId, "Jackets"),
          shirtUrl: await fetchImageUrl(outfitData.shirtId, "Shirts"),
          pantsUrl: await fetchImageUrl(outfitData.pantsId, "Pants"),
          shortsUrl: await fetchImageUrl(outfitData.shortsId, "Shorts"),
          shoesUrl: await fetchImageUrl(outfitData.shoesId, "Shoes"),
        };
        outfitsData.push(outfitWithUrls);
      });

      setOutfits(outfitsData);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  };

  useEffect(() => {
    getOutfitsFromFirestore();
  }, []);

  const fetchImageUrl = async (itemId: string, type: OutfitClothingItems): Promise<string> => {
    try {
      const itemDoc = await getDoc(doc(FIRESTORE_DB, type, itemId));
      const itemData = itemDoc.data();
      const imageUrl = itemData?.picture || null;
  
      if (imageUrl !== null) {
        return imageUrl;
      } else {
        throw new Error("Image URL not found");
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
      return "";
    }
  };

  const handleOutfitSelection = async (id: string) => {
    try {
      const plannerDatesCollectionRef = collection(FIRESTORE_DB, "PlannerDates");
      await addDoc(plannerDatesCollectionRef, {
        outfitId: id,
        date: theDate,
        userUid: userID,
      });
      console.log("Outfit selected and stored in PlannerDates collection.");
      navigation.navigate("Planner");
    } catch (error) {
      console.error("Error storing outfit in PlannerDates collection:", error);
    }
  };

  return (
    <GridView
      data={outfits}
      renderItem={(item) => (
        <TouchableOpacity onPress={() => handleOutfitSelection(item.id)}>
          <View style={styles.itemContainer}>
            <View style={styles.gridContainer}>
              {item.hatUrl && <Image source={{ uri: item.hatUrl }} style={styles.image} />}
              {item.jacketUrl && <Image source={{ uri: item.jacketUrl }} style={styles.image} />}
              {item.shirtUrl && <Image source={{ uri: item.shirtUrl }} style={styles.image} />}
              {item.pantsUrl && <Image source={{ uri: item.pantsUrl }} style={styles.image} />}
              {item.shortsUrl && <Image source={{ uri: item.shortsUrl }} style={styles.image} />}
              {item.shoesUrl && <Image source={{ uri: item.shoesUrl }} style={styles.image} />}
            </View>
          </View>
        </TouchableOpacity>
      )}
    ></GridView>
  );
};

export default ChooseOutfitScreen;

const styles = StyleSheet.create({
  itemContainer: {
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 155,
  },
  image: {
    width: 40,
    height: 30,
    //flex: 1,
    aspectRatio: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 80,
    marginBottom: 10,
  },
});