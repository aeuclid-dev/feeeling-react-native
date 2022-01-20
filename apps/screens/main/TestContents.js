import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  BackHandler,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';

import {useSelector, useDispatch} from 'react-redux';
import SurveyHeader from '../../components/survey/SurveyHeader';
import SurveyList from '../../components/survey/SurveyList';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomNav from '../../components/BottomNav';
import {TextNR, TextNB, TextNEB} from '../../components/FontConst';

import {
  setQuestion,
  requestTest,
  imageTextChange,
} from '../../store/actions/mainActions';

const {height, width} = Dimensions.get('window');
const qstep = 4; //static step count(selecttest,selectuser,uploadimage,setimage,)

export default function TestContents(props) {
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const mainState = useSelector((state) => state.main);
  const [questionSteps, setQuestionSteps] = useState(0);
  const is_last = mainState.testServey.length <= questionSteps;
  const is_complete = mainState.testServey.length < questionSteps;
  const stepNextQuestion = mainState.testServey.filter(
    (obj) => obj.order_no === questionSteps + 1,
  )[0];
  const headerText =
    props.step < qstep
      ? '2.이 그림으로 검사를 할까요?'
      : props.step -
        1 +
        '. ' +
        mainState.testServey.filter((fo) => fo.order_no === questionSteps)[0]
          .question;
  const backBtnText = props.step < qstep ? '재촬영' : '이전';
  const nextBtnDisable =
    props.step < qstep
      ? true
      : mainState.testAnswers.test_questions[questionSteps - 1].answer_no > 0 &&
        (mainState.testServey
          .filter(
            (obj) =>
              obj.question_no ===
              mainState.testAnswers.test_questions[questionSteps - 1]
                .question_no,
          )[0]
          .answers.filter(
            (obj2) =>
              obj2.answer_no ===
              mainState.testAnswers.test_questions[questionSteps - 1].answer_no,
          )[0].type === 1
          ? mainState.testAnswers.test_questions[questionSteps - 1].answer !==
            ''
          : true);
  // console.log('step > '+props.step + " / qs >>"+questionSteps+" / len>"+mainState.testServey.length) ;
  // console.log('next btn > '+nextBtnDisable);

  const onNextBtn = async () => {
    if (is_last) {
      await dispatch(requestTest(mainState.testAnswers));
    } else {
      await dispatch(setQuestion(stepNextQuestion));
      await setQuestionSteps(questionSteps + 1);
      await scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
      await props.onStepUp();
    }
  };
  const onBackBtn = async () => {
    await props.onStepDown();
    if (questionSteps > 0) {
      //console.log('ov 0');
      await setQuestionSteps(questionSteps - 1);
    }
  };

  useEffect(() => {
    const stepBack = () => {
      props.onStepDown();
      setQuestionSteps((nowstep) => {
        return nowstep - 1;
      });
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', stepBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', stepBack);
    };
  }, [props]);

  console.log('props.step>>' + props.step, '/', 'ContentsQstep>>' + qstep);
  return (
    <View>
      <View style={styles.surveyTitleDiv}>
        <SurveyHeader
          is_finish={is_complete}
          iconType={is_complete ? 'C' : props.step <= qstep - 1 ? 'P' : 'S'}
          step={props.step}
          text={headerText}
        />
      </View>
      <View style={styles.surveyContentsDiv}>
        {mainState.testimg !== null ? (
          <Image
            resizeMode="contain"
            style={styles.surveyContentsImage}
            source={{uri: `data:image/png;base64,${mainState.testimg}`}}
          />
        ) : null}
        {props.step >= qstep ? (
          <SurveyList
            questionSteps={questionSteps}
            style={styles.surveyContentsListDiv}
            scrollRef={scrollRef}
          />
        ) : (
          <KeyboardAvoidingView
            style={{
              // flex: 1,
              // flexDirection: 'column',
              // justifyContent: 'center',
              display: 'flex',
              margin: 0,
            }}
            //behavior="position"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={height * 0.1 + 100}>
            <View style={styles.bottomContents}>
              <TextInput
                style={{
                  height: height / 8,
                  borderStyle: 'solid',
                  borderWidth: 1,
                  borderColor: '#ff6f61',
                }}
                onChangeText={(text) => dispatch(imageTextChange({text}))}
                multiline={true}
                numberOfLines={3}
                value={mainState.testAnswers.image_comment}
                selectTextOnFocus={true}
                placeholder={'그림에 대해 간단히 25자 이내로 설명해주세요'}
                placeholderTextColor="#98A3B5"
                returnKeyType={'done'}
                blurOnSubmit={true}
                autoCorrect={false}
                maxLength={25}
              />
            </View>
          </KeyboardAvoidingView>
        )}
      </View>
      <View style={styles.surveyFooterDiv}>
        <BottomNav
          backText={backBtnText}
          forwardText={is_last ? '검사완료' : '다음'}
          is_finish={is_last}
          disabled={!nextBtnDisable}
          onClickBack={onBackBtn}
          onClickForward={onNextBtn}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  surveyTitleDiv: {
    width: width,
    height: (height / 10) * 2,
  },
  surveyContentsDiv: {
    width: width,
    height: (height / 10) * 6.7,
  },
  surveyContentsImage: {
    height: (height / 10) * 2,
    marginTop: 10,
  },
  surveyContentsListDiv: {
    //height: (height / 10) * 5,
    overflow: 'hidden',
  },
  surveyFooterDiv: {
    width: width,
    height: (height / 10) * 1,
  },
  bottomContents: {
    marginHorizontal: 20,
    marginVertical: 5,
  },
});
