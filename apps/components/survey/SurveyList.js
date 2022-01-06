import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {setChangeAnswer} from '../../store/actions/mainActions';
import RadioButton from '../RadioButton';
import {TextNR, TextNB, TextNEB} from '../FontConst';

const {width, height} = Dimensions.get('window');

export default function SurveyList(props) {
  const dispatch = useDispatch();
  const mainState = useSelector((state) => state.main);
  //const textRef = useRef();
  return (
    <KeyboardAvoidingView
      style={{flex: 1, flexDirection: 'column', justifyContent: 'center'}}
      //behavior="position"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={height * 0.1 + 100}>
      <ScrollView>
        {mainState.testServey
          .filter((obj) => obj.order_no === props.questionSteps)[0]
          .answers.map(
            (RQ, index) => {
              return (
                <View
                  key={index}
                  style={[
                    surveystyles.radiostyle,
                    mainState.testAnswers.test_questions[
                      props.questionSteps - 1
                    ].answer_no === RQ.answer_no
                      ? surveystyles.seletedradio
                      : '',
                  ]}>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(
                        setChangeAnswer(RQ.answer_no, RQ.question_no, ''),
                      );
                    }}
                    style={surveystyles.radiorowstyle}>
                    <View style={surveystyles.radioViewstyle}>
                      <RadioButton
                        selected={
                          mainState.testAnswers.test_questions[
                            props.questionSteps - 1
                          ].answer_no === RQ.answer_no
                        }
                        style={{marginRight: 10, marginLeft: 10}}
                      />
                      {mainState.testAnswers.test_questions[
                        props.questionSteps - 1
                      ].answer_no === RQ.answer_no ? (
                        <TextNEB
                          style={[
                            RQ.type === 1
                              ? surveystyles.withOtherTextstyle
                              : surveystyles.textstyle,
                            surveystyles.seletedtext,
                          ]}>
                          {RQ.answer}
                        </TextNEB>
                      ) : (
                        <TextNR
                          style={[
                            RQ.type === 1
                              ? surveystyles.withOtherTextstyle
                              : surveystyles.textstyle,
                          ]}>
                          {RQ.answer}
                        </TextNR>
                      )}
                      {RQ.type === 1 ? (
                        <View style={[surveystyles.inradioinput]}>
                          <TextInput
                            style={[surveystyles.inradioinputtext]}
                            onChangeText={(text) => {
                              dispatch(
                                setChangeAnswer(
                                  RQ.answer_no,
                                  RQ.question_no,
                                  text,
                                ),
                              );
                            }}
                            selectTextOnFocus={true}
                            placeholder={'입력'}
                            placeholderTextColor="#98A3B5"
                            multiline={false}
                            returnKeyType={'done'}
                            value={
                              mainState.testAnswers.test_questions[
                                props.questionSteps - 1
                              ].answer
                            }
                          />
                        </View>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }, //in map if end
          )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const surveystyles = StyleSheet.create({
  radiostyle: {
    flexWrap: 'wrap',
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EBEDF2',
    width: width - 30,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  radiorowstyle: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
    alignItems: 'center',
  },
  radioViewstyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  withOtherTextstyle: {
    color: '#9b9b9b',
    fontSize: 14,
    marginRight: 10,
  },
  textstyle: {
    width: width - 30,
    color: '#9b9b9b',
    fontSize: 14,
  },
  seletedradio: {
    borderColor: '#ff6f61',
    borderWidth: 2,
  },
  seletedtext: {
    color: '#4a4a4a',
    fontWeight: '800',
    fontSize: 14,
  },
  inradioinput: {
    width: width - 30 - 44 - 50,
    alignItems: 'flex-start',
  },
  inradioinputtext: {
    width: width - 30 - 44 - 50,
    marginVertical: 5,
    borderColor: '#ebedf2',
    borderWidth: 2,
    borderRadius: 4,
    height: 30,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
