/**
 * @jest-environment jsdom
 */

import { WebSocketClient, createWebSocketClient } from '../src/WebSocketClient.js';

// Mock ReconnectingWebSocket
class MockReconnectingWebSocket {
  constructor(url, protocols, options) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;
    this.readyState = 0; // CONNECTING
    this.listeners = new Map();
    
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.triggerEvent('open', {});
    }, 10);
  }
  
  addEventListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  removeEventListener(event, callback) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }
  
  close() {
    this.readyState = 3; // CLOSED
    this.triggerEvent('close', {});
  }
  
  send(data) {
    // Simulate receiving a response
    if (data === 'Ping') {
      setTimeout(() => {
        this.triggerEvent('message', { data: 'Pong' });
      }, 10);
    } else {
      // Echo back the message
      setTimeout(() => {
        this.triggerEvent('message', { data });
      }, 10);
    }
  }
  
  triggerEvent(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        callback(data);
      });
    }
  }
}

// Mock the ReconnectingWebSocket module
jest.mock('reconnecting-websocket', () => {
  return {
    __esModule: true,
    default: MockReconnectingWebSocket
  };
});

describe('WebSocketClient', () => {
  let client;
  let mockSocket;
  
  beforeEach(() => {
    mockSocket = new MockReconnectingWebSocket('wss://test.com');
    client = new WebSocketClient(mockSocket, { debug: false });
  });
  
  afterEach(() => {
    if (client) {
      client.destroy();
    }
  });
  
  test('should create a WebSocket client instance', () => {
    expect(client).toBeInstanceOf(WebSocketClient);
    expect(client.socket).toBe(mockSocket);
  });
  
  test('should handle connection open event', (done) => {
    client.on('open', (data) => {
      expect(client.open).toBe(true);
      expect(data.event).toBeDefined();
      done();
    });
  });
  
  test('should handle connection close event', (done) => {
    client.on('close', (data) => {
      expect(client.open).toBe(false);
      expect(data.event).toBeDefined();
      done();
    });
    
    mockSocket.close();
  });
  
  test('should handle ping/pong', (done) => {
    client.on('Pong', (data) => {
      expect(data).toBeDefined();
      done();
    });
    
    client.ping();
  });
  
  test('should emit custom actions', (done) => {
    client.on('message', (data) => {
      expect(data.event).toBe('customAction');
      expect(data.data).toBe('test data');
      done();
    });
    
    client.emit('customAction', 'test data');
  });
  
  test('should send chat messages', (done) => {
    client.on('message', (data) => {
      expect(data.event).toBe('chatMessage');
      expect(data.data).toBe('Hello chat!');
      done();
    });
    
    client.chatMessage('Hello chat!');
  });
  
  test('should send general messages', (done) => {
    client.on('message', (data) => {
      expect(data.event).toBe('message');
      expect(data.data).toBe('General message');
      done();
    });
    
    client.message('General message');
  });
  
  test('should get connection status', () => {
    const status = client.getStatus();
    expect(status).toHaveProperty('open');
    expect(status).toHaveProperty('readyState');
    expect(status).toHaveProperty('url');
    expect(status).toHaveProperty('connectionId');
    expect(status).toHaveProperty('messageQueueLength');
    expect(status).toHaveProperty('pingInterval');
    expect(status).toHaveProperty('autoPing');
  });
  
  test('should set connection ID', () => {
    const testId = 'test-connection-123';
    client.setConnectionId(testId);
    expect(client.connectionId).toBe(testId);
  });
  
  test('should handle event listeners', (done) => {
    const testData = { message: 'test' };
    
    client.on('testEvent', (data) => {
      expect(data).toEqual(testData);
      done();
    });
    
    // Simulate receiving a test event
    mockSocket.triggerEvent('message', { 
      data: JSON.stringify({ event: 'testEvent', data: testData }) 
    });
  });
  
  test('should remove event listeners', () => {
    const callback = jest.fn();
    client.on('testEvent', callback);
    client.off('testEvent', callback);
    
    // Simulate receiving the event
    mockSocket.triggerEvent('message', { 
      data: JSON.stringify({ event: 'testEvent', data: 'test' }) 
    });
    
    expect(callback).not.toHaveBeenCalled();
  });
  
  test('should listen for specific actions', (done) => {
    client.listen('chatMessage', (data) => {
      expect(data.event).toBe('chatMessage');
      done();
    });
    
    client.chatMessage('test message');
  });
  
  test('should listen for all messages', (done) => {
    client.listen('*', (data) => {
      expect(data).toBeDefined();
      done();
    });
    
    client.emit('testAction', 'test data');
  });
});

describe('createWebSocketClient', () => {
  test('should create client with URL string', () => {
    const client = createWebSocketClient('wss://test.com', { debug: false });
    expect(client).toBeInstanceOf(WebSocketClient);
    expect(client.socket).toBeInstanceOf(MockReconnectingWebSocket);
    client.destroy();
  });
  
  test('should create client with custom options', () => {
    const client = createWebSocketClient('wss://test.com', {
      pingInterval: 30,
      autoPing: false,
      debug: true
    });
    
    expect(client.options.pingInterval).toBe(30);
    expect(client.options.autoPing).toBe(false);
    expect(client.options.debug).toBe(true);
    
    client.destroy();
  });
});

describe('Legacy webSocketIOconnect', () => {
  test('should create client with legacy function', () => {
    const { socket, io } = webSocketIOconnect('wss://test.com', 20);
    
    expect(socket).toBeInstanceOf(MockReconnectingWebSocket);
    expect(io).toBeInstanceOf(WebSocketClient);
    expect(io.options.pingInterval).toBe(20);
    
    io.destroy();
  });
});
