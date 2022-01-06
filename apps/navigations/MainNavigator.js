import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainTabNavigation from './MainTabNavigator';
import Alarm from '../screens/main/Alarm';
import TestResult from '../screens/main/TestResult';

const Stack = createStackNavigator();

function MainNavigator() {
  return (
    <Stack.Navigator initialRouteName="MainTab" headerMode="none">
      <Stack.Screen name="MainTab" component={MainTabNavigation} />
      <Stack.Screen name="Alarm" component={Alarm} />
      <Stack.Screen name="TestResult" component={TestResult} />
    </Stack.Navigator>
  );
}
export default MainNavigator;
