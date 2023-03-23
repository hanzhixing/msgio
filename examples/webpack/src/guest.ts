import {Guest} from 'msgio';

const guest = new Guest({host: '//localhost:3456'});

const concat = (...args: any) => (args.join(''));

guest.on('connect', socket => {
    console.log('guest:connected');

    guest.resize({width: 400, height: 600});

    socket.on('host_event_1', (...args: any) => {
        console.log('guest:main:host_event_1', ...args);
    });

    socket.emit('guest_event_1', {name: 'guest_event_1', b: 'b', y: 2});

    socket.func('concat', concat);

    socket.call('summarize', 1, 2).then((result: any) => {
        console.log('guest:return:', result);
    });

    socket.call('summarize', 3, 4).then((result: any) => {
        console.log('guest:return:', result);
    });

    socket.call('multiply', 5, 6).then((result: any) => {
        console.log('guest:return:', result);
    });

    socket.call('throw1').catch((e: Error) => {
        console.log('guest:return:', e);
    });

    socket.call('throw2')
        .then((data: any) => {
            console.log(data);
            return data;
        })
        .catch((e: Error) => {
            console.log('guest:return:', e);
        });

    socket.call('foo').catch((e: Error) => {
        console.log('guest:return:', e);
    });
})
