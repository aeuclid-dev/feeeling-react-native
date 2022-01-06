import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import IconHome from '../resource/icons/home_icon.svg'; // naver
import IconEtc from '../resource/icons/etc_icon.svg'; // etc
import {TestButton} from '../components/TestButton';

import Home from '../screens/main/Home';
import PPTest from '../screens/main/PPTest';
import MoreNavigator from './MoreNavigator';

const Tab = createBottomTabNavigator();

const myHome = ({navigation}) => {
  return <Home navigation={navigation} />;
};

const testP = ({navigation, route}) => {
  return <PPTest navigation={navigation} route={route} />;
};

function MainTabNavigator({navigation, route}) {
  return (
    <Tab.Navigator
      initialRouteName="MainPage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#ff6f61',
        tabBarInactiveTintColor: '#4A4A4A',
        tabBarStyle: {display: 1 ? 'flex' : 'none'},
      }}>
      <Tab.Screen
        name="MainPage"
        component={myHome}
        options={{
          safeAreaInsets: {top: 20},
          tabBarIcon: ({color, size}) => (
            <IconHome name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TestPage"
        component={testP}
        options={{
          tabBarButton: (props) => <TestButton {...props} />,
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <IconEtc name="etc" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default MainTabNavigator;
