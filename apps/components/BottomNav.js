import React from 'react';
import {View, Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextNR, TextNB, TextNEB} from './FontConst';

import IconBackArrow from '../resource/icons/arrow.svg'; // <- btn
import IconFowradArrow from '../resource/icons/arrow_button_white.svg'; // -> in circle btn
import IconCheckInCircle from '../resource/icons/check_button_white.svg'; // v in circle btn

const {height, width} = Dimensions.get('window');

export default function BottomNav(props) {
  const backBtnText = props.backText;
  const forwardBtnText = props.forwardText;
  const is_finish = props.is_finish ? true : false;
  //onClickBack onClickForward
  return (
    <View style={styles.BottomDiv}>
      <View style={[styles.BottomBtnDiv]}>
        <TouchableOpacity
          style={[styles.BottomBtnGroup, styles.BottomBtnCancle]}
          onPress={props.onClickBack}>
          <IconBackArrow />
          <TextNEB style={[styles.BottomBtnText]}>{backBtnText}</TextNEB>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.BottomBtnGroup, styles.BottomBtnNext]}
          disabled={props.disabled}
          onPress={props.onClickForward}>
          <TextNEB
            style={[
              styles.BottomBtnText,
              {color: props.disabled ? '#dadee1' : '#FFF'},
            ]}>
            {forwardBtnText}
          </TextNEB>
          {is_finish ? (
            <IconCheckInCircle
              style={{
                marginTop: 12,
                color: props.disabled ? '#dadee1' : '#FFF',
              }}
              width={50}
              height={50}
            />
          ) : (
            <IconFowradArrow
              style={{
                marginTop: 12,
                color: props.disabled ? '#dadee1' : '#FFF',
              }}
              width={50}
              height={50}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BottomDiv: {
    height: (height / 10) * 1,
    justifyContent: 'flex-end',
  },
  BottomBtnDiv: {
    backgroundColor: '#ff6f61',
    width: width - 30,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
  },
  BottomBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  BottomBtnText: {
    color: '#FFF',
    fontSize: 14,
    marginRight: 3,
    marginLeft: 3,
  },
  BottomBtnCancle: {
    justifyContent: 'flex-start',
    marginLeft: 20,
  },
  BottomBtnNext: {
    justifyContent: 'flex-end',
    marginRight: 10,
  },
});
