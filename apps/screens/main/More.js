import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Keyboard,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DatePicker from 'react-native-date-picker';
import Modal from 'react-native-modal';
import {Formik} from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import {
  Logout,
  setUpdateUser,
  setDeleteUser,
} from '../../store/actions/userActions';
import {getImage} from '../../store/actions/commonActions';
import {getTestUserInfos, setNewUser} from '../../store/actions/mainActions';

import ScreenHeaderMain from '../../components/ScreenHeaderMain';
import {deleteMyStorage} from '../../modules/localStorage';
import CameraForUser from '../../components/CameraForUser';
import {TextNB, TextNEB, TextNR} from '../../components/FontConst';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign'; //picture

import IconVersion from '../../resource/icons/more_version.svg';
import IconTesteeInfo from '../../resource/icons/more_testeeinfo.svg';
import IconInfo from '../../resource/icons/more_info.svg';
import IconNotice from '../../resource/icons/more_notice.svg';

const validationSchemaNS = Yup.object().shape({
  user_id: Yup.string()
    .required('이메일 입력은 필수 입니다.')
    .email('이메일 형식이 아닙니다.'),
  pwd: Yup.string().min(6, '최소 6자이상 입력해주세요!'),
  pwdConfirm: Yup.string().oneOf(
    [Yup.ref('pwd')],
    '비밀번호가 동일하지않습니다!',
  ),
  birthday: Yup.date().required('생년월일을 입력해주세요'),
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
  nickname: Yup.string()
    .required('별명 입력은 필수 입니다.')
    .min(2, '최소 두글자이상 입력해주세요!')
    .max(20, '최대글자수를 초과 하였습니다!'),
  gender: Yup.string().required('성별을 선택해주세요.'),
});

const validationSchema = Yup.object().shape({
  nickname: Yup.string()
    .required('별명 입력은 필수 입니다.')
    .min(2, '최소 두글자이상 입력해주세요!'),
  birthday: Yup.date().required('생년월일을 입력해주세요'),
  gender: Yup.string().required('성별을 선택해주세요.'),
});
const {height, width} = Dimensions.get('window');

