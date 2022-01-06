

export default class XRTCPeerConnection {
    static _configuration = null;
    static _stream = null;
    static _channel = null;
    static _from = null;
    static _map = new Map();

    static get configuration(){ return XRTCPeerConnection._configuration; }

    static set stream(v){ XRTCPeerConnection._stream = v; }
    static set channel(v){
        XRTCPeerConnection._channel = v;

        XRTCPeerConnection._channel.onanswer = (json => XRTCPeerConnection.answer(json));
        XRTCPeerConnection._channel.onicecandidate = (json => {
            const connection = XRTCPeerConnection._map.get(json.from);

            connection._o.addIceCandidate(json.msg)
                         .catch(e => console.log(e));
            
        });
    }

    static async answer(offer) {
        const connection = new XRTCPeerConnection(offer.from);
                           await connection._o.setRemoteDescription(offer.msg);
        const answer     = await connection._o.createAnswer();
                           await connection._o.setLocalDescription(answer);

        XRTCPeerConnection._channel.res(offer, {type: 'answer', from: XRTCPeerConnection._from, to: connection.to, msg: answer});
    }

    constructor(to) {
        this._o = new RTCPeerConnection(XRTCPeerConnection.configuration);

        XRTCPeerConnection._stream.getTracks().forEach(track => this._o.addTrack(track, XRTCPeerConnection._stream));

        this._o.onconnectionstatechange = (event => this.onConnectionStateChange(event));
        this._o.ondatachannel = (event => this.onDataChannel(event));
        this._o.onicecandidate = (event => this.onIceCandidate(event));
        this._o.onicecandidateerror = (event => this.onIceCandidateError(event));
        this._o.oniceconnectionstatechange = (event => this.onIceConnectionStateChange(event));
        this._o.onicegatheringstatechange = (event => this.onIceGatheringStateChange(event));
        this._o.onnegotiationneeded = (event => this.onNegotiationNeeded(event));
        this._o.onsignalingstatechange = (event => this.onSignalingStateChange(event));
        this._o.ontrack = (event => this.onTrack(event));
        this._o.onaddstream = (event => this.onAddStream(event));
        this._o.onremovestream = (event => this.onRemoveStream(event));

        this._to = to;

        this._map.set(this._to, this);
    }

    get to(){ return this._to; }

    offer() {
        const offer  = await this._o.createOffer();
                       await this._o.setLocalDescription(offer);
        const answer = await XRTCPeerConnection._channel.req({ type: 'offer', from: XRTCPeerConnection.from, to: this._to, msg: offer});
                       await this._o.setRemoteDescription(answer.msg);
    }

    onConnectionStateChange(event) {

    }

    onDataChannel(event) {

    }
    
    onIceCandidate(event) {
        XRTCPeerConnection._channel.send({type: 'candidate', from: XRTCPeerConnection.from, to: this.to, msg: event.candidate});
    }

    onIceCandidateError(event) {

    }

    onIceConnectionStateChange(event) {

    }

    onIceGatheringStateChange(event) {

    }

    onNegotiationNeeded(event) {

    }

    onSignalingStateChange(event) {

    }

    onTrack(event) {
        console.log('implement this');
    }

    onAddStream(event) {
        console.log('implement this');
    }

    onRemoveStream(event) {

    }
}
