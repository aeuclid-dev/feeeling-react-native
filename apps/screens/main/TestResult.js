import React from 'react';
import {View, Image, Dimensions, StyleSheet, ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ResultReportContents from '../../components/ResultReportContents';
import ResultReportEquipItemContents from '../../components/ResultReportEquipItemContents';

import IconReport from '../../resource/icons/report.svg'; //header(결과보고서 옆)
import Iconfacebook from '../../resource/icons/facebook.svg'; //하단 공유 3아이콘
import IconInsta from '../../resource/icons/instagram.svg'; //하단 공유 3아이콘
import IconKakao from '../../resource/icons/kakao-talk.svg'; //하단 공유 3아이콘

import IconThumb from '../../resource/icons/recommend.svg'; //따봉
import Gauge from '../../components/Gauge';

const {height, width} = Dimensions.get('window');

export default function TestResult({navigation}) {
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  const resultItemArr = [
    mainState.resultData.psy_item_img1,
    mainState.resultData.psy_item_img2,
    mainState.resultData.psy_item_img3,
    mainState.resultData.psy_item_img4,
  ];
  console.log('testResultScreen');
  const testResult = mainState.resultData;

  return (
    <View style={styles.container}>
      <View style={styles.resultHeaderDiv}>
        <View style={{height: '100%', position: 'relative'}}>
          <View
            style={{
              backgroundColor: '#ff6f61',
              height: '100%',
              width: '100%',
              opacity: 0.1,
            }}
          />
          <View
            style={{
              width: 120,
              height: 97,
              position: 'absolute',
              right: 20,
              bottom: 0,
            }}>
            <IconReport style={{width: '100%', height: '100%'}} />
          </View>
          <View
            style={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}>
            <Icon
              name="ios-arrow-back"
              size={30}
              color={'black'}
              onPress={() => {
                navigation.navigate('MainPage');
              }}
            />
            <TextNEB style={{color: '#4a4a4a', fontSize: 32, margin: 10}}>
              결과보고서
            </TextNEB>
          </View>
        </View>
      </View>
      {/* head end */}
      <ScrollView style={[styles.resultContents, {width: width}]}>
        <ResultReportContents
          resultTitle={testResult.psy_note_sub_title}
          resultTextResult={testResult.psy_note_title}
          resultImage={testResult.psy_char_img}
          resultItems={resultItemArr}
        />
        <View style={styles.resultContentsSections}>
          <TextNEB style={styles.sectionTitle}>보유</TextNEB>
          <TextNEB style={styles.sectionTitle}>아이템은</TextNEB>
          <View style={styles.sectionItemEquid}>
            {resultItemArr.map((data, index) => {
              return (
                <ResultReportEquipItemContents
                  key={index}
                  icon={data}
                  contentsTitle={testResult['psy_item_name' + (index + 1)]}
                  contentsText={testResult['psy_item_comment' + (index + 1)]}
                  contentsFeature={testResult['psy_item_feature' + (index + 1)]}
                />
              );
            })}
          </View>
          {/* <View style={styles.resultTitleContentsView}>
            <TextNR style={{fontSize: 16, color: '#4a4a4a'}}>
              대부분의 사람들이 스트레스를 받는 일에도 당신은 대수롭지 않게 넘길
              거예요. 화가 나는 상황에서도 능숙하고 태연하게 받아칠 수 있죠.
              그래서인지 주변에서 속을 모르겠다, 알 수 없다 라는 말을 들을 수도
              있어요.
            </TextNR>
          </View> */}
        </View>
        <View style={styles.resultContentsSections}>
          <TextNEB style={styles.sectionTitle}>나는 전반적으로</TextNEB>
          <View style={styles.sectionStatus}>
            <TextNEB style={styles.sectionStatusTitle}>
              {testResult.psy_note_main_status}
            </TextNEB>
            <TextNR>{testResult.psy_note_detail_status}</TextNR>
          </View>
        </View>
        <View style={styles.resultContentsSections}>
          <TextNEB style={styles.sectionTitle}>나의 특성은</TextNEB>
          <View style={styles.sectionItemDesc}>
            <View style={{flexDirection: 'row'}}>
              <TextNR>{'\u2022'}</TextNR>
              <TextNR style={{flex: 1, paddingLeft: 5}}>
                {testResult.psy_item_desc1}
              </TextNR>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextNR>{'\u2022'}</TextNR>
              <TextNR style={{flex: 1, paddingLeft: 5}}>
                {testResult.psy_item_desc2}
              </TextNR>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextNR>{'\u2022'}</TextNR>
              <TextNR style={{flex: 1, paddingLeft: 5}}>
                {testResult.psy_item_desc3}
              </TextNR>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TextNR>{'\u2022'}</TextNR>
              <TextNR style={{flex: 1, paddingLeft: 5}}>
                {testResult.psy_item_desc4}
              </TextNR>
            </View>
          </View>
        </View>
        <View style={styles.resultContentsSections}>
          <TextNEB style={styles.sectionTitle}>
            {testResult.test_name}지수는 : {testResult.test_score}점
          </TextNEB>
          <View style={styles.gaugeView}>
            <TextNEB
              style={{fontSize: 15, color: '#4a4a4a', paddingVertical: 10}}>
              {testResult.stat_class1}
            </TextNEB>
            <Gauge
              type={testResult.stat_class_name1}
              typeValue={testResult.stat_percentage1 <= 50 ? '낮' : '높'}
              percent={testResult.stat_percentage1}
              radius={70}
            />
          </View>
          <View style={styles.gaugeView}>
            <TextNEB
              style={{fontSize: 15, color: '#4a4a4a', paddingVertical: 10}}>
              {testResult.stat_class2}
            </TextNEB>
            <Gauge
              type={testResult.stat_class_name2}
              typeValue={testResult.stat_percentage2 < 50 ? '낮' : '높'}
              percent={testResult.stat_percentage2}
              radius={70}
            />
          </View>
          <View style={styles.gaugeView}>
            <TextNEB
              style={{fontSize: 15, color: '#4a4a4a', paddingVertical: 10}}>
              {testResult.stat_class3}
            </TextNEB>
            <Gauge
              type={testResult.stat_class_name3}
              typeValue={testResult.stat_percentage3 < 50 ? '낮' : '높'}
              percent={testResult.stat_percentage3}
              radius={70}
            />
          </View>
        </View>
        <View style={styles.resultContentsSections}>
          <TextNEB style={styles.sectionTitle}>당신에게 주는 팁은</TextNEB>
          <View style={styles.sectionTips}>
            <TextNR>{testResult.psy_note_detail_solution}</TextNR>
          </View>
        </View>
        {/* <View style={[styles.flexDirRow, styles.resultContentsSectionsFooter]}>
          <IconKakao style={styles.iconStyle} />
          <IconInsta style={styles.iconStyle} />
          <Iconfacebook style={styles.iconStyle} />
        </View> */}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  resultHeaderDiv: {
    width: width,
    height: (height / 10) * 2,
  },
  resultContents: {
    width: width,
    height: (height / 10) * 8,
  },
  flexDirRow: {
    flexDirection: 'row',
  },
  resultTitleContentsView: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    backgroundColor: 'rgba(255, 111, 97, 0.1)',
  },
  resultContentsSections: {
    borderTopWidth: 1,
    borderTopColor: '#d8d8d8',
    padding: 20,
  },

  sectionTitle: {
    fontSize: 24,
    color: '#4a4a4a',
    letterSpacing: 0.5,
  },
  gaugeRow: {
    justifyContent: 'center',
  },
  gaugeView: {
    padding: 20,
    alignItems: 'center',
  },
  gaugeContent: {
    borderWidth: 1,
    borderColor: 'rgba(255, 111, 97, 0.5)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'flex-end',
  },
  gaugeContentIcon: {
    position: 'absolute',
    top: -20,
    left: 0,
  },
  resultContentsSectionsFooter: {
    width: width - 40,
    marginHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#d8d8d8',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyle: {
    width: 15,
    height: 15,
    margin: 5,
  },

  sectionStatus: {
    backgroundColor: '#FCEFEE',
    padding: 20,
    marginVertical: 5,
  },
  sectionStatusTitle: {
    fontSize: 20,
    color: '#4a4a4a',
    letterSpacing: 0.5,
    marginVertical: 8,
  },
  sectionItemEquid: {
    backgroundColor: '#E7F1FF',
    padding: 20,
    marginVertical: 5,
  },

  sectionItemDesc: {
    backgroundColor: '#FFF9F1',
    padding: 20,
    marginVertical: 5,
  },
  sectionTips: {
    backgroundColor: '#F8FFF1',
    padding: 20,
    marginVertical: 5,
  },
});
