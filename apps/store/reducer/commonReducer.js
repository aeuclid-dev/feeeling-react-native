//import {Platform} from 'react-native';
import {
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  SPLASH_SWITCH_ON,
  SPLASH_SWITCH_OFF,
  SET_RESOUCE_FINISH,
  DONT_SPLASH_NOW,
  DO_SPLASH_NOW,
  NOTICE_LIST_LOADED,
  NOTICE_LIST_LOADED_FINISH,
  GET_NOTICE_LIST_SUCCESS,
  GET_NOTICE_LIST_FAIL,
  GET_ALARM_LIST_FIRST_SUCCESS,
  GET_ALARM_LIST_SUCCESS,
  GET_ALARM_LIST_FAIL,
  GET_MESSAGE_BACKGROUND,
} from '../actions/types';

//import {getMyStorageItem} from '../../modules/localStorage';
// const splashbg = getMyStorageItem('splashbg');
// splashImage: splashbg
//     ? Platform.OS === 'ios'
//       ? splashbg
//       : `file://${splashbg}`
//     : null,
//splashbg splashtitle splashci splashbottomtext splashtext

const initialState = {
  msg: '',
  resouceLoad: false,
  canIShowSplash: true,
  splashSwitch: false,
  splashImage: null,
  noticeList: [],
  noticeFilter: {
    // start: 0,
    // end: 0,
    pos: 0,
    count: 10,
  },
  is_noticeLoaded: false,

  alarmList: [],
  alarmFilter: {
    // start: 0,
    // end: 0,
    pos: 0,
    count: 10,
  },
  is_alarmLoaded: false,

  is_getBackAlram: false,
};
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SHOW_MESSAGE:
      return {
        ...state,
        msg: payload,
      };
    case HIDE_MESSAGE:
      return {
        ...state,
        msg: '',
      };
    case SPLASH_SWITCH_ON:
      return {
        ...state,
        splashSwitch: true,
      };
    case SPLASH_SWITCH_OFF:
      return {
        ...state,
        splashSwitch: false,
      };
    case SET_RESOUCE_FINISH:
      return {
        ...state,
        resouceLoad: true,
        splashImage: payload,
      };
    case DONT_SPLASH_NOW:
      return checkdont(state, payload);
    case DO_SPLASH_NOW:
      return {
        ...state,
        canIShowSplash: true,
      };
    case NOTICE_LIST_LOADED:
      return {
        ...state,
        is_noticeLoaded: true,
      };
    case NOTICE_LIST_LOADED_FINISH:
      return {
        ...state,
        is_noticeLoaded: false,
      };
    case GET_NOTICE_LIST_SUCCESS:
      return {
        ...state,
        noticeList: state.noticeList.concat(payload),
        is_noticeLoaded: false,
      };
    case GET_NOTICE_LIST_FAIL:
      return {
        ...state,
        is_noticeLoaded: false,
      };
    case GET_ALARM_LIST_FIRST_SUCCESS:
      return {
        ...state,
        alarmList: payload,
        is_alarmLoaded: false,
      };
    case GET_ALARM_LIST_SUCCESS:
      return {
        ...state,
        alarmList: state.alarmList.concat(payload),
        is_alarmLoaded: false,
      };
    case GET_ALARM_LIST_FAIL:
      return {
        ...state,
        is_alarmLoaded: false,
      };
    default:
      return state;
  }
};

function checkdont(state, payload) {
  console.log('i do false..!');
  return {
    ...state,
    canIShowSplash: false,
  };
}
