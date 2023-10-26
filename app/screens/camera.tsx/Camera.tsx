import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { RNCamera } from "react-native-camera";

const Camera = () => {
  const cameraRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      //const data = await cameraRef.current.takePictureAsync(options);

      //setImageUri(data.uri);
    }
  };

  return (
    <View style={styles.body}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
      />
      <TouchableOpacity onPress={takePicture}>
        <Text>Capture Photo</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={uploadImageToFirebase}>
        <Text>Upload to Firebase</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  preview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "black",
  },
});
