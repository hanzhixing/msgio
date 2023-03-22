import {createNanoEvents} from 'nanoevents';
import {SocketEvent, SocketEventType, SocketCallResponseEventPayload, SocketCallRegistryValue} from './types';
import type Endpoint from './endpoint';
import {MIME_TYPE} from './constants';
import {generateId, typeOf, bodyOf, encodeError, decodeError} from './utils';

class Socket {
    emitter = createNanoEvents();

    id: string;

    connection: Endpoint;

    functionRegistry: Map<string, (...args: any) => any>;

    callRegistry: Map<string, SocketCallRegistryValue>;

    constructor(connection: Endpoint) {
        this.connection = connection;

        this.id = this.connection.socketId;

        this.functionRegistry = new Map();

        this.callRegistry = new Map();

        window.addEventListener('message', this.onEvent);
        window.addEventListener('message', this.onCallRequest);
        window.addEventListener('message', this.onCallResponse);
    }

    isValidEvent = (e: SocketEvent) => {
        const {origin, data: {mime, socket}} = e;

        if (origin !== this.connection.receiver.origin) {
            return false;
        }

        if (mime !== MIME_TYPE) {
            return false;
        }

        if (socket !== this.id) {
            return false;
        }

        return true;
    };

    sendPacket = (type: SocketEventType, body: any) => {
        const {target, origin} = this.connection.receiver;

        target.postMessage({
            mime: MIME_TYPE,
            type,
            socket: this.id,
            body,
        }, origin);
    };

    onEvent = (e: SocketEvent) => {
        if (!this.isValidEvent(e)) {
            return;
        }

        if (typeOf(e) !== 'SOCKET_EVENT') {
            return;
        }

        const {event, payload} = bodyOf(e);

        this.emitter.emit(event, payload);
    };

    on = (event: string, fn: (...args: any) => void) => {
        this.emitter.on(event, fn);
    };

    emit = (event: string, payload: any) => {
        this.sendPacket('SOCKET_EVENT', {event, payload});
    };

    func = (fname: string, fn: (...args: any) => void) => {
        if (typeof fn !== 'function') {
            throw new Error('The object supplied to \'function\' must be a function!<msgio>');
        }

        this.functionRegistry.set(fname, fn);
    };

    onCallRequest = (e: SocketEvent) => {
        if (!this.isValidEvent(e)) {
            return;
        }

        if (typeOf(e) !== 'SOCKET_CALL_REQUEST') {
            return;
        }

        const {callId, fname, args} = bodyOf(e);

        const send = (payload: SocketCallResponseEventPayload) => {
            this.sendPacket('SOCKET_CALL_RESPONSE', {callId, fname, payload});
        };

        const sendError = (result: Error) => send({error: true, result: encodeError(result)});

        const sendResult = (result: unknown) => send({error: false, result});

        if (!this.functionRegistry.has(fname)) {
            sendError(new ReferenceError(`${fname} is not defined!<msgio>`));
            return;
        }

        try {
            // NOTE: need typescirpt's non-null assertion operator ! below
            // see Line 186 above and https://github.com/microsoft/TypeScript/issues/41045
            const result = this.functionRegistry.get(fname)!(...args);

            Promise.resolve(result)
                .then(sendResult)
                .catch(sendError);
        } catch (error) {
            sendError(error as Error);
        }
    };

    onCallResponse = (e: SocketEvent) => {
        if (!this.isValidEvent(e)) {
            return;
        }

        if (typeOf(e) !== 'SOCKET_CALL_RESPONSE') {
            return;
        }

        const {callId, payload: {error, result}} = bodyOf(e);

        if (!this.callRegistry.has(callId)) {
            return;
        }

        // NOTE: need typescirpt's non-null assertion operator ! below
        // see Line 186 above and https://github.com/microsoft/TypeScript/issues/41045
        const {resolve, reject} = this.callRegistry.get(callId)!;

        if (error) {
            reject(decodeError(result));
        } else {
            resolve(result);
        }

        this.callRegistry.delete(callId);
    };

    call = (fname: string, ...args: any[]) => {
        const callId = generateId();

        this.sendPacket('SOCKET_CALL_REQUEST', {callId, fname, args});

        return new Promise((resolve, reject) => {
            this.callRegistry.set(callId, {callId, fname, args, resolve, reject});
        });
    };
}

export default Socket;
