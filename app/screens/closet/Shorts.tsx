import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

import { FIRESTORE_DB } from "../../../FirebaseConfig";
import GridView from "../GridView";

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
      const shortsCollectionRef = collection(FIRESTORE_DB, "Shorts");
      const q = query(shortsCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const shortsData: Short[] = [];
      querySnapshot.forEach((doc) => {
        shortsData.push({ id: doc.id, ...doc.data() } as Short);
      });

      setShorts(shortsData);
    } catch (error) {
      console.error("Error fetching shorts:", error);
    }
  };

  const handleDeleteShort = async (shortId: string) => {
    try {
      const shortRef = doc(collection(FIRESTORE_DB, "Shorts"), shortId);
      await deleteDoc(shortRef);

      setShorts((prevShorts) => prevShorts.filter((short) => short.id !== shortId));
    } catch (error) {
      console.error("Error deleting short:", error);
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
            <TouchableOpacity onPress={() => handleDeleteShort(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
