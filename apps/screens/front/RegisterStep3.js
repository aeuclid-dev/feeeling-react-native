import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  NativeModules,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import moment from 'moment';
import {getUniqueId} from 'react-native-device-info';
import {Formik} from 'formik';
import * as Yup from 'yup';

import CameraForUser from '../../components/CameraForUser';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ScreenHader from '../../components/ScreenHeader';
import BottomNav from '../../components/BottomNav';
import {FeeelingJoin} from '../../store/actions/userActions';

const PHONE_NO_REGEX = /^[0-9\- ]{10,11}$/;

const validationSchemaNS = Yup.object().shape({
  user_id: Yup.string()
    .required('이메일 입력은 필수 입니다.')
    .email('이메일 형식이 아닙니다.'),
  pwd: Yup.string()
    .required('비밀번호를 입력해주세요')
    .min(6, '최소 6자이상 입력해주세요!'),
  pwdConfirm: Yup.string()
    .oneOf([Yup.ref('pwd')], '비밀번호가 동일하지않습니다!')
    .required('비밀번호가 동일하지않습니다!'),
  birthday: Yup.date().required('생년월일을 입력해주세요'),
  mobile: Yup.string()
    .required('휴대전화번호를 입력해주세요')
    .matches(PHONE_NO_REGEX, '유효한번호가 아닙니다.')
    .nullable(),
  // auth: Yup.string()
  //   .required('인증번호를 입력해주세요!')
  //   .min(4, '최소 4자이상 입력해주세요!'),
  nickname: Yup.string()
    .required('별명 입력은 필수 입니다.')
    .min(2, '최소 두글자이상 입력해주세요!')
    .max(20, '최대글자수를 초과 하였습니다!'),
  gender: Yup.string().required('성별을 선택해주세요.'),
});

const validationSchemaWS = Yup.object().shape({
  user_id: Yup.string()
    .required('이메일 입력은 필수 입니다.')
    .email('이메일 형식이 아닙니다.'),
  birthday: Yup.date().required('생년월일을 입력해주세요'),
  mobile: Yup.string()
    .required('휴대전화번호를 입력해주세요')
    .matches(PHONE_NO_REGEX, '유효한번호가 아닙니다.')
    .nullable(),
  // auth: Yup.string()
  //   .required('인증번호를 입력해주세요!')
  //   .min(4, '최소 4자이상 입력해주세요!'),
  nickname: Yup.string()
    .required('별명 입력은 필수 입니다.')
    .min(2, '최소 두글자이상 입력해주세요!')
    .max(20, '최대글자수를 초과 하였습니다!'),
  gender: Yup.string().required('성별을 선택해주세요.'),
});

//import {FeeelingLogin,CheckSnsLogin} from "../../store/actions/userActions";

const {height, width} = Dimensions.get('window');

