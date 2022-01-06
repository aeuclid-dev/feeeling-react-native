import {
  LOGIN,
  JOIN,
  KAKAO_LOGIN_FAIL_SET_JOIN,
  NAVER_LOGIN_FAIL_SET_JOIN,
  SELECT_UNDER_14,
  SELECT_OVER_14,
  SET_JOIN_PROFILE,
  LOG_OUT,
} from '../actions/types';

const initialState = {
  token: '',
  is_login: false,
  is_go_join: false,
  is_join_info: null,
  joinAgeOver14: null,
  joinImageFile: {},
};
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case SELECT_UNDER_14:
      return {
        ...state,
        joinAgeOver14: false,
      };
    case SELECT_OVER_14:
      return {
        ...state,
        joinAgeOver14: true,
      };
    case LOGIN:
      return {
        ...state,
        UserInfo: payload,
      };
    case KAKAO_LOGIN_FAIL_SET_JOIN:
      return snsLoginSet(state, payload);
    case NAVER_LOGIN_FAIL_SET_JOIN:
      return snsLoginSet(state, payload);
    case SET_JOIN_PROFILE:
      return {
        ...state,
        joinImageFile: payload,
      };
    case LOG_OUT:
      return {
        ...state,
        initialState,
      };
    default:
      return state;
  }
};

function snsLoginSet(state, payload) {
  let n_is_join_info = {
    id: payload.id,
    type: payload.type,
  };
  //네이버에서 넘어오는 정보를 확인했을때 이메일같은경우 네이버 계정이 아니라 네이버 계정을 잃어버렸을때 주는 이메일이 넘어왔음 이런경우 이메일을 사용하는 아이디가 아닌
  //사용하지않는 경우의 아이디가 많기때문에 일단 아이디만 받는걸로 결정.

  // if(payload.type === 1){
  //   //kakao
  //   n_is_join_info = {
  //     id: payload.id,
  //     type: payload.type,
  //   }
  // }else if(payload.type === 2){
  //   //naver
  //   n_is_join_info = {
  //     id: payload.id,
  //     type: payload.type,
  //   }
  // }

  return {
    ...state,
    is_go_join: true,
    is_join_info: n_is_join_info,
  };
}
