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
    <View style={{ flex: 1, backgroundColor: '#282b30' }}>
    <SafeAreaView>
      <GridView
        data={pants}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeletePant(item.id)} style={[styles.deleteButton, { backgroundColor: '#008080' }]}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
    </View>
  );
};

export default Pants;

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
