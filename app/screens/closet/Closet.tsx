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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import addClothes from "./addClothes";

const Stack = createNativeStackNavigator();

interface TileProps {
  title: string;
  onPress: () => void;
}

interface TileData {
  id: string;
  title: string;
  color: string;
}

const Tile: React.FC<TileProps> = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.tile}>
      <Text>{title}</Text>
    </View>
  </TouchableOpacity>
);

const data: TileData[] = [
  { id: "1", title: "Outwear", color: "red" },
  { id: "2", title: "Shirts", color: "blue" },
  { id: "3", title: "Tile 3", color: "green" },
];

const renderItem = ({ item }: { item: TileData }) => (
  <Tile title={item.title} onPress={() => handleTilePress(item.id)} />
);
const handleTilePress = (id: string) => {
  console.log(`Tile clicked with ID: ${id}`);
};

const Closet = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.blankBox}></View>
      {/* <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      /> */}
      <View style={styles.gridContainer}>
        {data.map((item) => (
          <Tile
            key={item.id}
            title={item.title}
            onPress={() => handleTilePress(item.id)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Closet;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   paddingTop: 20,
  // },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "black",
  },
  // tile: {
  //   padding: 16,
  //   backgroundColor: "white",
  //   marginVertical: 8,
  //   marginLeft: 16,
  //   marginRight: 16,
  //   marginTop: 20,
  //   borderRadius: 20,
  //   // marginHorizonta: 16,
  //   // width: "auto",
  // },
  tile: {
    flexBasis: "10%", // Set the width of each tile (adjust as needed)
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: "lightgray",
    marginVertical: 8,
  },
  blankBox: {
    width: 20,
    height: 50,
    backgroundColor: "transparent",
  },
  gridContainer: {
    flexDirection: "row", // Arrange tiles horizontally
    flexWrap: "wrap", // Wrap tiles to the next line when necessary
    justifyContent: "space-between", // Distribute tiles evenly within rows
  },
});
