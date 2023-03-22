export type FrameSize = {
    width: number;
    height: number;
};

export type GuestOption = {
    host: string;
};

type IframeEndpointEventType = 'RESIZE';

export type EndpointEventType = 'CONNECT' | IframeEndpointEventType;

export type SocketEventType = 'SOCKET_EVENT' | 'SOCKET_CALL_REQUEST' | 'SOCKET_CALL_RESPONSE';

export type Receiver = {
    target: Window;
    origin: string;
};

type MsgioEventData = {
    mime: string;
    type: string;
    socket: string;
    body: unknown;
};

export type EndpointEvent = MessageEvent & {
    data: MsgioEventData;
};

export type SocketError = {
    name: string;
    message: string;
};

type SocketSocketEvent = MessageEvent & {
    data: MsgioEventData & {
        body: {
            event: string;
            args: unknown;
        };
    };
};

type SocketCallRequestEvent = MessageEvent & {
    data: MsgioEventData & {
        body: {
            callId: string;
            fname: string;
            args: unknown;
        };
    };
};

export type SocketCallResponseEvent = MessageEvent & {
    data: MsgioEventData & {
        body: {
            callId: string;
            fname: string;
            payload: SocketCallResponseEventPayload;
            args: unknown;
        };
    };
};

export type SocketEvent = SocketSocketEvent | SocketCallRequestEvent | SocketCallResponseEvent;

export type SocketCallResponseEventPayload = {
    error: boolean;
    result: SocketError | unknown;
};

export type SocketCallRegistryValue = {
    callId: string;
    fname: string;
    args: any[];
    resolve: (value: unknown) => void;
    reject: (reason?:any) => void;
};

export type ErrorNameConstructorMap = {
    [key: string]: typeof Error |
        typeof EvalError |
        typeof RangeError |
        typeof ReferenceError |
        typeof SyntaxError |
        typeof TypeError |
        typeof URIError;
};
