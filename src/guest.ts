import {GuestOption, EndpointEvent, FrameSize} from './types';
import Endpoint from './endpoint';
import Socket from './socket';
import {resolveOrigin, typeOf, bodyOf} from './utils';

class Guest extends Endpoint {
    option: GuestOption; // only for debug

    constructor(option: GuestOption) {
        const {host} = option;

        super({
            target: window.parent,
            origin: resolveOrigin(host),
        });

        this.option = option;

        window.addEventListener('message', this.onConnect);
    }

    onConnect = (e: EndpointEvent) => {
        if (!this.isValidEvent(e)) {
            return;
        }

        if (typeOf(e) !== 'CONNECT') {
            return;
        }

        const desiredSocketId = bodyOf(e);

        if (!desiredSocketId) {
            return;
        }

        this.socketId = desiredSocketId;

        this.sendPacket('CONNECT', this.socketId);

        this.emitter.emit('connect', new Socket(this));

        window.removeEventListener('message', this.onConnect);
    };

    resize = (size: FrameSize) => {
        this.sendPacket('RESIZE', size);
    };
}

export default Guest;
