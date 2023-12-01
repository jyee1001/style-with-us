import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";

interface Shoe {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}

const Shoes = () => {
  const userID = getAuth().currentUser?.uid;
  const [shoes, setShoes] = useState<Shoe[]>([]);

  const getShoesFromFirestore = async () => {
    try {
      const shoesCollectionRef = collection(FIRESTORE_DB, "Shoes");
      const q = query(shoesCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const shoesData: Shoe[] = [];
      querySnapshot.forEach((doc) => {
        shoesData.push({ id: doc.id, ...doc.data() } as Shoe);
      });

      setShoes(shoesData);
    } catch (error) {
      console.error("Error fetching shoes:", error);
    }
  };

  const handleDeleteShoe = async (shoeId: string) => {
    try {
      const shoeRef = doc(collection(FIRESTORE_DB, "Shoes"), shoeId);
      await deleteDoc(shoeRef);

      setShoes((prevShoes) => prevShoes.filter((shoe) => shoe.id !== shoeId));
    } catch (error) {
      console.error("Error deleting shoe:", error);
    }
  };

  useEffect(() => {
    getShoesFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={shoes}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeleteShoe(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Shoes;

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
    height: 100,
    flex: 1,
    aspectRatio: 2, // Adjusted aspectRatio for better display of shoe images
  },
});
