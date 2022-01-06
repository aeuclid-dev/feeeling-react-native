import axios from 'axios';
import RNSimpleCrypto from 'react-native-simple-crypto';
import messaging from '@react-native-firebase/messaging';
import {showMessage, reset} from './commonActions';
import {dateToPushUpdateDate} from '../../modules/timesUtiles';
import {
  API_URI,
  SELECT_UNDER_14,
  SELECT_OVER_14,
  LOGIN,
  NAVER_LOGIN_FAIL_SET_JOIN,
  KAKAO_LOGIN_FAIL_SET_JOIN,
  SET_JOIN_PROFILE,
  LOG_OUT,
} from './types';
import {
  getMyStorageItem,
  setMyStorageItem,
  deleteMyStorage,
} from '../../modules/localStorage';

export const selectU14 = () => (dispatch) => {
  dispatch({type: SELECT_UNDER_14});
  return Promise.resolve();
};
export const selectO14 = () => (dispatch) => {
  dispatch({type: SELECT_OVER_14});
  return Promise.resolve();
};
export const Logout = (navigation, CommonActions) => async (dispatch) => {
  console.log('##########LOGOUT-ACTION############');
  let t = getMyStorageItem('token');
  if (t !== null && t !== '') {
    console.log(t);
    let axiosConfig = {
      headers: {
        'Content-Type': 'Application/x-www-from-urlencoded',
        token: t,
      },
    };
    console.log(axiosConfig);
    await axios
      .post(`${API_URI}/member/logout`, {}, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log('logout-result');
        console.log(res);
        if (res.result.status === '000') {
          await deleteMyStorage('token');
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [{name: 'Splash'}],
            }),
          );
          navigation.navigate('Splash');
          await dispatch({type: LOG_OUT, is_success: true});
        } else {
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log(err));
  } else {
    console.log('no havit local token...');
    return false;
  }
};

