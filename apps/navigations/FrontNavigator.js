import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MainSplash from '../screens/front/MainSplash';
import Login from '../screens/front/Login';
import Join from '../screens/front/Join';

const Stack = createStackNavigator();

function FrontNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" headerMode="none">
      <Stack.Screen name="Splash" component={MainSplash} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Join" component={Join} />
    </Stack.Navigator>
  );
}
export default FrontNavigator;
