import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Button,
  StyleSheet,
  FlatList,
  Touchable,
  Image,
} from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import GridView from "../GridView";

interface TileData {
  id: string;
  title: string;
  uri: string;

  //color: string;
}

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Closet: React.FC<RouterProps> = ({ navigation }) => {
  const handleTilePress = (name: string) => {
    navigation.navigate(name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>MY CLOSET</Text>
      </View>
      <View style={styles.blankBox}></View>

      <GridView
        data={[
          {
            name: "Hats",
            id: 1,
            uri: "https://i.ibb.co/t4fXGsz/hathat.png",
          },
          {
            name: "Jackets",
            id: 2,
            uri: "https://i.ibb.co/BjqDcn6/jackets.png",
          },
          {
            name: "Shirts",
            id: 3,
            uri: "https://i.ibb.co/Yp9Ffk3/shirt.png",
          },
          {
            name: "Pants",
            id: 4,
            uri: "https://i.ibb.co/FgxdpJp/pants-2.png",
          },
          {
            name: "Shorts",
            id: 5,
            uri: "https://i.ibb.co/kJhbh7j/shorts.png",
          },
          {
            name: "Shoes",
            id: 6,
            uri: "https://i.ibb.co/54QbJbN/shoe.png",
          },
        ]}
        renderItem={(item) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleTilePress(item.name)}
          >
            <Image
              source={{
                uri: item.uri,
              }}
              style={styles.imageContainer}
            />
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
      ></GridView>
      <View style={styles.outfitContainer}>
        <TouchableOpacity
          style={styles.outfitsButton}
          onPress={() => {
            handleTilePress("Outfits");
          }}
        >
          <Text style={styles.text}>Outfits</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outfitsButton}
          onPress={() => {
            handleTilePress("Home");
          }}
        >
          <Text style={styles.text}>Create Outfit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Closet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#282b30",
  },
  tile: {
    padding: 16,
    backgroundColor: "white",
    marginVertical: 8,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 20,
    borderRadius: 20,
    // marginHorizonta: 16,
    // width: "auto",
  },
  itemContainer: {
    height: 100,
    backgroundColor: "#E5E5E5",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "black", fontWeight: "bold", fontSize: 13 },

  blankBox: {
    width: 20,
    height: 50,
    marginBottom: 80,
    backgroundColor: "transparent",
  },
  outfitsButton: {
    backgroundColor: "#008080",
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 5,
    height: 40,
    width: 110,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  outfitContainer: {
    height: 180,
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: "#282b30",
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "500",
    color: "#E5E5E5",
  },
  imageContainer: { width: 30, height: 30, marginBottom: 10 },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 30,
    marginTop: 30,
    color: "#E5E5E5",
    fontWeight: "500",
  },
});
