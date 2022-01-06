import React, {useState, useEffect} from 'react';

import {useSelector, useDispatch} from 'react-redux';
import {View, Text} from 'react-native';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

import {getTestList, resetTest} from '../../store/actions/mainActions';
import {
  showMessage,
  doSplashNow,
  dontSplashNow,
} from '../../store/actions/commonActions';
//import {onBackPress} from '../../modules/backPressHandler';

import TestMain from './TestMain';
import TestUserSet from './TestUserSet';
import CameraForTest from './CameraForTest';
import TestContents from './TestContents';
import TestComplete from './TestComplete';

export default function PPTest(props) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const [step, setStep] = useState(0);

  const onSelectTest = async (id, typeName) => {
    console.log(typeName);
    if (typeName === 'HOUSE' || typeName === 'PITR') {
      await dispatch(getTestList(id, 'kor'))
        .then((res) => {
          console.log(res);
          if (res.payload.result.status === '000') {
            onStepUp();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      await dispatch(showMessage('준비 중..'));
    }
  };
  const onStepUp = () => {
    setStep(step + 1);
  };
  const onStepDown = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    if (mainState.is_testCompleted) {
      const stepReset = () => {
        setStep(0);
      };
      return () => stepReset();
    }
  }, [mainState.is_testCompleted]);

  useEffect(() => {
    console.log('test step >>> ' + step);
    async function stepByStepSplashCheck() {
      if (step === 2) {
        await dispatch(dontSplashNow());
      } else if (step === 1 || step === 3) {
        await dispatch(doSplashNow());
      }
    }
    stepByStepSplashCheck();
  }, [step]);

  useEffect(() => {
    async function callInitialScreen() {
      if (isFocused) {
        console.log('pptest focus navi style change...');
        props.navigation.setOptions({
          tabBarStyle: {
            display: 'none',
          },
        });
      }
    }
    callInitialScreen();
  }, [isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('focus test Page-');
      return () => {
        setStep(0);
        resetTest();
      };
    }, []),
  );

  if (mainState.is_testCompleted) {
    return <TestComplete navigation={props.navigation} />;
  } else {
    if (step === 0) {
      return (
        <TestMain
          activeTest={mainState.testType}
          onStepUp={onStepUp}
          navigation={props.navigation}
          onSelectTest={onSelectTest}
        />
      );
    } else if (step === 1) {
      return <TestUserSet onStepUp={onStepUp} onStepDown={onStepDown} />;
    } else if (step === 2) {
      return <CameraForTest onStepUp={onStepUp} onStepDown={onStepDown} />;
    } else {
      return mainState.testServey.length > 1 && step > 2 ? (
        <TestContents
          step={step}
          onStepUp={onStepUp}
          onStepDown={onStepDown}
          navigation={props.navigation}
        />
      ) : (
        <View>
          <Text>{mainState.testServey.length}</Text>
          <Text>@</Text>
          <Text>{step}</Text>
        </View>
      );
    }
  }
}
