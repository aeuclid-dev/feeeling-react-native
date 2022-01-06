//import moment from 'moment';
import moment from 'moment-timezone';
import * as RNLocalize from 'react-native-localize';

const currentTimeZone = RNLocalize.getTimeZone();

export function timeStapmToDate(date) {
  //console.log(currentTimeZone);
  var changeDate = moment.tz(currentTimeZone);
  var currentTimeZoneOffsetInHours = changeDate.utcOffset() / 60;

  const dateObject = new Date(date);
  const currentHours = dateObject.getHours();
  dateObject.setHours(currentHours + currentTimeZoneOffsetInHours);
  const newDateString = dateObject.toISOString().replace('T', ' ').slice(0, 19);
  // console.log(newDateString);
  // var format = new Date(newDateString);
  // var year = format.getFullYear();
  // var month = format.getMonth() + 1;
  // if (month < 10) month = '0' + month;
  // var date = format.getDate();
  // if (date < 10) date = '0' + date;

  // var hours = format.getHours();
  // var minutes = format.getMinutes();
  // var seconds = format.getSeconds();
  return newDateString;
}

export function dateToStr(date) {
  var datearr = date.split('-');
  var dateText = datearr[0] + '년 ' + datearr[1] + '월 ' + datearr[2] + '일';
  return dateText;
}

export function dateToFullStr(date) {
  var dateData = date.split(' ');
  var datearr = dateData[0].split('-');
  var dateText = datearr[0] + '년 ' + datearr[1] + '월 ' + datearr[2] + '일';
  var dateTime = dateData[1].split(':');
  var dateTextTime = dateTime[0] + '시 ' + dateTime[1] + '분';
  return dateText + ' ' + dateTextTime;
}

export function timeStapmToYearMonth(date) {
  var changeDate = moment.tz(date, currentTimeZone).format();
  var format = new Date(changeDate);
  var year = format.getFullYear();
  var month = format.getMonth() + 1;

  return year + '년' + month + '월';
}

export function dateToPushUpdateDate(date) {
  var format = new Date(date);
  var year = format.getFullYear();
  var month = format.getMonth() + 1;
  var day = format.getDate();
  return year + '/' + month + '/' + day + ' 23:59:59';
}

export function isDateToPushUpdate(date1, date2) {
  var date1 = new Date(date1);
  var date2 = new Date(date2);
  // console.log('t1: ' + date1);
  // console.log('t2: ' + date2);
  // console.log('t3: ' + (date1 < date2));
  return date1 < date2;
}
