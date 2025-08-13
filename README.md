# WebSocket Client IO

A comprehensive WebSocket client package featuring two different WebSocket implementations:

1. **🔗 SimpleWebSocket** - A lightweight WebSocket client with app authentication support
2. **🚀 WebSocketClient** - A feature-rich WebSocket client with automatic reconnection, ping/pong, and advanced event handling Built with ES6+ features and designed for both browser and Node.js environments.

## 🚀 Features

- **Automatic Reconnection**: Built-in reconnection logic with configurable retry intervals
- **Event-Driven Architecture**: Clean event-based API for handling WebSocket events
- **Ping/Pong Support**: Automatic ping messages to keep connections alive
- **Message Queuing**: Messages are queued when disconnected and sent when reconnected
- **TypeScript Support**: Full TypeScript definitions included
- **Multiple Build Formats**: CommonJS, ES Modules, and UMD builds
- **Debug Logging**: Optional debug logging for development
- **Browser Compatible**: Works in all modern browsers
- **Node.js Support**: Can be used in Node.js environments

## 🔗 SimpleWebSocket

The `SimpleWebSocket` class provides a lightweight, easy-to-use WebSocket client with built-in app authentication support.

### Features
- **Simple Configuration**: Just provide a URL and optional authentication parameters
- **App Authentication**: Built-in support for app ID, app secret, and access tokens
- **Callback-Based**: Simple callback interface for all events
- **URL Parameters**: Automatic injection of authentication parameters into the WebSocket URL
- **Binary Support**: ArrayBuffer binary type support for efficient data transfer

### Usage

```javascript
import { SimpleWebSocket } from 'websocket-client-io';

const ws = new SimpleWebSocket({
  url: 'wss://your-server.com',
  appId: 'your-app-id',
  appSecret: 'your-app-secret',
  accessToken: 'user-token',
  onConnect: (connection) => {
    console.log('Connected!', connection);
  },
  onMessage: (data) => {
    console.log('Message received:', data);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
  onClose: () => {
    console.log('Connection closed');
  }
});

// Send a message
ws.send('Hello Server!', (error, result) => {
  if (error) {
    console.error('Send failed:', error.message);
  } else {
    console.log('Message sent successfully');
  }
});

// Get connection status
const status = ws.getStatus();
console.log('Status:', status);

// Disconnect
ws.disconnect();
```

## 🚀 WebSocketClient (Advanced)

The `WebSocketClient` class provides advanced features like automatic reconnection, ping/pong, and event-driven architecture.

## 📦 Installation

### NPM

```bash
npm install websocket-client-io
```

### Yarn

```bash
yarn add websocket-client-io
```

### CDN

```html
<script src="https://unpkg.com/websocket-client-io/dist/websocket-client.umd.js"></script>
```

## 🔧 Dependencies

This package requires `reconnecting-websocket` as a peer dependency:

```bash
npm install reconnecting-websocket
```

## 📖 Usage

### Basic Usage

```javascript
import { createWebSocketClient } from 'websocket-client-io';

// Create a WebSocket client
const client = createWebSocketClient('wss://your-server.com', {
  pingInterval: 15,        // Send ping every 15 seconds
  autoPing: true,          // Enable automatic ping
  debug: true              // Enable debug logging
});

// Listen for connection events
client.on('open', () => {
  console.log('Connected to server');
});

client.on('close', () => {
  console.log('Disconnected from server');
});

client.on('error', (error) => {
  console.error('Connection error:', error);
});

// Listen for messages
client.on('message', (data) => {
  console.log('Message received:', data);
});

// Send messages
client.emit('action', { data: 'Hello Server!' });
client.chatMessage('Hello everyone!');
client.message('General message');
```

### Advanced Usage

```javascript
import { WebSocketClient } from 'websocket-client-io';
import ReconnectingWebSocket from 'reconnecting-websocket';

// Create custom ReconnectingWebSocket
const socket = new ReconnectingWebSocket('wss://your-server.com', null, {
  reconnectInterval: 1000,
  timeoutInterval: 10000,
  maxReconnectAttempts: 10
});

// Create client with custom socket
const client = new WebSocketClient(socket, {
  pingInterval: 30,
  autoPing: false,  // Disable auto-ping
  debug: true
});

// Custom event handling
client.on('chatMessage', (data) => {
  console.log('Chat message:', data);
});

client.on('userJoined', (user) => {
  console.log('User joined:', user);
});

// Send custom actions
client.emit('joinRoom', { room: 'general' });
client.emit('leaveRoom', { room: 'general' });

// Manual ping
client.ping();

// Get connection status
const status = client.getStatus();
console.log('Connection status:', status);
```

### Event Handling

```javascript
// Listen for specific events
client.on('notification', (data) => {
  showNotification(data);
});

client.on('update', (data) => {
  updateUI(data);
});

// Listen for all messages
client.listen('*', (data) => {
  console.log('All messages:', data);
});

// Listen for specific actions
client.listen('chatMessage', (data) => {
  console.log('Chat message:', data);
});

// Remove event listeners
const handler = (data) => console.log(data);
client.on('event', handler);
client.off('event', handler);
```

### Connection Management

