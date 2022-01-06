import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import ScreenHader from '../../components/ScreenHeader';
import {selectU14, selectO14} from '../../store/actions/userActions';
import {useDispatch} from 'react-redux';

const {height, width} = Dimensions.get('window');

export default function RegisterStep1(props) {
  const dispatch = useDispatch();
  const under14 = () => {
    dispatch(selectU14())
      .then((res) => {
        console.log('ok under 14');
        props.onStepUp();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const over14 = () => {
    dispatch(selectO14())
      .then((res) => {
        console.log('ok over 14');
        props.onStepUp();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <View style={styles.container}>
      <ScreenHader navigation={props.navigation} backBtn={true} />
      <View style={[styles.loginTitleDiv]}>
        <TextNEB style={[styles.loginTitle]}>회원가입</TextNEB>
      </View>
      <View style={styles.btnView}>
        <TouchableOpacity onPress={under14}>
          <View style={styles.btn}>
            <TextNEB style={styles.btnText}>만 14세 미만</TextNEB>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={over14}>
          <View style={styles.btn}>
            <TextNEB style={styles.btnText}>만 14세 이상</TextNEB>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.textView1}>
        <TextNB style={styles.text1}>꼭 확인하세요!</TextNB>
      </View>
      <View style={styles.textView2}>
        <TextNR style={styles.text2}>
          개인정보 보호법 제4장 제39조의3에 의거 만 14세 미만의 아동으로부터
          개인정보 수집, 이용, 제공 등의 동의를 받으려면 그 법정대리인의 동의를
          받아야 하고~ 어쩌구 저쩌구~
        </TextNR>
      </View>
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
  },
  loginTitle: {
    color: '#042c5c',
    fontSize: 32,
    marginBottom: 24,
  },
  btnView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: width / 2 - 25,
    borderRadius: 6,
    margin: 5,
    backgroundColor: '#ff6f61',
    paddingVertical: 17,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 16,
    letterSpacing: 0.4,
    color: '#fff',
    textAlign: 'center',
  },
  textView1: {
    marginVertical: 10,
    paddingTop: 10,
    paddingLeft: 20,
  },
  text1: {
    fontSize: 18,
    letterSpacing: 0.45,
    color: '#6d7278',
  },
  textView2: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  text2: {
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.4,
    color: '#6d7278',
  },
});
