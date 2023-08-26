import { View, Text, Button } from 'react-native'
import React from 'react'
import { NavigationContainer, NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Planner from './Planner';
import Closet from './Closet';


interface RouterProps {
    navigation: NavigationProp<any, any>;
}



const Home = ({ navigation }: RouterProps) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Button onPress={() => navigation.navigate('Planner')} title="open page" />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />

        </View>

    )
}

export default Home