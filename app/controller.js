const ComponentName = [
    'UI',
    'Buttons',
    'BasicCommunication',
    'VR',
    'TTS',
    'Navigation',
    'VehicleInfo'
];
const FirstRequestList = [
    'BasicCommunication.GetSystemInfo',
    'VR.IsReady',
    'TTS.IsReady',
    'UI.IsReady',
    'Navigation.IsReady',
    'VehicleInfo.IsReady',
    'Buttons.GetCapabilities',
    'BasicCommunication.MixingAudioSupported',
    'VR.GetLanguage',
    'VR.GetSupportedLanguages',
    'VR.GetCapabilities',
    'TTS.GetLanguage',
    'TTS.GetSupportedLanguages',
    'TTS.GetCapabilities',
    'UI.GetLanguage',
    'UI.GetSupportedLanguages',
    'UI.GetCapabilities',
    'VehicleInfo.GetVehicleData', // "params":{"vin":true}
    'VehicleInfo.GetVehicleType',
];

class Controller {
    constructor(socket) {
        this.socket = socket;
        this.requestID = 0;
    }
    process(message) {
        console.log(message);
        if (message.method === 'MB.registerComonent') {
            if (message.params && message.params.componentName &&
                ComponentName.indexOf(message.params.componentName) > -1) {
                    this.send({
                        id: message.id,
                        jsonrpc: message.jsonrpc,
                        result: message.id * 10
                    });
            }
        } else if (message.method === 'MB.subscribeTo') {
            let result = {
                id: message.id,
                jsonrpc: message.jsonrpc,
                result: 'OK'
            }
            this.send(result);
        } else if (message.method === 'BasicCommunication.OnReady') {
            // Check HMI Ready
            this.firstRequest();
        }
    }
    firstRequest() {
        FirstRequestList.forEach(request => {
            setTimeout(()=>{
                let rpc = {
                    id: this.requestID++,
                    jsonrpc: 2.0,
                    method: request
                };
                this.send(rpc);
            }, 100);
        });
    }
    send(rpc) {
        let str = JSON.stringify(rpc);
        console.log('send: '+str);
        this.socket.send(str);
    }
}

module.exports = Controller;