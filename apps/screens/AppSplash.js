import React, {useEffect} from 'react';
import {ImageBackground, Dimensions, StyleSheet, Text} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';

const {height, width} = Dimensions.get('window');

export default function AppSplash(props) {
  const common = useSelector((state) => state.common);
  // console.log('here is appsplash');
  // console.log(common.splashImage);
  return (
    <Modal
      isVisible={common.splashSwitch}
      useNativeDriver={true}
      animationIn={'zoomIn'}
      animationOut={'zoomOut'}
      coverScreen={true}
      style={styles.splashModal}>
      <Text
        style={{
          color: '#FFF',
          fontSize: 28,
          position: 'absolute',
          top: 0,
          left: 0,
        }}>
        ???
      </Text>
      <ImageBackground
        source={
          common.splashImage === null
            ? require('../resource/images/splash_new1.png')
            : common.splashImage
        }
        style={styles.splashBgimg}
      />
    </Modal>
  );
}
const styles = StyleSheet.create({
  splashModal: {
    flex: 1,
    margin: 0,
  },
  splashBgimg: {
    width: width,
    height: height,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
