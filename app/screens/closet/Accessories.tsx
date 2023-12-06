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

interface Accessory {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}

const Accessories = () => {
  const userID = getAuth().currentUser?.uid;
  const [accessories, setAccessories] = useState<Accessory[]>([]);

  const getHatsFromFirestore = async () => {
    try {
      const accessoriesCollectionRef = collection(FIRESTORE_DB, "Accessories");
      const q = query(accessoriesCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const accessoriesData: Accessory[] = [];
      querySnapshot.forEach((doc) => {
        accessoriesData.push({ id: doc.id, ...doc.data() } as Accessory);
      });

      setAccessories(accessoriesData);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    }
  };

  const handleDeleteAccessory = async (accessoriesId: string) => {
    try {
      const accessoryRef = doc(
        collection(FIRESTORE_DB, "Accessories"),
        accessoriesId
      );
      await deleteDoc(accessoryRef);

      setAccessories((prevAccessories) =>
        prevAccessories.filter((accessory) => accessory.id !== accessoriesId)
      );
    } catch (error) {
      console.error("Error deleting accessory:", error);
    }
  };

  useEffect(() => {
    getHatsFromFirestore();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#282b30" }}>
      <SafeAreaView>
        <GridView
          data={accessories}
          renderItem={(item) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.picture }} style={styles.image} />
              <TouchableOpacity
                onPress={() => handleDeleteAccessory(item.id)}
                style={[styles.deleteButton, { backgroundColor: "#008080" }]}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

export default Accessories;

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
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#E5E5E5",
    fontSize: 14,
  },
});
