import React, {useEffect} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {GetNoticeInitData} from '../../store/actions/commonActions';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ScreenHeaderMain from '../../components/ScreenHeaderMain';
import {timeStapmToDate} from '../../modules/timesUtiles';

const {height, width} = Dimensions.get('window');
export default function Notice({navigation}) {
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
    if (Object.keys(commonstate.noticeList).length < 1) {
      console.log('------loaded...notice screen------');
      dispatch(GetNoticeInitData(commonstate.noticeFilter, 'F'));
    }
  }, []);

  return (
    <View>
      <ScreenHeaderMain
        text={'공지사항'}
        navigation={navigation}
        enableAlert={false}
      />
      <ScrollView
        style={{marginVertical: 3, flexWrap: 'wrap', height: 600}}
        contentContainerStyle={{flexGrow: 1}}
        onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent) && !commonstate.is_noticeLoaded) {
            dispatch(GetNoticeInitData(commonstate.noticeFilter, 'L'));
          }
        }}
        scrollEventThrottle={50}>
        {Object.keys(commonstate.noticeList).length > 0
          ? commonstate.noticeList.map((data, index) => {
              return (
                <TouchableNativeFeedback
                  key={index}
                  onPress={() => {
                    navigation.navigate('NoticeContents', {
                      contents: data.posting_no,
                    });
                  }}>
                  <View style={styles.noticeRow}>
                    <View style={styles.noticeTitle}>
                      <TextNEB>{data.posting_title}</TextNEB>
                    </View>
                    <View style={styles.noticeDate}>
                      <TextNB>{timeStapmToDate(data.reg_time)}</TextNB>
                    </View>
                  </View>
                </TouchableNativeFeedback>
              );
            })
          : null}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  noticeRow: {
    flexDirection: 'row',
    //flex: 1,
    height: 60,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 1,
    paddingHorizontal: 8,
  },
  noticeTitle: {
    width: (width - 20) * 0.75,
    justifyContent: 'center',
  },
  noticeDate: {
    width: (width - 20) * 0.25,
    justifyContent: 'center',
  },
});
