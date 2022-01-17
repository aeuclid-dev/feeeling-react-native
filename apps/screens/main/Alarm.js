import React, {useEffect} from 'react';
import {View, ScrollView, Dimensions, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {GetAlarmInitData} from '../../store/actions/commonActions';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ScreenHeaderMain from '../../components/ScreenHeaderMain';
import {timeStapmToDate, dateToFullStr} from '../../modules/timesUtiles';
import {useIsFocused} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');
export default function Alarm({navigation}) {
  const isFocused = useIsFocused();
  const commonstate = useSelector((state) => state.common);
  const dispatch = useDispatch();

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 3;
    const is_scrollEnd =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    return is_scrollEnd;
  };

  useEffect(() => {
    async function callInitialData() {
      if (isFocused) {
        dispatch(GetAlarmInitData(commonstate.alarmFilter, 'F'));
      }
    }
    callInitialData();
  }, [isFocused]);

  return (
    <View>
      <ScreenHeaderMain
        text={'알림'}
        navigation={navigation}
        enableAlert={false}
      />
      <ScrollView
        style={{marginVertical: 3, flexWrap: 'wrap', height: 600}}
        contentContainerStyle={{flexGrow: 1}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent) && !commonstate.is_alarmLoaded) {
            dispatch(GetAlarmInitData(commonstate.alarmFilter, 'L'));
          }
        }}
        scrollEventThrottle={50}>
        {commonstate.alarmList.length > 0 ? (
          commonstate.alarmList.map((data, index) => {
            if (data.notice_status === 'requested') {
              return (
                <View key={index} style={styles.alarmRow}>
                  <TextNR>
                    {dateToFullStr(timeStapmToDate(data.reg_time))}{' '}
                    {data.testRequest.testeeinfo.nickname}님을 위한{' '}
                    {data.testRequest.linktestname.test_desc} 그림심리검사를
                    요청하였습니다.{' '}
                  </TextNR>
                </View>
              );
            } else if (data.notice_status === 'rejected') {
              return (
                <View key={index} style={styles.alarmRow}>
                  <TextNR>
                    {dateToFullStr(timeStapmToDate(data.reg_time))}{' '}
                    {data.testRequest.testeeinfo.nickname}님을 위해 요청하신{' '}
                    {data.testRequest.linktestname.test_desc} 그림심리검사는
                    업로드한 그림이 당사 기준 해당 심리검사에 적합하지않아
                    심리검사를 수행하지 못함을 알려드립니다.
                  </TextNR>
                </View>
              );
            } else if (data.notice_status === 'completed') {
              return (
                <View key={index} style={styles.alarmRow}>
                  <TextNR>
                    {dateToFullStr(timeStapmToDate(data.reg_time))}에 요청하신
                    {data.testRequest.testeeinfo.nickname}님을 위한{' '}
                    {data.testRequest.linktestname.test_desc} 그림심리검사
                    결과가 도착하였습니다!
                  </TextNR>
                </View>
              );
            } else {
              return <View key={index} style={styles.noticeRow}></View>;
            }
          })
        ) : (
          <View>
            <TextNEB>등록된 알림이 없습니다.</TextNEB>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  alarmRow: {
    flexDirection: 'row',
    height: 80,
    borderColor: 'gray',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  alarmText: {},
});
