import {EndpointEvent} from './types';
import Endpoint from './endpoint';
import Socket from './socket';
import {resolveOrigin, generateId, typeOf} from './utils';

class Iframe extends Endpoint {
    dom: HTMLIFrameElement;

    desiredSocketId = generateId();

    constructor(dom: HTMLIFrameElement) {
        if (dom.tagName !== 'IFRAME' || !dom.contentWindow) {
            throw new Error('The DOM Node supplied is not a valid iframe node!<msgio>');
        }

        super({
            target: dom.contentWindow,
            origin: resolveOrigin(dom.src),
        });

        this.dom = dom;

        window.addEventListener('message', this.onConnect);
        window.addEventListener('message', this.onResize);

        this.sendPacket('CONNECT', this.desiredSocketId);
    }

    onConnect = (e: EndpointEvent) => {
        if (!this.isValidEvent(e)) {
            return;
        }

        if (typeOf(e) !== 'CONNECT') {
            return;
        }

        const repliedSocketId = e.data.body;

        if (repliedSocketId !== this.desiredSocketId) {
            return;
        }

        this.socketId = this.desiredSocketId;

        this.desiredSocketId = 'verified';

        this.emitter.emit('connect', new Socket(this));

        window.removeEventListener('message', this.onConnect);
    };

    onResize = (e: EndpointEvent) => {
        if (!this.isValidEvent(e)) {
            return;
        }

        if (typeOf(e) !== 'RESIZE') {
            return;
        }

        const {width, height} = e.data.body;

        this.dom.width = width;
        this.dom.height = height;
    };
}

export default Iframe;
