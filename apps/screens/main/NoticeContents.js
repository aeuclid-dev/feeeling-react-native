import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ScreenHeaderMain from '../../components/ScreenHeaderMain';
import {timeStapmToDate} from '../../modules/timesUtiles';

const {height, width} = Dimensions.get('window');
export default function NoticeContents({navigation, route}) {
  const commonstate = useSelector((state) => state.common);
  const renderData = commonstate.noticeList.filter(
    (data) => data.posting_no === route.params.contents,
  );

  if (renderData !== undefined && renderData.length > 0) {
    const contents = renderData[0];
    return (
      <View>
        <ScreenHeaderMain
          text={contents.posting_title}
          navigation={navigation}
          enableAlert={false}
        />
        <View style={styles.postingRow}>
          <View style={styles.postingCaption}>
            <TextNB>날짜</TextNB>
          </View>
          <View style={styles.postingContents}>
            <TextNR>{timeStapmToDate(contents.reg_time)}</TextNR>
          </View>
        </View>
        <View style={styles.postingRow}>
          <View style={styles.postingCaption}>
            <TextNB>내용</TextNB>
          </View>
          <View style={styles.postingContents}>
            <TextNR>{contents.posting_contents}</TextNR>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <TextNR>데이터가 없습니다.</TextNR>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  postingRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  postingCaption: {
    width: (width - 20) * 0.25,
  },
  postingContents: {
    width: (width - 20) * 0.75,
  },
});
