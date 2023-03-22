import {nanoid} from 'nanoid';
import {SocketError, ErrorNameConstructorMap} from './types';

export const resolveOrigin = (url: string) => {
    const a = document.createElement('a');

    a.href = url;

    const protocol = a.protocol.length > 4 ? a.protocol : window.location.protocol;

    const host = (() => {
        if (a.host.length > 0) {
            return (a.port === '80' || a.port === '443') ? a.hostname : a.host;
        }
        return window.location.host;
    })();

    return a.origin || `${protocol}//${host}`;
};

export const generateId = () => `${nanoid()}<msgio>`;

export const typeOf = (e: MessageEvent) => e.data.type;

export const bodyOf = (e: MessageEvent) => e.data.body;

export const encodeError = ({name, message}: Error) => ({name, message});

export const decodeError = ({name, message}: SocketError) => {
    const ErrorConstructor: ErrorNameConstructorMap = {
        Error,
        EvalError,
        RangeError,
        ReferenceError,
        SyntaxError,
        TypeError,
        URIError,
    };

    if (name in ErrorConstructor) {
        return new ErrorConstructor[name](message);
    }

    return new Error('Unknown Error type!<msgio>');
};
