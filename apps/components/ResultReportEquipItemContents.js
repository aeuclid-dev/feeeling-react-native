import React from 'react';
import {StyleSheet, View, Image, Dimensions} from 'react-native';
import {TextNR, TextNB, TextNEB} from './FontConst';
import {ResultImage} from '../components/ResultImage';
const {height, width} = Dimensions.get('window');
export default function ResultReportEquipItemContents(props) {
  return (
    <View style={[reportContents.flexDirRow, reportContents.iconRow]}>
      <View style={reportContents.itemView}>
        <TextNB>{props.contentsTitle}</TextNB>
      </View>
      <View style={reportContents.iconView}>
        <Image
          resizeMode="contain"
          style={{width: 65, height: 65}}
          source={ResultImage(props.icon)}
          // source={{
          //   uri: `data:image/png;base64,${props.icon}`,
          // }}
        />
      </View>
      <View style={reportContents.iconText}>
        <TextNR style={reportContents.iconTextTitle}>
          {props.contentsText}
        </TextNR>
        <TextNB style={reportContents.iconTextContents}>
          {props.contentsFeature}
        </TextNB>
      </View>
    </View>
  );
}
const reportContents = StyleSheet.create({
  flexDirRow: {
    flexDirection: 'row',
  },
  iconView: {
    width: 103,
    height: 103,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  iconRow: {
    paddingVertical: 20,
    flexWrap: 'wrap',
  },
  iconText: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  iconTextTitle: {
    fontSize: 16,
    letterSpacing: 0.31,
    color: '#4a4a4a',
    marginVertical: 5,
  },
  iconTextContents: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.27,
    color: '#4a4a4a',
  },

  itemView: {
    width: width / 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
