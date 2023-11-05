import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";

interface Shirt {
  id: string;
  imageUrl: string;
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
        console.log(doc.data() as Shirt);
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
    // <GridView
    //   data={shirts}
    //   renderItem={(item) => (
    //     <View style={styles.itemContainer}>
    //       <Image source={{ uri: item.imageUrl }} style={styles.image} />
    //       {/* Render other shirt details */}
    //     </View>
    //   )}
    // ></GridView>
    <FlatList
      data={shirts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Image
            source={{ uri: item.imageUrl }}
            style={{ width: 200, height: 200 }}
          />
          <Text>{item.description}</Text>
          {/* Render other shirt details */}
        </View>
      )}
    />
  );
};

export default Shirts;

const styles = StyleSheet.create({
  itemContainer: {
    height: 100,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    aspectRatio: 1,
  },
});