
/**
 * 환경변수 클래스
 */
export default class XEnvironment {
    static get ReactNative(){ return "react-native" }

    static _type = "react-native";

    static get type(){
        return XEnvironment._type;
    }
}