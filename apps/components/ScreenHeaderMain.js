import React from 'react';
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextNR, TextNB, TextNEB} from './FontConst';
import CI_LOGO_COLOR from '../resource/images/feeeling_ci_coral.png'; // -> in circle btn
import ICON_ALERT from '../resource/icons/alert_icon.svg'; //icon
const {height, width} = Dimensions.get('window');

export default function ScreenHeaderMain(props) {
  const alremDotSize = 10;
  return (
    <View style={[styles.screenHader]}>
      {props.text ? (
        <TextNEB style={{fontSize: 32}}>{props.text}</TextNEB>
      ) : (
        <Image source={CI_LOGO_COLOR} style={styles.headerLogo} />
      )}
      {props.enableAlert ? (
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('Alarm');
          }}>
          <View style={{position: 'relative'}}>
            <ICON_ALERT />
            {props.getNotice ? (
              <View
                style={{
                  position: 'absolute',
                  top: 3,
                  right: -3,
                  width: alremDotSize,
                  height: alremDotSize,
                  borderRadius: alremDotSize,
                  backgroundColor: 'red',
                }}
              />
            ) : null}
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <Icon
          name="close"
          size={40}
          color={'black'}
          style={styles.headerBackBtn}
          onPress={() => {
            props.location === undefined
              ? props.navigation.goBack()
              : props.navigation.navigate(props.location);
          }}
        />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  screenHader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerBackBtn: {
    marginRight: 3,
    marginLeft: 20,
    marginBottom: -3,
    color: '#000',
  },
  headerLogo: {
    marginRight: 10,
    marginTop: 5,
  },
  emptyView: {
    width: 10,
  },
});
