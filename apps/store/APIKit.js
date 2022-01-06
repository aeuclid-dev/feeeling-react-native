import axios from 'axios';
import {API_URI} from './actions/types';

//211104
//nest에서 jwt전략에
//jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//해놓은경우 유효한 소스코드..
//현재는 기존방식유지를 위해서 ExtractJwt.fromHeader('token'), 사용..
//APIKit.post(...) APIKit.get(...)  로그인하고 토큰받거나 스플래시에서 토큰 확인되면 setClientToken.

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
  baseURL: API_URI,
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = (token) => {
  APIKit.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default APIKit;
