import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

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
      // Create a reference to the 'Shirts' collection and query by user ID
      const shirtsCollectionRef = collection(FIRESTORE_DB, "Shirts");
      const q = query(shirtsCollectionRef, where("userUid", "==", userID));

      // Get the documents that match the query
      const querySnapshot = await getDocs(q);

      const shirtsData: Shirt[] = [];

      querySnapshot.forEach((doc) => {
        // Push the data of each shirt into the shirtsData array
        shirtsData.push(doc.data() as Shirt);
        console.log(doc.data().picture as Shirt);
      });

      setShirts(shirtsData);
    } catch (error) {
      console.error("Error fetching shirts:", error);
    }
  };

  useEffect(() => {
    // Get the shirts when the component mounts
    getShirtsFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={shirts}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            {/* Render other shirt details */}
          </View>
        )}
      ></GridView>
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
