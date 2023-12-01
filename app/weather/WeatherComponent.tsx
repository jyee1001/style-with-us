import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

interface ForecastData {
  current: {
    weather: {
      icon: string; // Add other properties as needed
    }[];
  };
}

const openWeatherKey = "4e4c2d8cf82b7c8cdb4c743f9cdcdcd3";
let url = `https://api.openweathermap.org/data/3.0/onecall?&units=metric&exclude=minutely&appid=${openWeatherKey}`;

const WeatherComponent = () => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadForecast = async () => {
    setRefreshing(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access location was denied");
    }
    let location = await Location.getCurrentPositionAsync({});

    //fetching weather data from the openweathermap api
    console.log(location.coords.latitude);
    console.log(location.coords.longitude);

    const response = await fetch(
      `${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
    );
    const data = await response.json(); //converts the response to a json
    if (!response.ok) {
      Alert.alert("Error", "Something went wrong");
    } else {
      setForecast(data);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  if (!forecast) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large"></ActivityIndicator>
      </SafeAreaView>
    );
  }
  const current = forecast.current.weather[0];
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.current}>
          <Image
            style={styles.largeIcon}
            source={{
              uri: `http://openweathermap.org/img/wn/${current.icon}@4x.png`,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeatherComponent;

const styles = StyleSheet.create({
  text: {
    color: "white",
  },
  loading: {},
  container: { flex: 1 },
  current: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
  },
  largeIcon: {
    width: 300,
    height: 250,
  },
});
