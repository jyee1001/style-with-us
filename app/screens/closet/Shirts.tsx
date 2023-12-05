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
    <View style={{ flex: 1, backgroundColor: '#282b30' }}>
    <SafeAreaView>
      <GridView
        data={shirts}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeleteShirt(item.id)} style={[styles.deleteButton, { backgroundColor: '#008080' }]}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
    </View>
  );
};

export default Shirts;

const styles = StyleSheet.create({
  itemContainer: {
    height: 180,
    marginLeft: 10,
    marginRight: 10,
    //backgroundColor: "#424549",
    backgroundColor: "transparent",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 155,
  },
  image: {
    width: 100,
    height: 100,
    flex: 1,
    aspectRatio: 1,
    borderWidth: 5,
    borderColor: "#424549",
    borderRadius: 20,
  },
  deleteButton: {
    marginTop: 10,
    width: 120,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#E5E5E5',
    fontSize: 14,
  },
});
