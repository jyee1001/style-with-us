import { View, Text, StyleSheet, Button, Image, TouchableOpacity, } from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { NavigationProp } from "@react-navigation/native";
import "firebase/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { StringLike } from "@firebase/util";

interface Outfit {
  id: string;
  hatId: string;
  jacketId: string;
  shirtId: string;
  pantsId: string;
  shortsId: string;
  shoesId: string;
  style: string;
  userId: string;
}

interface OutfitUrls {
  hatUrl?: string | null;
  jacketUrl?: string | null;
  shirtUrl?: string | null;
  pantsUrl?: string | null;
  shortsUrl?: string | null;
  shoesUrl?: string | null;
}

type PlannerProps = {
  navigation: NavigationProp<any, any>;
};

const Planner: React.FC<PlannerProps> = ({ navigation }) => {
  const [date, setDate] = useState("");
  const [outfitUrls, setOutfitUrls] = useState<OutfitUrls | null>(null);
  const [theOutfitId, setTheOutfitId] = useState<string | null>(null);
  const [displayDate, setDisplayDate] = useState("");

  const dateSelect = async (day: { dateString: string }) => {
    try {
      const selectedDate = day.dateString;
      const dateParts = selectedDate.split("-");
      setDisplayDate(`${dateParts[1]}/${dateParts[2]}/${dateParts[0]}`);
      const userID = getAuth().currentUser?.uid;

      const plannerDatesCollectionRef = collection(
        FIRESTORE_DB,
        "PlannerDates"
      );
      const q = query(
        plannerDatesCollectionRef,
        where("date", "==", selectedDate),
        where("userUid", "==", userID)
      );
      const querySnapshot = await getDocs(q);

      let outfitId = "";

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        outfitId = data.outfitId;
      });

      if (outfitId) {
        const outfitDoc = await getDoc(doc(FIRESTORE_DB, "Outfits", outfitId));
        if (outfitDoc.exists()) {
          setTheOutfitId(outfitId);

          const outfitData = outfitDoc.data() as Outfit;
          const fetchItemUrl = async (
            itemId: string,
            collectionName: string
          ): Promise<string | null> => {
            if (itemId) {
              const itemDoc = await getDoc(
                doc(FIRESTORE_DB, collectionName, itemId)
              );
              if (itemDoc.exists()) {
                return itemDoc.data()?.picture || null;
              } else {
                return null;
              }
            } else {
              return null;
            }
          };

          const hatUrl = await fetchItemUrl(outfitData.hatId, "Hats");
          const jacketUrl = await fetchItemUrl(outfitData.jacketId, "Jackets");
          const shirtUrl = await fetchItemUrl(outfitData.shirtId, "Shirts");
          const pantsUrl = await fetchItemUrl(outfitData.pantsId, "Pants");
          const shortsUrl = await fetchItemUrl(outfitData.shortsId, "Shorts");
          const shoesUrl = await fetchItemUrl(outfitData.shoesId, "Shoes");

          setOutfitUrls({
            hatUrl,
            jacketUrl,
            shirtUrl,
            pantsUrl,
            shortsUrl,
            shoesUrl,
          });
        }
      } else {
        setTheOutfitId(null);
        setOutfitUrls(null);
      }
      setDate(selectedDate);
    } catch (error) {
      console.error("Error fetching outfits:", error);
    }
  };

  const handleDeleteOutfit = async () => {
    if (theOutfitId) {
      const userID = getAuth().currentUser?.uid;
      const plannerDatesCollectionRef = collection(
        FIRESTORE_DB,
        "PlannerDates"
      );
      const q = query(
        plannerDatesCollectionRef,
        where("date", "==", date),
        where("userUid", "==", userID)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        try {
          await deleteDoc(doc.ref);
          setTheOutfitId(null);
          setOutfitUrls(null);
          //setDate("");
        } catch (error) {
          console.error("Error deleting PlannerDates document:", error);
        }
      });
    }
  };

  const navigateToChooseOutfitScreen = () => {
    navigation.navigate("Choose Outfit", { date });
  };

  const markedDates = {
    [date]: { selected: true, marked: true, selectedColor: "#008080" },
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>PLANNER</Text>
      </View>

      <View style={styles.calendarContainer}>
        <Calendar
          style={{
            width: 400,
            height: 300,
          }}
          current={new Date().toISOString().split("T")[0]}
          onDayPress={dateSelect}
          markedDates={markedDates}
        />
      </View>
      {theOutfitId ? (
        <View style={styles.dateContainer}>
          <Text style={{ color: '#E5E5E5' }}>Selected Date: {displayDate}</Text>
          <View style={styles.imageContainer}>
            {outfitUrls?.hatUrl && (
              <Image source={{ uri: outfitUrls.hatUrl }} style={styles.image} />
            )}
            {outfitUrls?.jacketUrl && (
              <Image
                source={{ uri: outfitUrls.jacketUrl }}
                style={styles.image}
              />
            )}
            {outfitUrls?.shirtUrl && (
              <Image
                source={{ uri: outfitUrls.shirtUrl }}
                style={styles.image}
              />
            )}
            {outfitUrls?.pantsUrl && (
              <Image
                source={{ uri: outfitUrls.pantsUrl }}
                style={styles.image}
              />
            )}
            {outfitUrls?.shortsUrl && (
              <Image
                source={{ uri: outfitUrls.shortsUrl }}
                style={styles.image}
              />
            )}
            {outfitUrls?.shoesUrl && (
              <Image
                source={{ uri: outfitUrls.shoesUrl }}
                style={styles.image}
              />
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleDeleteOutfit}
              style={[styles.button, { backgroundColor: '#008080' }]}
            >
              <Text style={styles.buttonText}>Delete Outfit From Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : date !== "" ? (
        <View style={styles.dateContainer}>
          <Text style={{ color: '#E5E5E5' }}>Selected Date: {displayDate}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={navigateToChooseOutfitScreen}
              style={[styles.buttonSmaller, { backgroundColor: '#008080' }]}
            >
              <Text style={styles.buttonText}>Choose Outfit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#282b30",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 30,
    marginTop: 77,
    color: "#E5E5E5",
    fontWeight: "500",
  },
  calendarContainer: {
    marginTop: 80,
    alignItems: "center",
  },
  dateContainer: {
    marginTop: 70,
    alignItems: "center",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 50,
    height: 50,
    marginHorizontal: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    width: 180,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSmaller: {
    width: 120,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#E5E5E5',
    fontSize: 14,
  },
});

export default Planner;
