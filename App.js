import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import WikiTab from './Components/WikiTab';
import MapTab from './Components/MapTab';
import PostLocationTab from './Components/PostLocationTab';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = 'ios-information-circle'; // default...??? this one should never be the case

            if (route.name === 'Map') {
              iconName = 'map';
            } else if (route.name === 'Wiki') {
              iconName = "book"
            }
            else if (route.name === 'PostLocation') {
              iconName = "pencil"
            }
            if (!focused) iconName += '-outline'
            return <Ionicons name={iconName} size={24} />
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        >
        <Tab.Screen name="Map" component={MapTab} />
        <Tab.Screen name="Wiki" component={WikiTab} />
        <Tab.Screen name="PostLocation" component={PostLocationTab} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
