import React, {useEffect, useRef} from 'react';
import {AppState, Platform, NativeModules} from 'react-native';
import Toast from 'react-native-simple-toast';
import {useSelector, useDispatch} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {
  setupPushNotification,
  checkBackgroundNoti,
} from '../modules/pushNotification';

import VersionCheck from 'react-native-version-check';

import FrontNavigation from './FrontNavigator';
import MainNavigation from './MainNavigator';
import AppSplash from '../screens/AppSplash';
import AppResouce from '../screens/AppResouce';

import {getImageTestList, setResult} from '../store/actions/mainActions';

import {
  pushRenewal,
  checkVersion,
  callSplash,
  setResouce,
  getMessageOnForeground,
} from '../store/actions/commonActions';

import {AppInfo} from '../resource/AppInfo';
import {
  getMyStorageItem,
  saveAsyncStorage,
  deleteMyStorage,
} from '../modules/localStorage';

const MainNavi = createStackNavigator();

function AppNavigator() {
  console.log('APPnavi render');
  const dispatch = useDispatch();
  const navigationRef = useRef(null);
  const common = useSelector((state) => state.common);
  const mainState = useSelector((state) => state.main);
  const commonRef = useRef(common.canIShowSplash);
  const appState = useRef(AppState.currentState);

  setupPushNotification((notification) => {
    let pm = getMyStorageItem('pushMessage');
    let req = getMyStorageItem('test_req_no');
    console.log(
      '------------------------------------------------------------------------------------------------',
    );
    console.log('on open from push message');
    console.log('pushMessage', pm);
    console.log('test_req_no', req);
    console.log(
      '--------------------------------noticlick event---pushClick nnnn-------------------------------',
    );
    console.log(notification.data);
    console.log(
      '------------------------------------------------------------------------------------------------',
    );

    if (pm && pm === 'f' && req && req !== undefined) {
      //foreground에서 푸시를 받는경우 현재 스크린이 어디인지도 모르고 바로 푸시를 눌러버린다면 stacknavi가 꼬일수도있음..
      let data = {
        test_req_no: req,
      };
      dispatch(setResult(data))
        .then(async (res) => {
          let a = deleteMyStorage('backMessage');
          let b = deleteMyStorage('test_req_no');
          if (a !== false && b !== false) {
            console.log(
              'send TestResult....from app navi front check function',
            );
            await dispatch(getImageTestList(mainState.homeFilter, 'L'));
            navigationRef.current?.navigate('TestResult');
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });

  const handleAppStateChange = async (nextAppState) => {
    console.log('appState nextAppState', appState.current + '/' + nextAppState);
    if (commonRef.current) {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('foreground!');
        dispatch(callSplash());

        dispatch(pushRenewal())
          .then((res) => {
            console.log('pushRen');
            console.log(res);
          })
          .catch((e) => {
            console.log('pushRen err');
            console.log(e);
          });
      }
      if (
        appState.current.match(/inactive|active/) &&
        nextAppState === 'active'
      ) {
        console.log('app starting....check Resource');
        let info = getMyStorageItem('AppInfo');
        let sendData = {};
        //console.log(info);
        if (info) {
          console.log('have app Info');
          sendData.major = info.major;
          sendData.minor = info.minor;
        } else {
          console.log('no app Info');
          saveAsyncStorage('AppInfo', AppInfo);
          sendData.major = AppInfo.major;
          sendData.minor = AppInfo.minor;
        }
        sendData.lang = '';
        sendData.deviceType = Platform.OS === 'ios' ? 1 : 0;
        console.log('senddata', sendData);
        dispatch(setResouce());
        //     dispatch(checkVersion(sendData)).then((res) => {
        //       결과에 따라서 splash등 리소스가 바뀌는 경우 셋팅하는 값들은
        //        await dispatch(setResouce()); 처럼 commonState에 셋팅하도록 처리해야함.
        //       console.log('version check dispatch result111111');
        //       console.log(res);
        //     }),
      }
    }
    appState.current = nextAppState;
  };

  useEffect(() => {
    //console.log('appNavi useeffect');
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('------foreground got a push message------');
      PushNotification.localNotification({
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        bigPictureUrl: remoteMessage.notification.android.imageUrl,
        smallIcon: remoteMessage.notification.android.imageUrl,
        data: remoteMessage.data,
      });
      getMessageOnForeground(remoteMessage);
      //await dispatch(getImageTestList(mainState.homeFilter, 'L'));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (common.msg !== '') {
      Toast.show(common.msg);
    }
  }, [common.msg, dispatch]);

  useEffect(() => {
    commonRef.current = common.canIShowSplash;
  }, [common.canIShowSplash]);
  return (
    <>
      <NavigationContainer ref={navigationRef}>
        <MainNavi.Navigator initialRouteName="First" headerMode="none">
          <MainNavi.Screen name="First" component={AppResouce} />
          <MainNavi.Screen name="Front" component={FrontNavigation} />
          <MainNavi.Screen name="Main" component={MainNavigation} />
        </MainNavi.Navigator>
      </NavigationContainer>
      <AppSplash />
    </>
  );
}

export default AppNavigator;
