import React from 'react';
import {StyleSheet, View, Dimensions, Image} from 'react-native';
import {array} from 'yup';
import {TextNR, TextNB, TextNEB} from './FontConst';
import {ResultImage} from '../components/ResultImage';

const {width} = Dimensions.get('window');

export default function ResultReportContents(props) {
  return (
    <View style={styles.resultContentsSectionTitle}>
      <TextNB style={{fontSize: 24, color: '#4a4a4a'}}>
        {props.resultTitle}
      </TextNB>
      <View style={[styles.flexDirRow, styles.resultTitleTextView]}>
        <TextNEB style={{fontSize: 24, color: '#4a4a4a', margin: 3}}>
          {props.resultTextResult}
        </TextNEB>
      </View>

      <Image
        resizeMode="contain"
        style={{width: 140, height: 140, marginVertical: 5}}
        source={ResultImage(props.resultImage)}
        // source={{
        //   uri: `data:image/png;base64,${props.resultImage}`,
        // }}
      />
      {props.resultItems.length > 0 ? (
        <View style={styles.resultContentsSectionItems}>
          {props.resultItems.map((Icon, index) => {
            return (
              <View
                key={index}
                style={
                  props.resultItems.length === index + 1
                    ? styles.resultContentsSectionItemViewLast
                    : styles.resultContentsSectionItemView
                }>
                <Image
                  resizeMode="contain"
                  style={{width: 65, height: 65}}
                  source={ResultImage(Icon)}
                  // source={{
                  //   uri: `data:image/png;base64,${Icon}`,
                  // }}
                />
              </View>
            );
          })}
          {[...Array(4 - props.resultItems.length)].map((x, i) => {
            if (4 - props.resultItems.length === i + 1) {
              return <View />;
            } else {
              return (
                <View key={i} style={styles.resultContentsSectionItemView} />
              );
            }
          })}
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  flexDirRow: {
    flexDirection: 'row',
  },
  resultContentsSectionTitle: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  resultTitleTextView: {
    alignItems: 'flex-end',
  },
  resultContentsSectionItems: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    width: width - 40,
    height: 90,
  },
  resultContentsSectionItemView: {
    width: (width - 40) / 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContentsSectionItemViewLast: {
    width: (width - 40) / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContentsSectionItem: {
    transform: [{scaleX: 0.65}, {scaleY: 0.65}],
  },
});
