export interface WebSocketMessage {
  type: "answer" | "sources";
  content: string | { [key: string]: any };
  done: boolean;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private onChunk: ((content: string) => void) | null = null;
  private onSources: ((sources: { [key: string]: any }) => void) | null = null;
  private onError: ((error: string) => void) | null = null;
  private onClose: (() => void) | null = null;
  private onConnect: (() => void) | null = null;

  connect(url: string) {
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.onConnect?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          //   console.log("WebSocket message received:", data);
          //   console.log("Message type:", data.type);
          //   console.log("Message content:", data.content);

          if (data.type === "answer") {
            // console.log("Processing chunk message");
            this.onChunk?.(data.content as string);
          } else if (data.type === "sources") {
            // console.log("Processing sources message");
            // console.log("Sources content:", data.content);
            // console.log("Sources type:", typeof data.content);
            // console.log("Sources keys:", Object.keys(data.content));
            this.onSources?.(data.content as { [key: string]: any });
          }
        } catch (error) {
          //   console.error("Error parsing WebSocket message:", error);
          this.onError?.("Failed to parse message");
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket connection error:", error);
        this.onError?.("WebSocket connection error");
      };

      this.ws.onclose = () => {
        this.onClose?.();
      };
    } catch (error) {
      this.onError?.("Failed to create WebSocket connection");
    }
  }

  sendMessage(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      this.onError?.("WebSocket is not connected");
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  onChunkMessage(callback: (content: string) => void) {
    this.onChunk = callback;
  }

  onSourcesMessage(callback: (sources: { [key: string]: any }) => void) {
    this.onSources = callback;
  }

  onErrorMessage(callback: (error: string) => void) {
    this.onError = callback;
  }

  onCloseMessage(callback: () => void) {
    this.onClose = callback;
  }

  onConnectMessage(callback: () => void) {
    this.onConnect = callback;
  }
}

export const websocketService = new WebSocketService();
