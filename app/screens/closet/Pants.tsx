import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

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
      // Create a reference to the 'Shirts' collection and query by user ID
      const pantsCollectionRef = collection(FIRESTORE_DB, "Pants");
      const q = query(pantsCollectionRef, where("userUid", "==", userID));

      // Get the documents that match the query
      const querySnapshot = await getDocs(q);

      const pantsData: Pant[] = [];

      querySnapshot.forEach((doc) => {
        // Push the data of each shirt into the shirtsData array
        pantsData.push(doc.data() as Pant);
        console.log(doc.data().picture as Pant);
      });

      setPants(pantsData);
    } catch (error) {
      console.error("Error fetching shirts:", error);
    }
  };

  useEffect(() => {
    // Get the shirts when the component mounts
    getPantsFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={pants}
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
