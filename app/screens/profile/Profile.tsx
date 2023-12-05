import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../../FirebaseConfig";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";

const Profile = () => {
  const authUser = getAuth().currentUser;

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [stylePreference, setStylePreference] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [nameText, setNameText] = useState("");
  const [genderText, setGenderText] = useState("");
  const [heightText, setHeightText] = useState("");
  const [weightText, setWeightText] = useState("");
  const [stylePreferenceText, setStylePreferenceText] = useState("");
  const [birthdateText, setBirthdateText] = useState("");

  const [picture, setPicture] = useState("");

  const [birthdateMap, setBirthdateMap] = useState({
    month: "",
    day: "",
    year: "",
  });

  const [editMode, setEditMode] = useState(false);

  const [updatedInfo, setUpdatedInfo] = useState({
    picture: "",
    name: "",
    gender: "",
    height: "",
    weight: "",
    stylePreference: "",
    birthdate: {
      month: "",
      day: "",
      year: "",
    },
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setPicture(userData.picture || "");
        setName(userData.name || authUser?.displayName || "");
        setGender(userData.gender || "");
        setHeight(userData.height || "");
        setWeight(userData.weight || "");
        setStylePreference(userData.stylePreference || "");
        setBirthdate(userData.birthdate || "");

        if (userData.name) {
          setNameText(`${userData.name}`);
        }
        else {
          setNameText(`No Name Entered`);
        }
        if (userData.gender) {
          setGenderText(`${userData.gender}`);
        }
        else {
          setGenderText(`No Gender Selected`);
        }
        if (userData.height) {
          setHeightText(`${userData.height}`);
        }
        else {
          setHeightText(`No Height Selected`);
        }
        if (userData.weight) {
          setWeightText(`${userData.weight}`);
        }
        else {
          setWeightText(`No Weight Selected`);
        }
        if (userData.stylePreference) {
          setStylePreferenceText(`${userData.stylePreference}`);
        }
        else {
          setStylePreferenceText(`No Style Preference Selected`);
        }
        if (userData.birthdate) {
          setBirthdateText(`${userData.birthdate}`);
        }
        else {
          setBirthdateText(`No Birthday Selected`);
        }
      }
      else {
        await setDoc(userDocRef, {
          userUid: authUser?.uid || "",
          name: authUser?.displayName || "",
          birthdate: "",
          stylePreference: "",
          gender: "",
          height: "",
          picture: "",
          weight: "",
        });
        setNameText(`No Name Entered`);
        setGenderText(`No Gender Selected`);
        setHeightText(`No Height Selected`);
        setWeightText(`No Weight Selected`);
        setStylePreferenceText(`No Style Preference Selected`);
        setBirthdateText(`No Birthday Selected`);
      }
    };

    fetchProfile();
  }, [authUser]);

  const takePhoto = async () => {
    const cameraResp = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!cameraResp.canceled) {
      console.log(cameraResp.assets[0].uri);
      setPicture(cameraResp.assets[0].uri);
      setUpdatedInfo({ ...updatedInfo, picture: cameraResp.assets[0].uri });
    }
  };

  const isValidDate = (day: number, month: number, year: number): boolean => {
    const date = new Date(year, month - 1, day);
    return (
      date.getDate() === day &&
      date.getMonth() === month - 1 &&
      date.getFullYear() === year
    );
  };

  const handleSaveChanges = async () => {
    try {
      const userDocRef = doc(FIRESTORE_DB, "ProfileSettings", authUser?.uid || "");

      let change = 0;
      if (updatedInfo.picture !== "") {
        await updateDoc(userDocRef, { picture: updatedInfo.picture });
        console.log("Picture updated successfully!");
        change++;
      }
      if (updatedInfo.name !== "") {
        await updateDoc(userDocRef, { name: updatedInfo.name });
        console.log("Name updated successfully!");
        setNameText(`${updatedInfo.name}`);
        change++;
      }
      if (updatedInfo.gender !== "") {
        await updateDoc(userDocRef, { gender: updatedInfo.gender });
        console.log("Gender updated successfully!");
        setGenderText(`${updatedInfo.gender}`);
        change++;
      }
      if (updatedInfo.height !== "") {
        await updateDoc(userDocRef, { height: updatedInfo.height });
        console.log("Height updated successfully!");
        setHeightText(`${updatedInfo.height}`);
        change++;
      }
      if (updatedInfo.weight !== "") {
        await updateDoc(userDocRef, { weight: updatedInfo.weight });
        console.log("Weight updated successfully!");
        setWeightText(`${updatedInfo.weight}`);
        change++;
      }
      if (updatedInfo.stylePreference !== "") {
        await updateDoc(userDocRef, { stylePreference: updatedInfo.stylePreference });
        console.log("Style Preference updated successfully!");
        setStylePreferenceText(`${updatedInfo.stylePreference}`);
        change++;
      }
      if (updatedInfo.birthdate.month !== "" && updatedInfo.birthdate.day !== "" && updatedInfo.birthdate.year !== "") {
        console.log("Month:", updatedInfo.birthdate.month);
        console.log("Day:", updatedInfo.birthdate.day);
        console.log("Year:", updatedInfo.birthdate.year);
        const numericDay = parseInt(updatedInfo.birthdate.day, 10);
        const numericMonth = parseInt(updatedInfo.birthdate.month, 10);
        const numericYear = parseInt(updatedInfo.birthdate.year, 10);
        if (!isValidDate(numericDay, numericMonth, numericYear)) {
          await updateDoc(userDocRef, { birthdate: "Invalid date!" });
          console.log("Birthdate updated but Invalid!");
          setBirthdateText("Invalid date!");
          change++;
        }
        else {
          const formattedBirthdate = `${updatedInfo.birthdate.month}/${updatedInfo.birthdate.day}/${updatedInfo.birthdate.year}`;
          await updateDoc(userDocRef, { birthdate: formattedBirthdate });
          console.log("Birthdate updated successfully!");
          setBirthdateText(`${formattedBirthdate}`);
          change++;
        }
      }
      if (change > 0) {
        setSuccessMessage("Information Successfully Updated!");
      }
      
      setUpdatedInfo({
        picture: "",
        name: "",
        gender: "",
        height: "",
        weight: "",
        stylePreference: "",
        birthdate: {
          month: "",
          day: "",
          year: "",
        },
      });
    } catch (error) {
      console.error("Error updating profile settings:", error);
    }
  };

  const renderTopText = () => {
    return (
      <>
        <TouchableOpacity style={styles.pictureRound}>
          {picture ? (
            <Image source={{ uri: picture }} style={styles.image} />
          ) : null}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Name</Text>
            <Text style={styles.infoText}>{nameText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Gender</Text>
            <Text style={styles.infoText}>{genderText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Height</Text>
            <Text style={styles.infoText}>{heightText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Weight</Text>
            <Text style={styles.infoText}>{weightText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoTitle}>Style Preference</Text>
            <Text style={styles.infoText}>{stylePreferenceText}</Text>
          </View>
          <View style={styles.infoLastRow}>
            <Text style={styles.infoTitle}>Birthday</Text>
            <Text style={styles.infoText}>{birthdateText}</Text>
          </View>
        </View>
      </>
    );
  };

  const renderPickers = () => {
    return (
      <>
        <TouchableOpacity style={styles.pictureRound} onPress={takePhoto}>
          {picture ? (
            <Image source={{ uri: picture }} style={styles.image} />
          ) : null}
        </TouchableOpacity>
        
        <View style={styles.rowContainer}>
        <TextInput
          style={[styles.infoNameText, styles.nameInput]}
          placeholder="Enter Name here..."
          placeholderTextColor="#E5E5E5"
          value={updatedInfo.name}
          onChangeText={(text) => setUpdatedInfo({ ...updatedInfo, name: text })}
        />
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: " Choose Gender", value: "" }}
            onValueChange={(itemValue: string) => setUpdatedInfo({ ...updatedInfo, gender: itemValue })}
            items={[
              { label: " Male", value: "Male" },
              { label: " Female", value: "Female" },
              { label: " Non-binary", value: "Non-binary" },
              { label: " Genderqueer", value: "Genderqueer" },
              { label: " Genderfluid", value: "Genderfluid" },
              { label: " Prefer not to say", value: "Prefer not to say" },
            ]}
            style={{
              inputAndroid: {
                color: '#E5E5E5',
              },
              inputIOS: {
                color: '#E5E5E5',
              },
            }}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: " Choose Height" }}
            onValueChange={(value) => setUpdatedInfo({ ...updatedInfo, height: value })}
            items={[
              { label: " 4 feet - 4 feet 5 inches", value: "4 feet - 4 feet 5 inches" },
              { label: " 4 feet 6 inches - 4 feet 11 inches", value: "4 feet 6 inches - 4 feet 11 inches" },
              { label: " 5 feet - 5 feet 5 inches", value: "5 feet - 5 feet 5 inches" },
              { label: " 5 feet 6 inches - 5 feet 11 inches", value: "5 feet 6 inches - 5 feet 11 inches" },
              { label: " 6 feet - 6 feet 5 inches", value: "6 feet - 6 feet 5 inches" },
              { label: " 6 feet 6 inches - 6 feet 11 inches", value: "6 feet 6 inches - 6 feet 11 inches" },
              { label: " 7 feet - 7 feet 5 inches", value: "7 feet - 7 feet 5 inches" },
            ]}
            style={{
              inputAndroid: {
                color: '#E5E5E5',
              },
              inputIOS: {
                color: '#E5E5E5',
              },
            }}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: " Choose Weight" }}
            onValueChange={(value) => setUpdatedInfo({ ...updatedInfo, weight: value })}
            items={
              [
                { label: " 50 - 54 lbs", value: "50 - 54 lbs" },
                { label: " 55 - 59 lbs", value: "55 - 59 lbs" },
                { label: " 60 - 64 lbs", value: "60 - 64 lbs" },
                { label: " 65 - 69 lbs", value: "65 - 69 lbs" },
                { label: " 70 - 74 lbs", value: "70 - 74 lbs" },
                { label: " 75 - 79 lbs", value: "75 - 79 lbs" },
                { label: " 80 - 84 lbs", value: "80 - 84 lbs" },
                { label: " 85 - 89 lbs", value: "85 - 89 lbs" },
                { label: " 90 - 94 lbs", value: "90 - 94 lbs" },
                { label: " 95 - 99 lbs", value: "95 - 99 lbs" },
                { label: " 100 - 104 lbs", value: "100 - 104 lbs" },
                { label: " 105 - 109 lbs", value: "105 - 109 lbs" },
                { label: " 110 - 114 lbs", value: "110 - 114 lbs" },
                { label: " 115 - 119 lbs", value: "115 - 119 lbs" },
                { label: " 120 - 124 lbs", value: "120 - 124 lbs" },
                { label: " 125 - 129 lbs", value: "125 - 129 lbs" },
                { label: " 130 - 134 lbs", value: "130 - 134 lbs" },
                { label: " 135 - 139 lbs", value: "135 - 139 lbs" },
                { label: " 140 - 144 lbs", value: "140 - 144 lbs" },
                { label: " 145 - 149 lbs", value: "145 - 149 lbs" },
                { label: " 150 - 154 lbs", value: "150 - 154 lbs" },
                { label: " 155 - 159 lbs", value: "155 - 159 lbs" },
                { label: " 160 - 164 lbs", value: "160 - 164 lbs" },
                { label: " 165 - 169 lbs", value: "165 - 169 lbs" },
                { label: " 170 - 174 lbs", value: "170 - 174 lbs" },
                { label: " 175 - 179 lbs", value: "175 - 179 lbs" },
                { label: " 180 - 184 lbs", value: "180 - 184 lbs" },
                { label: " 185 - 189 lbs", value: "185 - 189 lbs" },
                { label: " 190 - 194 lbs", value: "190 - 194 lbs" },
                { label: " 195 - 199 lbs", value: "195 - 199 lbs" },
                { label: " 200 - 204 lbs", value: "200 - 204 lbs" },
                { label: " 205 - 209 lbs", value: "205 - 209 lbs" },
                { label: " 210 - 214 lbs", value: "210 - 214 lbs" },
                { label: " 215 - 219 lbs", value: "215 - 219 lbs" },
                { label: " 220 - 224 lbs", value: "220 - 224 lbs" },
                { label: " 225 - 229 lbs", value: "225 - 229 lbs" },
                { label: " 230 - 234 lbs", value: "230 - 234 lbs" },
                { label: " 235 - 239 lbs", value: "235 - 239 lbs" },
                { label: " 240 - 244 lbs", value: "240 - 244 lbs" },
                { label: " 245 - 249 lbs", value: "245 - 249 lbs" },
                { label: " 250 - 254 lbs", value: "250 - 254 lbs" },
                { label: " 255 - 259 lbs", value: "255 - 259 lbs" },
                { label: " 260 - 264 lbs", value: "260 - 264 lbs" },
                { label: " 265 - 269 lbs", value: "265 - 269 lbs" },
                { label: " 270 - 274 lbs", value: "270 - 274 lbs" },
                { label: " 275 - 279 lbs", value: "275 - 279 lbs" },
                { label: " 280 - 284 lbs", value: "280 - 284 lbs" },
                { label: " 285 - 289 lbs", value: "285 - 289 lbs" },
                { label: " 290 - 294 lbs", value: "290 - 294 lbs" },
                { label: " 295 - 299 lbs", value: "295 - 299 lbs" },
                { label: " 300 lbs and above", value: "300 lbs and above" },
              ]
            }
            style={{
              inputAndroid: {
                color: '#E5E5E5',
              },
              inputIOS: {
                color: '#E5E5E5',
              },
            }}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.pickerContainer}>
          <RNPickerSelect
            placeholder={{ label: " Choose Style Preference" }}
            onValueChange={(value) => setUpdatedInfo({ ...updatedInfo, stylePreference: value })}
            items={[
              { label: " Casual", value: "Casual" },
              { label: " Formal/Elegant", value: "Formal/Elegant" },
              { label: " Business Casual", value: "Business Casual" },
              { label: " Sporty", value: "Sporty" },
              { label: " Relaxed", value: "Relaxed" },
              { label: " Streetwear", value: "Streetwear" },
              { label: " Retro", value: "Retro" },
            ]}
            style={{
              inputAndroid: {
                color: '#E5E5E5',
              },
              inputIOS: {
                color: '#E5E5E5',
              },
            }}
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.birthdateContainer}>
          <View style={styles.pickerBirthdayContainer}>
            <RNPickerSelect
              placeholder={{ label: " Birth Month" }}
              onValueChange={(value) => setUpdatedInfo({ ...updatedInfo, birthdate: { ...updatedInfo.birthdate, month: value, }, })}
              items={[
                { label: " January", value: "01" },
                { label: " February", value: "02" },
                { label: " March", value: "03" },
                { label: " April", value: "04" },
                { label: " May", value: "05" },
                { label: " June", value: "06" },
                { label: " July", value: "07" },
                { label: " August", value: "08" },
                { label: " September", value: "09" },
                { label: " October", value: "10" },
                { label: " November", value: "11" },
                { label: " December", value: "12" },
              ]}
              style={{
                inputAndroid: {
                  color: '#E5E5E5',
                },
                inputIOS: {
                  color: '#E5E5E5',
                },
              }}
            />
          </View>
          <View style={styles.pickerBirthdayContainer}>
            <RNPickerSelect
              placeholder={{ label: " Birth Day" }}
              onValueChange={(value) => setUpdatedInfo({ ...updatedInfo, birthdate: { ...updatedInfo.birthdate, day: value, }, })}
              items={[
                { label: " 1", value: "01" },
                { label: " 2", value: "02" },
                { label: " 3", value: "03" },
                { label: " 4", value: "04" },
                { label: " 5", value: "05" },
                { label: " 6", value: "06" },
                { label: " 7", value: "07" },
                { label: " 8", value: "08" },
                { label: " 9", value: "09" },
                { label: " 10", value: "10" },
                { label: " 11", value: "11" },
                { label: " 12", value: "12" },
                { label: " 13", value: "13" },
                { label: " 14", value: "14" },
                { label: " 15", value: "15" },
                { label: " 16", value: "16" },
                { label: " 17", value: "17" },
                { label: " 18", value: "18" },
                { label: " 19", value: "19" },
                { label: " 20", value: "20" },
                { label: " 21", value: "21" },
                { label: " 22", value: "22" },
                { label: " 23", value: "23" },
                { label: " 24", value: "24" },
                { label: " 25", value: "25" },
                { label: " 26", value: "26" },
                { label: " 27", value: "27" },
                { label: " 28", value: "28" },
                { label: " 29", value: "29" },
                { label: " 30", value: "30" },
                { label: " 31", value: "31" },
              ]}
              style={{
                inputAndroid: {
                  color: '#E5E5E5',
                },
                inputIOS: {
                  color: '#E5E5E5',
                },
              }}
            />
          </View>
          <View style={styles.pickerBirthdayContainerLast}>
            <RNPickerSelect
              placeholder={{ label: " Birth Year" }}
              onValueChange={(value) => setUpdatedInfo({ ...updatedInfo, birthdate: { ...updatedInfo.birthdate, year: value, }, })}
              items={[
                { label: " 2005", value: "2005" },
                { label: " 2004", value: "2004" },
                { label: " 2003", value: "2003" },
                { label: " 2002", value: "2002" },
                { label: " 2001", value: "2001" },
                { label: " 2000", value: "2000" },
                { label: " 1999", value: "1999" },
                { label: " 1998", value: "1998" },
                { label: " 1997", value: "1997" },
                { label: " 1996", value: "1996" },
                { label: " 1995", value: "1995" },
                { label: " 1994", value: "1994" },
                { label: " 1993", value: "1993" },
                { label: " 1992", value: "1992" },
                { label: " 1991", value: "1991" },
                { label: " 1990", value: "1990" },
                { label: " 1989", value: "1989" },
                { label: " 1988", value: "1988" },
                { label: " 1987", value: "1987" },
                { label: " 1986", value: "1986" },
                { label: " 1985", value: "1985" },
                { label: " 1984", value: "1984" },
                { label: " 1983", value: "1983" },
                { label: " 1982", value: "1982" },
                { label: " 1981", value: "1981" },
                { label: " 1980", value: "1980" },
                { label: " 1979", value: "1979" },
                { label: " 1978", value: "1978" },
                { label: " 1977", value: "1977" },
                { label: " 1976", value: "1976" },
                { label: " 1975", value: "1975" },
                { label: " 1974", value: "1974" },
                { label: " 1973", value: "1973" },
                { label: " 1972", value: "1972" },
                { label: " 1971", value: "1971" },
                { label: " 1970", value: "1970" },
                { label: " 1969", value: "1969" },
                { label: " 1968", value: "1968" },
                { label: " 1967", value: "1967" },
                { label: " 1966", value: "1966" },
                { label: " 1965", value: "1965" },
                { label: " 1964", value: "1964" },
                { label: " 1963", value: "1963" },
                { label: " 1962", value: "1962" },
                { label: " 1961", value: "1961" },
                { label: " 1960", value: "1960" },
                { label: " 1959", value: "1959" },
                { label: " 1958", value: "1958" },
                { label: " 1957", value: "1957" },
                { label: " 1956", value: "1956" },
                { label: " 1955", value: "1955" },
                { label: " 1954", value: "1954" },
                { label: " 1953", value: "1953" },
                { label: " 1952", value: "1952" },
                { label: " 1951", value: "1951" },
                { label: " 1950", value: "1950" },
                { label: " 1949", value: "1949" },
                { label: " 1948", value: "1948" },
                { label: " 1947", value: "1947" },
                { label: " 1946", value: "1946" },
                { label: " 1945", value: "1945" },
                { label: " 1944", value: "1944" },
                { label: " 1943", value: "1943" },
                { label: " 1942", value: "1942" },
                { label: " 1941", value: "1941" },
                { label: " 1940", value: "1940" }
              ]}
              style={{
                inputAndroid: {
                  color: '#E5E5E5',
                },
                inputIOS: {
                  color: '#E5E5E5',
                },
              }}
            />
          </View>
        </View>
      </View>

      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSaveChanges}
          style={[styles.button, { backgroundColor: '#008080' }]}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      </>
    );
  };

  const renderButtons = () => {
    return (
      <>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setEditMode(false);
              setSuccessMessage("");
            }}
            style={[styles.button, { backgroundColor: '#008080' }]}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {editMode ? renderPickers() : renderTopText()}

      {!editMode && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => setEditMode(true)}
            style={[styles.button, { backgroundColor: '#008080' }]}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {editMode ? renderButtons() : null}

      {!editMode && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => FIREBASE_AUTH.signOut()}
            style={[styles.button, { backgroundColor: '#008080' }]}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 0,
    backgroundColor: "#282b30",
    flexDirection: "column",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  pictureRound: {
    marginLeft: 10,
    marginRight: 10,
    width: 100,
    height: 100,
    marginTop: 15,
    backgroundColor: "#E5E5E5",
    borderRadius: 100,
    marginBottom: 10,
    borderWidth: 5,
    borderColor: "#424549",
  },
  pickerContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 340,
    height: 50,
    //backgroundColor: 'white',
    //borderRadius: 5,
    color: '#E5E5E5',
    fontSize: 16,
    backgroundColor: '#424549',
    borderRadius: 10,
    marginTop: 10,
  },
  pickerBirthdayContainer: {
    width: 108,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    height: 50,
    color: '#E5E5E5',
    backgroundColor: '#424549',
    borderRadius: 10,
    marginTop: 10,
    marginRight: 8,
  },
  pickerBirthdayContainerLast: {
    width: 108,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 16,
    height: 50,
    color: '#E5E5E5',
    backgroundColor: '#424549',
    borderRadius: 10,
    marginTop: 10,
  },
  image: {
    // width: 200,
    // height: 200,
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  birthdateContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    width: 110,
    height: 40,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#E5E5E5',
    fontSize: 14,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoContainer: {
    backgroundColor: 'transparent',
    marginLeft: 15,
    marginRight: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#424549',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  infoLastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#424549',
    borderRadius: 10,
    padding: 15,
    margin: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '40%',
    color: '#E5E5E5',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'left',
    width: '60%',
    color: '#E5E5E5',
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#008080',
  },
  nameInput: {
    width: 340,
    height: 50,
    //backgroundColor: 'white',
    //borderRadius: 5,
    color: '#E5E5E5',
    fontSize: 16,
    backgroundColor: '#424549',
    borderRadius: 10,
    marginTop: 10,
  },
  infoNameText: {
    fontSize: 14,
    color: "black",
  },
});

export default Profile;
