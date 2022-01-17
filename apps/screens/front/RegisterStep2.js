import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import {useSelector} from 'react-redux';
import Modal from 'react-native-modal';
import BottomNav from '../../components/BottomNav';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ScreenHader from '../../components/ScreenHeader';
import RegisterTrems from './RegisterTrems';
import RegisterProvide from './RegisterProvide';

import IconCheckCircle from '../../resource/icons/check-circle.svg'; // vv in circle

const {height, width} = Dimensions.get('window');

export default function RegisterStep2(props) {
  const modalContent = {
    check1: <RegisterTrems />,
    check2: <RegisterProvide />,
  };
  const [is_disabled, setIsdisabled] = useState(true);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [visibleData, setVisibleData] = useState(null);

  const userState = useSelector((state) => state.user);

  const onPressCallModal = (w) => {
    setVisibleData(w);
    setDialogVisible(true);
  };

  const onPressAgree = (w) => {
    if (w === 'check1') {
      setCheck1(!check1);
    } else if (w === 'check2') {
      setCheck2(!check2);
    }
  };

  useEffect(() => {
    //console.log(check1+'/'+check2)
    if (check1 && check2) {
      setIsdisabled(false);
    } else {
      setIsdisabled(true);
    }
  }, [check1, check2]); //1

  return (
    <View style={styles.container}>
      <ScreenHader navigation={props.navigation} backBtn={false} />
      <View style={[styles.loginTitleDiv]}>
        <TextNEB style={[styles.loginTitle]}>서비스 이용동의</TextNEB>
      </View>
      <View>
        <View style={styles.serviceDiv}>
          <TouchableWithoutFeedback onPress={(e) => onPressAgree('check1')}>
            <View style={styles.serviceDivInner}>
              <IconCheckCircle
                style={{color: check1 ? '#ff6f61' : '#C0C5D2'}}
              />
              <TextNB style={styles.serviceDivInnerText}>
                서비스 이용약관
              </TextNB>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={(e) => onPressCallModal('check1')}>
            <View style={styles.serviceDivOuter}>
              <TextNR style={styles.serviceDivOuterText}>전문보기</TextNR>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.serviceDiv}>
          <TouchableWithoutFeedback onPress={(e) => onPressAgree('check2')}>
            <View style={styles.serviceDivInner}>
              <IconCheckCircle
                style={{color: check2 ? '#ff6f61' : '#C0C5D2'}}
              />
              <TextNB style={styles.serviceDivInnerText}>
                개인정보 수집 및 이용동의
              </TextNB>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={(e) => onPressCallModal('check2')}>
            <View style={styles.serviceDivOuter}>
              <TextNR style={styles.serviceDivOuterText}>전문보기</TextNR>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
      <View style={styles.bottomNav}>
        <BottomNav
          backText={'뒤로'}
          forwardText={'다음'}
          disabled={is_disabled}
          onClickBack={props.onStepDown}
          onClickForward={props.onStepUp}
        />
      </View>
      <Modal
        isVisible={dialogVisible}
        useNativeDriver={true}
        onModalHide={() => setVisibleData(null)}
        style={styles.serviceDialog}>
        <View style={{alignItems: 'center', flex: 1}}>
          <View style={[styles.promptJoinHeader]}>
            <ScrollView>
              <View>{modalContent[visibleData]}</View>
            </ScrollView>
          </View>
          <TouchableWithoutFeedback
            style={styles.promptJoinFooter}
            onPress={() => {
              setDialogVisible(false);
            }}>
            <View style={[styles.promptFooterBtn]}>
              <TextNB style={styles.promptFooterText}>닫기</TextNB>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginTitleDiv: {
    paddingLeft: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  loginTitle: {
    color: '#042c5c',
    fontSize: 32,
    marginBottom: 24,
  },
  serviceDiv: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  serviceDivInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  serviceDivInnerText: {
    fontSize: 18,
    marginLeft: 8,
    color: '#4a4a4a',
  },
  serviceDivOuter: {
    alignItems: 'center',
    borderBottomColor: '#024c8c',
    borderBottomWidth: 1,
  },
  serviceDivOuterText: {
    fontSize: 16,
    color: '#024c8c',
  },
  bottomNav: {
    justifyContent: 'flex-end',
    flex: 1,
    // position: 'absolute',
    // bottom: 10,
  },
  serviceDialog: {
    flex: 1,
    padding: 0,
    backgroundColor: '#FFF',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  promptJoinHeader: {
    flex: 9,
    padding: 10,
    overflow: 'scroll',
  },
  promptJoinFooter: {
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#3097ce',
  },
  promptFooterBtn: {
    justifyContent: 'center',
    marginBottom: 7,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: '#ff6f61',
  },
  promptFooterText: {
    fontSize: 16,
    color: '#FFF',
  },
});
