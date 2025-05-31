export class WebSocketManager {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.onMessageCallback = null;
    this.onConnectedCallback = null;
    this.onDisconnectedCallback = null;
  }

  connect(url) {
    if (this.ws) {
      this.disconnect();
    }

    this.ws = new WebSocket(url);
    this.isConnected = false;

    this.ws.onopen = () => {
      this.isConnected = true;
      if (this.onConnectedCallback) {
        this.onConnectedCallback();
      }
    };

    this.ws.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      if (this.onDisconnectedCallback) {
        this.onDisconnectedCallback();
      }
    };

    this.ws.onerror = () => {
      this.isConnected = false;
      if (this.onDisconnectedCallback) {
        this.onDisconnectedCallback(new Error('WebSocket error'));
      }
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
    }
  }

  send(data) {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onConnected(callback) {
    this.onConnectedCallback = callback;
  }

  onDisconnected(callback) {
    this.onDisconnectedCallback = callback;
  }
}