export default function More({navigation}) {
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const [testeeInfoTemp, setTesteeInfoTemp] = useState({
    list: mainState.testeeUsers.list,
  });

  const [userModalVisible, setUserModalVisible] = useState(false);
  const [testeeModalVisible, setTesteeModalVisible] = useState(false);
  const [testeeAddModalVisible, setTesteeAddModalVisible] = useState(false);
  const [cameraModalVisible, setCameraModalVisible] = useState(false);

  const [uploadFile, setUploadFile] = useState({}); // for new testee
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(null);
  const [getformikProps, setformikProps] = useState({});

  const [changeTesteeNo, setChangeTesteeNo] = useState(0); //setforTestee_no

  const deleteTesteeUser = (sendObj) => {
    console.log(sendObj);
    console.log('call setDeleteUser');
    dispatch(setDeleteUser(sendObj))
      .then(async (response) => {
        if (response.res.result.status === '000') {
          await dispatch(getTestUserInfos()).then(async (res2) => {
            await setUploadFile({});
            await setInitialTestee();
            await setTesteeModalVisible(false);
          });
        }
      })
      .catch((e) => {
        console.log('error');
        console.log(e);
      });
  };

  const showConfirmDialog = (nick, sendObj) => {
    return Alert.alert(
      '정말 삭제하시겠습니까?',
      `정말 그린이 '${nick}' 정보를 삭제하시겠습니까?`,
      [
        {
          text: 'Yes',
          onPress: () => {
            console.log('click yes');
            console.log(sendObj);
            deleteTesteeUser(sendObj);
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const setInitialTestee = () => {
    console.log('call initial function');
    let rerenderobj = {
      list: mainState.testeeUsers.list,
    };
    setTesteeInfoTemp(rerenderobj);
  };

  const openCameraFromInfoModal = (num) => {
    setChangeTesteeNo(num);
    setCameraModalVisible(true);
  };

  const closeCameraFromInfoModal = (file, type, type_no) => {
    //파일 셋팅처리작업 여기서 ㄱㄱㄱㄱ
    console.log(type);
    console.log(type_no);
    console.log(file);
    if (type === 0 || type === 1) {
      let newTestList = Object.assign({}, testeeInfoTemp);
      let testListArr = [];
      testeeInfoTemp.list.map((data) => {
        let newArrObj = Object.assign({}, data);
        if (newArrObj.testee_no === type_no) {
          console.log('get same testee_no data');
          console.log(newArrObj);
          newArrObj.profile_photo_temp = file;
          newArrObj.is_change = true;
        }
        testListArr.push(newArrObj);
      });
      newTestList.list = testListArr;
      setTesteeInfoTemp(newTestList);
      setUploadFile(file);
    } else if (type === 2) {
      setUploadFile(file);
    } else {
      console.log('type is over 2??');
    }

    setChangeTesteeNo(0);
    setCameraModalVisible(false);
  };

  const onFocusDateInput = (dateValue, FomikProps) => {
    Keyboard.dismiss();
    setDatePickerShow(true);
    setDatePickerValue(dateValue);
    setformikProps(FomikProps);
  };

  const onSelectDate = (date, formikProps) => {
    setDatePickerShow(false);
    formikProps.setFieldValue('birthday', moment(date).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    console.log('changed mainState.testeeUsers.list');
    let rerenderobj = {
      list: mainState.testeeUsers.list,
    };
    setTesteeInfoTemp(rerenderobj);
  }, [mainState.testeeUsers]);

  // console.log('---------------testeeUsers TempInfomations...!!!------------');
  // testeeInfoTemp.list.map((data) => {
  //   console.log(data.testee_no);
  //   console.log(data.nickname);
  //   console.log(
  //     data.hasOwnProperty('profile_photo_temp')
  //       ? data.profile_photo_temp
  //       : 'profile_photo_temp is empty',
  //   );
  //   console.log(
  //     data.hasOwnProperty('is_change') ? data.is_change : 'is_change is empty',
  //   );
  // });
  // console.log('--------------------------------------------------------');

  useFocusEffect(
    React.useCallback(() => {
      console.log('focus more Page-');
      return () => {
        //clean up page state.... for push click page move
        setUserModalVisible(false);
        setTesteeModalVisible(false);
        setTesteeAddModalVisible(false);
        setCameraModalVisible(false);
        setUploadFile({});
        setDatePickerShow(false);
        setDatePickerValue(null);
        setformikProps({});
        setChangeTesteeNo(0);
        console.log('unfocused more page.. cleanup page state...!');
      };
    }, []),
  );

  return (
    <>
      <View style={styles.moreContainer}>
        <View>
          <ScreenHeaderMain
            text={'더보기'}
            navigation={navigation}
            enableAlert={true}
          />
          <View>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Notice')}>
              <View style={styles.moreBtnRow}>
                <View style={[styles.moreBtnIcon, styles.moreBtnWrapper]}>
                  <IconNotice color={'red'} />
                </View>
                <TextNR>공지사항</TextNR>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setUserModalVisible(true)}>
              <View style={styles.moreBtnRow}>
                <View style={[styles.moreBtnIcon, styles.moreBtnWrapper]}>
                  <IconInfo />
                </View>
                <TextNR>개인/보안</TextNR>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setTesteeModalVisible(true)}>
              <View style={styles.moreBtnRow}>
                <View style={[styles.moreBtnIcon, styles.moreBtnWrapper]}>
                  <IconTesteeInfo />
                </View>
                <TextNR>그린이</TextNR>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => {
                setUserModalVisible(false);
                setTesteeModalVisible(false);
                setTesteeAddModalVisible(false);
                setCameraModalVisible(false);
                setUploadFile({});
                setDatePickerShow(false);
                setDatePickerValue(null);
                setformikProps({});
                setChangeTesteeNo(0);
                dispatch(Logout(navigation, CommonActions)).catch((e) => {
                  console.log('err > ' + e);
                });
              }}>
              <View style={styles.moreBtnRow}>
                <View style={[styles.moreBtnIcon, styles.moreBtnWrapper]}>
                  <AntIcon name="logout" size={28} color={'black'} />
                </View>
                <TextNR>로그아웃</TextNR>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        <View style={styles.moreVersionRow}>
          <IconVersion style={styles.moreBtnIcon} />
          <View>
            <TextNR>버전 정보: 최신 버전</TextNR>
            <TextNR>2020. 11. 01 v1.0101</TextNR>
          </View>
        </View>
      </View>
      <DatePicker
        modal
        open={datePickerShow}
        mode={'date'}
        date={
          datePickerValue !== null
            ? moment(datePickerValue).toDate()
            : new Date()
        }
        onConfirm={(date) => {
          onSelectDate(date, getformikProps);
        }}
        onCancel={() => {
          setDatePickerShow(false);
        }}
        confirmText={'입력'}
        cancelText={'취소'}
      />
      <Modal
        isVisible={userModalVisible}
        useNativeDriver={true}
        style={styles.modalContainer}>
        {Object.keys(testeeInfoTemp).length > 0 &&
        JSON.stringify(testeeInfoTemp) !== JSON.stringify({}) ? (
          testeeInfoTemp.list
            .filter((testee) => testee.type === 0)
            .map((data, index) => {
              return (
                <KeyboardAwareScrollView
                  key={index}
                  style={[styles.modalContainer]}
                  contentContainerStyle={{flexGrow: 1}}
                  enableAutomaticScroll={true}>
                  <Formik
                    initialValues={
                      mainState.user_type > 0
                        ? {
                            user_no: data.user_no,
                            testee_no: data.testee_no,
                            user_id: mainState.user_id,
                            nickname: data.nickname,
                            birthday: data.birthday,
                            gender: data.gender.toString(),
                          }
                        : {
                            user_no: data.user_no,
                            testee_no: data.testee_no,
                            user_id: mainState.user_id,
                            pwd: '',
                            pwdConfirm: '',
                            nickname: data.nickname,
                            birthday: data.birthday,
                            gender: data.gender.toString(),
                          }
                    }
                    validateOnChange={true}
                    validateOnBlur={false}
                    onSubmit={(values, actions) => {
                      console.log('click Submit');
                      if (
                        data.hasOwnProperty('profile_photo_temp') &&
                        Object.keys(data.profile_photo_temp).length > 0 &&
                        JSON.stringify(data.profile_photo_temp) !==
                          JSON.stringify({})
                      ) {
                        values.file = data.profile_photo_temp;
                      }
                      values.type = 0;
                      dispatch(setUpdateUser(values))
                        .then(async (response) => {
                          if (response.res.result.status === '000') {
                            await dispatch(getTestUserInfos()).then(
                              async (res2) => {
                                await setUploadFile({});
                              },
                            );
                          }
                        })
                        .catch((e) => {});

                      setTimeout(() => {
                        actions.setSubmitting(false);
                      }, 1000);
                    }}
                    validationSchema={
                      mainState.user_type > 0
                        ? validationSchemaWS
                        : validationSchemaNS
                    }>
                    {(formikProps) => (
                      <View style={[styles.modalDiv, styles.personalDataModal]}>
                        <View>
                          <View style={styles.userInfoDiv}>
                            <View style={styles.userInfoCaption}>
                              <TextNB>사용자</TextNB>
                            </View>
                            <View style={styles.userInfoDataDiv}>
                              <View style={[styles.userInfoDataTextDiv]}>
                                <TouchableWithoutFeedback
                                  onPress={() => {
                                    openCameraFromInfoModal(data.testee_no);
                                  }}>
                                  {/* <View style={{position: 'relative'}}> */}
                                  {data.profile_photo !== '' ? (
                                    <Image
                                      style={styles.profileImageStyle}
                                      resizeMode="cover"
                                      source={{
                                        uri:
                                          data.profile_photo_temp &&
                                          data.is_change
                                            ? data.profile_photo_temp.uri
                                            : `data:image/png;base64,${data.profile_image}`,
                                      }}
                                    />
                                  ) : (
                                    <View
                                      style={[
                                        styles.profileImageStyle,
                                        styles.profileImageNone,
                                      ]}>
                                      <TextNR>터치해서</TextNR>
                                      <TextNR>이미지</TextNR>
                                      <TextNR>등록하기</TextNR>
                                    </View>
                                  )}
                                  {/* <Icon
                                      style={{
                                        position: 'absolute',
                                        top: -3,
                                        right: 3,
                                      }}
                                      name="reload-circle-outline"
                                      size={20}
                                      color={'black'}
                                    /> */}
                                  {/* </View> */}
                                </TouchableWithoutFeedback>
                                <View style={styles.testeeWithImageNickname}>
                                  <TextInput
                                    style={[styles.text, styles.input]}
                                    onChangeText={formikProps.handleChange(
                                      'nickname',
                                    )}
                                    selectTextOnFocus={true}
                                    multiline={false}
                                    returnKeyType={'done'}
                                    value={formikProps.values.nickname}
                                  />
                                  <TextNR style={styles.errorCodeText}>
                                    {formikProps.errors.nickname}
                                  </TextNR>
                                </View>
                              </View>
                            </View>
                          </View>
                          <View style={styles.userInfoDiv}>
                            <View style={styles.userInfoCaption}>
                              <TextNB>아이디</TextNB>
                            </View>
                            <View style={styles.userInfoDataDiv}>
                              <View style={styles.userInfoDataTextDiv}>
                                <TextInput
                                  style={[
                                    styles.text,
                                    styles.input,
                                    styles.userInfoDataText,
                                  ]}
                                  onChangeText={formikProps.handleChange(
                                    'user_id',
                                  )}
                                  selectTextOnFocus={true}
                                  multiline={false}
                                  returnKeyType={'done'}
                                  value={formikProps.values.user_id}
                                />
                                <TextNR style={styles.errorCodeText}>
                                  {formikProps.errors.user_id}
                                </TextNR>
                              </View>
                            </View>
                          </View>
                          {mainState.user_type > 0 ? null : (
                            <>
                              <View style={styles.userInfoDiv}>
                                <View style={styles.userInfoCaption}>
                                  <TextNB>비밀번호</TextNB>
                                </View>
                                <View style={styles.userInfoDataDiv}>
                                  <View style={styles.userInfoDataTextDiv}>
                                    <TextInput
                                      style={[
                                        styles.text,
                                        styles.input,
                                        styles.userInfoDataText,
                                      ]}
                                      secureTextEntry={true}
                                      onChangeText={formikProps.handleChange(
                                        'pwd',
                                      )}
                                      selectTextOnFocus={true}
                                      multiline={false}
                                      returnKeyType={'done'}
                                      value={formikProps.values.pwd}
                                    />
                                    <TextNR style={styles.errorCodeText}>
                                      {formikProps.errors.pwd}
                                    </TextNR>
                                  </View>
                                </View>
                              </View>
                              <View style={styles.userInfoDiv}>
                                <View style={styles.userInfoCaption}>
                                  <TextNB>비밀번호</TextNB>
                                  <TextNB>재입력</TextNB>
                                </View>
                                <View style={styles.userInfoDataDiv}>
                                  <View style={styles.userInfoDataTextDiv}>
                                    <TextInput
                                      style={[
                                        styles.text,
                                        styles.input,
                                        styles.userInfoDataText,
                                      ]}
                                      secureTextEntry={true}
                                      onChangeText={formikProps.handleChange(
                                        'pwdConfirm',
                                      )}
                                      selectTextOnFocus={true}
                                      multiline={false}
                                      returnKeyType={'done'}
                                      value={formikProps.values.pwdConfirm}
                                    />
                                    <TextNR style={styles.errorCodeText}>
                                      {formikProps.errors.pwdConfirm}
                                    </TextNR>
                                  </View>
                                </View>
                              </View>
                            </>
                          )}
                          <View style={styles.userInfoDiv}>
                            <View style={styles.userInfoCaption}>
                              <TextNB>생년월일</TextNB>
                            </View>
                            <View style={styles.userInfoDataDiv}>
                              <View style={styles.userInfoDataTextDiv}>
                                <TouchableWithoutFeedback
                                  onPress={() => {
                                    onFocusDateInput(
                                      formikProps.values.birthday,
                                      formikProps,
                                    );
                                  }}>
                                  <View
                                    style={[
                                      styles.userInfoDataText,
                                      styles.textPlaceholderView,
                                    ]}>
                                    <TextNR
                                      style={[
                                        styles.input,
                                        formikProps.values.birthday
                                          ? styles.textView
                                          : styles.textPlaceholder,
                                      ]}>
                                      {formikProps.values.birthday
                                        ? moment(
                                            formikProps.values.birthday,
                                          ).format('YYYY-MM-DD')
                                        : '생년월일을 입력해주세요!'}
                                    </TextNR>
                                  </View>
                                </TouchableWithoutFeedback>
                                <TextNR style={styles.errorCodeText}>
                                  {formikProps.errors.birthday}
                                </TextNR>
                              </View>
                            </View>
                          </View>
                          <View style={styles.userInfoDiv}>
                            <View style={styles.userInfoCaption}>
                              <TextNB>성별</TextNB>
                            </View>
                            <View style={styles.userInfoDataDiv}>
                              <View style={styles.userInfoDataTextDiv}>
                                <View style={[styles.userInfoGenderDivDiv]}>
                                  <TouchableWithoutFeedback
                                    onPress={() => {
                                      formikProps.setFieldValue('gender', '1');
                                    }}>
                                    <View
                                      style={[
                                        styles.userInfoGenderDiv,
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
                                        styles.userInfoGenderDiv,
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
                            </View>
                          </View>
                        </View>
                        <View>
                          {formikProps.isSubmitting ? (
                            <ActivityIndicator />
                          ) : (
                            <View style={styles.testeeChangeModalFooterBtnDiv}>
                              <TouchableWithoutFeedback
                                onPress={formikProps.handleSubmit}>
                                <View
                                  style={[
                                    styles.testeeChangeModalFooterBtn,
                                    // formikProps.isValid
                                    //   ? null
                                    //   : styles.testeeChangeModalFooterBtnDisable,
                                  ]}>
                                  <TextNEB style={styles.promptFooterText}>
                                    저장
                                  </TextNEB>
                                </View>
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  setInitialTestee(); //mainState값으로 초기화
                                  setUserModalVisible(false);
                                }}>
                                <View style={styles.testeeChangeModalFooterBtn}>
                                  <TextNEB style={styles.promptFooterText}>
                                    닫기
                                  </TextNEB>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  </Formik>
                </KeyboardAwareScrollView>
              );
            })
        ) : (
          <View></View>
        )}
      </Modal>
      <Modal
        isVisible={testeeModalVisible}
        useNativeDriver={true}
        style={styles.modalContainer}>
        <View style={{width: width, paddingVertical: 5, alignItems: 'center'}}>
          <TextNB
            style={{fontSize: 20, borderBottomWidth: 1, borderColor: '#000'}}>
            그린이
          </TextNB>
        </View>
        <View style={styles.testeeTopBtnDiv}>
          <TouchableWithoutFeedback
            onPress={() => {
              setTesteeAddModalVisible(true);
            }}
            disabled={
              testeeInfoTemp.list === undefined ||
              testeeInfoTemp.list.length > 4
            }>
            <View
              style={[
                styles.testeeChangeModalFooterBtn,
                {
                  borderWidth: 1,
                  borderColor:
                    testeeInfoTemp.list === undefined ||
                    testeeInfoTemp.list.length > 4
                      ? 'grey'
                      : 'red',
                  backgroundColor:
                    testeeInfoTemp.list === undefined ||
                    testeeInfoTemp.list.length > 4
                      ? 'grey'
                      : '#ff6f61',
                },
              ]}>
              <TextNEB style={[styles.promptFooterText]}>
                새로운 사람 추가
              </TextNEB>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              //변경값같은거 초기화하는거 필요함.
              setInitialTestee();
              setTesteeModalVisible(false);
            }}>
            <View style={styles.testeeChangeModalFooterBtn}>
              <TextNEB style={styles.promptFooterText}>닫기</TextNEB>
            </View>
          </TouchableWithoutFeedback>
        </View>

        <KeyboardAwareScrollView
          style={[styles.testeeModalContainer]}
          contentContainerStyle={{flexGrow: 1}}
          enableAutomaticScroll={true}>
          {Object.keys(testeeInfoTemp).length > 0 &&
          JSON.stringify(testeeInfoTemp) !== JSON.stringify({})
            ? testeeInfoTemp.list
                .filter((testee) => testee.type === 1)
                .map((data, index) => {
                  return (
                    <Formik
                      key={index}
                      initialValues={{
                        user_no: data.user_no,
                        testee_no: data.testee_no,
                        user_id: mainState.user_id,
                        nickname: data.nickname,
                        birthday: data.birthday,
                        gender: data.gender.toString(),
                      }}
                      validateOnChange={true}
                      validateOnBlur={false}
                      onSubmit={(values, actions) => {
                        console.log('click Submit');
                        if (
                          data.hasOwnProperty('profile_photo_temp') &&
                          Object.keys(data.profile_photo_temp).length > 0 &&
                          JSON.stringify(data.profile_photo_temp) !==
                            JSON.stringify({})
                        ) {
                          values.file = data.profile_photo_temp;
                        }
                        values.type = 1;
                        dispatch(setUpdateUser(values))
                          .then(async (response) => {
                            if (response.res.result.status === '000') {
                              new_user_no = response.res.testee_no;
                              await dispatch(getTestUserInfos()).then(
                                async (res2) => {
                                  await setUploadFile({});
                                  //useState값이 변경되지않는경우 수동으로 setInitialTestee();
                                  await setTesteeAddModalVisible(false);
                                },
                              );
                            }
                          })
                          .catch((e) => {});

                        setTimeout(() => {
                          actions.setSubmitting(false);
                        }, 1000);
                      }}
                      validationSchema={validationSchemaWS}>
                      {(formikProps) => (
                        <View style={styles.testeeInfoDiv}>
                          <View style={styles.userInfoDiv}>
                            <View style={[styles.testeeWithImageDiv]}>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  openCameraFromInfoModal(data.testee_no);
                                }}>
                                {/* <View style={{position: 'relative'}}> */}
                                {data.profile_photo !== '' ||
                                (data.profile_photo_temp && data.is_change) ? (
                                  <Image
                                    style={styles.testeeProfileImageStyle}
                                    resizeMode="cover"
                                    source={{
                                      uri:
                                        data.profile_photo_temp &&
                                        data.is_change
                                          ? data.profile_photo_temp.uri
                                          : `data:image/png;base64,${data.profile_image}`,
                                    }}
                                  />
                                ) : (
                                  <View
                                    style={[
                                      styles.profileImageStyle,
                                      styles.profileImageNone,
                                    ]}>
                                    <TextNR>터치해서</TextNR>
                                    <TextNR>이미지</TextNR>
                                    <TextNR>등록하기</TextNR>
                                  </View>
                                )}

                                {/* <Icon
                                  style={{
                                    position: 'absolute',
                                    top: -3,
                                    right: 3,
                                  }}
                                  name="reload-circle-outline"
                                  size={20}
                                  color={'black'}
                                /> */}
                                {/* </View> */}
                              </TouchableWithoutFeedback>
                            </View>
                            <View style={{flexDirection: 'column'}}>
                              <View style={styles.testeeWithImageNickname}>
                                <TextInput
                                  style={[styles.text, styles.input]}
                                  onChangeText={formikProps.handleChange(
                                    'nickname',
                                  )}
                                  selectTextOnFocus={true}
                                  multiline={false}
                                  returnKeyType={'done'}
                                  value={formikProps.values.nickname}
                                />
                                <TextNR style={styles.errorCodeText}>
                                  {formikProps.errors.nickname}
                                </TextNR>
                              </View>
                              <View style={styles.userInfoDataTextDiv}>
                                <TouchableWithoutFeedback
                                  onPress={() => {
                                    onFocusDateInput(
                                      formikProps.values.birthday,
                                      formikProps,
                                    );
                                  }}>
                                  <View
                                    style={[
                                      styles.userInfoDataText,
                                      styles.textPlaceholderView,
                                    ]}>
                                    <TextNR
                                      style={[
                                        styles.input,
                                        formikProps.values.birthday
                                          ? styles.textView
                                          : styles.textPlaceholder,
                                      ]}>
                                      {formikProps.values.birthday
                                        ? moment(
                                            formikProps.values.birthday,
                                          ).format('YYYY-MM-DD')
                                        : '생년월일을 입력해주세요!'}
                                    </TextNR>
                                  </View>
                                </TouchableWithoutFeedback>
                                <TextNR style={styles.errorCodeText}>
                                  {formikProps.errors.birthday}
                                </TextNR>
                              </View>
                              <View style={styles.userInfoDataTextDiv}>
                                <View style={[styles.userInfoGenderDivDiv]}>
                                  <TouchableWithoutFeedback
                                    onPress={() => {
                                      formikProps.setFieldValue('gender', '1');
                                    }}>
                                    <View
                                      style={[
                                        styles.userInfoGenderDiv,
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
                                        styles.userInfoGenderDiv,
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
                            </View>
                          </View>

                          {formikProps.isSubmitting ? (
                            <ActivityIndicator />
                          ) : (
                            <View style={styles.testeeChangeModalFooterBtnDiv}>
                              <TouchableWithoutFeedback
                                onPress={formikProps.handleSubmit}>
                                <View
                                  style={[
                                    styles.testeeChangeModalFooterBtn,
                                    // formikProps.isValid
                                    //   ? null
                                    //   : styles.testeeChangeModalFooterBtnDisable,
                                  ]}>
                                  <TextNEB style={styles.promptFooterText}>
                                    저장
                                  </TextNEB>
                                </View>
                              </TouchableWithoutFeedback>
                              <TouchableWithoutFeedback
                                onPress={() => {
                                  let sendObj = {
                                    user_no: data.user_no,
                                    testee_no: data.testee_no,
                                  };
                                  showConfirmDialog(data.nickname, sendObj);
                                }}>
                                <View style={styles.testeeChangeModalFooterBtn}>
                                  <TextNEB style={styles.promptFooterText}>
                                    삭제
                                  </TextNEB>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          )}
                        </View>
                      )}
                    </Formik>
                  );
                })
            : null}
        </KeyboardAwareScrollView>
      </Modal>
      <Modal
        isVisible={testeeAddModalVisible}
        useNativeDriver={true}
        style={styles.modalContainer}>
        <KeyboardAwareScrollView
          style={[styles.modalContainer]}
          contentContainerStyle={{flexGrow: 1}}
          enableAutomaticScroll={true}>
          <View style={{justifyContent: 'center', alignItems: 'flex-end'}}>
            <Icon
              name="close"
              size={40}
              color={'black'}
              style={styles.headerBackBtn}
              onPress={() => {
                setTesteeAddModalVisible(false);
              }}
            />
          </View>
          <View style={[styles.modalTitleDiv]}>
            <TextNEB style={[styles.modalTitle]}>새로운 사람 추가</TextNEB>
          </View>
          <Formik
            initialValues={{
              nickname: '',
            }}
            validateOnChange={true}
            validateOnBlur={false}
            onSubmit={(values, actions) => {
              if (
                Object.keys(uploadFile).length > 0 &&
                JSON.stringify(uploadFile) !== JSON.stringify({})
              ) {
                values.file = uploadFile;
              }
              values.type = 1;
              console.log('more - add new testee send Data');
              console.log(values);
              dispatch(setNewUser(values))
                .then(async (response) => {
                  if (response.res.result.status === '000') {
                    await dispatch(getTestUserInfos()).then(async (res2) => {
                      await setUploadFile({});
                      await setInitialTestee();
                      await setTesteeAddModalVisible(false);
                    });
                  }
                })
                .catch((e) => {});

              setTimeout(() => {
                actions.setSubmitting(false);
              }, 1000);
            }}
            validationSchema={validationSchema}>
            {(formikProps) => (
              <View style={[styles.modalDiv]}>
                <View style={[styles.modalTextDiv]}>
                  <TextInput
                    style={[styles.text, styles.input]}
                    onChangeText={formikProps.handleChange('nickname')}
                    selectTextOnFocus={true}
                    placeholder="이름 혹은 별명을 입력해주세요!"
                    placeholderTextColor="#98A3B5"
                    multiline={false}
                    returnKeyType={'done'}
                  />
                  <TextNR style={styles.errorCodeText}>
                    {formikProps.errors.nickname}
                  </TextNR>
                </View>
                <View style={[styles.modalTextDiv]}>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      onFocusDateInput(
                        formikProps.values.birthday,
                        formikProps,
                      );
                    }}>
                    <View style={styles.textPlaceholderView}>
                      <TextNR
                        style={[
                          styles.input,
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
                <View style={[styles.modalTextDiv]}>
                  <View style={[styles.modalGenderDiv]}>
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
                <View style={[styles.modalTextDiv, styles.modalProfile]}>
                  {Object.keys(uploadFile).length > 0 &&
                  JSON.stringify(uploadFile) !== JSON.stringify({}) ? (
                    <View style={styles.modalProfileImage}>
                      <Image
                        resizeMode="contain"
                        style={{width: 150, height: 150}}
                        source={{uri: uploadFile.uri}}
                      />
                    </View>
                  ) : null}
                  <TouchableWithoutFeedback
                    onPress={() => {
                      setCameraModalVisible(true);
                    }}>
                    <View style={[styles.promptJoinFooter]}>
                      <TextNEB style={[styles.promptFooterText]}>
                        프로필 사진 업로드
                      </TextNEB>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                {formikProps.isSubmitting ? (
                  <ActivityIndicator />
                ) : (
                  <TouchableWithoutFeedback onPress={formikProps.handleSubmit}>
                    <View style={styles.promptJoinFooter}>
                      <TextNEB style={styles.promptFooterText}>추가</TextNEB>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </Modal>

      <Modal
        isVisible={cameraModalVisible}
        useNativeDriver={true}
        style={styles.modalContainer}>
        <CameraForUser
          close={closeCameraFromInfoModal}
          type={
            userModalVisible
              ? 0
              : testeeModalVisible
              ? 1
              : testeeAddModalVisible
              ? 2
              : 99
          }
          type_no={changeTesteeNo}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  moreContainer: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 35,
  },
  moreBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moreVersionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreBtnWrapper: {
    alignItems: 'center',
    width: 34,
  },
  moreBtnIcon: {
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: 0,
  },
  personalDataModal: {
    paddingTop: 15,
    justifyContent: 'space-between',
  },
  personalDataContens: {
    backgroundColor: 'blue',
  },
  personalDataBottomBtnDiv: {
    backgroundColor: 'green',
  },
  modalTitleDiv: {
    flex: 1,
    paddingLeft: 20,
    paddingTop: 10,
  },
  modalTitle: {
    color: '#042c5c',
    fontSize: 32,
    marginBottom: 18,
  },
  modalDiv: {
    flex: 25,
    alignItems: 'center',
  },
  modalTextDiv: {
    width: width - 50,
    paddingVertical: 3,
    marginVertical: 3,
    justifyContent: 'center',
  },
  modalGenderDiv: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  genderDiv: {
    width: (width - 60) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#EBEDF2',
    borderRadius: 10,
  },
  genderDivSelect: {
    borderColor: '#ff6f61',
  },
  genderText: {
    fontSize: 16,
    color: '#EBEDF2',
  },
  genderTextSelect: {
    fontWeight: '800',
    color: '#ff6f61',
  },
  headerBackBtn: {
    marginRight: 3,
    marginLeft: 20,
    marginBottom: -3,
    color: '#000',
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
  promptJoinFooter: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 60,
    margin: 3,
    borderRadius: 10,
    backgroundColor: '#ff6f61',
    flexDirection: 'row',
  },
  promptFooterText: {
    fontSize: 16,
    color: '#FFF',
  },
  modalProfile: {
    flexDirection: 'column',
  },
  modalProfileImage: {},
  errorCodeText: {
    marginVertical: 2,
    color: 'red',
    height: 15,
  },

  profileImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 15,
  },
  profileImageNone: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  userInfoDiv: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  userInfoCaption: {
    width: (width - 20) * 0.2,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  userInfoDataDiv: {
    width: (width - 20) * 0.8,
  },
  userInfoDataTextDiv: {
    width: (width - 20) * 0.7,
    flexDirection: 'row',
    paddingVertical: 3,
    marginVertical: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  userInfoDataText: {
    flex: 1,
  },

  userInfoGenderDivDiv: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  userInfoGenderDiv: {
    width: ((width - 20) * 0.7 - 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#EBEDF2',
    borderRadius: 10,
  },

  testeeModalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    margin: 0,
    padding: 0,
  },
  testeeInfoDiv: {
    paddingVertical: 5,
  },

  testeeProfileImageStyle: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  testeeWithImageDiv: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 3,
    marginVertical: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  testeeWithImageNickname: {
    flex: 1,
    marginLeft: 5,
  },
  testeeChangeModalFooterBtnDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  testeeChangeModalFooterBtn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 140) / 2,
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#ff6f61',
    flexDirection: 'row',
  },
  testeeChangeModalFooterBtnDisable: {
    backgroundColor: 'gray',
  },
  testeeTopBtnDiv: {flexDirection: 'row', justifyContent: 'center'},
});
