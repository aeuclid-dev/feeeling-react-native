import React, {Component, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GetAppLabel, showMessage} from '../../store/actions/commonActions';
import {useDispatch} from 'react-redux';

export default function RegisterTrems(props) {
  const dispatch = useDispatch();
  const [trems, setTrems] = useState('');
  useEffect(() => {
    dispatch(GetAppLabel('yak1')).then((res) => {
      if (res.data.result.status === '000') {
        setTrems(res.data.resultData);
      } else {
        showMessage('서버와 통신에 실패했습니다..');
      }
    });
  }, []);
  return (
    <View style={{flex: 1, alignItems: 'flex-start'}}>
      {trems.split('\\n').map((line, index) => {
        return <Text key={index}>{line}</Text>;
      })}
    </View>
  );
}
