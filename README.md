# msgio

If you are familiar with `socket.io`, you already know how to use this package.

`socket.io` is based on WebSocket.

`msgio` is based on postMessage.


## Install

### npm

```js
npm install --save msgio
```

### &lt;script&gt;

```js
<script src="//<path to msgio>/msgio.min.js"></script>
<script>
  console.log(window.msgio); // Iframe, Guest
  // For detail usage, see below...
</script>
```

## Usage

### Iframe

#### In your Main App
```js
import {Iframe} from 'msgio';

const iframe = document.getElementById('my-iframe');

const onLoad = e => {
    const io = new Iframe(e.target);

    io.on('connect', socket => {
        // listening some events from the guest
        socket.on('my_custom_event', data => {
            // data: {x: 1, y: 2}
            // any code
        });

        // emit events to the guest
        socket.emit('greeting', 'hello world!');

        // expose functions to the guest
        socket.func('my_sync_fn', (a1, a2, ...rest) => {
            // a1: 1
            // a2: 2
            // rest: 3, 4, 5
            // any code
            // you can throw as usual!
        });

        // you can expose aysnc functions too.
        socket.func('my_async_fn', (a1, a2, ...rest) => {
            // a1: 'a'
            // a2: 'b'
            // rest: 'c', 'd', 'e'
            return new Promise((resolve, reject) => {
                // any code
            });
        });

        // call some functions the guest provides.
        socket.call('hi', 'guest', '!')
            .then(result => {
                // as you call the 'hi' function with args 'guest' and '!'
                // the resule may be 'hello host!', who knows!
                // any code
            })
            .catch(error => {
                // the guest may throw error to you
            });
    });
};

iframe.addEventListener('load', onLoad);
```

#### In your Iframe
```js
import {Guest} from 'msgio';

// You must provide the host's origin. It's all.
const io = new Guest({host: 'http://localhost:8080'});

// Like in your main app
io.on('connect', socket => {
    // the host will use this to set the <iframe>'s width and height.
    io.resize({width: 400, height: 600});

    // listening some events from the host
    socket.on('greeting', data => {
        // data: 'hello world!'
        // any code
    });

    // emit events to the guest
    socket.emit('my_custom_event', {x: 1, y: 2});

    // call functions from the host.
    socket.call('my_sync_fn', 1, 2, 3, 4, 5)
        .then(result => {
            // any code
        })
        .catch(error => {
            // catch the error
        });

    socket.call('my_async_fn', 'a', 'b', 'c', 'd', 'e')
        .then(result => {
            // any code
        })
        .catch(error => {
            // catch the error
        });

    socket.func('hi', (a1, a2, a3) => {
        // a1: 'guest'
        // a2: '!'
        // a3: undefined
        // any code
        // return 'hello host!'
    });
});
```

### Tab
Not implemented yet!

### Web Worker
Not implemented yet!

## API

### Iframe API

#### constructor

> constructor(dom: HTMLIFrameElement)

The dom provied must be a iframe node.

#### on

> on: ('connect', callback: (socket: Socket) => void) => void

### Guest API

#### constructor

> constructor(option: {host:string})

Pass the origin string. eg: http://example.com:8080

#### on

> on: ('connect', callback: (socket: Socket) => void) => void

#### resize

> resize: (size: {width: number, height: number}) => void;

### Socket API

#### on

> on: (event: string, callback: (...args: any) => void) => void

#### emit

> emit: (event: string, payload: any) => void

#### func

> func: (fname: string, callback: (...args: any) => any) => void

#### call

> call: (fname: string, ...args: any) => Promise&lt;any&gt;
