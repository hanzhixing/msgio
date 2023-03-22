import {createNanoEvents} from 'nanoevents';
import {EndpointEvent, EndpointEventType, Receiver} from './types';
import type Socket from './socket';
import {MIME_TYPE} from './constants';

class Endpoint {
    emitter = createNanoEvents();

    origin = window.location.origin;

    socketId = 'none';

    receiver: Receiver;

    constructor(receiver: Receiver) {
        this.receiver = receiver;
    }

    sendPacket = (type: EndpointEventType, body: any) => {
        this.receiver.target.postMessage({
            mime: MIME_TYPE,
            type,
            socket: type === 'CONNECT' ? this.socketId : undefined,
            body,
        }, this.receiver.origin);
    };

    isValidEvent = (e: EndpointEvent) => {
        const {origin, data: {mime, type, socket}} = e;

        if (origin !== this.receiver.origin) {
            return false;
        }

        if (mime !== MIME_TYPE) {
            return false;
        }

        if (type !== 'CONNECT' && socket !== this.socketId) {
            return false;
        }

        return true;
    };

    on = (event: 'connect', fn: (socket: Socket) => void) => {
        this.emitter.on(event, fn);
    };
}

export default Endpoint;
