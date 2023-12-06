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

interface Dress {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}

const Dresses = () => {
  const userID = getAuth().currentUser?.uid;
  const [dresses, setDresses] = useState<Dress[]>([]);

  const getDressesFromFirestore = async () => {
    try {
      const dressesCollectionRef = collection(FIRESTORE_DB, "Dresses");
      const q = query(dressesCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const dressesData: Dress[] = [];
      querySnapshot.forEach((doc) => {
        dressesData.push({ id: doc.id, ...doc.data() } as Dress);
      });

      setDresses(dressesData);
    } catch (error) {
      console.error("Error fetching dresses:", error);
    }
  };

  const handleDeleteDress = async (dressesId: string) => {
    try {
      const dressRef = doc(collection(FIRESTORE_DB, "Dresses"), dressesId);
      await deleteDoc(dressRef);

      setDresses((prevDresses) =>
        prevDresses.filter((dress) => dress.id !== dressesId)
      );
    } catch (error) {
      console.error("Error deleting dress:", error);
    }
  };

  useEffect(() => {
    getDressesFromFirestore();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#282b30" }}>
      <SafeAreaView>
        <GridView
          data={dresses}
          renderItem={(item) => (
            <View style={styles.itemContainer}>
              <Image source={{ uri: item.picture }} style={styles.image} />
              <TouchableOpacity
                onPress={() => handleDeleteDress(item.id)}
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

export default Dresses;

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
