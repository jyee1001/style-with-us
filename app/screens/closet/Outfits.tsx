import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";

interface Outfit {
  id: string;
  hatId: string;
  jacketId: string;
  pantsId: string;
  shirtId: string;
  shoesId: string;
  shortsId: string;
  style: string;
  userId: string;
}

interface ClothingItem {
  id: string;
  picture: string;
}

const Outfits = () => {
  const userID = getAuth().currentUser?.uid;
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [clothingItemsArray, setClothingItemsArray] = useState<ClothingItem[][]>([]);

  const getClothingItemDetails = async (clothingItemId: string, collectionName: string) => {
    const clothingItemDocRef = doc(FIRESTORE_DB, collectionName, clothingItemId);
    const clothingItemDocSnap = await getDoc(clothingItemDocRef);

    if (clothingItemDocSnap.exists()) {
      return {
        id: clothingItemDocSnap.id,
        ...clothingItemDocSnap.data(),
      } as ClothingItem;
    }

    return null;
  };

  const fetchClothingItemsForOutfit = async (outfit: Outfit) => {
    const items: ClothingItem[] = [];

    if (outfit.hatId) {
      const clothingItem = await getClothingItemDetails(outfit.hatId, "Hats");
      if (clothingItem) items.push(clothingItem);
    }

    if (outfit.jacketId) {
      const clothingItem = await getClothingItemDetails(outfit.jacketId, "Jackets");
      if (clothingItem) items.push(clothingItem);
    }

    if (outfit.shirtId) {
      const clothingItem = await getClothingItemDetails(outfit.shirtId, "Shirts");
      if (clothingItem) items.push(clothingItem);
    }

    if (outfit.pantsId) {
      const clothingItem = await getClothingItemDetails(outfit.pantsId, "Pants");
      if (clothingItem) items.push(clothingItem);
    }

    if (outfit.shortsId) {
      const clothingItem = await getClothingItemDetails(outfit.shortsId, "Shorts");
      if (clothingItem) items.push(clothingItem);
    }

    if (outfit.shoesId) {
      const clothingItem = await getClothingItemDetails(outfit.shoesId, "Shoes");
      if (clothingItem) items.push(clothingItem);
    }

    setClothingItemsArray((prevItems) => [...prevItems, items]);
  };

  const handleDeleteOutfit = async (outfitId: string) => {
    try {
      const outfitRef = doc(collection(FIRESTORE_DB, "Outfits"), outfitId);
      await deleteDoc(outfitRef);

      setOutfits((prevOutfits) => prevOutfits.filter((outfit) => outfit.id !== outfitId));
      setClothingItemsArray([]);
    } catch (error) {
      console.error("Error deleting outfit:", error);
    }
  };

  const getOutfitsFromFirestore = async () => {
    try {
      const outfitsCollectionRef = collection(FIRESTORE_DB, "Outfits");
      const q = query(outfitsCollectionRef, where("userId", "==", userID));
      const querySnapshot = await getDocs(q);

      const outfitsData: Outfit[] = [];
      querySnapshot.forEach((doc) => {
        outfitsData.push({ id: doc.id, ...doc.data() } as Outfit);
      });

      setOutfits(outfitsData);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  };

  useEffect(() => {
    getOutfitsFromFirestore();
  }, []);

  useEffect(() => {
    outfits.forEach((outfit) => {
      fetchClothingItemsForOutfit(outfit);
    });
  }, [outfits]);

  return (
    <View style={{ flex: 1, backgroundColor: '#282b30' }}>
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        {clothingItemsArray.map((items, index) => (
          <View key={index} style={styles.itemContainer}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Image source={{ uri: item.picture }} style={styles.image} />
              )}
              horizontal
            />
            <TouchableOpacity onPress={() => handleDeleteOutfit(outfits[index]?.id)} style={[styles.deleteButton, { backgroundColor: '#008080' }]}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
    </View>
  );
};

export default Outfits;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: 10,
  },
  itemContainer: {
    height: 250,
    backgroundColor: "#424549",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
    margin: 5,
  },
  deleteButton: {
    width: 120,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#E5E5E5',
    fontSize: 14,
  },
});
