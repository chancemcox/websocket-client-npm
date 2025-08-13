/**
 * @fileoverview Main entry point for the WebSocket client package
 * @author Your Name
 * @version 1.0.0
 */

// Export the advanced WebSocket client with reconnection support
export { WebSocketClient, createWebSocketClient } from './WebSocketClient.js';

// Export the simple WebSocket client with app authentication
export { SimpleWebSocket } from './SimpleWebSocket.js';

// Default export for backward compatibility
export { WebSocketClient as default } from './WebSocketClient.js';
