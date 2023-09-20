import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";

const Planner = () => {
  const [date, setDate] = useState("");
  const dateSelect = (day: { dateString: string }) => {
    setDate(day.dateString);
  };

  return (
    <View style = {styles.container}>
      <View style = {styles.titleContainer}>
        <Text style = {styles.title}>Planner</Text>
      </View>
      <View style = {styles.calendarContainer}>
        <Calendar
          current = {"2023-09-20"}
          onDayPress = {dateSelect}
        />
      </View>
      {date !== "" && (
        <View style = {styles.dateContainer}>
          <Text>Date: {date}</Text>
          <Text>Outfit for the Day: :)</Text>
        </View>
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
