import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

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
      // Create a reference to the 'Shorts' collection and query by user ID
      const shoesCollectionRef = collection(FIRESTORE_DB, "Shoes");
      const q = query(shoesCollectionRef, where("userUid", "==", userID));

      // Get the documents that match the query
      const querySnapshot = await getDocs(q);

      const shoesData: Shoe[] = [];

      querySnapshot.forEach((doc) => {
        // Push the data of each shirt into the shirtsData array
        shoesData.push(doc.data() as Shoe);
        console.log(doc.data().picture as Shoe);
      });

      setShoes(shoesData);
    } catch (error) {
      console.error("Error fetching shorts:", error);
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
            {/* Render other shirt details */}
          </View>
        )}
      ></GridView>
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
    aspectRatio: 1,
  },
});
