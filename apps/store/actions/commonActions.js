import axios from 'axios';
import {
  API_URI,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  GET_PROFILE_IMAGE_SUCCESS,
  GET_TESTEE_PROFILE_IMAGE_SUCCESS,
  GET_TEST_IMAGE_SUCCESS,
  SPLASH_SWITCH_ON,
  SPLASH_SWITCH_OFF,
  SET_RESOUCE_FINISH,
  DONT_SPLASH_NOW,
  DO_SPLASH_NOW,
  NOTICE_LIST_LOADED,
  GET_NOTICE_LIST_SUCCESS,
  GET_NOTICE_LIST_FAIL,
  GET_ALARM_LIST_FIRST_SUCCESS,
  ALARM_LIST_LOADED,
  GET_ALARM_LIST_SUCCESS,
  GET_ALARM_LIST_FAIL,
} from './types';
import {
  dateToPushUpdateDate,
  isDateToPushUpdate,
} from '../../modules/timesUtiles';
import messaging from '@react-native-firebase/messaging';
import * as RNFS from 'react-native-fs';
import {
  getMyStorageItem,
  setMyStorageItem,
  saveAsyncStorage,
} from '../../modules/localStorage';

global.Buffer = global.Buffer || require('buffer').Buffer;

export const showMessage = (msg) => async (dispatch) => {
  console.log(msg);
  await dispatch({type: SHOW_MESSAGE, payload: msg});
  setTimeout(() => {
    dispatch({type: HIDE_MESSAGE});
  }, 3000);
  return Promise.resolve();
};

//GET	/image?type=0&image_id=00000000001_20210325120000&size=0
/**
 *
 * @param {*} type 0:검사 ,1:프로필 ,2:리소스 , 3:testee 프로필이미지
 * @param {*} image_id 이미지id
 * @param {*} size 0:썸네일크기 ,1:원본사이즈
 * @param {*} storageSavename asyncStorage 저장명
 * @returns
 */
