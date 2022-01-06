import React, {Component, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GetAppLabel, showMessage} from '../../store/actions/commonActions';
import {useDispatch} from 'react-redux';

export default function RegisterProvide(props) {
  const dispatch = useDispatch();
  const [provide, setProvide] = useState('');
  useEffect(() => {
    dispatch(GetAppLabel('yak2')).then((res) => {
      if (res.data.result.status === '000') {
        setProvide(res.data.resultData);
      } else {
        showMessage('서버와 통신에 실패했습니다..');
      }
    });
  }, []);
  return (
    <View>
      {provide.split('\n').map((line, index) => {
        return <Text key={index}>{line}</Text>;
      })}
    </View>
  );
}
