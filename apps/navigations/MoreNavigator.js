import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useIsFocused} from '@react-navigation/native';

import Notice from '../screens/main/Notice';
import More from '../screens/main/More';
import NoticeContents from '../screens/main/NoticeContents';

const Stack = createStackNavigator();

function MoreNavigator({navigation}) {
  const isFocused = useIsFocused();
  useEffect(() => {
    async function callInitialScreen() {
      if (isFocused) {
        console.log('MoreNavi focused..');
        navigation.setOptions({
          tabBarStyle: {
            display: 'flex',
          },
        });
      }
    }
    callInitialScreen();
  }, [isFocused]);

  return (
    <Stack.Navigator initialRouteName="MoreMain" headerMode="none">
      <Stack.Screen name="MoreMain" component={More} />
      <Stack.Screen name="Notice" component={Notice} />
      <Stack.Screen name="NoticeContents" component={NoticeContents} />
    </Stack.Navigator>
  );
}
export default MoreNavigator;
