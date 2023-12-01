import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";
import { SafeAreaView } from "react-native-safe-area-context";

interface Pant {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}

const Pants = () => {
  const userID = getAuth().currentUser?.uid;
  const [pants, setPants] = useState<Pant[]>([]);

  const getPantsFromFirestore = async () => {
    try {
      const pantsCollectionRef = collection(FIRESTORE_DB, "Pants");
      const q = query(pantsCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const pantsData: Pant[] = [];
      querySnapshot.forEach((doc) => {
        pantsData.push({ id: doc.id, ...doc.data() } as Pant);
      });

      setPants(pantsData);
    } catch (error) {
      console.error("Error fetching pants:", error);
    }
  };

  const handleDeletePant = async (pantId: string) => {
    try {
      const pantRef = doc(collection(FIRESTORE_DB, "Pants"), pantId);
      await deleteDoc(pantRef);

      setPants((prevPants) => prevPants.filter((pant) => pant.id !== pantId));
    } catch (error) {
      console.error("Error deleting pant:", error);
    }
  };

  useEffect(() => {
    getPantsFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={pants}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeletePant(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Pants;

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
