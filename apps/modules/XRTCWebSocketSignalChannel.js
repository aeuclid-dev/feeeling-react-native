
export default class XRTCWebSocketSignalChannel {
    
    static _id = 0;
    static _map = new Map();

    constructor(url) {
        this._o = new WebSocket(url);

        this.onanswer = null;
        this.onicecandidate = null;

        this._o.addEventListener('open', event => this.onOpen(event));
        this._o.addEventListener('close', event => this.onClose(event));
        this._o.addEventListener('error', event => this.onError(event));
        this._o.addEventListener('message', event => this.onMessage(event));
    }

    async req(o) {
        XRTCWebSocketSignalChannel._id = XRTCWebSocketSignalChannel._id + 1;

        o.id = XRTCWebSocketSignalChannel._id;

        

        return new Promise((resolve, reject) => {
            o.resolve = resolve;
            o.reject = reject;
            o.req = true;

            _map.set(o.id, o);

            this._o.send(JSON.stringify(o));
        });
    }

    res(req, o) {
        o.id = req.id;
        o.res = true;
        this._o.send(JSON.stringify(o));
    }

    send(o) {
        this._o.send(JSON.stringify(o));
    }


    onOpen(event){

    }

    onClose(event){
        XRTCWebSocketSignalChannel._map.forEach((value, key) => {
            value.reject(new Error());
        });
    }

    onError(event){

    }

    onMessage(event){
        try {
            const json = JSON.parse(event.data);
            if(json.res) {
                const req = XRTCWebSocketSignalChannel._map.get(json.id);
                if(req) {
                    req.resolve(json.res);
                } else {
                    req.reject(new Error());
                }
                return;
            } else {
                switch(json.type){
                case 'answer':    this.onanswer(json);       break;
                case 'candidate': this.onicecandidate(json); break;
                }
            }
        } catch(e) {
            console.log(e);
        }
    }
}