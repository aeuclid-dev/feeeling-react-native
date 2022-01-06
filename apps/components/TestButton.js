import React, {useRef} from 'react';
import {Animated, TouchableWithoutFeedback} from 'react-native';
import ViewOverflow from 'react-native-view-overflow';
import IconTest from '../resource/icons/test_icon.svg'; // etc

export const TestButton = ({onPress, accessibilityState}) => {
  //<ViewOverflow>
  const btnSize = 64;
  const AnimatedViewOverflow = Animated.createAnimatedComponent(ViewOverflow);
  const animation = useRef(new Animated.Value(0)).current;
  const is_focus = accessibilityState.selected;
  const slidePopUp = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-28, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
  Animated.timing(animation, {
    toValue: is_focus ? 1 : 0,
    duration: 500,
    useNativeDriver: true,
  }).start();
  return (
    <TouchableWithoutFeedback
      style={{
        height: btnSize,
        width: btnSize,
        borderRadius: btnSize / 2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
      }}
      onPress={() => {
        onPress();
      }}>
      <Animated.View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FFF',
            height: btnSize,
            width: btnSize,
            borderRadius: btnSize / 2,
            borderWidth: 5,
            borderColor: '#ff6f61',
          },
          slidePopUp,
        ]}>
        <IconTest size={48} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