export const CheckSnsLogin = (type, values) => async (dispatch) => {
  console.log(type, ' // ', values);
  let axiosConfig = {
    headers: {
      'Content-Type': 'Application/x-www-from-urlencoded',
    },
  };
  const sendData = {
    params: {
      id: values.id,
      type: type,
    },
  };
  const request = await axios
    .get(`${API_URI}/member/exist`, sendData, axiosConfig)
    .then(async (response) => {
      // console.log('i call useraction exist!!!!!!!!');
      // console.log(response.status);
      // console.log(typeof response.status);
      if (response.status === 200) {
        // console.log('0x 1ok -->');
        // console.log(response.data);
        if (
          response.data.result.status === '201' ||
          response.data.result.status === '202'
        ) {
          const NSData = {
            sns_id: values.id,
            type: type,
          };
          return await dispatch(FeeelingLogin(NSData, false));
        } else {
          values.type = type;
          if (type === 1) {
            return await dispatch({
              type: KAKAO_LOGIN_FAIL_SET_JOIN,
              payload: values,
            });
          } else if (type === 2) {
            return await dispatch({
              type: NAVER_LOGIN_FAIL_SET_JOIN,
              payload: values,
            });
          }
        }
      } else {
        console.log(
          'err -> ' + response.result.status + ' / ' + response.result.message,
        );
      }
    })
    .catch((error) => {
      if (error.response) {
        // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
        console.log('111');
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 요청이 이루어 졌으나 응답을 받지 못했습니다.
        // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
        // Node.js의 http.ClientRequest 인스턴스입니다.
        console.log('222');
        console.log(error);
      } else {
        console.log('333');
        // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  return request;
};

export const FeeelingLogin = (values, needENC) => async (dispatch) => {
  let axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let sendData;

  console.log(typeof values);
  console.log(values);

  if (needENC) {
    const pwdhash = await RNSimpleCrypto.SHA.sha512(values.pwd);
    values.pwd = pwdhash;
  }

  if (values.type === 0) {
    sendData = {
      user_id: values.user_id,
      pwd: values.pwd,
      type: values.type,
    };
  } else {
    sendData = {
      user_id: values.sns_id,
      type: values.type,
    };
  }

  const fcmToken = await messaging().getToken();
  sendData.push_token = fcmToken;

  console.log('userAction feeeling login');
  console.log('sendData');
  console.log(sendData);
  var nowTime = new Date().getTime();
  console.log(`${API_URI}/member/login`, sendData, axiosConfig);
  const request = await axios
    .post(`${API_URI}/member/login`, sendData, axiosConfig)
    .then(async (response) => {
      const res = response.data;
      console.log(res);
      if (res.result.status === '000') {
        let payload = {
          token: res.resultData.token,
          pushDate: dateToPushUpdateDate(nowTime),
        };
        setMyStorageItem(payload);
        return await dispatch({type: LOGIN, payload: payload});
      } else {
        return dispatch(showMessage(res.result.message));
      }
    })
    .catch((err) => {
      console.log('user login error!');
      console.log(err.status);
      console.log(err);
    });
  return request;
};

export const FeeelingJoin = (inputobj, deviceobj, snsobj, fileobj) => async (
  dispatch,
) => {
  const is_file =
    Object.keys(fileobj).length > 0 &&
    JSON.stringify(fileobj) !== JSON.stringify({})
      ? true
      : false;
  let axiosConfig = {
    headers: {
      'Content-Type': is_file ? 'multipart/form-data' : 'application/json',
    },
  };
  let sendData;
  let reData = {};
  if (is_file) {
    console.log('have file data!!');
    sendData = new FormData();
    sendData.append('file', fileobj);
    sendData.append('user_id', inputobj.user_id);
    reData.user_id = inputobj.user_id;
    sendData.append('birthday', inputobj.birthday);
    sendData.append('mobile', inputobj.mobile);
    sendData.append('device_id', deviceobj.device_id);
    sendData.append('device_type', deviceobj.device_type);
    sendData.append('nation', deviceobj.nation);

    sendData.append('gender', inputobj.gender);
    sendData.append('nickname', inputobj.nickname);

    if (snsobj !== null) {
      sendData.append('sns_id', snsobj.id);
      sendData.append('type', snsobj.type);
      reData.sns_id = snsobj.id;
      reData.type = snsobj.type;
    } else {
      const pwdhashforform = await RNSimpleCrypto.SHA.sha512(inputobj.pwd);
      sendData.append('pwd', pwdhashforform);
      sendData.append('type', 0);

      reData.pwd = pwdhashforform;
      reData.type = 0;
    }
  } else {
    console.log('no file Data..');
    if (snsobj !== null) {
      sendData = {
        user_id: inputobj.user_id,
        sns_id: snsobj.id,
        birthday: inputobj.birthday,
        mobile: inputobj.mobile,
        device_id: deviceobj.device_id,
        device_type: deviceobj.device_type,
        nation: deviceobj.nation,
        type: snsobj.type,
        gender: inputobj.gender,
        nickname: inputobj.nickname,
      };
    } else {
      const pwdhash = await RNSimpleCrypto.SHA.sha512(inputobj.pwd);
      sendData = {
        user_id: inputobj.user_id,
        pwd: pwdhash,
        birthday: inputobj.birthday,
        mobile: inputobj.mobile,
        device_id: deviceobj.device_id,
        device_type: deviceobj.device_type,
        nation: deviceobj.nation,
        type: 0,
        gender: inputobj.gender,
        nickname: inputobj.nickname,
      };
    }
  }
  console.log('ready for send!!');
  //snsobj {"id": "32587910", "type": 2},
  console.log(sendData);

  const request = await axios
    .post(`${API_URI}/member/new`, sendData, axiosConfig)
    .then(async (response) => {
      const res = response.data;
      console.log(res.result);
      if (res.result.status === '000') {
        if (!is_file && !(sendData instanceof FormData)) {
          reData = Object.assign({}, sendData);
          console.log('without file!');
          console.log(reData);
        }
        return await dispatch(FeeelingLogin(reData, false));
      } else {
        console.log('err -> ' + res.result.status + ' / ' + res.result.message);
        return dispatch(showMessage(res.result.message));
      }
    })
    .catch((err) => console.log(err));

  return request;
};

export const proFilePicture = (file) => async (dispatch) => {
  return dispatch({type: SET_JOIN_PROFILE, payload: file});
};

export const setUpdateUser = (obj) => async (dispatch) => {
  let t = getMyStorageItem('token');
  console.log('call useraction setupdateUser');
  if (t !== null && t !== '') {
    //charset=utf-8
    const is_file =
      obj.file !== undefined &&
      Object.keys(obj.file).length > 0 &&
      JSON.stringify(obj.file) !== JSON.stringify({})
        ? true
        : false;
    let axiosConfig = {
      headers: {
        'Content-Type': is_file ? 'multipart/form-data' : 'application/json',
        token: t,
      },
    };

    let sendData;
    if (is_file) {
      console.log('testeee with file');
      sendData = new FormData();
      sendData.append('file', obj.file);
      sendData.append('user_no', obj.user_no);
      sendData.append('testee_no', obj.testee_no);
      sendData.append('nickname', obj.nickname);
      sendData.append('birthday', obj.birthday);
      sendData.append('gender', obj.gender);
      sendData.append('type', obj.type);
      if (obj.type === 0 && obj.pwd !== undefined && obj.pwd !== '') {
        const pwdhashforform = await RNSimpleCrypto.SHA.sha512(obj.pwd);
        sendData.append('pwd', pwdhashforform);
      }
    } else {
      console.log('testeee without file');
      sendData = Object.assign({}, obj);
      if (obj.pwd !== undefined && obj.pwd !== '') {
        const pwdhash = await RNSimpleCrypto.SHA.sha512(obj.pwd);
        sendData.pwd = pwdhash;
        delete sendData.pwdConfirm;
      } else {
        delete sendData.pwd;
        delete sendData.pwdConfirm;
      }
    }
    console.log('-------useraction setupdateUser-------');
    console.log(sendData);

    const request = await axios
      .post(`${API_URI}/member/editUser`, sendData, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        if (res.result.status === '000') {
          console.log(
            '-------useraction setupdateUser--------OKOK--OKOK--OKOK--',
          );
          return {res: res};
        } else {
          console.log(
            'err -> ' + res.result.status + ' / ' + res.result.message,
          );
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((error) => {
        console.log('getERROR');
        console.log(error);
        if (error.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
          console.log('111');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
          // Node.js의 http.ClientRequest 인스턴스입니다.
          console.log('222');
          console.log(error);
          console.log(error.config.data._parts);
        } else {
          console.log('333');
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};
export const setDeleteUser = (sendObj) => async (dispatch) => {
  let t = getMyStorageItem('token');
  console.log('call userAction setdeleteUser');
  if (t !== null && t !== '') {
    //charset=utf-8
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };
    console.log('delete testee');
    console.log(sendObj);

    const request = await axios
      .post(`${API_URI}/member/deleteUser`, sendObj, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        if (res.result.status === '000') {
          console.log('delete succ');
          return {res: res};
        } else {
          console.log(
            'err -> ' + res.result.status + ' / ' + res.result.message,
          );
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((error) => {
        console.log('getERROR');
        console.log(error);
        if (error.response) {
          // 요청이 이루어졌으며 서버가 2xx의 범위를 벗어나는 상태 코드로 응답했습니다.
          console.log('111');
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // 요청이 이루어 졌으나 응답을 받지 못했습니다.
          // `error.request`는 브라우저의 XMLHttpRequest 인스턴스 또는
          // Node.js의 http.ClientRequest 인스턴스입니다.
          console.log('222');
          console.log(error);
          console.log(error.config.data._parts);
        } else {
          console.log('333');
          // 오류를 발생시킨 요청을 설정하는 중에 문제가 발생했습니다.
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};
