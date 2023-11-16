import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";
import { SafeAreaView } from "react-native-safe-area-context";

interface Hat {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}

const Hats = () => {
  const userID = getAuth().currentUser?.uid;
  const [hats, setHats] = useState<Hat[]>([]);

  const getHatsFromFirestore = async () => {
    try {
      // Create a reference to the 'Shirts' collection and query by user ID
      const hatsCollectionRef = collection(FIRESTORE_DB, "Hats");
      const q = query(hatsCollectionRef, where("userUid", "==", userID));

      // Get the documents that match the query
      const querySnapshot = await getDocs(q);

      const shirtsData: Hat[] = [];

      querySnapshot.forEach((doc) => {
        // Push the data of each shirt into the shirtsData array
        shirtsData.push(doc.data() as Hat);
        console.log(doc.data().picture as Hat);
      });

      setHats(shirtsData);
    } catch (error) {
      console.error("Error fetching shirts:", error);
    }
  };

  useEffect(() => {
    // Get the shirts when the component mounts
    getHatsFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={hats}
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

export default Hats;

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
