import {combineReducers} from 'redux';
import userReducer from './userReducer';
import mainReducer from './mainReducer';
import commonReducer from './commonReducer';

const appReducer = combineReducers({
  user: userReducer,
  main: mainReducer,
  common: commonReducer,
});

export default rootReducer = (state, action) => {
  console.log('root reducer answer action type>> ', action.type);
  if (action.type === 'LOG_OUT') {
    console.log('get action LOG_OUT');
    //console.log(state);
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
