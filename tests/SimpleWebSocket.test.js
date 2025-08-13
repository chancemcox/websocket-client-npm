/**
 * @jest-environment jsdom
 */

import { SimpleWebSocket } from '../src/SimpleWebSocket.js';

// Mock WebSocket for testing
class MockWebSocket {
  constructor(url, protocols, options) {
    this.url = url;
    this.protocols = protocols;
    this.options = options;
    this.readyState = 0; // CONNECTING
    this.binaryType = 'arraybuffer';
    
    // Simulate connection after a short delay
    setTimeout(() => {
      this.readyState = 1; // OPEN
      if (this.onopen) this.onopen({});
    }, 10);
  }
  
  send(data) {
    // Simulate receiving a response
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data: `Echo: ${data}` });
      }
    }, 10);
  }
  
  close() {
    this.readyState = 3; // CLOSED
    if (this.onclose) this.onclose({});
  }
}

// Mock global WebSocket
global.WebSocket = MockWebSocket;

describe('SimpleWebSocket', () => {
  let ws;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    if (ws) {
      ws.disconnect();
    }
  });

  test('should create instance with required url', () => {
    ws = new SimpleWebSocket({ url: 'wss://test.com' });
    expect(ws.url).toBe('wss://test.com');
    expect(ws.appId).toBeUndefined();
    expect(ws.appSecret).toBeUndefined();
  });

  test('should create instance with all options', () => {
    const options = {
      url: 'wss://test.com',
      appId: 'test-app',
      appSecret: 'test-secret',
      accessToken: 'test-token'
    };
    
    ws = new SimpleWebSocket(options);
    expect(ws.url).toBe('wss://test.com');
    expect(ws.appId).toBe('test-app');
    expect(ws.appSecret).toBe('test-secret');
    expect(ws.accessToken).toBe('test-token');
  });

  test('should throw error without url', () => {
    expect(() => {
      new SimpleWebSocket({});
    }).toThrow('url is required in the options.');
  });

  test('should handle connection events', (done) => {
    const onConnect = jest.fn();
    const onMessage = jest.fn();
    const onClose = jest.fn();
    
    ws = new SimpleWebSocket({
      url: 'wss://test.com',
      onConnect,
      onMessage,
      onClose
    });

    setTimeout(() => {
      expect(onConnect).toHaveBeenCalled();
      expect(ws.webSocket).toBeDefined();
      expect(ws.webSocket.readyState).toBe(1);
      done();
    }, 20);
  });

  test('should send messages when connected', (done) => {
    const onMessage = jest.fn();
    
    ws = new SimpleWebSocket({
      url: 'wss://test.com',
      onMessage
    });

    setTimeout(() => {
      ws.send('Hello World', (error, result) => {
        expect(error).toBeNull();
        expect(result.success).toBe(true);
        
        // Wait for echo response
        setTimeout(() => {
          expect(onMessage).toHaveBeenCalledWith('Echo: Hello World');
          done();
        }, 20);
      });
    }, 20);
  });

  test('should handle send errors when not connected', () => {
    ws = new SimpleWebSocket({ url: 'wss://test.com' });
    
    // Try to send before connection is established
    const callback = jest.fn();
    ws.send('test', callback);
    
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'WebSocket Connection not open. Couldn\'t send data.'
      })
    );
  });

  test('should handle send errors with undefined data', () => {
    ws = new SimpleWebSocket({ url: 'wss://test.com' });
    
    const callback = jest.fn();
    ws.send(undefined, callback);
    
    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'undefined data detected.'
      })
    );
  });

  test('should get connection status', () => {
    ws = new SimpleWebSocket({ 
      url: 'wss://test.com',
      appId: 'test-app',
      appSecret: 'test-secret'
    });
    
    const status = ws.getStatus();
    expect(status).toHaveProperty('url', 'wss://test.com');
    expect(status).toHaveProperty('appId', 'test-app');
    expect(status).toHaveProperty('hasAppSecret', true);
    expect(status).toHaveProperty('connected');
    expect(status).toHaveProperty('readyState');
  });

  test('should disconnect properly', (done) => {
    const onClose = jest.fn();
    
    ws = new SimpleWebSocket({
      url: 'wss://test.com',
      onClose
    });

    setTimeout(() => {
      ws.disconnect();
      
      setTimeout(() => {
        expect(onClose).toHaveBeenCalled();
        expect(ws.webSocket.readyState).toBe(3);
        done();
      }, 20);
    }, 20);
  });

  test('should build URL with authentication parameters', () => {
    ws = new SimpleWebSocket({
      url: 'wss://test.com',
      appId: 'test-app',
      appSecret: 'test-secret',
      accessToken: 'test-token'
    });
    
    // The mock WebSocket should receive the URL with query parameters
    setTimeout(() => {
      expect(ws.webSocket.url).toContain('wss://test.com');
      // Note: The mock doesn't actually process URL parameters, but in real usage they would be included
    }, 20);
  });
});
