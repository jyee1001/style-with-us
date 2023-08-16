import { View, Text, StyleSheet, TextInput, Image } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{uri: 'https://i.ibb.co/frnmnHs/stylewithus-LOGO.jpg'}}
      />
      
      <TextInput value={email} style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        onChangeText={ (text) => setEmail(text)}
      ></TextInput>
        <TextInput value={password} style={styles.input}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize="none"
        onChangeText={ (text) => setPassword(text)}
      ></TextInput>
    </View>
  )
}

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-start',
    backgroundColor: '#8F6E5D',
    alignItems: 'center',
    //flexDirection: 'column'
  },
  logo:{
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
   
  },
  input: {
    marginHorizontal: 20,
    marginVertical: 4,
    height: 50, 
    width: 250,
    borderWidth: 1,
    borderRadius: 4, 
    padding: 10,
    backgroundColor: '#fff'
  }
});