export const getImage = (type, image_id, size, storageSavename) => async (
  dispatch,
) => {
  let t = getMyStorageItem('token');
  console.log('call getImage function >> ', image_id);
  if (t !== null && t !== '') {
    console.log('have token');
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
      params: {
        type: type < 4 ? type : 0,
        image_id: image_id,
        size: size,
      },
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    };
    //console.log(axiosConfig);
    await axios
      .get(`${API_URI}/image`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        const resHeader = response.headers;
        // console.log(axiosConfig.params);
        // console.log('call image response...');
        // console.log(resHeader);
        // console.log(res);
        if (resHeader.status === '000') {
          try {
            // let profileBlob = await new Blob([new ArrayBuffer(response.data)], { type: 'image/png' })
            let profileBlob = await Buffer.from(res, 'binary').toString(
              'base64',
            );
            if (type === 0) {
              console.log('type 0');
              await dispatch({
                type: GET_TEST_IMAGE_SUCCESS,
                payload: {image_id: image_id, image: profileBlob},
              });
            } else if (type === 1) {
              console.log('type 1');
              await dispatch({
                type: GET_PROFILE_IMAGE_SUCCESS,
                payload: profileBlob,
              });
            } else if (type === 2) {
              console.log('type 2');
              // const imagePath = storageSavename+'.png';
              // console.log(RNFS.DocumentDirectoryPath);
              // RNFS.writeFile(imagePath, profileBlob, 'base64')
              // .then((success) => {
              //   saveAsyncStorage(storageSavename,imagePath);
              //   console.log('FILE WRITTEN!');
              // })
              // .catch((error) => {
              //   console.log(JSON.stringify(error));
              // });
            } else if (type === 3) {
              console.log('type 3');
              await dispatch({
                type: GET_TESTEE_PROFILE_IMAGE_SUCCESS,
                payload: {profile_photo: image_id, image: profileBlob},
              });
            } else if (type === 6) {
              //resouse
              console.log('type test');
              const imagePath = `${RNFS.DocumentDirectoryPath}/${storageSavename}.png`;
              console.log(RNFS.DocumentDirectoryPath);
              console.log(imagePath);
              RNFS.writeFile(imagePath, profileBlob, 'base64')
                .then((success) => {
                  console.log(storageSavename);
                  saveAsyncStorage(storageSavename, imagePath);
                  console.log('FILE WRITTEN!');
                })
                .catch((error) => {
                  console.log(JSON.stringify(error));
                });
            } else {
              console.log('type is not 0,1');
            }
          } catch (e) {
            console.log('commonAction getImage >> catch err');
            console.log(e);
          }
        } else {
          dispatch(showMessage(resHeader.status_message));
        }
      })
      .catch((err) => {
        console.log('err!!');
        console.log(err);
      });
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const pushRenewal = () => async (dispatch) => {
  let t = getMyStorageItem('token');
  let pd = getMyStorageItem('pushDate');
  const today = new Date().getTime();
  console.log('call the renewal push token');
  // console.log('token1 : ');
  // console.log(t);
  // console.log('pushDate');
  // console.log(pd);
  if (t && t !== null && t !== '') {
    //pd yyyy/mm/dd 1<2?
    const isUpdate = isDateToPushUpdate(pd, today);
    //console.log(isUpdate);
    if (isUpdate) {
      console.log('call pushtoken update method');
      const fcmToken = await messaging().getToken();
      let axiosConfig = {
        headers: {
          'Content-Type': 'application/json',
          token: t,
        },
      };
      let sendData = {
        push_token: fcmToken,
      };
      return await axios
        .post(`${API_URI}/member/push`, sendData, axiosConfig)
        .then(async (response) => {
          const res = response.data;
          if (res.result.status === '000') {
            saveAsyncStorage('pushDate', dateToPushUpdateDate(today));
            return Promise.resolve();
          } else {
            //dispatch(showMessage(resHeader.status_message));
            return Promise.reject(new Error('api error'));
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log('[push check]dont need update');
      return Promise.reject(new Error('no need update'));
    }
  } else {
    console.log('[push check]no havit local token...');
    return Promise.reject(new Error('no token'));
  }
};

export const checkVersion = (object) => async (dispatch) => {
  let info = getMyStorageItem('AppInfo');
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const sendData = {
    params: {
      major: object.major,
      minor: object.minor,
      lang: 'kor',
      devicetype: object.deviceType,
    },
  };
  console.log(sendData);
  return Promise.resolve();

  // version관련 미구현상태 TODO
  // return await axios
  //   .get(`${API_URI}/resource`, sendData, axiosConfig)
  //   .then(async (response) => {
  //     const res = response.data;
  //     if (res.result.status === '000') {
  //       if (res.major !== object.major) {
  //         console.log('need update from store');
  //         info.major = res.major;
  //         saveAsyncStorage('AppInfo', info);
  //         return Promise.resolve();

  //       }
  //       if (res.minor !== object.minor) {
  //         console.log('need minor');
  //         if (res.splash_bkg !== '' && res.splash_bkg !== null) {
  //           await dispatch(getImage(2, res.splash_bkg, 1,'splashbg'))
  //         }
  //         if (res.splash_ci !== '' && res.splash_ci !== null) {
  //           await dispatch(getImage(2, res.splash_ci, 1,'splashci'));
  //         }
  //         info.minor = res.minor;
  //         saveAsyncStorage('AppInfo', info);
  //         return Promise.resolve();
  //       }

  //       console.log('no need update');
  //       return Promise.resolve();
  //     } else {
  //       return Promise.reject(new Error('api error'));
  //     }
  //   })
  //   .catch((err) => console.log(err));
};

export const setResouce = () => async (dispatch) => {
  console.log('>>>>>>>>>', 'commonAction setesouce');
  const splashbg = getMyStorageItem('splashbg');
  console.log('splashBG>>>', splashbg);
  if (splashbg) {
    console.log('exist!!');
    return await dispatch({
      type: SET_RESOUCE_FINISH,
      payload: {
        uri: Platform.OS === 'ios' ? splashbg : `file://${splashbg}`,
      },
    });
  } else {
    console.log('not exist!!');
    return await dispatch({type: SET_RESOUCE_FINISH, payload: null});
  }
};

export const callSplash = () => async (dispatch) => {
  await dispatch({type: SPLASH_SWITCH_ON});
  setTimeout(() => {
    dispatch({type: SPLASH_SWITCH_OFF});
  }, 2000);
  return Promise.resolve();
};

export const dontSplashNow = () => async (dispatch) => {
  await dispatch({type: DONT_SPLASH_NOW});
  return Promise.resolve();
};

export const doSplashNow = () => async (dispatch) => {
  await dispatch({type: DO_SPLASH_NOW});
  return Promise.resolve();
};

export const axiosErrorHandler = (error) => {
  if (!error.response) {
    // network error
    dispatch(showMessage('네트워크 오류'));
  } else {
    // http status code
    const code = error.response.status;
    // response data
    const response = error.response.data;
    dispatch(showMessage('서버와 통신에 실패하였습니다'));
    console.log(code);
    console.log(response);
  }
};

export const GetAppLabel = (userParam) => async (dispatch) => {
  const checkUsage = ['hello', 'start_main', 'start_bottom', 'yak1', 'yak2'];
  let axiosConfig = {
    params: {
      usage: userParam,
    },
  };
  if (checkUsage.includes(userParam)) {
    console.log('get a app labels...');
    return await axios.get(`${API_URI}/common/text`, axiosConfig);
  } else {
    console.log('unregistered value in checkUsages..');
    dispatch(showMessage('확인할 수 없는 값입니다.'));
    return Promise.reject(new Error('unregistered value'));
  }
};

export const GetNoticeInitData = (filterObj, type) => async (dispatch) => {
  console.log('noticeInit');
  console.log(type);
  console.log(filterObj);
  let setData = {
    type: type,
    pos: filterObj.pos,
  };
  await dispatch({type: NOTICE_LIST_LOADED, payload: setData});

  if (type === 'L') {
    //for list
    if (filterObj.pos === 0) {
      filterObj.pos = filterObj.count;
    } else {
      filterObj.pos = filterObj.pos + filterObj.count;
    }
  } else if (type === 'F') {
    // for filter
    filterObj.pos = 0;
  }
  console.log(filterObj);
  return dispatch(GetNotice(filterObj));
};

export const GetNotice = (obj) => async (dispatch) => {
  console.log('commonAction getNotice');
  let axiosConfig = {
    params: obj,
  };
  await axios
    .get(`${API_URI}/common/notice`, axiosConfig)
    .then(async (response) => {
      const res = response.data;
      if (res.result.status === '000') {
        return dispatch({
          type: GET_NOTICE_LIST_SUCCESS,
          payload: res.data.resultData,
        });
      } else {
        dispatch(showMessage(res.result.message));
        return dispatch({type: GET_NOTICE_LIST_FAIL});
      }
    })
    .catch((err) => console.log(err));
};

export const GetAlarmInitData = (filterObj, type) => async (dispatch) => {
  console.log('alarmInit');
  console.log(type);
  console.log(filterObj.pos);
  let setData = {
    type: type,
    pos: filterObj.pos,
  };
  await dispatch({type: ALARM_LIST_LOADED, payload: setData});

  if (type === 'L') {
    //for list
    if (filterObj.pos === 0) {
      filterObj.pos = filterObj.count;
    } else {
      filterObj.pos = filterObj.pos + filterObj.count;
    }
  } else if (type === 'F') {
    // for filter
    filterObj.pos = 0;
  }
  console.log(filterObj.pos);
  return dispatch(GetAlarm(filterObj, type));
};
export const GetAlarm = (obj, type) => async (dispatch) => {
  console.log('commonAction GetAlarm');
  let t = getMyStorageItem('token');
  //console.log(t);
  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
      params: obj,
    };
    await axios
      .get(`${API_URI}/common/alarm`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        if (res.result.status === '000') {
          if (res.resultData !== undefined) {
            if (type === 'F') {
              console.log('alarm list first');
              return dispatch({
                type: GET_ALARM_LIST_FIRST_SUCCESS,
                payload: res.resultData,
              });
            } else {
              console.log('alarm list add');
              return dispatch({
                type: GET_ALARM_LIST_SUCCESS,
                payload: res.resultData,
              });
            }
          } else {
            dispatch(showMessage('데이터가 없습니다.'));
          }
        } else {
          dispatch(showMessage(res.result.message));
          return dispatch({type: GET_ALARM_LIST_FAIL});
        }
      })
      .catch((err) => console.log(err));
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const getMessageOnBackground = async (remoteMessage) => {
  console.log('set storage backMessage');
  await saveAsyncStorage('test_req_no', remoteMessage.data.id);
  await saveAsyncStorage('pushMessage', 'b');
};

export const getMessageOnForeground = async (remoteMessage) => {
  console.log('set storage foreMessage');
  await saveAsyncStorage('test_req_no', remoteMessage.data.id);
  await saveAsyncStorage('pushMessage', 'f');
};
