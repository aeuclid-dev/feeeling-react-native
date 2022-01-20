import React, {useRef} from 'react';
import {Animated, TouchableOpacity, Dimensions} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import IconHome from '../resource/icons/home_icon.svg'; // naver
import IconEtc from '../resource/icons/etc_icon.svg'; // etc
import {TestButton} from '../components/TestButton';

import Home from '../screens/main/Home';
import PPTest from '../screens/main/PPTest';
import MoreNavigator from './MoreNavigator';
const {width} = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const myHome = ({navigation}) => {
  return <Home navigation={navigation} />;
};

const testP = ({navigation, route}) => {
  return <PPTest navigation={navigation} route={route} />;
};

function CustomTabBar({state, descriptors, navigation}) {
  // const focusedOptions = descriptors[state.routes[state.index].key].options;
  const tabNaviAnimation = useRef(new Animated.Value(0)).current;
  const BTNInvisible =
    state.routes[state.index].name === 'TestPage' ? true : false;
  const slidePopUp = {
    transform: [
      {
        translateY: tabNaviAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 50],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
  Animated.timing(tabNaviAnimation, {
    toValue: BTNInvisible ? 1 : 0,
    duration: 500,
    useNativeDriver: true,
  }).start();
  return (
    <Animated.View
      style={[
        {
          position: BTNInvisible ? 'absolute' : 'relative',
          bottom: 0,
          width: width,
          height: 50,
          backgroundColor: '#FFF',
          borderTopColor: '#666',
          elevation: 1,
          display: 'flex',
          flexDirection: 'row',
          paddingHorizontal: 15,
        },
        slidePopUp,
      ]}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent:
                route.name !== 'TestPage' ? 'center' : 'flex-start',
            }}>
            {route.name === 'MainPage' ? (
              <IconHome name="home" color={isFocused ? '#ff6f61' : '#4A4A4A'} />
            ) : route.name === 'TestPage' ? (
              <TestButton
                onPress={onPress}
                accessibilityState={isFocused ? {selected: true} : {}}
              />
            ) : (
              <IconEtc name="etc" color={isFocused ? '#ff6f61' : '#4A4A4A'} />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

function MainTabNavigator({navigation, route}) {
  return (
    <Tab.Navigator
      initialRouteName="MainPage"
      screenOptions={{
        headerShown: false,
        // tabBarShowLabel: false,
        // tabBarActiveTintColor: '#ff6f61',
        // tabBarInactiveTintColor: '#4A4A4A',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="MainPage"
        component={myHome}
        options={{
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
