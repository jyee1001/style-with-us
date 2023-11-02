import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import { Camera as ExpoCamera, CameraType } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import RNPickerSelect from "react-native-picker-select";

const Camera = () => {
  // const [permission, requestPermission] = ExpoCamera.useCameraPermissions();

  // const [type, setType] = useState(CameraType.back);
  // const [isTakingPicture, setIsTakingPicture] = useState(false);
  // const cameraRef = useRef<ExpoCamera | null>(null);

  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  if (permission?.status !== ImagePicker.PermissionStatus.GRANTED) {
    return (
      <View style={styles.container}>
        <Text>Permission Not Granted - {permission?.status}</Text>
        <StatusBar style="auto" />
        <Button title="Request Permission" onPress={requestPermission}></Button>
      </View>
    );
  }

  const takePhoto = async () => {
    const cameraResp = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!cameraResp.canceled) {
      console.log(cameraResp.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.pictureButton}
        onPress={takePhoto}
      ></TouchableOpacity>
      <RNPickerSelect
        onValueChange={(value) => console.log(value)}
        items={[
          { label: "Tops", value: "JavaScript" },
          { label: "Bottoms", value: "TypeScript" },
          { label: "Outerwear", value: "Python" },
          { label: "Accesories", value: "Java" },
        ]}
      />
    </SafeAreaView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },

  pictureButton: {
    padding: 30,
    marginLeft: 10,
    marginRight: 10,
    width: 300,
    height: 300,
    marginTop: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
  },
});
