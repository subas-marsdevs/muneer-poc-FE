import { useState, useCallback } from "react";

export interface Source {
  document_id: number;
  page_number: number;
  source_location: string;
  similarity: number;
  chunk_text: string;
  filename: string;
  file_path: string;
  file_url: string;
}

export interface ChatAnswer {
  answer: string;
  sources: { [key: string]: Source };
}

export interface ChatMessage {
  question: string;
  content: ChatAnswer;
  timestamp: string;
  isLoading?: boolean;
}

// Simple state management without external libraries
let messages: ChatMessage[] = [];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useChatMessages = () => {
  const [, forceUpdate] = useState({});

  const subscribe = useCallback(() => {
    const listener = () => forceUpdate({});
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  useState(() => {
    subscribe();
  });

  return messages;
};

export const useChatActions = () => {
  const addMessage = useCallback((message: ChatMessage) => {
    messages = [...messages, message];
    notifyListeners();
  }, []);

  const updateLastMessage = useCallback((message: ChatMessage) => {
    if (messages.length > 0) {
      messages = [...messages.slice(0, -1), message];
      notifyListeners();
    }
  }, []);

  const clearMessages = useCallback(() => {
    messages = [];
    notifyListeners();
  }, []);

  return { addMessage, updateLastMessage, clearMessages };
};
