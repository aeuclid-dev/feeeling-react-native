import React from 'react';
import { View,Text} from 'react-native';

export default function RadioButton(props) {
  return (
      <View style={[{
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: (props.selected)?"#ff6f61":'#EBEDF2' ,
        alignItems: 'center',
        justifyContent: 'center',
      }, props.style]}>
        {
          props.selected ?
            <View style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: '#ff6f61',
            }}/>
            : null
        }
      </View>
  );
}