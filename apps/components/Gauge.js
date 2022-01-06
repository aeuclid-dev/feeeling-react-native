import React from 'react';
import {View} from 'react-native';
import {TextNEB} from './FontConst';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';

export default function Gauge(props) {
  const radius = props.radius;
  const percent = props.percent;
  const strokeWidth = radius * 0.2;
  const innerRadius = radius - strokeWidth / 2;
  const circumference = innerRadius * 2 * Math.PI;
  const arc = circumference * (220 / 360);
  const dashArray = `${arc} ${circumference}`;
  const transform = `rotate(160, ${radius}, ${radius})`;
  const percentNormalized = Math.min(Math.max(percent, 0), 100);
  const offset = arc - (percentNormalized / 100) * arc;
  return (
    <View>
      <Svg
        height={radius * 2}
        width={radius * 2}
        //style={{backgroundColor: 'green'}}
      >
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#3097ce" stopOpacity="1"></Stop>
            <Stop offset="1" stopColor="#5ec8e9" stopOpacity="1"></Stop>
          </LinearGradient>
        </Defs>
        <Circle
          cx={radius}
          cy={radius}
          fill="transparent"
          r={innerRadius}
          stroke="#dfe7f5"
          strokeDasharray={dashArray}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          transform={transform}
        />
        <Circle
          cx={radius}
          cy={radius}
          fill="transparent"
          r={innerRadius}
          stroke="url(#grad)"
          strokeDasharray={dashArray}
          strokeDashoffset={offset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          style={{
            transition: 'stroke-dashoffset 0.3s',
          }}
          transform={transform}
        />
        <TextNEB
          style={{
            color: '#4a4a4a',
            fontSize: 24,
            position: 'absolute',
            top: radius * 0.7,
            left: radius * 0.6,
          }}>
          {percent}%
        </TextNEB>
        <View
          style={{
            width: radius * 2,
            position: 'absolute',
            top: radius * 1.5,
            alignItems: 'center',
          }}>
          <TextNEB
            style={{
              color: '#4a4a4a',
              fontSize: 14,
            }}>
            {props.type}에서 {props.percent}%로
          </TextNEB>
          <TextNEB
            style={{
              color: '#4a4a4a',
              fontSize: 14,
            }}>
            지수가 {props.typeValue}습니다.
          </TextNEB>
        </View>
      </Svg>
    </View>
  );
}
