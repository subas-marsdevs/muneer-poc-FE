import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import {
  ArrowUp,
  // ChevronUpDown
} from "../assets/icons";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useChatActions } from "../store/chat-store";
import { websocketService } from "../services/websocket-service";

export default function ChatPanel() {
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  // const [isConnected, setIsConnected] = useState(false);
  const { addMessage, updateLastMessageContent } = useChatActions();
  const currentAnswerRef = useRef("");
  const isConnectedRef = useRef(false);

  useEffect(() => {
    // Connect to WebSocket when component mounts
    websocketService.connect(
      "wss://api-muneer.marsdevs.com/api/v1/chat/agent/ws"
    );

    // Set up event handlers
    websocketService.onConnectMessage(() => {
      console.log("WebSocket connected successfully");
      // setIsConnected(true);
    });

    websocketService.onChunkMessage((content: string) => {
      console.log("Received chunk:", content);
      console.log("Current answer before update:", currentAnswerRef.current);

      // Add a small delay to make the streaming more visible
      setTimeout(() => {
        currentAnswerRef.current += content;
        console.log("Current answer after update:", currentAnswerRef.current);
        updateLastMessageContent({
          answer: currentAnswerRef.current,
          isLoading: false, // Set loading to false when we receive the first chunk
        });
      }, 1000); // 50ms delay between chunks
    });

    websocketService.onSourcesMessage((sources: { [key: string]: any }) => {
      console.log("Received sources in chat panel:", sources);
      // console.log("Sources type:", typeof sources);
      // console.log("Sources keys:", Object.keys(sources));
      // console.log("Sources content:", sources);
      updateLastMessageContent({ sources });
      setIsLoading(false);
    });

    websocketService.onErrorMessage((error: string) => {
      console.error("WebSocket error:", error);
      // setIsConnected(false);
      updateLastMessageContent({
        answer: "Sorry, there was an error processing your request.",
        isLoading: false,
      });
      setIsLoading(false);
    });

    websocketService.onCloseMessage(() => {
      // console.log("WebSocket closed");
      // setIsConnected(false);
      isConnectedRef.current = false;
      setIsLoading(false);
    });

    // Add connection status tracking
    const checkConnection = () => {
      if (websocketService.isConnected()) {
        // setIsConnected(true);
      } else {
        // setIsConnected(false);
      }
    };

    // Check connection status after a short delay
    setTimeout(checkConnection, 1000);

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [updateLastMessageContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    setIsLoading(true);
    currentAnswerRef.current = ""; // Reset current answer

    // Create initial message with loading state
    const initialMessage = {
      question: question,
      content: {
        answer: "",
        sources: {},
      },
      timestamp: new Date().toISOString(),
      isLoading: true,
    };

    // console.log("Creating initial message:", initialMessage);
    addMessage(initialMessage);
    // console.log("Initial message added to store");

    try {
      // Send message via WebSocket
      websocketService.sendMessage({
        query: question,
        // Add any other required fields
      });

      isConnectedRef.current = true;
    } catch (error) {
      updateLastMessageContent({
        answer: "Sorry, there was an error processing your request.",
        sources: {},
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  return (
    <div
      className={`w-full bg-background flex flex-col items-center fixed bottom-0 h-fit px-4 pb-4`}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full mx-auto relative bg-muted rounded-3xl p-2 border border-input"
      >
        <div className="relative flex-1 flex items-center gap-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full resize-none min-h-12 outline-none px-4 py-3 text-sm bg-transparent"
            placeholder="Ask me anything..."
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-2">
            {/* Connection status indicator */}
            {/* <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-muted-foreground">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div> */}
            {/* <Menu>
              <MenuButton className="inline-flex gap-2 items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-sm rounded-full shadow-none focus:ring-0 cursor-pointer">
                Language
                <ChevronUpDown className="h-[14px] w-[14px]" />
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom end"
                className="w-32 origin-top-right rounded-xl border border-white/5 bg-popover p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              >
                <MenuItem>
                  <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    English
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                    Arabic
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu> */}
          </div>

          <Button
            type="submit"
            size="icon"
            variant="outline"
            className={`${isLoading ? "animate-pulse" : ""} rounded-full`}
            disabled={!input.trim() || isLoading}
          >
            <ArrowUp />
          </Button>
        </div>
      </form>
    </div>
  );
}

// what the cause of covid and how many percentages all sudden infant deaths and which vaccine Japanese government released and how to cure covid
