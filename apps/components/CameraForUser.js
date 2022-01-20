'use strict';
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  BackHandler,
  StatusBar,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {useRoute} from '@react-navigation/native';

import AntIcon from 'react-native-vector-icons/AntDesign'; //picture
import Icon from 'react-native-vector-icons/Ionicons';
import {proFilePicture} from '../store/actions/userActions';

const {height, width} = Dimensions.get('window');

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

export default function CameraForUser(props) {
  const dispatch = useDispatch();
  const route = useRoute();
  const testCamera = useRef(null);
  const [cameraType, setCameraType] = useState('back');
  /* route 정보
   * test 에서는 아마 name : TestPage
   * {"key": "Join-KnTVf7OCOAWOoPgSYI0el", "name": "Join", "params": undefined}
   */

  const textColor = {
    from: {color: '#FFF'},
    to: {color: '#ffff00'},
  };

  const changeCamera = () => {
    cameraType === 'back' ? setCameraType('front') : setCameraType('back');
  };

  const takePicture = async function () {
    if (testCamera) {
      const options = {quality: 0.5, base64: true, imageType: true};
      const data = await testCamera.current.takePictureAsync(options);
      //  eslint-disable-next-line
      // console.log(data);

      // data
      let file = {
        name: data.uri.split('/').reverse()[0],
        uri: data.uri,
        type: 'image/jpeg',
      };
      if (route.name === 'Join') {
        await dispatch(proFilePicture(file))
          .then((res) => {
            console.log('take picture result');
            //console.log(res);
            props.close(false);
          })
          .catch((e) => {
            console.log(e);
          });
      } else if (route.name === 'TestPage') {
        props.setUploadFile(file);
        props.close(false);
      } else if (route.name === 'More' || route.name === 'MoreMain') {
        //더보기 메뉴에서 호출시
        //props.type 0:user수정창 / 1:testee수정창 / 2:testee추가창 / 99 :err
        //props.type_no  type0 -> testee_no type1->testee_no type2->unde
        console.log('got a data >>', props.type, props.type_no);
        props.close(file, props.type, props.type_no);
      } else {
        console.log('unknown router');
        console.log(route.name);
      }
    } else {
      console.log('ref err');
    }
  };

  const selectFile = () => {
    let options = {
      mideaType: 'photo',
      // storageOptions: {
      //   skipBackup: true,
      //   path: 'images',
      // },
    };

    launchImageLibrary(options, (res) => {
      //console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        const source = {
          name: res.fileName,
          uri: res.uri,
          type: res.type,
        };
        console.log('fileSize > ' + res.fileSize);

        if (route.name === 'Join') {
          dispatch(proFilePicture(source))
            .then((res) => {
              console.log('gallry select picture');
              //console.log(res);
              props.close(false);
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (route.name === 'TestPage') {
          props.setUploadFile(source);
          props.close(false);
        } else if (route.name === 'More' || route.name === 'MoreMain') {
          //더보기 메뉴에서 호출시
          //props.type 0:user수정창 / 1:testee수정창 / 2:testee추가창 / 99 :err
          //props.type_no  type0 -> testee_no type1->testee_no type2->unde
          console.log('got a data >>', props.type, props.type_no);
          props.close(source, props.type, props.type_no);
        } else {
          console.log('unknown router');
          console.log(route.name);
        }
      }
    });
  };

  useEffect(() => {
    const stepBack = () => {
      props.onStepDown();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', stepBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', stepBack);
    };
  }, [props]);

  return (
    <View style={styles.container}>
      <View style={styles.cameraHeader}>
        <Icon
          name="close-circle-outline"
          size={34}
          color={'white'}
          onPress={() => props.close(false)}
        />
      </View>
      <View style={styles.RNCameraContainer}>
        <RNCamera
          id="myTestCamera"
          ref={testCamera}
          style={styles.preview}
          type={cameraType}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status, recordAudioPermissionStatus}) => {
            if (status !== 'READY') return <PendingView />;
          }}
        </RNCamera>
      </View>
      <View style={styles.cameraFooter}>
        <View style={styles.cameraFooterBtnDiv}>
          <AntIcon
            name="picture"
            size={40}
            color={'white'}
            onPress={() => {
              selectFile();
            }}
          />
          <TouchableOpacity onPress={() => takePicture()}>
            <View
              style={{
                borderWidth: 3,
                borderColor: '#FFF',
                borderRadius: 28,
                padding: 5,
              }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#FFF',
                  borderRadius: 20,
                }}
              />
            </View>
          </TouchableOpacity>
          <Icon
            name="camera-reverse"
            size={40}
            color={'white'}
            onPress={() => {
              changeCamera();
            }}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cameraHeader: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: width,
    height: (height - (StatusBar.currentHeight || 0) - width) * 0.2,
    paddingRight: 20,
  },
  RNCameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: width * 0.9,
    height: width,
  },
  cameraFooter: {
    width: width,
    height: (height - (StatusBar.currentHeight || 0) - width) * 0.4,
    justifyContent: 'flex-end',
  },
  cameraFooterBtnDiv: {
    flexDirection: 'row',
    width: width,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