```javascript
// Check connection status
if (client.open) {
  console.log('Connected');
} else {
  console.log('Disconnected');
}

// Get detailed status
const status = client.getStatus();
console.log('Ready state:', status.readyState);
console.log('Message queue length:', status.messageQueueLength);

// Set connection ID (useful for tracking)
client.setConnectionId('user-123');

// Close connection
client.close();

// Clean up resources
client.destroy();
```

## ⚙️ Configuration Options

### Client Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pingInterval` | number | 15 | Ping interval in seconds |
| `autoPing` | boolean | true | Enable automatic ping messages |
| `debug` | boolean | false | Enable debug logging |

### ReconnectingWebSocket Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `reconnectInterval` | number | 1000 | Reconnection interval in milliseconds |
| `timeoutInterval` | number | 10000 | Connection timeout in milliseconds |
| `maxReconnectAttempts` | number | 10 | Maximum reconnection attempts |

## 📡 API Reference

### Methods

#### `createWebSocketClient(url, options)`
Factory function to create a WebSocket client.

#### `new WebSocketClient(socket, options)`
Constructor for creating a WebSocket client instance.

#### `client.on(event, callback, options)`
Add event listener for a specific event.

#### `client.off(event, callback)`
Remove event listener.

#### `client.listen(action, callback)`
Listen for specific actions or all messages.

#### `client.emit(action, data)`
Emit an action with optional data.

#### `client.chatMessage(data)`
Send a chat message.

#### `client.message(data)`
Send a general message.

#### `client.ping()`
Send a ping message.

#### `client.close()`
Close the WebSocket connection.

#### `client.destroy()`
Clean up all resources and event listeners.

#### `client.getStatus()`
Get connection status information.

#### `client.setConnectionId(id)`
Set connection ID for tracking.

### Events

- `open` - Connection opened
- `close` - Connection closed
- `error` - Connection error
- `message` - Message received
- `Pong` - Pong response received
- Custom events based on your server's message format

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📦 Build Outputs

The package provides multiple build formats:

- **CommonJS** (`dist/websocket-client.js`) - For Node.js and bundlers
- **ES Modules** (`dist/websocket-client.esm.js`) - For modern bundlers
- **UMD** (`dist/websocket-client.umd.js`) - For browser use

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start development build
npm run dev

# Build for production
npm run build

# Generate documentation
npm run docs
```

## 📝 Examples

### React Component

```jsx
import React, { useEffect, useState } from 'react';
import { createWebSocketClient } from 'websocket-client-io';

function ChatComponent() {
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const wsClient = createWebSocketClient('wss://your-chat-server.com', {
      pingInterval: 15,
      debug: true
    });

    wsClient.on('open', () => {
      setConnected(true);
    });

    wsClient.on('close', () => {
      setConnected(false);
    });

    wsClient.on('chatMessage', (data) => {
      setMessages(prev => [...prev, data]);
    });

    setClient(wsClient);

    return () => {
      wsClient.destroy();
    };
  }, []);

  const sendMessage = (text) => {
    if (client && connected) {
      client.chatMessage(text);
    }
  };

  return (
    <div>
      <div>Status: {connected ? 'Connected' : 'Disconnected'}</div>
      <div>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <button onClick={() => sendMessage('Hello!')}>
        Send Message
      </button>
    </div>
  );
}
```

### Vue Component

```vue
<template>
  <div>
    <div>Status: {{ connected ? 'Connected' : 'Disconnected' }}</div>
    <div v-for="(msg, i) in messages" :key="i">
      {{ msg }}
    </div>
    <button @click="sendMessage">Send Message</button>
  </div>
</template>

<script>
import { createWebSocketClient } from 'websocket-client-io';

export default {
  data() {
    return {
      client: null,
      connected: false,
      messages: []
    };
  },
  mounted() {
    this.client = createWebSocketClient('wss://your-chat-server.com');
    
    this.client.on('open', () => {
      this.connected = true;
    });
    
    this.client.on('close', () => {
      this.connected = false;
    });
    
    this.client.on('chatMessage', (data) => {
      this.messages.push(data);
    });
  },
  beforeDestroy() {
    if (this.client) {
      this.client.destroy();
    }
  },
  methods: {
    sendMessage() {
      if (this.client && this.connected) {
        this.client.chatMessage('Hello from Vue!');
      }
    }
  }
};
</script>
```

### Node.js Usage

```javascript
const { createWebSocketClient } = require('websocket-client-io');

const client = createWebSocketClient('wss://your-server.com', {
  pingInterval: 30,
  debug: true
});

client.on('open', () => {
  console.log('Connected to WebSocket server');
});

client.on('message', (data) => {
  console.log('Received message:', data);
});

client.emit('subscribe', { channel: 'updates' });
```

## 🔍 Debugging

Enable debug mode to see detailed logs:

```javascript
const client = createWebSocketClient('wss://your-server.com', {
  debug: true
});
```

Debug logs will show:
- Connection events
- Message sending/receiving
- Ping/pong activity
- Reconnection attempts
- Error details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Make your changes
5. Run tests: `npm test`
6. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [ReconnectingWebSocket](https://github.com/pladaria/reconnecting-websocket) - For the robust reconnection logic
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) - For the underlying WebSocket implementation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/websocket-client-io/issues)
- **Documentation**: [GitHub Wiki](https://github.com/yourusername/websocket-client-io/wiki)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/websocket-client-io/discussions)

---

**Built with ❤️ for the WebSocket community**
