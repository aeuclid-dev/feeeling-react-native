import XEnvironment from "./XEnvironment";

/**
 * RTCPeerConnection wrapper 로 connection 수립 과정을 일반화 시킨 인터페이스 클래스입니다.
 * 
 */
export default class XRTCPeerConnection {
    static from = null;
    static channel = null;
    static stream = null;
    
    static _map = new Map();
    static _configuration = null;

    static get configuration(){ return XRTCPeerConnection._configuration; }
    static get map(){ return XRTCPeerConnection._map; }


    static answer(offer, view) {
        const connection = new XRTCPeerConnection(offer.from, view);
        const answer = await connection.answer(offer.msg);

        XRTCPeerConnection.channel.res(offer, { type: 'answer', from: XRTCPeerConnection.from, to: connection.to, msg: answer });
    }

    constructor(to, view) {
        this._o = new RTCPeerConnection(XRTCPeerConnection.configuration);

        if(XEnvironment.ReactNative === XEnvironment.type) {
            this._o.addStream(XRTCPeerConnection.stream);

            this._o.onaddstream = (event => onAddStream(event));
            this._o.onremovestream = (event => onRemoveStream(event));
        } else {
            /**
             * @todo    implement to use addTrack method
             */
        }

        this._o.onconnectionstatechange = (event => onConnectionStateChange(event));
        this._o.ondatachannel = (event => onDataChannel(event));
        this._o.onicecandidate = (event => onIceCandidate(event));
        this._o.onicecandidateerror = (event => onIceCandidateError(event));
        this._o.oniceconnectionstatechange = (event => onIceConnectionStateChange(event));
        this._o.onicegatheringstatechange = (event => onIceGatheringStateChange(event));
        this._o.onnegotiationneeded = (event => onNegotiationNeeded(event));
        this._o.onsignalingstatechange = (event => onSignalingStateChange(event));
        this._o.ontrack = (event => onTrack(event));

        this._to = to;
        this._view = view;

        XRTCPeerConnection._map.set(this._to, this);
    }

    get to() { return this._to; }

    async offer() {
        const offer = await this._o.createOffer();
                      await this._o.setLocalDescription(offer);
        const json  = await XRTCPeerConnection.channel.req({ type: 'offer', from: XRTCPeerConnection.from, to: this._to, msg: offer });
                      await this._o.setRemoteDescription(json.msg);
    }

    async answer(offer) {
                       await this._o.setRemoteDescription(offer);
        const answer = await this._o.createAnswer();
                       await this._o.setLocalDescription(answer);

        return answer;
    }

    onConnectionStateChange(event) {

    }

    onDataChannel(event){

    }

    onIceCandidate(event){
        XRTCPeerConnection.channel.req({ type: 'candidate', from: XRTCPeerConnection.from, to: this._to, msg: event.candidate });
    }

    onIceCandidateError(event){

    }

    onIceConnectionStateChange(event){

    }

    onIceGatheringStateChange(event){

    }

    onNegotiationNeeded(event){

    }

    onSignalingStateChange(event){

    }

    onTrack(event){

    }

    onAddStream(event){

    }

    onRemoveStream(event){

    }
}