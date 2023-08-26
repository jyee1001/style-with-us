import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Planner from './Planner';
import Closet from './Closet';
import Home from './Home';
import Profile from './Profile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Inside = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} options={{
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="home" size={size} color={color} />)
            }} />
            <Tab.Screen name="Closet" component={Closet} />
            <Tab.Screen name="Planner" component={Planner} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}

export default Inside