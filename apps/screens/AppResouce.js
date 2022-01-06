import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
// import {CommonActions} from '@react-navigation/native';
// import {setResouce} from '../store/actions/commonActions';
const {height, width} = Dimensions.get('window');

export default function AppResouce({navigation}) {
  const dispatch = useDispatch();
  const common = useSelector((state) => state.common);

  // const navigationReset = async () => {
  //   //stack navi reset.
  //   await navigation.dispatch(
  //     CommonActions.reset({
  //       index: 1,
  //       routes: [{name: 'Splash'}],
  //     }),
  //   );
  //   await navigation.navigate('Splash');
  // };

  //1027 임시로 front강제이동
  useEffect(() => {
    // console.log('appresouce useeffect');
    navigation.navigate('Front');
    //dispatch(setResouce());
  }, []);

  //1027 TODO 첫설치시 1> false가 나온다음 동작멈춤. 이거 확인하고 수정해야함.
  // useEffect(() => {
  //   // navigation.dispatch(
  //   //   CommonActions.reset({
  //   //     index: 1,
  //   //     routes: [{name: 'Splash'}],
  //   //   }),
  //   // );
  //   console.log('1>', common.resouceLoad);
  //   if (common.splashImage !== undefined && common.resouceLoad === true) {
  //     console.log('appresouce useeffect common splashImage');
  //     console.log('>>', common.splashImage);
  //     navigation.navigate('Front');
  //   }
  // }, [common.resouceLoad]);

  return (
    <View style={{width: width, height: height}}>
      <Text>loading...</Text>
      <Text>{common.resouceLoad}</Text>
      <Text>{common.resouceLoad === true ? '1' : '2'}</Text>
      <TouchableOpacity
        style={{width: 30}}
        onPress={() => {
          navigation.navigate('Front');
        }}>
        <Text>강제로 메인이동</Text>
      </TouchableOpacity>
    </View>
  );
}
