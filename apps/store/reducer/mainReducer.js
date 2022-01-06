import {timeStapmToYearMonth} from '../../modules/timesUtiles';
import {
  GET_USER_INFO,
  GET_PROFILE_IMAGE_SUCCESS,
  GET_LIST_INFO,
  GET_LIST_INFO_FAIL,
  GET_TEST_IMAGE_SUCCESS,
  GET_TEST_USER_INFO,
  GET_TESTEE_PROFILE_IMAGE_SUCCESS,
  GET_TEST_TYPE,
  SET_TESTEE_USER,
  CORRECTION_PICTURE,
  GET_TEST_LIST,
  LIST_LOADED,
  LIST_LOADED_FINISH,
  QUESTION_SET,
  ANSWER_CHANGE,
  ANSWER_SET,
  REQUEST_TEST_SUCCESS,
  REQUEST_TEST_RESET,
  REQUEST_RESULT,
  CHANGE_FILTER,
  INIT_FILTER,
  LOG_OUT,
  IMAGE_TEXT_CHANGE,
  REQUEST_RESULT_IMAGE,
} from '../actions/types';

const initialState = {
  user_no: null,
  user_id: null,
  homeFilter: {
    nickname: '',
    start: 0,
    end: 0,
    status: null,
    pos: 0,
    count: 3,
  },
  nickname: null,
  profile_photo: null,
  profile_photo_img: null,
  post: null,
  test: null,
  point: null,
  testType: [],
  testList: {},
  testimg: null,
  testeeUsers: {},
  testServey: [],
  testAnswers: {},
  is_testCompleted: false,
  resultData: {},
  is_listLoaded: false,
  temp_list_pos: 0,
  user_type: null, // 0:join 1:ka 2:na
  is_homeLoaded: false,
};
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case GET_USER_INFO:
      return {
        ...state,
        user_no: payload.user_no,
        user_id: payload.user_id,
        nickname: payload.nickname,
        profile_photo: payload.profile_photo,
        post: payload.post,
        test: payload.test,
        point: payload.point,
        user_type: payload.type,
      };
    case GET_PROFILE_IMAGE_SUCCESS:
      return {
        ...state,
        profile_photo_img: payload,
      };
    case GET_LIST_INFO: {
      return settingTestList(state, payload);
    }
    case GET_LIST_INFO_FAIL:
      return {
        ...state,
        testList: {},
      };
    case GET_TEST_IMAGE_SUCCESS:
      return testListSetImage(state, payload);
    case GET_TEST_USER_INFO:
      return testeeSetUser(state, payload);
    case GET_TESTEE_PROFILE_IMAGE_SUCCESS:
      return testeeListSetImage(state, payload);
    case GET_TEST_TYPE:
      return {
        ...state,
        testType: payload.resultData.list,
      };
    case SET_TESTEE_USER:
      return testeeSetUserSelect(state, payload);
    case CORRECTION_PICTURE:
      return pictureSet(state, payload);
    case LIST_LOADED:
      return {
        ...state,
        is_listLoaded: true,
        temp_list_pos: payload.type === 'L' ? payload.pos : 0,
      };
    case LIST_LOADED_FINISH:
      return {
        ...state,
        homeFilter: {
          ...state.homeFilter,
          pos: state.temp_list_pos,
        },
        is_listLoaded: false,
        temp_list_pos: 0,
      };
    case GET_TEST_LIST:
      return {
        ...state,
        testServey: payload.resultData.list,
        testAnswers: {
          test_id: payload.resultData.test_id,
        },
      };
    case QUESTION_SET:
      return questionSet(state, payload);
    case ANSWER_CHANGE:
      return answerSet(state, payload);
    case ANSWER_SET:
      return {
        ...state,
      };
    case REQUEST_TEST_SUCCESS: {
      return {
        ...state,
        is_testCompleted: true,
      };
    }
    case REQUEST_TEST_RESET:
      return {
        ...state,
        testimg: null,
        testServey: [],
        testAnswers: {},
        is_testCompleted: false,
        is_homeLoaded: true,
      };
    case REQUEST_RESULT:
      return {
        ...state,
        resultData: payload,
      };
    case REQUEST_RESULT_IMAGE:
      return {
        ...state,
        resultData: {
          ...state.resultData,
          [payload.resultData.key]: payload.resultData.value,
        },
      };
    case CHANGE_FILTER:
      return {
        ...state,
        homeFilter: {
          ...state.homeFilter,
          [payload.key]: payload.value,
        },
      };
    case INIT_FILTER:
      return {
        ...state,
        homeFilter: {
          nickname: '',
          start: 0,
          end: 0,
          status: null,
          pos: 0,
          count: 3,
        },
      };
    case LOG_OUT:
      return logoutInitialMainReducer(state, payload);
    case IMAGE_TEXT_CHANGE:
      return {
        ...state,
        testAnswers: {
          ...state.testAnswers,
          image_comment: payload,
        },
      };
    default:
      return state;
  }
};

function logoutInitialMainReducer(state, payload) {
  return {
    ...state,
    initialState,
  };
}