export default function RegisterStep3(props) {
  const dispatch = useDispatch();
  const uniqueID = getUniqueId();
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const userState = useSelector((state) => state.user);
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] //iOS 13
      : NativeModules.I18nManager.localeIdentifier;
  const userDeviceInfo = {
    device_id: uniqueID,
    device_type: Platform.OS === 'ios' ? 1 : 0,
    nation: deviceLanguage,
  };

  const setYupSchema =
    userState.is_join_info !== null ? validationSchemaWS : validationSchemaNS;

  const onFocusDateInput = () => {
    Keyboard.dismiss();
    setDatePickerShow(true);
  };

  const onSelectDate = (date, formikProps) => {
    setDatePickerShow(false);
    formikProps.setFieldValue('birthday', moment(date).format('YYYY-MM-DD'));
  };
  const onAuthRequest = () => {
    console.log('인증번호 요청');
  };
  const onAuthConfirm = () => {
    console.log('인증번호 확인');
  };

  const openSetProfile = () => {
    setDialogVisible(true);
  };

  return (
    <KeyboardAwareScrollView
      style={[styles.container]}
      contentContainerStyle={{flexGrow: 1}}
      enableAutomaticScroll={true}>
      <ScreenHader navigation={props.navigation} backBtn={false} />
      <View style={[styles.joinTitleDiv]}>
        <TextNEB style={[styles.loginTitle]}>필수정보입력</TextNEB>
      </View>
      <Formik
        initialValues={{}}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values, actions) => {
          console.log('onsubmit!!');
          dispatch(
            FeeelingJoin(
              values,
              userDeviceInfo,
              userState.is_join_info,
              userState.joinImageFile,
            ),
          )
            .then((res) => {
              console.log('result!');
              console.log(res);
              if (res.type === 'LOGIN') {
                props.navigation.navigate('Main');
              }
            })
            .catch((e) => {});
          setTimeout(() => {
            actions.setSubmitting(false);
          }, 1000);
        }}
        validationSchema={setYupSchema}>
        {(formikProps) => (
          <View style={[styles.joinBottomDiv]}>
            <View style={[styles.joinFormikDiv]}>
              <View style={[styles.joinTextDiv]}>
                <TextInput
                  style={[styles.text, styles.input]}
                  onChangeText={formikProps.handleChange('user_id')}
                  selectTextOnFocus={true}
                  placeholder="아이디로 사용할 이메일을 입력해주세요!"
                  placeholderTextColor="#98A3B5"
                  multiline={false}
                  returnKeyType={'done'}
                />
                <TextNR style={styles.errorCodeText}>
                  {formikProps.errors.user_id}
                </TextNR>
              </View>
              {userState.is_join_info !== null ? null : (
                <>
                  <View style={[styles.joinTextDiv]}>
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
                    <TextNR style={{color: 'red', height: 15}}>
                      {formikProps.errors.pwd}
                    </TextNR>
                  </View>
                  <View style={[styles.joinTextDiv]}>
                    <TextInput
                      style={[styles.text, styles.input]}
                      onChangeText={formikProps.handleChange('pwdConfirm')}
                      selectTextOnFocus={true}
                      secureTextEntry={true}
                      placeholder="비밀번호를 다시 한 번 입력해주세요!"
                      placeholderTextColor="#98A3B5"
                      multiline={false}
                      returnKeyType={'done'}
                    />
                    <TextNR style={styles.errorCodeText}>
                      {formikProps.errors.pwdConfirm}
                    </TextNR>
                  </View>
                </>
              )}
              <View style={[styles.joinTextDiv]}>
                <DatePicker
                  modal
                  open={datePickerShow}
                  mode={'date'}
                  date={
                    formikProps.values.birthday
                      ? moment(formikProps.values.birthday).toDate()
                      : new Date()
                  }
                  onConfirm={(date) => {
                    onSelectDate(date, formikProps);
                  }}
                  onCancel={() => {
                    setDatePickerShow(false);
                  }}
                  confirmText={'입력'}
                  cancelText={'취소'}
                />
                <TouchableWithoutFeedback onPress={onFocusDateInput}>
                  <View style={styles.textPlaceholderView}>
                    <TextNR
                      style={[
                        styles.input,
                        {marginVertical: 3},
                        formikProps.values.birthday
                          ? styles.textView
                          : styles.textPlaceholder,
                      ]}>
                      {formikProps.values.birthday
                        ? moment(formikProps.values.birthday).format(
                            'YYYY-MM-DD',
                          )
                        : '생년월일을 입력해주세요!'}
                    </TextNR>
                  </View>
                </TouchableWithoutFeedback>
                <TextNR style={styles.errorCodeText}>
                  {formikProps.errors.birthday}
                </TextNR>
              </View>
              <View style={[styles.joinTextDiv]}>
                <View style={[styles.joinTextWithBtnDiv]}>
                  <TextInput
                    style={[styles.text, styles.input, styles.joinText]}
                    onChangeText={formikProps.handleChange('mobile')}
                    selectTextOnFocus={true}
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    placeholder={
                      userState.joinAgeOver14
                        ? '휴대전화번호'
                        : '법정대리인의 휴대전화번호'
                    }
                    placeholderTextColor="#98A3B5"
                    multiline={false}
                    returnKeyType={'done'}
                  />
                  {/* <TouchableOpacity
                    onPress={onAuthRequest}
                    style={[styles.joinTextBtn]}>
                    <View>
                      <TextNEB style={[styles.joinTextBtnText]}>
                        인증번호요청
                      </TextNEB>
                    </View>
                  </TouchableOpacity> */}
                </View>
                <TextNR style={styles.errorCodeText}>
                  {formikProps.errors.mobile}
                </TextNR>
              </View>
              {/* <View style={[styles.joinTextDiv]}>
                <View style={[styles.joinTextWithBtnDiv]}>
                  <TextInput
                    style={[styles.text, styles.input, styles.joinText]}
                    onChangeText={formikProps.handleChange('auth')}
                    selectTextOnFocus={true}
                    keyboardType={
                      Platform.OS === 'android' ? 'numeric' : 'number-pad'
                    }
                    placeholder="인증번호를 입력해주세요!"
                    placeholderTextColor="#98A3B5"
                    multiline={false}
                    returnKeyType={'done'}
                  />
                  <TouchableOpacity
                    onPress={onAuthConfirm}
                    style={[styles.joinTextBtn]}>
                    <View>
                      <TextNEB style={[styles.joinTextBtnText]}>
                        인증번호확인
                      </TextNEB>
                    </View>
                  </TouchableOpacity>
                </View>
                <TextNR style={{color: 'red'}}>
                  {formikProps.errors.auth}
                </TextNR>
              </View> */}
              <View style={[styles.joinTextDiv]}>
                <TextInput
                  style={[styles.text, styles.input]}
                  onChangeText={formikProps.handleChange('nickname')}
                  selectTextOnFocus={true}
                  placeholder="별명 혹은 애칭을 입력해주세요!"
                  placeholderTextColor="#98A3B5"
                  multiline={false}
                  returnKeyType={'done'}
                />
                <TextNR style={styles.errorCodeText}>
                  {formikProps.errors.nickname}
                </TextNR>
              </View>
              <View style={[styles.joinTextDiv]}>
                <View style={[styles.joinGenderDiv]}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      formikProps.setFieldValue('gender', '1');
                    }}>
                    <View
                      style={[
                        styles.genderDiv,
                        formikProps.values.gender === '1'
                          ? styles.genderDivSelect
                          : null,
                      ]}>
                      <TextNB
                        style={[
                          styles.genderText,
                          formikProps.values.gender === '1'
                            ? styles.genderTextSelect
                            : null,
                        ]}>
                        남자
                      </TextNB>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      formikProps.setFieldValue('gender', '2');
                    }}>
                    <View
                      style={[
                        styles.genderDiv,
                        formikProps.values.gender === '2'
                          ? styles.genderDivSelect
                          : null,
                      ]}>
                      <TextNB
                        style={[
                          styles.genderText,
                          formikProps.values.gender === '2'
                            ? styles.genderTextSelect
                            : null,
                        ]}>
                        여자
                      </TextNB>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <TextNR style={styles.errorCodeText}>
                  {formikProps.errors.gender}
                </TextNR>
              </View>
              <View style={[styles.joinTextDiv, styles.joinProfile]}>
                {Object.keys(userState.joinImageFile).length > 0 &&
                JSON.stringify(userState.joinImageFile) !==
                  JSON.stringify({}) ? (
                  <View style={styles.joinProfileImage}>
                    <Image
                      resizeMode="contain"
                      style={{width: 150, height: 150}}
                      source={{uri: userState.joinImageFile.uri}}
                    />
                  </View>
                ) : null}
                <TouchableOpacity
                  onPress={openSetProfile}
                  style={[styles.joinTextBtn]}>
                  <View>
                    <TextNEB style={[styles.joinTextBtnText]}>
                      프로필 사진 업로드
                    </TextNEB>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomNav}>
              <BottomNav
                backText={'뒤로'}
                forwardText={'회원가입완료'}
                disabled={formikProps.isSubmitting}
                is_finish={true}
                onClickBack={props.onStepDown}
                onClickForward={formikProps.handleSubmit}
              />
            </View>
          </View>
        )}
      </Formik>
      <Modal
        isVisible={dialogVisible}
        useNativeDriver={true}
        style={{margin: 0}}>
        <View style={[styles.modalContainer]}>
          <CameraForUser close={setDialogVisible} />
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  joinTitleDiv: {
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  loginTitle: {
    color: '#042c5c',
    fontSize: 32,
    marginBottom: 18,
  },
  joinBottomDiv: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  joinFormikDiv: {},
  joinTextDiv: {
    width: width - 50,
    justifyContent: 'center',
  },
  joinTextWithBtnDiv: {
    flexDirection: 'row',
    paddingVertical: 3,
  },
  joinTextBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#ff6f61',
  },
  joinTextBtnText: {
    fontSize: 14,
    color: '#fff',
    letterSpacing: 0.35,
  },
  text: {
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: '#77869e',
    textAlign: 'left',
    padding: 0,
  },
  textView: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
  },
  textPlaceholderView: {
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderColor: '#77869e',
  },
  textPlaceholder: {
    fontSize: 14,
    color: '#98A3B5',
    textAlign: 'left',
  },
  input: {
    paddingBottom: 1,
  },
  joinText: {
    flex: 2,
  },
  bottomNav: {
    margin: 0,
  },
  //1116add
  errorCodeText: {
    color: 'red',
    height: 15,
  },
  joinGenderDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderDiv: {
    width: (width - 60) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderWidth: 1,
    //borderColor: '#EBEDF2',
    borderColor: '#c9ccd4',
    borderRadius: 10,
  },
  genderDivSelect: {
    borderColor: '#ff6f61',
  },
  genderText: {
    fontSize: 16,
    //color: '#EBEDF2',
    color: '#c9ccd4',
  },
  genderTextSelect: {
    fontWeight: '800',
    color: '#ff6f61',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  joinProfile: {
    flexDirection: 'column',
  },
  joinProfileImage: {},
});
