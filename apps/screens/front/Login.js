import React, {useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  Dimensions,
  ToastAndroid,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  login as kakaoLogin,
  logout as kakaoLogout,
  unlink as kakaoUnlink,
  getProfile as kakaoGetProfile,
} from '@react-native-seoul/kakao-login';
import {NaverLogin, getProfile} from '@react-native-seoul/naver-login';
import {Formik} from 'formik';
import * as Yup from 'yup';

import ScreenHader from '../../components/ScreenHeader';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import {FeeelingLogin, CheckSnsLogin} from '../../store/actions/userActions';

import IconKakao from '../../resource/icons/kakao_icon.svg'; // kakao
import IconNaver from '../../resource/icons/naver_icon.svg'; // naver

const {height, width} = Dimensions.get('window');

const validationSchema = Yup.object().shape({
  user_id: Yup.string()
    .required('이메일 입력은 필수 입니다.')
    .email('이메일 형식이 아닙니다.'),
  pwd: Yup.string()
    .required('패스워드를 입력해주세요!')
    .min(6, '최소 6자이상 입력해주세요!'),
});

export default function Login({navigation}) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const loginKakao = async () => {
    try {
      let result = await kakaoLogin();
      if (result) {
        let profileResult = await kakaoGetProfile();
        await dispatch(CheckSnsLogin(1, profileResult))
          .then((res) => {
            console.log(res);
            if (res.type === 'LOGIN') {
              navigation.navigate('Main');
            }
          })
          .catch((err) => console.log(err));
      }
    } catch (err) {
      if (err.code === 'E_CANCELLED_OPERATION') {
        console.log(`Login Cancelled:${err.message}`);
      } else {
        console.log(`Login Failed:${err.code} ${err.message}`);
      }
    }
  };
  const loginNaver = async () => {
    // let androidKeys = {
    //   kConsumerKey: "bPAW2XS9aqQpoZZnB0GD",
    //   kConsumerSecret: "5xreYutHqv",
    //   kServiceAppName: "com.aeuclid.feeeling"
    // };
    let androidKeys = {
      kConsumerKey: 'Mx_lXLtLbOCvUkjWW9Qw',
      kConsumerSecret: 'LO7DQvOuaU',
      kServiceAppName: 'com.aeuclid.feeeling',
    };
    console.log('네이버 로그인 클릭쓰');

    return new Promise((resolve, reject) => {
      NaverLogin.login(androidKeys, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
        console.log(`\n\n  Token is fetched  :: ${token} \n\n`);

        //naver로 로그인 시도. 실패시 가입으로 정보와 함께 이동.
        getUserProfileNaver(token);
      });
    });
  };

  const getUserProfileNaver = async (token) => {
    console.log('getUserProfile called..');
    const profileResult = await getProfile(token.accessToken);
    if (profileResult.resultcode === '024') {
      Alert.alert('로그인 실패', profileResult.message);
      return;
    } else {
      console.log('profileResult', profileResult.response);
      dispatch(CheckSnsLogin(2, profileResult.response))
        .then((res) => {
          console.log('naver res');
          console.log(res);
          if (res.type === 'LOGIN') {
            navigation.navigate('Main');
          }
        })
        .catch((err) => console.log(err));
    }
  };
  const logoutNaver = () => {
    NaverLogin.logout();
  };
  const logoutKakao = () => {
    kakaoLogout();
    kakaoUnlink();
  };

  useEffect(() => {
    if (
      userState.is_go_join &&
      JSON.stringify(userState.is_join_info) !== JSON.stringify({})
    ) {
      navigation.navigate('Join');
    }
  }, [userState.is_join_info, dispatch]); //1

  return (
    <KeyboardAwareScrollView
      style={[styles.container]}
      contentContainerStyle={{flexGrow: 1}}
      enableAutomaticScroll={true}>
      <ScreenHader location="Splash" navigation={navigation} backBtn={true} />
      <View style={[styles.loginTitleDiv]}>
        <TextNEB style={[styles.loginTitle]}>로그인</TextNEB>
      </View>
      <Formik
        initialValues={{user_id: '', pwd: ''}}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          let tossData = values;
          tossData.type = 0;
          dispatch(FeeelingLogin(tossData, true))
            .then((res) => {
              console.log('then res >>> ');
              console.log(res);
              if (res.type === 'LOGIN') {
                navigation.navigate('Main');
              }
            })
            .catch((e) => {
              console.log('err > ' + e);
            });

          setTimeout(() => {
            actions.setSubmitting(false);
          }, 1000);
        }}>
        {(formikProps) => (
          <View style={[styles.loginBottomDiv]}>
            <View style={[styles.loginTextDiv]}>
              <TextInput
                style={[styles.text, styles.input]}
                onChangeText={formikProps.handleChange('user_id')}
                selectTextOnFocus={true}
                placeholder="아이디(이메일)을 입력해주세요!"
                placeholderTextColor="#98A3B5"
                multiline={false}
                returnKeyType={'done'}
              />
              <TextNR style={{color: 'red'}}>
                {formikProps.errors.user_id}
              </TextNR>
            </View>
            <View style={[styles.loginTextDiv]}>
              <TextInput
                style={[styles.text, styles.input]}
                onChangeText={formikProps.handleChange('pwd')}
                selectTextOnFocus={true}
                secureTextEntry={true}
                placeholder="비밀번호를 입력해주세요!"
                placeholderTextColor="#98A3B5"
                multiline={false}
                returnKeyType={'done'}
              />
              <TextNR style={{color: 'red'}}>{formikProps.errors.pwd}</TextNR>
            </View>
            {formikProps.isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity onPress={formikProps.handleSubmit}>
                <View style={[styles.loginBtnDiv]}>
                  <TextNEB style={[styles.loginBtnText, {fontSize: 16}]}>
                    로그인
                  </TextNEB>
                </View>
              </TouchableOpacity>
            )}
            <View style={[styles.loginBtnSubDiv]}>
              <TextNR style={[styles.loginBlurText]}>
                로그인 계정이 없으신가요?
              </TextNR>
              <TextNEB
                style={[styles.loginStrongText]}
                onPress={() => {
                  navigation.navigate('Join');
                }}>
                회원가입
              </TextNEB>
            </View>
          </View>
        )}
      </Formik>
      <View style={[styles.loginSocialDiv]}>
        <>
          <TextNR style={[styles.loginSocialTitle]}>
            SNS 계정으로 회원가입 및 로그인하기
          </TextNR>
          <TouchableOpacity onPress={loginNaver}>
            <View style={[styles.loginBtnDivSns, styles.loginBtnDivN]}>
              <IconNaver
                style={[
                  styles.loginBtnDivSnsIcon,
                  {marginVertical: 3, marginHorizontal: 15},
                ]}
              />
              <View
                style={[
                  styles.loginBtnDivSnsIconBtn,
                  {borderLeftColor: '#ebedf2'},
                ]}>
                <TextNB
                  style={[styles.loginBtnText, {color: '#FFF', fontSize: 16}]}>
                  네이버 계정으로 로그인
                </TextNB>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={loginKakao}>
            <View style={[styles.loginBtnDivSns, styles.loginBtnDivK]}>
              <IconKakao
                style={[
                  styles.loginBtnDivSnsIcon,
                  {marginVertical: 2, marginHorizontal: 13},
                ]}
              />
              <View
                style={[
                  styles.loginBtnDivSnsIconBtn,
                  {borderLeftColor: '#c0c5d2'},
                ]}>
                <TextNB
                  style={[
                    styles.loginBtnText,
                    {color: '#391b1b', fontSize: 16},
                  ]}>
                  카카오 계정으로 로그인
                </TextNB>
              </View>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={logoutNaver}>
        <View style={[styles.loginBtnDiv, styles.loginBtnDivN]}>
          <Text style={[styles.loginBtnText, {fontSize: 16}]}>네이로갓</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={logoutKakao}>
        <View style={[styles.loginBtnDiv, styles.loginBtnDivK]}>
          <Text style={[styles.loginBtnText, {fontSize: 16}]}>카카로갓</Text>
        </View>
        </TouchableOpacity> */}
        </>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'space-between',
  },
  loginTitleDiv: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 10,
  },
  loginBottomDiv: {
    flex: 2,
    alignItems: 'center',
  },
  loginSocialDiv: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  loginSocialTitle: {
    color: '#77869e',
    letterSpacing: 0.4,
    margin: 5,
  },
  loginTextDiv: {
    width: width - 50,
  },
  loginTextDivFlex: {
    flexDirection: 'row',
  },
  loginAutoWrapDiv: {
    paddingVertical: 5,
    width: width - 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginAutoDiv: {
    width: (width - 50) / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginBtnDiv: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 50,
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#ff6f61',
    padding: 15,
  },
  loginBtnDivSns: {
    alignItems: 'center',
    width: width - 50,
    margin: 5,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
  },
  loginBtnDivSnsIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnDivSnsIconBtn: {
    flex: 2,
    paddingVertical: 5,
    borderLeftWidth: 1,
    alignItems: 'center',
  },
  loginBtnDivK: {
    backgroundColor: '#FEE500',
  },
  loginBtnDivN: {
    backgroundColor: '#19ce60',
  },
  loginBtnSubDiv: {
    width: width - 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 5,
  },
  completedText: {
    color: '#BBB',
    textDecorationLine: 'line-through',
  },
  uncompletedText: {
    color: '#353839',
  },
  loginTitle: {
    color: '#042c5c',
    fontSize: 32,
    marginBottom: 24,
  },
  loginBtn: {
    backgroundColor: '#FF6F61',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  },
  loginBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '200',
  },
  loginBlurText: {
    color: '#77869e',
    marginRight: 8,
    marginLeft: 8,
  },
  loginStrongText: {
    color: '#042c5c',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  loginSubTitle: {
    color: '#002456',
    fontSize: 24,
  },
  loginforgotpw: {
    color: '#3097ce',
    fontSize: 13,
    textDecorationLine: 'underline',
  },

  text: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#77869e',
    textAlign: 'left',
  },
  input: {
    paddingBottom: 3,
  },
});
