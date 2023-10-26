import { View, Text, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import { NavigationProp } from "@react-navigation/native";

type PlannerProps = {
  navigation: NavigationProp<any, any>;
};

const Planner: React.FC<PlannerProps> = ({ navigation }) => {
  const [date, setDate] = useState("");
  const [outfit, setOutfit] = useState("");

  const dateSelect = (day: { dateString: string }) => {
    const currentOutfit = "Description of your Outfit";
    setDate(day.dateString);
    setOutfit(currentOutfit);
  };

  const navigateToOutfitScreen = () => {
    navigation.navigate("Outfit");
  };

  return (
    <View style = {styles.container}>
      <View style = {styles.titleContainer}>
        <Text style = {styles.title}>Planner</Text>
      </View>
      <View style = {styles.calendarContainer}>
        <Calendar
          style={{
            width: 400,
            height: 300
          }}
          current = {"2023-10-26"}
          onDayPress = {dateSelect}
        />
      </View>
      {date !== "" && (
        <View style = {styles.dateContainer}>
          <Text>Date: {date}</Text>
          <Text>Outfit for the Day: {outfit || "Nothing Planned"}</Text>
        </View>
      )}
      {date !== "" && (
        <Button
          title="Add/Edit Outfit"
          onPress={navigateToOutfitScreen}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 35,
  },
  calendarContainer: {
    alignItems: "center",
  },
  dateContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default Planner;
