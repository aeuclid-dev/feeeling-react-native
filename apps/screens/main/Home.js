import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  Alert,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useIsFocused} from '@react-navigation/native';
import RNExitApp from 'react-native-exit-app';

import ScreenHeaderMain from '../../components/ScreenHeaderMain';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';
import HomeFilterModal from '../../components/HomeFilterModal';
import HomeList from '../../components/HomeList';

import {
  getUserInfo,
  getImageTestList,
  resetTest,
  getTestUserInfos,
  getTypeOfTest,
  setResult,
} from '../../store/actions/mainActions';
import {
  pushRenewal,
  showMessage,
  GetAppLabel,
} from '../../store/actions/commonActions';
import Laughface from '../../resource/icons/laugh-face.svg';
import {deleteMyStorage, getMyStorageItem} from '../../modules/localStorage';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const {height, width} = Dimensions.get('window');

export default function Home(props) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [welcomeText, setWelcomText] = useState('');
  const [listFilterVisible, setListFilterVisible] = useState(false);
  const mainState = useSelector((state) => state.main);

  console.log(props);

  //BackHandler.exitApp 는 정확하게 앱을 종료시키는게 아니라 강제로 백그라운드로 밀어버리는것 인듯.
  useEffect(() => {
    const endFeeeling = () => {
      Alert.alert('Exit feeeling', 'feeeling앱을 종료하시겠습니까?', [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '종료',
          onPress: () => RNExitApp.exitApp(),
        },
      ]);
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', endFeeeling);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', endFeeeling);
    };
  }, [props]);

  useEffect(() => {
    async function callInitialData() {
      if (isFocused) {
        console.log('focus home screen');
        await dispatch(resetTest()); //검사상태 초기화
        await dispatch(getUserInfo()); //아이디 테스트리스트,검사수,포인트 등 가져오기
        await dispatch(getTestUserInfos()); //아이디에 등록된 테스트할 유저목록
        await dispatch(getTypeOfTest()); //검사유형 가져오기...

        console.log('tabnavi home focus display style');
        props.navigation.setOptions({
          tabBarStyle: {
            display: 'flex',
          },
        });
      }
    }
    callInitialData();
  }, [isFocused]);

  // useEffect(() => {
  //   async function checkUserInfo() {
  //     const t = await getMyStorageItem('token');
  //     if(t !== null) {
  //       if(!mainState.user_id) {
  //         await deleteMyStorage('token');
  //         props.navigation.navigate("Login");
  //       }
  //     }
  //   };
  //   checkUserInfo();
  // }, [mainState.user_id]);

  useEffect(() => {
    async function callListImagaFromHomeList() {
      const t = await getMyStorageItem('token');
      console.log('home.js useEffect callListImageFromHomeList');
      // console.log(Object.keys(mainState.testList).length);
      // console.log(JSON.stringify(mainState.testList));
      if (
        Object.keys(mainState.testList).length < 1 &&
        JSON.stringify(mainState.testList) === JSON.stringify({}) &&
        t
      ) {
        console.log('Home.js useEffect testlist.length<1 && not {}.. ');
        console.log(Object.keys(mainState.testList).length);
        // console.log('get image test list..');

        await dispatch(getImageTestList(mainState.homeFilter, 'L'));
      }
    }
    callListImagaFromHomeList();
  }, [mainState.testList]);

  useEffect(() => {
    const bm = getMyStorageItem('pushMessage');
    const req = getMyStorageItem('test_req_no');
    const t = getMyStorageItem('token');
    console.log('call home is_homeLoaded useEffect!!');
    console.log(mainState.is_homeLoaded);
    console.log(bm);
    console.log(t);
    console.log(req);

    if (
      mainState.is_homeLoaded &&
      bm &&
      bm === 'b' &&
      t !== null &&
      t !== '' &&
      req &&
      req !== null &&
      req !== undefined
    ) {
      console.log('move to result');
      let data = {
        test_req_no: req,
      };
      dispatch(setResult(data))
        .then((res) => {
          let a = deleteMyStorage('backMessage');
          let b = deleteMyStorage('test_req_no');
          if (a !== false && b !== false) {
            props.navigation.navigate('TestResult');
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [mainState.is_homeLoaded]);

  useEffect(() => {
    dispatch(pushRenewal())
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
    dispatch(GetAppLabel('start_main')).then((res) => {
      if (res.data.result.status === '000') {
        setWelcomText(res.data.resultData);
      } else {
        showMessage('서버와 통신에 실패했습니다..');
      }
    });
  }, []);

  //Image.getSize(`data:image/png;base64,${img}`, (width, height) => {console.log(width, height)});
  return (
    <View style={styles.container}>
      <ScreenHeaderMain
        navigation={props.navigation}
        enableAlert={true}
        style={styles.homeHeaderDiv}
      />
      <View style={styles.homeProfileDiv}>
        <LinearGradient
          colors={['#ff6f61', '#ff9075']}
          style={styles.linearGradient}>
          {mainState.profile_photo_img !== null &&
          mainState.profile_photo_img !== '' ? (
            <View style={styles.profileImg}>
              <TouchableOpacity onPress={() => {
                  console.log(1);
                  props.navigation.navigate('XPsychologistList');
                }}>
                <Image
                  style={{width: 80, height: 80}}
                  source={{
                    uri: `data:image/png;base64,${mainState.profile_photo_img}`,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.profileImg}>
              <Laughface
                style={{width: 80, height: 80, backgroundColor: '#FFF'}}
              />
            </View>
          )}
          <View>
            {mainState.nickname !== '' && mainState.nickname !== null ? (
              <TextNB style={styles.profileUpper}>
                {mainState.nickname}님!
              </TextNB>
            ) : (
              <TextNB style={styles.profileUpper}>
                {mainState.user_id}님!
              </TextNB>
            )}
            <TextNB style={styles.profileUpper}>{welcomeText}</TextNB>
          </View>
          <View style={styles.profile}>
            <View style={styles.profileDivShort}>
              <TextNB
                style={[styles.profileBottomer, styles.profileBottomerNumber]}>
                {mainState.post}
              </TextNB>
              <TextNR
                style={[styles.profileBottomer, styles.profileBottomerText]}>
                검사중
              </TextNR>
            </View>
            <View style={styles.profileDivShort}>
              <TextNB
                style={[styles.profileBottomer, styles.profileBottomerNumber]}>
                {mainState.test}
              </TextNB>
              <TextNR
                style={[styles.profileBottomer, styles.profileBottomerText]}>
                검사완료
              </TextNR>
            </View>
            <View style={styles.profileDivLong}>
              {/* <TextNB
                style={[styles.profileBottomer, styles.profileBottomerNumber]}>
                {mainState.point}
              </TextNB>
              <TextNR
                style={[styles.profileBottomer, styles.profileBottomerText]}>
                포인트
              </TextNR> */}
            </View>
          </View>
        </LinearGradient>
      </View>
      <HomeList
        style={styles.homeContentsDiv}
        navigation={props.navigation}
        openFilter={setListFilterVisible}
      />
      <HomeFilterModal
        is_open={listFilterVisible}
        close={setListFilterVisible}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  homeHeaderDiv: {
    height: (height / 10) * 1,
  },
  homeProfileDiv: {
    marginBottom: 5,
    //height: (height / 10) * 3,
  },
  homeContentsDiv: {
    height: (height / 10) * 7,
  },
  linearGradient: {
    position: 'relative',
    width: width - 50,
    borderRadius: 14,
    marginVertical: 5,
    padding: 25,
  },
  profileImg: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: 80,
    borderWidth: 7,
    borderColor: '#FFF',
    top: -12,
    right: -12,
  },
  profileUpper: {
    color: '#FFF',
    fontSize: 16,
  },
  profile: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 30,
  },
  profileBottomer: {
    color: '#FFF',
  },
  profileBottomerNumber: {
    fontSize: 36,
  },
  profileBottomerText: {
    fontSize: 14,
    marginTop: 3,
  },
  profileDivShort: {
    flex: 1,
    alignItems: 'center',
  },
  profileDivLong: {
    flex: 2,
    alignItems: 'center',
  },
});
