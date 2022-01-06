import React ,{useState} from 'react';
import RegisterStep1 from './RegisterStep1';
import RegisterStep2 from './RegisterStep2';
import RegisterStep3 from './RegisterStep3';
export default function Join({navigation}){
  const [step,setStep] = useState(1);
  const onStepUp = () =>{setStep(step + 1);}
  const onStepDown = () =>{setStep(step - 1);}
  
  if (step === 1) {
    return(<RegisterStep1 onStepUp={onStepUp} navigation={navigation}/>);
  }else if(step === 2){
    return(<RegisterStep2 onStepUp={onStepUp} onStepDown={onStepDown}/>);
  }else if(step === 3){
    return(<RegisterStep3 onStepDown={onStepDown} navigation={navigation}/>) 
  }else{
    return null;
  }
}