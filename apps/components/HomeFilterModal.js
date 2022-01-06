import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Ionicons';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'; //필터에 입력하는게 들어갈지 안갈지 모름..
import {Formik} from 'formik'; //들어가면 ./testUserSet참고
import * as Yup from 'yup';

import {TextNR, TextNB, TextNEB} from './FontConst';

import {listFilter, getImageTestListForNew} from '../store/actions/mainActions';
import {showMessage} from '../store/actions/commonActions';

const {height, width} = Dimensions.get('window');
export default function HomeFilterModal(props) {
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const [modalDateType, setModalDateType] = useState('start');
  const [datePickerShow, setDatePickerShow] = useState(false);

  const getFilteringTestList = () => {
    if (mainState.homeFilter.start > 0 || mainState.homeFilter.end > 0) {
      if (mainState.homeFilter.start > mainState.homeFilter.end) {
        dispatch(showMessage('시작일자가 종료일자보다 클 수 없습니다.'));
        return false;
      }
    }

    dispatch(getImageTestListForNew(mainState.homeFilter, 'F'));
    props.close(false);
  };
  const dateFilteringInit = () => {
    dispatch(listFilter('start', 0));
    dispatch(listFilter('end', 0));
  };

  const onFocusDateInput = (type) => {
    Keyboard.dismiss();
    setModalDateType(type);
    setDatePickerShow(true);
  };

  const checkAndSetDate = (date, type) => {
    let settingDate = moment(date).valueOf();
    setDatePickerShow(false);
    // if (type === 'start') {
    //   let nowEndDate = moment().endOf('day').valueOf();
    //   if (mainState.homeFilter.end > 0) {
    //     if (mainState.homeFilter.end > settingDate) {
    //       dispatch(listFilter(type, settingDate));
    //       dispatch(listFilter('end', nowEndDate));
    //     } else {
    //       dispatch(showMessage('종료일자보다 클 수 없습니다.'));
    //     }
    //   } else {
    //     dispatch(listFilter(type, settingDate));
    //     dispatch(listFilter('end', nowEndDate));
    //   }
    // }

    // if (type === 'end') {
    //   let nowStartDate = moment(date).startOf('month').valueOf();
    //   if (moment(date).hours() === 0) {
    //     //초기값이 0일때 moment객체에서 받는값이 yyyy-mm-dd 까지만 받기때문에 23:59:59를 더해줌
    //     //처음에만 동작하고 이후에 동작안하는 조건문
    //     settingDate += 86399999;
    //   }
    //   if (mainState.homeFilter.start > 0) {
    //     if (mainState.homeFilter.start < settingDate) {
    //       //end날짜라서 23:59:59로 고정
    //       dispatch(listFilter(type, settingDate));
    //       dispatch(listFilter('start', nowStartDate));
    //     } else {
    //       dispatch(showMessage('시작일자보다 작을 수 없습니다.'));
    //     }
    //   } else {
    //     dispatch(listFilter(type, settingDate));
    //     dispatch(listFilter('start', nowStartDate));
    //   }
    // }
    if (type === 'end') {
      if (moment(date).hours() === 0) {
        //초기값이 0일때 moment객체에서 받는값이 yyyy-mm-dd 까지만 받기때문에 23:59:59를 더해줌
        //처음에만 동작하고 이후에 동작안하는 조건문
        settingDate += 86399999;
      }
    }
    dispatch(listFilter(type, settingDate));
  };

  return (
    <Modal
      isVisible={props.is_open}
      useNativeDriver={true}
      style={styles.homeListFilterContainer}
      onBackdropPress={() => {
        props.close(false);
      }}>
      <KeyboardAwareScrollView
        style={[styles.homeListFilterView]}
        contentContainerStyle={{flexGrow: 1}}
        enableAutomaticScroll={true}>
        <View style={styles.homeListFilterViewHeader}>
          <Icon
            name="close"
            size={40}
            color={'black'}
            style={styles.headerBackBtn}
            onPress={() => {
              props.close(false);
            }}
          />
        </View>
        <View style={styles.homeListFilterContent}>
          <TextNEB style={styles.homeListFilterRowTitle}>
            시작일자 - 종료일자
          </TextNEB>
          <View>
            <View style={styles.homeListFilterRow}>
              <DatePicker
                modal
                open={datePickerShow}
                mode={'date'}
                onConfirm={(date) => {
                  checkAndSetDate(date, modalDateType);
                }}
                onCancel={() => {
                  setDatePickerShow(false);
                }}
                date={
                  modalDateType === 'start'
                    ? moment(mainState.homeFilter.start).toDate()
                    : moment(mainState.homeFilter.end).toDate()
                }
                confirmText={'입력'}
                cancelText={'취소'}
              />
              <TouchableWithoutFeedback
                onPress={() => onFocusDateInput('start')}>
                <View style={styles.textPlaceholderView}>
                  <TextNR
                    style={[
                      styles.input,
                      {marginVertical: 3},
                      mainState.homeFilter.start > 0
                        ? styles.textView
                        : styles.textPlaceholder,
                    ]}>
                    {mainState.homeFilter.start > 0
                      ? moment(mainState.homeFilter.start).format('YYYY-MM-DD')
                      : '검색시작일자'}
                  </TextNR>
                </View>
              </TouchableWithoutFeedback>
              <TextNEB> ~ </TextNEB>
              <TouchableWithoutFeedback onPress={() => onFocusDateInput('end')}>
                <View style={styles.textPlaceholderView}>
                  <TextNR
                    style={[
                      styles.input,
                      {marginVertical: 3},
                      mainState.homeFilter.end > 0
                        ? styles.textView
                        : styles.textPlaceholder,
                    ]}>
                    {mainState.homeFilter.end > 0
                      ? moment(mainState.homeFilter.end).format('YYYY-MM-DD')
                      : '검색종료일자'}
                  </TextNR>
                </View>
              </TouchableWithoutFeedback>
            </View>
            <TouchableOpacity
              onPress={() => {
                dateFilteringInit();
              }}>
              <View style={styles.filterBtn}>
                <Text>날짜 초기화</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TextNEB style={styles.homeListFilterRowTitle}>종류</TextNEB>
          <View style={styles.homeListFilterRow}>
            <TouchableOpacity
              onPress={() => {
                dispatch(listFilter('status', null));
              }}>
              <View
                style={[
                  styles.homeListCircleBtn,
                  styles.statusBtn,
                  mainState.homeFilter.status === null
                    ? styles.homeListCircleBtnSelected
                    : '',
                ]}>
                <Text>모두</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(listFilter('status', 0));
              }}>
              <View
                style={[
                  styles.homeListCircleBtn,
                  styles.statusBtn,
                  mainState.homeFilter.status !== null &&
                  mainState.homeFilter.status === 0
                    ? styles.homeListCircleBtnSelected
                    : '',
                ]}>
                <Text>검사중</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                dispatch(listFilter('status', 1));
              }}>
              <View
                style={[
                  styles.homeListCircleBtn,
                  styles.statusBtn,
                  mainState.homeFilter.status !== null &&
                  mainState.homeFilter.status === 1
                    ? styles.homeListCircleBtnSelected
                    : '',
                ]}>
                <Text>검사완료</Text>
              </View>
            </TouchableOpacity>
          </View>
          <TextNEB style={styles.homeListFilterRowTitle}>닉네임선택</TextNEB>
          <View style={{alignItems: 'center'}}>
            <View style={{alignItems: 'flex-start', width: width / 2}}>
              {JSON.stringify(mainState.testeeUsers) !== JSON.stringify({}) ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(listFilter('nickname', ''));
                    }}>
                    <View
                      style={[
                        styles.homeListCircleBtn,
                        mainState.homeFilter.nickname === ''
                          ? styles.homeListCircleBtnSelected
                          : '',
                        ,
                        {
                          width: width / 2,
                        },
                      ]}>
                      <Text>모두</Text>
                    </View>
                  </TouchableOpacity>
                  {mainState.testeeUsers.list.map((item, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          dispatch(listFilter('nickname', item.nickname));
                        }}>
                        <View style={styles.homeListFilterNickNameRow}>
                          <Image
                            resizeMode="cover"
                            style={[
                              styles.nickNameImage,
                              mainState.homeFilter.nickname === item.nickname
                                ? styles.nickNameImageSelected
                                : '',
                            ]}
                            source={{
                              uri: `data:image/png;base64,${item.profile_image}`,
                            }}
                          />
                          <View
                            style={[
                              styles.homeListCircleBtn,
                              mainState.homeFilter.nickname === item.nickname
                                ? styles.homeListCircleBtnSelected
                                : '',
                              ,
                              styles.nicknameBtn,
                            ]}>
                            <Text>{item.nickname}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : null}
            </View>
          </View>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              getFilteringTestList();
            }}>
            <View style={styles.filterBtn}>
              <Text>검색하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  homeListFilterContainer: {
    flex: 1,
    margin: 30,
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  homeListFilterView: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  homeListFilterViewHeader: {
    height: 40,
    alignItems: 'flex-end',
  },
  homeListFilterContent: {
    flex: 9,
  },
  homeListFilterRowTitle: {
    fontSize: 16,
    marginVertical: 3,
  },
  homeListFilterRow: {
    flexDirection: 'row',
    marginVertical: 8,
    paddingVertical: 3,
    justifyContent: 'space-evenly',
  },
  homeListCircleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6f61',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeListCircleBtnSelected: {
    borderColor: '#FFF',
    backgroundColor: '#ff6f61',
    color: '#FFF',
  },
  filterBtn: {
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#ff6f61',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFF',
    marginHorizontal: 30,
  },
  homeListFilterNickNameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 4,
  },
  nicknameBtn: {
    marginVertical: 3,
    marginHorizontal: 15,
    width: width / 3,
  },
  nickNameImage: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },
  nickNameImageSelected: {
    borderWidth: 1,
    borderColor: '#ff6f61',
  },
  statusBtn: {
    width: width / 5,
  },
});
