import React, {useState, useEffect} from 'react';
import {View, Dimensions, StyleSheet, Image, BackHandler} from 'react-native';

import {getImageTestListForTestComplete} from '../../store/actions/mainActions';

import {useSelector, useDispatch} from 'react-redux';
import SurveyHeader from '../../components/survey/SurveyHeader';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';

const {height, width} = Dimensions.get('window');
export default function TestComplete(props) {
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    //백버튼은 무효화.
    const stepBack = () => {
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', stepBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', stepBack);
    };
  }, []);

  useEffect(() => {
    if (mainState.is_testCompleted) {
      const countdown = setInterval(async () => {
        if (parseInt(seconds) > 0) {
          setSeconds(parseInt(seconds) - 1);
        } else if (parseInt(seconds) === 0) {
          console.log('test complete before move homemain call list...');
          console.log('#################complete#########################');
          //console.log(mainState.homeFilter);
          await dispatch(getImageTestListForTestComplete());
          props.navigation.navigate('MainPage');
        } else {
          console.log('test complete error?');
        }
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [mainState.is_testCompleted, seconds]);

  return (
    <View>
      <View style={styles.surveyTitleDiv}>
        <SurveyHeader
          is_finish={true}
          iconType={'C'}
          step={props.step}
          text={'검사완료!'}
        />
      </View>
      <View style={styles.surveyContentsDiv}>
        {mainState.testimg !== null ? (
          <Image
            resizeMode="contain"
            style={styles.surveyContentsImage}
            source={{uri: `data:image/png;base64,${mainState.testimg}`}}
          />
        ) : null}
        <View style={styles.surveyContentsListDiv}>
          <TextNR style={styles.contentsText}>
            최대한 빨리 검사결과를 알려드릴께요!
          </TextNR>
          <TextNR style={styles.contentsText}>
            검사결과가 도착하면 알림으로 알려드립니다!
          </TextNR>
        </View>
      </View>
      <View style={styles.surveyFooterDiv}>
        <View style={[styles.BottomBtnDiv]}>
          <TextNEB style={styles.BottomText}>
            잠시후 자동으로 메인으로 이동합니다.
          </TextNEB>
          <View style={styles.BottomCircle}>
            <TextNEB style={styles.BottomCircleText}>{seconds}</TextNEB>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  surveyTitleDiv: {
    width: width,
    height: (height / 10) * 2,
  },
  surveyContentsDiv: {
    width: width,
    height: (height / 10) * 6.7,
  },
  surveyContentsImage: {
    height: (height / 10) * 2,
  },
  surveyContentsListDiv: {
    //height: (height / 10) * 5,
  },
  surveyFooterDiv: {
    width: width,
    height: (height / 10) * 1,
  },
  contentsText: {
    fontSize: 18,
    color: '#4a4a4a',
    lineHeight: 30,
    marginHorizontal: 25,
    paddingVertical: 10,
  },
  BottomBtnDiv: {
    backgroundColor: '#ff6f61',
    width: width - 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
    paddingVertical: 5,
  },
  BottomCircle: {
    backgroundColor: '#FFF',
    width: 45,
    height: 45,
    borderRadius: 22,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BottomText: {
    color: '#FFF',
    fontSize: 15,
  },
  BottomCircleText: {
    fontSize: 22,
    color: '#FF6F61',
  },
  cardImage: {
    height: 150,
  },
});
