import {AppRegistry} from 'react-native';
import App from './apps/App';

import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

import * as rnfb from '@react-native-firebase/app';

import {checkBackgroundNoti} from './apps/modules/pushNotification';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //console.log('back');
  console.log(messaging().isAutoInitEnabled);
  checkBackgroundNoti(remoteMessage);
  //console.log('Message handled in the background!', remoteMessage);
  //  여기에 로직을 작성한다.
  //  remoteMessage.data로 메세지에 접근가능
  //  remoteMessage.from 으로 topic name 또는 message identifier
  //  remoteMessage.messageId 는 메시지 고유값 id
  //  remoteMessage.notification 메시지와 함께 보내진 추가 데이터
  //  remoteMessage.sentTime 보낸시간
});

messaging().onNotificationOpenedApp(async (remoteMessage) => {
  //useless function when you got a push message and touch it activating function appNavigator-setupPushNotification func...
  //console.log('--from end app---onOpend from notification----');
  //console.log(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
