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
import * as Animatable from 'react-native-animatable';
import {useDispatch} from 'react-redux';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';

import AntIcon from 'react-native-vector-icons/AntDesign'; //picture
import Icon from 'react-native-vector-icons/Ionicons';
//camera-reverse
//camera-reverse-outline
import {sendPicture} from '../../store/actions/mainActions';

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

export default function CameraForTest(props) {
  const dispatch = useDispatch();
  const testCamera = useRef(null);
  const [cameraType, setCameraType] = useState('back');

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
      await testCamera.current.takePictureAsync(options).then(async (res) => {
        let file = {
          name: res.uri.split('/').reverse()[0],
          uri: res.uri,
          type: 'image/jpeg',
        };
        await dispatch(sendPicture(file))
          .then((res2) => {
            console.log('take picture result');
            //console.log(res);
            props.onStepUp();
          })
          .catch((e) => {
            console.log(e);
          });
      });
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

        dispatch(sendPicture(source))
          .then((res) => {
            console.log('gallry select picture');
            //console.log(res);
            props.onStepUp();
          })
          .catch((e) => {
            console.log(e);
          });
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
          onPress={() => {
            props.onStepDown();
          }}
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
        <View style={styles.cameraFooterTextDiv}>
          <Animatable.Text
            style={{fontSize: 20, textAlign: 'center'}}
            iterationCount="infinite"
            delay={3000}
            animation={textColor}>
            그림과 배경이 대비되는 곳에서 촬영해주세요
          </Animatable.Text>
        </View>
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
    height: (height - (StatusBar.currentHeight || 0) - width) * 0.3,
    paddingRight: 20,
  },
  RNCameraContainer: {
    //flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: width * 0.75,
    height: width,
  },
  cameraFooter: {
    width: width,
    height: (height - (StatusBar.currentHeight || 0) - width) * 0.7,
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
