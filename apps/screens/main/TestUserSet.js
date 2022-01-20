import React, {useState, useEffect} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  Keyboard,
  TextInput,
  ActivityIndicator,
  TouchableWithoutFeedback,
  BackHandler,
  Image,
} from 'react-native';

import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {Formik} from 'formik';
import * as Yup from 'yup';

import {
  getTestUserInfos,
  setTesteeUser,
  resetTesteeUser,
  setNewUser,
} from '../../store/actions/mainActions';
import RadioButton from '../../components/RadioButton';
import SurveyHeader from '../../components/survey/SurveyHeader';
import BottomNav from '../../components/BottomNav';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import CameraForUser from '../../components/CameraForUser';

const validationSchema = Yup.object().shape({
  nickname: Yup.string()
    .required('별명 입력은 필수 입니다.')
    .min(2, '최소 두글자이상 입력해주세요!'),
  birthday: Yup.date().required('생년월일을 입력해주세요'),
  gender: Yup.string().required('성별을 선택해주세요.'),
});
const {height, width} = Dimensions.get('window');

export default function TestUserSet(props) {
  //step 1
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const [is_disabled, setIsdisabled] = useState(true);
  const [datePickerShow, setDatePickerShow] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [cameraDialogVisible, setCameraDialogVisible] = useState(false);
  const [uploadFile, setUploadFile] = useState({});

  const userStepBack = () => {
    props.onStepDown();
  };

  const userStepFoward = () => {
    props.onStepUp();
  };

  const addNewTestee = () => {
    setDialogVisible(true);
  };

  const onFocusDateInput = () => {
    Keyboard.dismiss();
    setDatePickerShow(true);
  };

  const onSelectDate = (date, formikProps) => {
    setDatePickerShow(false);
    formikProps.setFieldValue('birthday', moment(date).format('YYYY-MM-DD'));
  };

  useEffect(() => {
    async function userSetFocus() {
      if (isFocused) {
        console.log('userSet focus');
        await dispatch(getTestUserInfos())
          .then((res) => {
            setIsdisabled(true);
          })
          .catch((err) => console.log(err));
      }
    }
    userSetFocus();
  }, [isFocused]);

  useEffect(() => {
    const stepBack = () => {
      props.onStepDown();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', stepBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', stepBack);
    };
  }, [props]);

  return (
    <View>
      <View style={styles.surveyTitleDiv}>
        <SurveyHeader iconType={'F'} text={'1.누가 그린 그림인가요?'} />
      </View>
      <View style={styles.surveyContentsDiv}>
        <ScrollView>
          {mainState.testeeUsers.list.map((item, index) => {
            return (
              <View
                key={item.testee_no}
                style={[
                  styles.radiostyle,
                  item.selected ? styles.seletedradio : '',
                ]}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setIsdisabled(false);
                    dispatch(setTesteeUser(item.testee_no));
                  }}
                  style={styles.radiorowstyle}>
                  <View style={styles.radioViewstyle}>
                    <RadioButton
                      selected={item.selected}
                      style={{marginRight: 10, marginLeft: 10}}
                    />
                    <TextNR
                      style={[
                        styles.textstyle,
                        item.selected ? styles.seletedtext : '',
                      ]}>
                      {item.nickname}{' '}
                      {mainState.testeeUsers.list.testee_no ===
                      mainState.user_no
                        ? '본인'
                        : null}
                    </TextNR>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
        </ScrollView>
        {mainState.testeeUsers.list.length < 5 ? (
          <TouchableWithoutFeedback
            onPress={() => {
              addNewTestee();
              setIsdisabled(false);
              //dispatch(resetTesteeUser(mainState.testeeUsers));
            }}>
            <View style={styles.newUserAddBtnView}>
              <TextNR style={styles.newUserAddBtnText}>새로운 사람</TextNR>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </View>
      <View style={styles.surveyFooterDiv}>
        <BottomNav
          backText={'뒤로'}
          forwardText={'그림촬영하러가기'}
          disabled={is_disabled}
          onClickBack={userStepBack}
          onClickForward={userStepFoward}
        />
      </View>
      <Modal
        isVisible={dialogVisible}
        useNativeDriver={true}
        style={{margin: 0}}>
        <KeyboardAwareScrollView
          style={[styles.modalContainer]}
          contentContainerStyle={{flexGrow: 1}}
          enableAutomaticScroll={true}>
          <View>
            <Icon
              name="close"
              size={40}
              color={'black'}
              style={styles.headerBackBtn}
              onPress={() => {
                setDialogVisible(false);
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
              let new_user_no;
              if (
                Object.keys(uploadFile).length > 0 &&
                JSON.stringify(uploadFile) !== JSON.stringify({})
              ) {
                values.file = uploadFile;
              }
              values.type = 1;
              dispatch(setNewUser(values))
                .then(async (response) => {
                  if (response.res.result.status === '000') {
                    new_user_no = response.res.testee_no;
                    await dispatch(getTestUserInfos()).then(async (res2) => {
                      await setUploadFile({});
                      await setIsdisabled(false);
                      await dispatch(setTesteeUser(new_user_no));
                      await setDialogVisible(false);
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
                      setCameraDialogVisible(true);
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
        isVisible={cameraDialogVisible}
        useNativeDriver={true}
        style={{margin: 0}}>
        <CameraForUser
          close={setCameraDialogVisible}
          setUploadFile={setUploadFile}
        />
      </Modal>
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
  surveyFooterDiv: {
    width: width,
    height: (height / 10) * 1,
  },
  radiostyle: {
    flexWrap: 'wrap',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEDF2',
    width: width - 30,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  radiorowstyle: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  radioViewstyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textstyle: {
    width: width - 30,
    color: '#9b9b9b',
    fontSize: 14,
  },
  seletedradio: {
    borderColor: '#ff6f61',
  },
  seletedtext: {
    color: '#4a4a4a',
    fontWeight: '800',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
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

  newUserAddBtnView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width - 30,
    borderRadius: 10,
    backgroundColor: '#ff6f61',
    padding: 15,
    minHeight: 50,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  newUserAddBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '200',
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
});
