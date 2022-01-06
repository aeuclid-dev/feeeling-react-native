import PushNotification from 'react-native-push-notification';
import {getMessageOnBackground} from '../store/actions/commonActions';

export function setupPushNotification(handleNotification) {
  PushNotification.configure({
    onNotification: function (notification) {
      handleNotification(notification);
    },
    popInitialNotification: true,
    requestPermissions: true,
  });

  return PushNotification;
}

export function checkBackgroundNoti(remoteMessage) {
  console.log('call checkfunction');
  getMessageOnBackground(remoteMessage);
}
