# websocket-client-io

A modern, feature-rich WebSocket client with event handling, reconnection, and ping/pong support. Built on top of `reconnecting-websocket` for resilient connections and a simple, event-driven API.

## Installation

```bash
npm install websocket-client-io reconnecting-websocket
```

## Quick start

```js
import { createWebSocketClient } from 'websocket-client-io';

const client = createWebSocketClient('wss://example.com/socket', {
  pingTime: 20, // seconds
  debug: true,
});

client.on('open', () => {
  console.log('Connected');
});

client.on('message', ({ event, data }) => {
  console.log('Message:', event, data);
});

client.emit('message', { hello: 'world' });

// Listen for a specific action (server-side event name)
client.listen('chatMessage', (data) => {
  console.log('Chat:', data);
});
```

## API

### createWebSocketClient(url, options?)
Creates and returns a `WebSocketClient` that automatically reconnects.

- **url**: WebSocket URL (`wss://` or `ws://`).
- **options**: Object
  - **pingTime**: number (default: 15) — seconds between automatic pings
  - **reconnectingOptions**: options passed to `reconnecting-websocket` (defaults shown below)
  - Any other option is forwarded to `WebSocketClient` (see below)

Default `reconnectingOptions` used if not provided:
```js
{
  reconnectInterval: 1000,
  timeoutInterval: 10000,
  maxReconnectAttempts: 10,
}
```

Returns: `WebSocketClient`

### Class: WebSocketClient

Constructs a client around an existing `WebSocket` or `ReconnectingWebSocket` instance, or a URL string.

Constructor options:
- **pingInterval**: number (default: 15) — seconds between automatic pings
- **autoPing**: boolean (default: true) — whether to automatically send pings
- **debug**: boolean (default: false) — log to console when true

Key methods:
- **on(event, callback, options?)**: Subscribe to an event (see Events below)
- **off(event, callback)**: Unsubscribe
- **listen(action, callback)**: Subscribe to a specific message action or `'*'` for all
- **emit(action, data?)**: Send `{ action, data }`
- **chatMessage(data?)**: Send `{ action: 'chatMessage', body: data }`
- **message(data?)**: Send `{ action: 'message', body: data }`
- **ping()**: Send a raw `Ping`
- **close()**: Close the socket and stop auto-ping
- **markAsClosed()**: Mark connection as closed and stop auto-ping
- **onOpen(callback)**: Run once when connection is open (immediately if already open)
- **getStatus()**: Returns `{ open, readyState, url, connectionId, messageQueueLength, pingInterval, autoPing }`
- **setConnectionId(id)**: Tag the connection
- **destroy()**: Cleanup listeners and close the connection

## Events

The client dispatches DOM `CustomEvent`s internally and exposes a simple `on()` API.

Built-in events:
- **open**: connection established
- **close**: connection closed
- **error**: error raised by the socket
- **message**: all messages, with shape `{ event, data, original }`

Server-defined events:
- Any `event`/`action` property in server messages is dispatched with that name.
- Example: a server message `{ event: 'chatMessage', data: {...} }` triggers `on('chatMessage', handler)`.

## Message formats

Incoming handling:
- If the raw message is the string `'Pong'` or empty string, the client treats it as a pong.
- Otherwise, it attempts `JSON.parse(event.data)` and uses `data.data || data.body || data` as the payload.

Outgoing helpers:
- `emit(action, data?)` sends `{ action, data }` (when `data` is provided)
- `message(data?)` sends `{ action: 'message', body: data }`
- `chatMessage(data?)` sends `{ action: 'chatMessage', body: data }`

## Usage notes

- This library targets browser environments (uses `document` and `CustomEvent`). For Node-based tests, use a DOM shim like `jsdom`.
- If you pass a native `WebSocket`, it is wrapped in a `ReconnectingWebSocket` for resilience.
- Set `debug: true` to see prefixed logs in the console.

## Generating documentation

JSDoc comments are included throughout the source. Generate static docs with:

```bash
npm run docs
```

This will output HTML docs to the `docs/` directory.

## Deprecations

- `webSocketIOconnect(url, pingTime?)` is deprecated. Use `createWebSocketClient(url, { pingTime })` instead.

## License

MIT