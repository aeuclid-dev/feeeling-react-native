import React from 'react';
import {TextNR, TextNB, TextNEB} from '../FontConst';
import {View, Image, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import IconFamily from '../../resource/icons/family_opacity20.svg'; //1
import IconPicture from '../../resource/icons/picture.svg'; //2
import IconSurvey from '../../resource/icons/survey.svg'; //3
import IconComplete from '../../resource/icons/complete.svg'; //fin

const {height, width} = Dimensions.get('window');

export default function SurveyHeader(props) {
  let IconHeader = '';
  switch (props.iconType) {
    case 'F':
      IconHeader = IconFamily;
      break;
    case 'P':
      IconHeader = IconPicture;
      break;
    case 'S':
      IconHeader = IconSurvey;
      break;
    case 'C':
      IconHeader = IconComplete;
      break;
    default: IconHeader = IconComplete;
  }
  
  //var imgSrc = Image.resolveAssetSource(iconsrc);
  //const IMAGE_RATIO = imgSrc.height / imgSrc.width;
  return (
    <View
      style={{
        height: '100%',
        position: 'relative'
      }}
    >
    <View style={{
        backgroundColor:"#ff6f61",
        height: '100%',
        width:'100%',
        opacity:0.1,
        }}/>
        <View style={{width:120,height:97,position: 'absolute',right:20,bottom:0}}>
          <IconHeader style={{width: '100%',height: '100%',}} />
        </View>
        <View
          style={{
            height: '100%',
            width:'100%',
            position: 'absolute',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <TextNEB style={{color: '#4a4a4a', fontSize: props.is_finish?32:18}}>
            {props.text}
          </TextNEB>
        </View>
    </View>
  );
}
