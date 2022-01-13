import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Animated,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import {useSelector, useDispatch} from 'react-redux';
import RNExitApp from 'react-native-exit-app';
import {getMyStorageItem} from '../../modules/localStorage';
import {GetAppLabel, showMessage} from '../../store/actions/commonActions';

const {height, width} = Dimensions.get('window');

export default function MainSplashScreen(props) {
  const dispatch = useDispatch();
  const common = useSelector((state) => state.common);
  const animation = useRef(new Animated.Value(0)).current;
  const [headerText, setHeaderText] = useState('');
  const [bottomText, setBottomText] = useState('');

  const mainState = useSelector((state) => state.main);
  console.log('#################################');
  console.log(mainState.homeFilter);

  const _screenAnimate = (finished) => {
    if (finished) {
      let t = getMyStorageItem('token');
      console.log('mainsplash animation end');
      //console.log(t);
      if (t !== null && t !== '' && t !== false) {
        props.navigation.navigate('Main');
        console.log("= 1 =================================");
      } else {
        console.log("= 2 =================================");
        _handleOpen();
      }
    }
  };

  const _handleOpen = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const _goLogin = () => {
    props.navigation.navigate('Login');
  };
  //animate options
  const fadeopacity = {
    from: {opacity: 0},
    to: {opacity: 1},
  };
  const slidePopUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0.01, 1],
          outputRange: [0, -1 * height],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  useEffect(() => {
    const endFeeeling = () => {
      Alert.alert('Exit App', 'Exiting the Feeeling?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => RNExitApp.exitApp(),
        },
      ]);
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', endFeeeling);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', endFeeeling);
    };
  }, [props]);

  useEffect(() => {
    dispatch(GetAppLabel('start_main')).then((res) => {
      if (res.data.result.status === '000') {
        setHeaderText(res.data.resultData);
      } else {
        showMessage('서버와 통신에 실패했습니다..');
      }
    });
    dispatch(GetAppLabel('start_bottom')).then((res) => {
      if (res.data.result.status === '000') {
        setBottomText(res.data.resultData);
      } else {
        showMessage('서버와 통신에 실패했습니다..');
      }
    });
  }, []);

  return (
    <View>
      <ImageBackground
        source={
          common.splashImage === null
            ? require('../../resource/images/splash_new1.png')
            : common.splashImage
        }
        style={styles.bgimg}>
        <Animatable.Image
          source={require('../../resource/images/feeeling_ci_white.png')}
          easing="ease-in-out"
          style={styles.fade}
          animation={fadeopacity}
          delay={1000}
          onAnimationEnd={({finished}) => {
            if (finished) {
              console.log('is fin animation ? --> ' + finished);
              _screenAnimate(finished);
            }
          }}
        />
      </ImageBackground>
      <View style={styles.appTitle}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <TextNR style={styles.appTitleMain}>{headerText}</TextNR>
        </View>
      </View>
      {/* <Animatable.View
        style={{
          position: 'absolute',
          top: height - 80,
          width: width,
          alignItems: 'center',
        }}
        iterationDelay={4}
        animation={'zoomInUp'}>
        <Text>{headerText}</Text>
      </Animatable.View> */}
      <View style={[styles.bottomPop]}>
        <Animated.View style={[styles.popup, slidePopUp]}>
          <View style={[styles.popTextDiv]}>
            <TextNB style={[styles.popTitle]}>{bottomText}</TextNB>
            {/* <TextNEB style={[styles.popTitle]}>로그인이 필요합니다!</TextNEB>
            <TextNR style={[styles.popSubTitle]}>처음 사용하시는 경우</TextNR>
            <TextNR style={[styles.popSubTitle]}>
              회원가입을 먼저 해주세요!
            </TextNR> */}
          </View>
          <View style={[styles.popBtnDiv]}>
            <TouchableOpacity style={styles.popBtn} onPress={_goLogin}>
              <TextNEB style={[styles.popBtnLoginText]} onPress={_goLogin}>
                시작하기
              </TextNEB>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bgimg: {
    width: width,
    height: height,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  appTitle: {
    position: 'absolute',
    top: (height / 5) * 2,
    width: width - 40,
    justifyContent: 'center',
    marginLeft: 40,
  },
  appTitleMain: {
    fontSize: 30,
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    marginRight: 3,
  },
  fade: {
    width: width * 0.4,
    height: 65,
    position: 'absolute',
    top: '10%',
    left: '55%',
    resizeMode: 'contain',
  },
  bottomPop: {
    position: 'absolute',
    top: height * 2,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  popup: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: height / 3,
    paddingBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#808988',
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: -3},
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  popTextDiv: {
    marginVertical: 3,
    marginHorizontal: 20,
  },
  popTitle: {
    color: '#4a4a4a',
    fontSize: 18,
    letterSpacing: 0.25,
    textAlign: 'center',
    marginBottom: 10,
  },
  popSubTitle: {
    color: '#77869e',
    fontSize: 13,
    letterSpacing: 0.1,
    lineHeight: 13 * 1.54,
    textAlign: 'center',
    marginBottom: 3,
  },
  popBtnDiv: {
    flexDirection: 'row',
  },
  popBtn: {
    margin: 15,
    padding: 15,
    width: width - 20,
    backgroundColor: '#FF6F61',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  popBtnLoginText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  splashbottomText: {
    fontSize: 12,
    color: '#FFF',
  },
});
