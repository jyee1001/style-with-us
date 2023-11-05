import { FC } from "react";
import { View, StyleSheet, FlatList } from "react-native";

interface Props<T> {
  data: T[];
  renderItem(item: T): JSX.Element;
  col?: number;
}

const GridView = <T extends any>(props: Props<T>) => {
  const { data, renderItem, col = 2 } = props;
  // return (
  //   <View style={styles.container}>
  //     {data.map((item, index) => {
  //       return (
  //         <View key={index} style={{ width: `${100 / col}%` }}>
  //           <View style={{ padding: 10 }}>{renderItem(item)}</View>
  //         </View>
  //       );
  //     })}
  //   </View>
  // );
  const columnWidth = `${100 / col}%`;

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => index.toString()} // Use the index as the key
      numColumns={col} // Set the number of columns
      renderItem={({ item }) => (
        <View style={{ width: columnWidth, padding: 10 }}>
          {renderItem(item)}
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", flexDirection: "row", flexWrap: "wrap" },
});

export default GridView;
