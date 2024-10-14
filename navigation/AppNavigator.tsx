import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../components/HomeScreen'; // Updated import
import { RootStackParamList } from './Types';
import RegisterMeal from '../components/RegisterMeal';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RegisterMeal" component={RegisterMeal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