function settingTestList(state, payload) {
  console.log('mainReducer in settingTestList function.. pos > ');
  console.log('state.homeFilter.pos>>', state.homeFilter.pos);
  console.log(payload);
  //console.log(payload.type)
  //const listType = payload.type;
  // delete payload.type
  payload.resultData.list.map((data) => {
    // console.log(data.status)
    // console.log(data.test_time)
    // console.log(data.result_time)

    // let dataDate =
    //   data.status === 0
    //     ? timeStapmToYearMonth(data.test_time)
    //     : timeStapmToYearMonth(data.result_time);
    data['YD'] = timeStapmToYearMonth(data.test_time);
    return;
  });
  if (state.homeFilter.pos === 0) {
    console.log('list all paste');
    return {
      ...state,
      testList: payload.resultData,
      is_listLoaded: false,
    };
  } else if (state.homeFilter.pos > 0) {
    console.log('list concated..');
    return {
      ...state,
      testList: {
        list: state.testList.list.concat(payload.resultData.list),
      },
      is_listLoaded: false,
    };
  } else {
    console.log('bug');
    return {
      ...state,
    };
  }
}

function testListSetImage(state, payload) {
  let newTestList = Object.assign({}, state.testList);
  let testListArr = [];
  state.testList.list.map((data) => {
    let newArrObj = Object.assign({}, data);
    if (newArrObj['image_id'] === payload.image_id) {
      newArrObj['image'] = payload.image;
    }
    testListArr.push(newArrObj);
  });
  newTestList.list = testListArr;
  // console.log('testListSetImage in Mainreducer');
  // console.log(Array.isArray(testListArr));
  // console.log(newTestList);
  return {
    ...state,
    testList: newTestList,
  };
}

function testeeSetUser(state, payload) {
  let newUserList = Object.assign({}, payload.resultData);
  let testUserArr = [];
  payload.resultData.list.map((data) => {
    let newArrObj = Object.assign({}, data);
    newArrObj['selected'] = false;
    testUserArr.push(newArrObj);
  });
  newUserList.list = testUserArr;
  return {
    ...state,
    testeeUsers: newUserList,
  };
}

function testeeSetUserSelect(state, payload) {
  let newUserList = Object.assign({}, state.testeeUsers);
  let newAnswers = Object.assign({}, state.testAnswers);
  let testUserArr = [];
  state.testeeUsers.list.map((data) => {
    let newArrObj = Object.assign({}, data);
    if (newArrObj['testee_no'] === payload) {
      newArrObj['selected'] = true;
    } else {
      newArrObj['selected'] = false;
    }
    testUserArr.push(newArrObj);
  });
  newUserList.list = testUserArr;
  newAnswers.testee_no = payload;
  return {
    ...state,
    testeeUsers: newUserList,
    testAnswers: newAnswers,
  };
}

function pictureSet(state, payload) {
  let newAnswers = Object.assign({}, state.testAnswers);
  newAnswers.correct_image_id = payload.id;
  newAnswers.image_comment = '';
  newAnswers.test_questions = [];
  return {
    ...state,
    testimg: payload.image,
    testAnswers: newAnswers,
  };
}

function questionSet(state, payload) {
  let newAnswers = Object.assign({}, state.testAnswers);
  //console.log('questionSet');
  //console.log(payload);
  if (newAnswers.test_questions.length < 1) {
    newAnswers.test_questions.push({
      question_no: payload.question_no,
      answer_no: 0,
      answer: '',
    });
  } else {
    let is_questions = newAnswers.test_questions.filter(
      (obj) => obj.question_no === payload.question_no,
    );
    if (is_questions.length < 1) {
      newAnswers.test_questions.push({
        question_no: payload.question_no,
        answer_no: 0,
        answer: '',
      });
    }
  }

  //console.log(newAnswers);
  return {
    ...state,
    testAnswers: newAnswers,
  };
}
function answerSet(state, payload) {
  // console.log('answerset');
  // console.log(state.testAnswers);
  // console.log(payload);
  let newAnswers = Object.assign({}, state.testAnswers);
  let testAnserArr = [];
  state.testAnswers.test_questions.map((data) => {
    let newArrObj = Object.assign({}, data);
    if (newArrObj['question_no'] === payload.qn) {
      newArrObj['answer_no'] = payload.an;
      newArrObj['answer'] = payload.text;
    }
    testAnserArr.push(newArrObj);
  });
  newAnswers.test_questions = testAnserArr;
  return {
    ...state,
    testAnswers: newAnswers,
  };
}

function testeeListSetImage(state, payload) {
  let newTestList = Object.assign({}, state.testeeUsers);
  let testListArr = [];
  state.testeeUsers.list.map((data) => {
    let newArrObj = Object.assign({}, data);
    if (newArrObj['profile_photo'] === payload.profile_photo) {
      console.log(payload.profile_photo);

      newArrObj['profile_image'] = payload.image;
    }
    testListArr.push(newArrObj);
  });
  newTestList.list = testListArr;
  // console.log('testListSetImage in Mainreducer');
  // console.log(Array.isArray(testListArr));
  // console.log(newTestList);
  return {
    ...state,
    testeeUsers: newTestList,
  };
}
