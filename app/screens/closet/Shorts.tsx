import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";
import { SafeAreaView } from "react-native-safe-area-context";

interface Short {
  id: string;
  attire: string;
  category: string;
  color: string;
  picture: string;
  description: string;
  // Add other fields as needed
}
const Shorts = () => {
  const userID = getAuth().currentUser?.uid;
  const [shorts, setShorts] = useState<Short[]>([]);

  const getShortsFromFirestore = async () => {
    try {
      // Create a reference to the 'Shorts' collection and query by user ID
      const shortsCollectionRef = collection(FIRESTORE_DB, "Shorts");
      const q = query(shortsCollectionRef, where("userUid", "==", userID));

      // Get the documents that match the query
      const querySnapshot = await getDocs(q);

      const shortsData: Short[] = [];

      querySnapshot.forEach((doc) => {
        // Push the data of each shirt into the shirtsData array
        shortsData.push(doc.data() as Short);
        console.log(doc.data().picture as Short);
      });

      setShorts(shortsData);
    } catch (error) {
      console.error("Error fetching shorts:", error);
    }
  };

  useEffect(() => {
    getShortsFromFirestore();
  }, []);
  return (
    <SafeAreaView>
      <GridView
        data={shorts}
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

export default Shorts;

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
