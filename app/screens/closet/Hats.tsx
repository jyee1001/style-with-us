import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

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
      const hatsCollectionRef = collection(FIRESTORE_DB, "Hats");
      const q = query(hatsCollectionRef, where("userUid", "==", userID));
      const querySnapshot = await getDocs(q);

      const hatsData: Hat[] = [];
      querySnapshot.forEach((doc) => {
        hatsData.push({ id: doc.id, ...doc.data() } as Hat);
      });

      setHats(hatsData);
    } catch (error) {
      console.error("Error fetching hats:", error);
    }
  };

  const handleDeleteHat = async (hatId: string) => {
    try {
      const hatRef = doc(collection(FIRESTORE_DB, "Hats"), hatId);
      await deleteDoc(hatRef);

      setHats((prevHats) => prevHats.filter((hat) => hat.id !== hatId));
    } catch (error) {
      console.error("Error deleting hat:", error);
    }
  };

  useEffect(() => {
    getHatsFromFirestore();
  }, []);

  return (
    <SafeAreaView>
      <GridView
        data={hats}
        renderItem={(item) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <TouchableOpacity onPress={() => handleDeleteHat(item.id)}>
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
