import React, {useEffect} from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  BackHandler,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';

import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import IconCancel from '../../resource/icons/cancel_button_coral.svg'; // kakao
import IconHouse from '../../resource/icons/h_menu_button';
import IconTree from '../../resource/icons/t_menu_button';
import IconPerson from '../../resource/icons/p_menu_button';
import IconPITR from '../../resource/icons/pitr_menu_button';

const {height, width} = Dimensions.get('window');

export default function TestMain(props) {
  /**
   *  pitr: 빗속의사람
   *  house: 집 그림
   *  tree: 나무 그림
   *  man: 남자 그림
   *  woman: 여자 그림
   */
  function SetIconComponents(props) {
    switch (props.type) {
      case 'PITR':
        return <IconPITR />;
      case 'HOUSE':
        return <IconHouse />;
      case 'TREE':
        return <IconTree />;
      case 'MAN':
        return <IconPerson />;
      case 'WOMAN':
        return <IconPerson />;
      default:
        return <IconPITR />;
    }
  }

  const navigationReset = async () => {
    //stack navi reset.
    await props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'MainPage'}],
      }),
    );
    await props.navigation.navigate('MainPage');
  };

  const _goBack = () => {
    props.navigation.navigate('MainPage');
  };

  useEffect(() => {
    const stepBack = () => {
      props.navigation.navigate('MainPage');
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', stepBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', stepBack);
    };
  }, [props]);

  console.log('test types');
  console.log(props.activeTest);

  return (
    <View>
      <ImageBackground
        source={require('../../resource/images/splash_new1.png')}
        style={styles.bgimg}
        resizeMode="cover">
        <View style={styles.testBtnView}>
          <View style={styles.titleView}>
            <View>
              <Image
                style={{width: 80, height: 80}}
                source={require('../../resource/images/test_img.png')}
              />
            </View>
            <TextNB style={styles.mainText}>그림심리검사를</TextNB>
            <TextNB style={styles.mainText}>시작합니다.</TextNB>
          </View>
          <View>
            {props.activeTest.map((renderData, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    props.onSelectTest(
                      renderData.test_id,
                      renderData.test_name,
                    );
                  }}>
                  <View style={[styles.flexdirRow, styles.testBtns]}>
                    <View style={styles.testBtnIcon}>
                      <SetIconComponents type={renderData.test_name} />
                    </View>
                    <TextNB style={styles.btnText}>
                      {renderData.test_desc}을 그렸어요!
                    </TextNB>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.cancleBtnView}>
          <TouchableOpacity
            style={[styles.flexdirRow, styles.cancleBtn]}
            onPress={navigationReset}>
            <TextNEB style={styles.cancleBtnText}>검사취소</TextNEB>
            <IconCancel />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  bgimg: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  titleView: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  mainText: {
    fontSize: 22,
    color: '#4a4a4a',
    letterSpacing: 0.55,
    textAlign: 'center',
  },
  flexdirRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cancleBtnView: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  cancleBtnText: {
    paddingBottom: 18,
    fontSize: 15,
    color: '#FFF',
  },
  cancleBtn: {
    alignItems: 'center',
  },
  testBtnView: {
    position: 'absolute',
    width: width * 0.7,
    top: 50,
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#808988',
        shadowOpacity: 0.5,
        shadowOffset: {width: 0, height: -3},
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  testBtns: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    opacity: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 7,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  testBtnIcon: {
    width: 37,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    fontSize: 16,
    color: '#4a4a4a',
    letterSpacing: 0.4,
    marginLeft: 15,
  },
  btnRowText: {
    margin: 5,
  },
});
