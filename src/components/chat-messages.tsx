import { Upload } from "../assets/icons";
import { useSidebarActions } from "../store/sidebar-store";
import { useChatMessages } from "../store/chat-store";
import { useRef, useEffect, useCallback } from "react";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
import { BotMessage } from "./ui/messages";

export default function ChatMessages() {
  const { setIsOpenSourceUpload } = useSidebarActions();
  const messages = useChatMessages();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const scrollToBottom = useCallback(() => {
    // Method 1: Direct container scroll (most reliable)
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      // Force scroll to absolute bottom
      container.scrollTop = container.scrollHeight;

      // Additional scroll attempts to ensure we're at the bottom
      // setTimeout(() => {
      //   container.scrollTop = container.scrollHeight;
      // }, 10);

      // setTimeout(() => {
      //   container.scrollTop = container.scrollHeight;
      // }, 50);

      // setTimeout(() => {
      //   container.scrollTop = container.scrollHeight;
      // }, 100);
    }

    // Method 2: Scroll to the last message element
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "auto",
        block: "end",
        inline: "nearest",
      });
    }

    // Method 3: Scroll the window as fallback
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "auto",
    });
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Immediate scroll
      scrollToBottom();

      // // Multiple scroll attempts to ensure we reach the bottom
      // const timeout1 = setTimeout(() => scrollToBottom(), 100);
      // const timeout2 = setTimeout(() => scrollToBottom(), 300);
      // const timeout3 = setTimeout(() => scrollToBottom(), 600);
      // const timeout4 = setTimeout(() => scrollToBottom(), 1000);

      // return () => {
      //   clearTimeout(timeout1);
      //   clearTimeout(timeout2);
      //   clearTimeout(timeout3);
      //   clearTimeout(timeout4);
      // };
    }
  }, [messages, scrollToBottom]);

  return (
    <div
      id="scroll-container"
      ref={scrollContainerRef}
      role="list"
      aria-roledescription="chat messages"
      className="flex-1 w-full overflow-y-auto"
      style={{
        height: "100vh",
        paddingTop: "3.5rem",
        paddingBottom: "12rem",
      }}
    >
      {messages.length > 0 ? (
        <div className="relative mx-auto w-full max-w-3xl px-4 pb-4">
          <div className="space-y-6">
            {messages.map((message, index) => {
              const isLastMessage = index === messages.length - 1;
              return (
                <div
                  key={`${message.question}-${index}`}
                  className="space-y-4"
                  ref={isLastMessage ? lastMessageRef : null}
                >
                  {/* Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-primary text-primary-foreground">
                      <div className="flex flex-col gap-1">
                        <p className="text-sm whitespace-pre-wrap">
                          {message.question}
                        </p>
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  <div className="flex justify-start">
                    <div className="max-w-full rounded-2xl px-4 py-3 text-foreground bg-muted">
                      <div className="flex flex-col gap-3 prose-sm prose-neutral prose-a:text-accent-foreground/50 ">
                        {message.isLoading ? (
                          <div className="flex items-center gap-1 ">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-current rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-current rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                            <span className="text-xs">AI is thinking...</span>
                          </div>
                        ) : (
                          <>
                            <BotMessage
                              message={message.content.answer}
                              sources={message.content.sources}
                            />
                            {/* <Markdown remarkPlugins={[remarkGfm]}>
                              {message.content.answer}
                            </Markdown> */}
                            {/* <p className="text-sm whitespace-pre-wrap">
                              {message.content.answer}
                            </p> */}

                            {/* Sources */}
                            {/* {Object.keys(message.content.sources).length > 0 && (
                              <div className="flex flex-col gap-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                  Sources:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(message.content.sources).map(
                                    ([key, source]) => (
                                      <button
                                        key={key}
                                        className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded-md hover:bg-accent/80 transition-colors"
                                        onClick={() => {
                                          // Handle source click - could open modal or navigate
                                          console.log("Source clicked:", source);
                                        }}
                                      >
                                        {source.filename} (p.{source.page_number})
                                      </button>
                                    )
                                  )}
                                </div>
                              </div>
                            )} */}

                            {/* <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span> */}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-3xl px-4 h-full flex flex-col justify-center items-center gap-3">
          <button
            onClick={() => setIsOpenSourceUpload(true)}
            className="inline-flex items-center justify-center bg-accent-blue text-sidebar-primary p-1 h-12 w-12 rounded-full cursor-pointer"
          >
            <Upload />
          </button>
          <h5 className="text-2xl font-medium text-foreground">
            Add a source to get started
          </h5>
          <button
            onClick={() => setIsOpenSourceUpload(true)}
            className="flex items-center justify-center w-40 gap-2 h-10 py-3 px-5 text-muted-foreground border border-muted-foreground rounded-4xl cursor-pointer"
          >
            <span className="text-sm font-poppins">Upload a source</span>
          </button>
        </div>
      )}
    </div>
  );
}
