import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {useSelector, useDispatch} from 'react-redux';
import {timeStapmToDate} from '../modules/timesUtiles';

import {TextNR, TextNB, TextNEB} from './FontConst';
import IconFilter from '../resource/icons/filter_icon.svg';
import TestProgress from '../resource/icons/test_progress.svg';
import TestCompleted from '../resource/icons/test_completed.svg';
import {setResult} from '../store/actions/mainActions';
import {getImageTestListForNew} from '../store/actions/mainActions';
import {showMessage} from '../store/actions/commonActions';

const {height, width} = Dimensions.get('window');

export default function HomeList(props) {
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const standby = '의뢰하신 검사를 확인 중 입니다.';
  const reject =
    '의뢰하신 검사의 이미지가 적합하지않아 심리검사를 수행하지 못했습니다.';

  let filterColor =
    mainState.homeFilter.nickname !== '' ||
    mainState.homeFilter.start > 0 ||
    mainState.homeFilter.end > 0
      ? 'red'
      : '#4A4A4A';

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 3;
    const is_scrollEnd =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    return is_scrollEnd;
  };

  const listClickhandler = (data) => {
    switch (data.status) {
      case 0:
        dispatch(showMessage(standby)); //first insert
        break;
      case 1:
        dispatch(showMessage(standby)); //admin reading
        break;
      case 2:
        selectTestResult(data); //admin confirm
        break;
      case 9:
        dispatch(showMessage(reject)); //admin reject
        break;
    }
  };

  const selectTestResult = (data) => {
    dispatch(setResult(data))
      .then((res) => {
        props.navigation.navigate('TestResult');
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // console.log('home list');
  // console.log(typeof mainState.testList.list);
  // console.log(Array.isArray(mainState.testList.list));
  let listHeaderText = '';
  return (
    <ScrollView
      style={{marginVertical: 3, flexWrap: 'wrap'}}
      contentContainerStyle={{flexGrow: 1}}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent) && !mainState.is_listLoaded) {
          dispatch(getImageTestListForNew(mainState.homeFilter, 'L'));
        }
      }}
      scrollEventThrottle={100}>
      {mainState.post > 0 ? (
        Object.keys(mainState.testList).length > 0 &&
        JSON.stringify(mainState.testList) !== JSON.stringify({}) ? (
          mainState.testList.list.map((renderData, index) => {
            if (renderData.YD !== listHeaderText) {
              listHeaderText = renderData.YD;
              return (
                <View key={renderData.test_req_no}>
                  {index === 0 ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: 30,
                        height: 30,
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => {
                          props.openFilter(true);
                        }}>
                        <View>
                          <IconFilter
                            color={filterColor}
                            style={{width: 30, height: 30}}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                  ) : null}
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 5,
                      width: width - 50,
                    }}>
                    <View style={{marginVertical: 3}}>
                      <TextNEB>{renderData.YD}</TextNEB>
                    </View>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      listClickhandler(renderData);
                    }}>
                    <View
                      style={[
                        styles.listCard,
                        {
                          backgroundColor:
                            renderData.status === 1 ? '#FFF' : '#FFF',
                        },
                      ]}>
                      <View style={styles.listCardHeader}>
                        <View>
                          <Text>
                            {/* {renderData.status === 2
                              ? timeStapmToDate(renderData.result_time)
                              : timeStapmToDate(renderData.test_time)} */}
                            {timeStapmToDate(renderData.test_time)}
                          </Text>
                        </View>
                        <View>
                          {renderData.status < 2 ? (
                            <TestProgress />
                          ) : (
                            <TestCompleted />
                          )}
                        </View>
                      </View>
                      <View style={styles.cardImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.cardImage}
                          source={{
                            uri: `data:image/png;base64,${renderData.image}`,
                          }}
                        />
                      </View>
                      <View style={styles.cardBottomText}>
                        <Text>{renderData.image_comment}</Text>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              );
            } else {
              return (
                <TouchableWithoutFeedback
                  key={renderData.test_req_no}
                  onPress={() => {
                    listClickhandler(renderData);
                  }}>
                  <View
                    style={[
                      styles.listCard,
                      {
                        backgroundColor:
                          renderData.status === 1 ? '#FFF' : '#FFF',
                      },
                    ]}>
                    <>
                      <View style={styles.listCardHeader}>
                        <View>
                          <Text>
                            {/* {renderData.status === 2
                              ? timeStapmToDate(renderData.result_time)
                              : timeStapmToDate(renderData.test_time)} */}
                            {timeStapmToDate(renderData.test_time)}
                          </Text>
                        </View>
                        <View>
                          {renderData.status < 2 ? (
                            <TestProgress />
                          ) : (
                            <TestCompleted />
                          )}
                        </View>
                      </View>
                      <View style={styles.cardImage}>
                        <Image
                          resizeMode="contain"
                          style={styles.cardImage}
                          source={{
                            uri: `data:image/png;base64,${renderData.image}`,
                          }}
                        />
                      </View>
                      <View style={styles.cardBottomText}>
                        <Text>{renderData.image_comment}</Text>
                      </View>
                    </>
                  </View>
                </TouchableWithoutFeedback>
              );
            }
          })
        ) : (
          <>
            <View
              style={{
                paddingVertical: 5,
                width: width - 50,
              }}>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 30,
                  height: 30,
                }}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    props.openFilter(true);
                  }}>
                  <View>
                    <IconFilter
                      color={filterColor}
                      style={{width: 30, height: 30}}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 5,
                width: width - 50,
              }}>
              <Text>표시할 내용이 없습니다.</Text>
              {console.log(typeof mainState.testList)}
              {console.log(mainState.testList)}
            </View>
          </>
        )
      ) : (
        <View style={[styles.homeContentsDiv, styles.emptyHomeView]}>
          <View>
            <TextNR style={styles.emptyHomeLabel}>작성한 검사가 없어요!</TextNR>
            <TextNR style={styles.emptyHomeLabel}>검사하러 가볼까요?</TextNR>
          </View>
          <View>
            <Icon name="arrow-down-sharp" size={40} color={'black'} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  listCard: {
    width: width - 50,
    borderRadius: 14,
    padding: 5,
    marginVertical: 5,
    backgroundColor: '#FFF',
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  listCardHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  cardImage: {
    height: 150,
  },
  cardBottomText: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  emptyHomeView: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  emptyHomeLabel: {
    fontSize: 20,
  },
});
