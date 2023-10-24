import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Button,
  StyleSheet,
  FlatList,
} from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import GridView from "../GridView";

// interface TileProps {
//   title: string;
//   onPress: () => void;
// }

interface TileData {
  id: string;
  title: string;

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
      <View style={styles.blankBox}></View>
      {/* <TouchableOpacity style={styles.tile} onPress={handleTilePress}>
        <Text>Bottoms</Text>
      </TouchableOpacity> */}

      <GridView
        data={[
          {
            name: "Shirts",
            id: 1,
          },
          {
            name: "Outwear",
            id: 2,
          },
          {
            name: "Bottoms",
            id: 3,
          },
        ]}
        renderItem={(item) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => handleTilePress(item.name)}
          >
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
      ></GridView>
    </SafeAreaView>
  );
};

export default Closet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "black",
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
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { color: "black", fontWeight: "bold", fontSize: 25 },

  blankBox: {
    width: 20,
    height: 50,
    backgroundColor: "transparent",
  },
});
