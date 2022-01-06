import axios from 'axios';
import {showMessage, getImage} from './commonActions';
import {
  getMyStorageItem,
  setMyStorageItem,
  deleteMyStorage,
} from '../../modules/localStorage';
import {
  API_URI,
  GET_USER_INFO,
  GET_LIST_INFO,
  GET_LIST_INFO_FAIL,
  GET_TEST_USER_INFO,
  SET_TESTEE_USER,
  GET_TEST_LIST,
  LIST_LOADED,
  LIST_LOADED_FINISH,
  CORRECTION_PICTURE,
  QUESTION_SET,
  ANSWER_CHANGE,
  ANSWER_SET,
  REQUEST_TEST_SUCCESS,
  REQUEST_TEST_RESET,
  REQUEST_RESULT,
  CHANGE_FILTER,
  INIT_FILTER,
  GET_TEST_TYPE,
  IMAGE_TEXT_CHANGE,
} from './types';

global.Buffer = global.Buffer || require('buffer').Buffer;

export const getUserInfo = () => async (dispatch) => {
  let t = getMyStorageItem('token');
  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };
    //axios get 사용할때 (uri,인자) 인거임 세번째 파라미터는 없슴.
    // get할때 헤더에 토큰이랑 param값이 필요하다면 같은곳에 넣어서 ㄱㄱ해야함.
    const request = await axios
      .get(`${API_URI}/test/summary`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log('result summary');
        console.log(res);
        if (res.result.status === '000') {
          if (
            res.resultData.profile_photo !== '' &&
            res.resultData.profile_photo !== null
          ) {
            console.log('have profile_photo');
            console.log(res.resultData.profile_photo);
            await dispatch(getImage(1, res.resultData.profile_photo, 0));
          }
          console.log('profileCheck!');
          return dispatch({type: GET_USER_INFO, payload: res.resultData});
        } else {
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log('er > ' + err));
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const getImageTestList = (filterObj, type) => async (dispatch) => {
  let t = getMyStorageItem('token');
  const pos = filterObj.pos;
  const count = filterObj.count;
  console.log('getImageTestList ======');
  console.log(pos, count);
  const nickname = filterObj.nickname;
  const start = filterObj.start;
  const end = filterObj.end;
  const status = filterObj.status;

  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
      params: {
        pos: pos,
        count: count,
      },
    };

    if (nickname !== undefined && nickname !== null && nickname !== '')
      axiosConfig.params.nickname = nickname;
    if (
      start !== undefined &&
      start !== null &&
      start > 0 &&
      end !== undefined &&
      end !== null &&
      end > 0
    ) {
      axiosConfig.params.start = start;
      axiosConfig.params.end = end;
    }
    if (status !== undefined && status !== null)
      axiosConfig.params.status = status;

    console.log('mainaction getImageTestList axios config');
    console.log(axiosConfig);
    //return Promise.resolve();

    const request = await axios
      .get(`${API_URI}/test/list`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        // res =  {"result": {"message": "데이터가 없습니다.", "status": "222"}}
        console.log('result /test/list');
        console.log(res);
        //console.log('getImageTestList1');
        if (res.result.status === '000') {
          res.resultData.type = type;
          if (res.resultData.list.length > 0) {
            console.log('res.list.length > 0');
            console.log(res.resultData.list.length);
            dispatch({type: GET_LIST_INFO, payload: res});
            res.resultData.list.forEach(async (element) => {
              //TODO list called component many time..
              if (element.image_id !== '' && element.image_id !== null) {
                //console.log(element.image_id);
                await dispatch(getImage(0, element.image_id, 0));
              }
            });
          }
        } else if (res.result.status === '222') {
          if (type === 'F' && pos === 0) {
            await dispatch({type: GET_LIST_INFO_FAIL});
          }
          await dispatch({type: LIST_LOADED_FINISH});
          return dispatch(showMessage(res.result.message));
        } else {
          await dispatch({type: LIST_LOADED_FINISH});
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => {
        console.log('/test/list error!!!!!!!');
        console.log(err);
      });
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const listFilter = (key, value) => (dispatch) => {
  dispatch({type: CHANGE_FILTER, payload: {key: key, value: value}});
  return Promise.resolve();
};

export const initialListFilter = () => (dispatch) => {
  dispatch({type: INIT_FILTER});
  return Promise.resolve();
};

export const getImageTestListForTestComplete = () => async (dispatch) => {
  //필터를 초기화 한다음 가져와야할지
  //필터를 유지해야할지 결정해야함... 만약 필터를 유지한다면 필터의 조건에 따라 방금 테스트완료한 post가 안나올수도 있음...

  //필터를 초기화 한다면 리스트를 그냥 새로 불러오는게 빠름. 0,3
  //필터를 유지해야한다면 pos ,temp_list_pos 같은거 신경쓰고 해야함.
  const initialFilter = {
    nickname: '',
    start: 0,
    end: 0,
    status: null,
    pos: 0,
    count: 3,
  };
  await dispatch(initialListFilter());
  return dispatch(getImageTestList(initialFilter, 'L'));
};

export const getImageTestListForNew = (filterObj, type) => async (dispatch) => {
  let setData = {
    type: type,
    pos: filterObj.pos,
  };
  await dispatch({type: LIST_LOADED, payload: setData});

  console.log('getImageTestList for new ');
  console.log(type);
  console.log(filterObj);
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
  return dispatch(getImageTestList(filterObj, type));
};

/**
 * 테스트 유저리스트
 *
 * @returns promise
 */
export const getTestUserInfos = () => async (dispatch) => {
  let t = getMyStorageItem('token');
  console.log('mainAction getTestUserInfos');
  //console.log(t);
  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };
    //axios get 사용할때 (uri,인자) 인거임 세번째 파라미터는 없슴.
    // get할때 헤더에 토큰이랑 param값이 필요하다면 같은곳에 넣어서 ㄱㄱ해야함.
    const request = await axios
      .get(`${API_URI}/test/testees`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log('result testees');
        console.log(res);

        if (res.result.status === '000') {
          console.log('getUserList1');
          console.log(res);
          console.log(res.resultData.list.length);
          dispatch({type: GET_TEST_USER_INFO, payload: res});
          res.resultData.list.forEach(async (element) => {
            //TODO list called component many time..
            if (
              element.profile_photo !== '' &&
              element.profile_photo !== null
            ) {
              await dispatch(getImage(3, element.profile_photo, 0));
            }
          });
          //return dispatch({type: GET_TEST_USER_INFO, payload: res});
        } else {
          console.log('getUserList fail');
          console.log(res);
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log(err));
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const setTesteeUser = (no) => {
  console.log(no);
  return {type: SET_TESTEE_USER, payload: no};
};

export const resetTesteeUser = (list) => {
  return {type: GET_TEST_USER_INFO, payload: list};
};

export const sendPicture = (file) => async (dispatch) => {
  let t = getMyStorageItem('token');
  console.log('sendPicture..');
  if (t !== null && t !== '') {
    const formData = new FormData();
    formData.append('file', file);
    let fileSendaxiosConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
        token: t,
      },
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
    };
    console.log(file);
    const request = await axios
      .post(`${API_URI}/test/image/correct`, formData, fileSendaxiosConfig)
      .then(async (response) => {
        const res = response.data;
        const resheader = response.headers;
        console.log('check send file');
        console.log(resheader);
        if (resheader.status === '000') {
          console.log(resheader);
          console.log(
            '-----------------------------!@#!@#--------------------------------------------',
          );
          console.log(response);
          let profileBlob = await Buffer.from(res, 'binary').toString('base64');
          let data = {
            image: profileBlob,
            id: resheader.correct_image_id,
          };
          return dispatch({type: CORRECTION_PICTURE, payload: data});
        } else {
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

export const setNewUser = (obj) => async (dispatch) => {
  let t = getMyStorageItem('token');
  if (t !== null && t !== '') {
    //charset=utf-8
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };

    let sendData;
    if (
      obj.file !== undefined &&
      Object.keys(obj.file).length > 0 &&
      JSON.stringify(obj.file) !== JSON.stringify({})
    ) {
      console.log('testeee with file');
      sendData = new FormData();
      sendData.append('file', obj.file);
      sendData.append('nickname', obj.nickname);
      sendData.append('birthday', obj.birthday);
      sendData.append('gender', obj.gender);
      sendData.append('type', obj.type);
    } else {
      console.log('testeee without file');
      sendData = Object.assign({}, obj);
    }
    console.log(sendData);

    const request = await axios
      .post(`${API_URI}/test/testee/new`, sendData, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        if (res.result.status === '000') {
          return {res: res};
        } else {
          console.log(
            'err -> ' + res.result.status + ' / ' + res.result.message,
          );
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log('err! > ' + err));
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const getTestList = (type, lang) => async (dispatch) => {
  let t = getMyStorageItem('token');

  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        token: t,
      },
      params: {
        test_id: type,
        lang: lang,
      },
    };
    const request = await axios
      .get(`${API_URI}/test/questions`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log('---11');
        console.log(res);
        console.log(res.resultData.list[0].answers);
        console.log(
          'TODO. answers next_question_no가 있는경우 처리작업 필요함..',
        );
        if (res.result.status === '000') {
          if (res.resultData.list.length > 0) {
            res.resultData.test_id = type;
            console.log(res.resultData);
            return dispatch({type: GET_TEST_LIST, payload: res});
          }
        } else {
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log(err));
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const setQuestion = (obj) => {
  return {type: QUESTION_SET, payload: obj};
};

export const setChangeAnswer = (an, qn, text) => {
  let answer = {
    an: an,
    qn: qn,
    text: text,
  };
  return {type: ANSWER_CHANGE, payload: answer};
};
export const setAnswer = (obj) => {
  return {type: ANSWER_SET, payload: obj};
};

export const requestTest = (sendData) => async (dispatch) => {
  let t = getMyStorageItem('token');
  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };
    console.log('mainAction requestTest');
    console.log(sendData);
    await axios
      .post(`${API_URI}/test/request`, sendData, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log(res.result);
        if (res.result.status === '000') {
          await dispatch({type: REQUEST_TEST_SUCCESS});
          return Promise.resolve();
        } else {
          console.log(
            'err -> ' + res.result.status + ' / ' + res.result.message,
          );
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log(err));
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};

export const resetTest = () => async (dispatch) => {
  //Promise.resolve();
  return await dispatch({type: REQUEST_TEST_RESET});
};

export const setResult = (data) => async (dispatch) => {
  console.log('mainAction setResult values');
  console.log('----------------------------------------------');
  console.log('call request result page data');
  console.log('----------------------------------------------');
  console.log(data);

  // {
  //   "YD": "NaN년NaN월",
  //   "image": 'image binary',
  //   "image_id": "00000000004_20211203152543",
  //   "result_time": null,
  //   "status": 2,
  //   "test_id": 100,
  //   "test_req_no": 4,
  //   "test_time": 1638512743925,
  //   "testee_nickname": "신형카카오",
  //   "testee_no": 4
  // }

  let t = getMyStorageItem('token');
  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };
    const sendData = {
      test_req_no: data.test_req_no,
    };
    const request = await axios
      .post(`${API_URI}/test/result`, sendData, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log(res);
        if (res.result.status === '000') {
          await dispatch({type: REQUEST_RESULT, payload: res.resultData.data});
        } else {
          return dispatch(showMessage('결과가져오기 실패'));
        }
      })
      .catch((err) => {
        console.log('setResult error!!!!!!!');
        console.log(err);
      });
  } else {
    console.log('result get action no token');
  }
};

export const getTypeOfTest = () => async (dispatch) => {
  console.log('call the type of testes..');
  let t = getMyStorageItem('token');
  if (t !== null && t !== '') {
    let axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: t,
      },
    };
    const request = await axios
      .get(`${API_URI}/test/types`, axiosConfig)
      .then(async (response) => {
        const res = response.data;
        console.log('result types');
        console.log(res);
        if (res.result.status === '000') {
          return dispatch({type: GET_TEST_TYPE, payload: res});
        } else {
          return dispatch(showMessage(res.result.message));
        }
      })
      .catch((err) => console.log('er > ' + err));
    return request;
  } else {
    console.log('no havit local token...');
    return Promise.reject();
  }
};
export const imageTextChange = (data) => async (dispatch) => {
  if (data.text.length <= 25) {
    dispatch({type: IMAGE_TEXT_CHANGE, payload: data.text});
  } else {
    return dispatch(showMessage('최대 25글자만 가능합니다.'));
  }
  return Promise.resolve();
};
