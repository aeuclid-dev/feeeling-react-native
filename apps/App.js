import React from 'react';
import {Provider} from 'react-redux';
import store from './store';
import 'react-native-gesture-handler';

import AppNavigator from './navigations/AppNavigator';

function App() {
  return (
    <Provider {...{store}}>
      <AppNavigator />
    </Provider>
  );
}
export default App;
