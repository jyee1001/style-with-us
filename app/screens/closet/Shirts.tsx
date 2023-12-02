import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";
import { SafeAreaView } from "react-native-safe-area-context";

interface Shirt {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}

const Shirts = () => {
  const userID = getAuth().currentUser?.uid;
  const [shirts, setShirts] = useState<Shirt[]>([]);

  const getShirtsFromFirestore = async () => {
    try {
      const shirtsCollectionRef = collection(FIRESTORE_DB, "Shirts");
      const q = query(shirtsCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const shirtsData: Shirt[] = [];
      querySnapshot.forEach((doc) => {
        shirtsData.push({ id: doc.id, ...doc.data() } as Shirt);
      });

      setShirts(shirtsData);
    } catch (error) {
      console.error("Error fetching shirts:", error);
    }
  };

  const handleDeleteShirt = async (shirtId: string) => {
    try {
      const shirtRef = doc(collection(FIRESTORE_DB, "Shirts"), shirtId);
      await deleteDoc(shirtRef);

      setShirts((prevShirts) =>
        prevShirts.filter((shirt) => shirt.id !== shirtId)
      );
    } catch (error) {
      console.error("Error deleting shirt:", error);
    }
  };

  useEffect(() => {
    getShirtsFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={shirts}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeleteShirt(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Shirts;

const styles = StyleSheet.create({
  itemContainer: {
    height: 200,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    flex: 1,
    aspectRatio: 1,
  },
});
