/**
 * @fileoverview A simple WebSocket client with app authentication support
 * @author Your Name
 * @version 1.0.0
 */

/**
 * Simple WebSocket client class with app authentication
 * @class SimpleWebSocket
 */
export class SimpleWebSocket {
    /**
     * Create a new SimpleWebSocket instance
     * @param {Object} options - Configuration options
     * @param {string} options.url - WebSocket URL (required)
     * @param {string} options.accessToken - Access token for authentication
     * @param {string} options.appId - App ID for authentication
     * @param {string} options.appSecret - App secret for authentication
     * @param {Function} options.onConnect - Connection established callback
     * @param {Function} options.onMessage - Message received callback
     * @param {Function} options.onError - Error callback
     * @param {Function} options.onClose - Connection closed callback
     */
    constructor(options = {}) {
        if (!options.url) {
            throw new Error('url is required in the options.');
        }

        this.url = options.url;
        this.accessToken = options.accessToken || '';
        this.appId = options.appId;
        this.appSecret = options.appSecret;
        this.options = options;

        // Bind methods to preserve context
        this.connect = this.connect.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onClose = this.onClose.bind(this);
        this.send = this.send.bind(this);
        this.disconnect = this.disconnect.bind(this);

        // Initialize connection
        this.connect();
    }

    /**
     * Handle WebSocket errors
     * @param {Event} err - Error event
     * @private
     */
    onError(err) {
        if (this.options.onError) {
            this.options.onError(err);
        } else {
            console.error('WebSocket Error:', err);
        }
    }

    /**
     * Handle incoming WebSocket messages
     * @param {MessageEvent} payload - Message event
     * @private
     */
    onMessage(payload) {
        const data = payload.data;
        if (this.options.onMessage) {
            this.options.onMessage(data);
        } else {
            console.debug('WebSocket Message:', data);
        }
    }

    /**
     * Handle WebSocket connection close
     * @private
     */
    onClose() {
        if (this.options.onClose) {
            this.options.onClose();
        } else {
            console.info('WebSocket Connection Closed.');
        }
    }

    /**
     * Handle WebSocket connection establishment
     * @param {Event} connection - Connection event
     * @private
     */
    onConnect(connection) {
        this.webSocketConnection = connection;
        
        // Set up event handlers
        if (this.webSocket) {
            this.webSocket.onerror = this.onError;
            this.webSocket.onmessage = this.onMessage;
            this.webSocket.onclose = this.onClose;
        }
        
        if (this.options.onConnect) {
            this.options.onConnect(connection);
        } else {
            console.info('WebSocket Connection established.');
        }
    }

    /**
     * Establish WebSocket connection
     * @private
     */
    connect() {
        if (typeof window !== 'undefined' && window.WebSocket) {
            // Build URL with authentication parameters
            const url = new URL(this.url);
            if (this.appId) url.searchParams.append('appId', this.appId);
            if (this.appSecret) url.searchParams.append('appSecret', this.appSecret);
            if (this.accessToken) url.searchParams.append('token', this.accessToken);
            
            console.log('Connecting to WebSocket:', url.toString());
            
            try {
                this.webSocket = new window.WebSocket(url.toString());
                
                // Set binary type before setting up event handlers
                this.webSocket.binaryType = 'arraybuffer';
                
                // Set up event handlers
                this.webSocket.onopen = this.onConnect;
                this.webSocket.onerror = this.onError;
                this.webSocket.onmessage = this.onMessage;
                this.webSocket.onclose = this.onClose;
                
            } catch (error) {
                console.error('Failed to create WebSocket connection:', error);
                this.onError(error);
            }
        } else {
            const error = new Error('WebSocket is not supported in this environment');
            this.onError(error);
        }
    }

    /**
     * Send data through the WebSocket connection
     * @param {*} data - Data to send
     * @param {Function} cb - Callback function for success/error
     */
    send(data, cb) {
        if (!data) {
            const error = { message: 'undefined data detected.' };
            if (cb) {
                cb(error);
            } else {
                console.warn(error.message);
            }
            return;
        }

        if (!this.webSocket) {
            const error = { message: 'WebSocket not initialized.' };
            if (cb) {
                cb(error);
            } else {
                console.warn(error.message);
            }
            return;
        }

        try {
            if (this.webSocket.readyState === 1) { // WebSocket.OPEN
                this.webSocket.send(data);
                if (cb) cb(null, { success: true });
            } else {
                const error = { 
                    message: 'WebSocket Connection not open. Couldn\'t send data.',
                    readyState: this.webSocket.readyState
                };
                if (cb) {
                    cb(error);
                } else {
                    console.warn(error.message);
                }
            }
        } catch (e) {
            const error = { message: 'Error while sending the data.', originalError: e };
            if (cb) {
                cb(error);
            } else {
                console.error('Error while sending the data:', e);
            }
        }
    }

    /**
     * Disconnect the WebSocket connection
     */
    disconnect() {
        if (this.webSocket) {
            this.webSocket.close();
        }
    }

    /**
     * Get the current connection status
     * @returns {Object} Connection status information
     */
    getStatus() {
        if (!this.webSocket) {
            return {
                connected: false,
                readyState: 'NOT_INITIALIZED',
                url: this.url
            };
        }

        return {
            connected: this.webSocket.readyState === 1,
            readyState: this.webSocket.readyState,
            url: this.url,
            appId: this.appId,
            hasAppSecret: !!this.appSecret,
            hasAccessToken: !!this.accessToken
        };
    }
}

// Export default
export default SimpleWebSocket;
