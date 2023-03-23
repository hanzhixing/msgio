import {useCallback, SyntheticEvent} from 'react';
import {Iframe} from 'msgio';

const summarize = (...args: number[]) => args.reduce((acc: any, cur: any) => (acc + cur), 0);

const multiply = (a: number, b: number) => Promise.resolve(a * b);

const throw1 = () => {
    throw new Error('Host throws Error. Error1');
};

const throw2 = () => {
    return Promise.reject(new Error('Host throws Error: Error2'));
};

const Host = () => {
    const handleLoad = useCallback(
        (e: SyntheticEvent<HTMLIFrameElement>) => {
            const host = new Iframe(e.target as HTMLIFrameElement);

            host.on('connect', socket => {
                console.log('host:connected');

                socket.on('guest_event_1', (...args: any) => {
                    console.log('host:main:guest_event_1', ...args);
                });

                socket.emit('host_event_1', {name: 'host_event_1', a: 'a', x: 1});

                socket.func('summarize', summarize);

                socket.func('multiply', multiply);

                socket.func('throw1', throw1);

                socket.func('throw2', throw2);

                socket.call('concat', 'hello', ' ', 'world', '!').then((result: any) => {
                    console.log('host:return:', result);
                });
            });
        },
        [],
    );

    return (
        <>
            <div>This is the Host.</div>
            <iframe src="//localhost:4567/guest" title="guest" onLoad={handleLoad} />
        </>
    );
};

export default Host;
