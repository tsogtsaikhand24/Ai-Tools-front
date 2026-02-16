"use client";

import { useEffect, useState, useRef } from "react";
import SendIcon from "../_icons/SendIcon";
import XIcon from "../_icons/XIcon";
import { BACK_END_URL } from "../_constants";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatBotProps = {
  onClose: () => void;
};

export default function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACK_END_URL}/chat/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="border rounded-lg bg-white">
      <div className="h-12 px-4 py-2 flex justify-between items-center">
        <div className="text-[16px] font-bold">Chat assistant</div>
        <div
          onClick={onClose}
          className="w-8 h-8 flex justify-center items-center border rounded-md cursor-pointer"
        >
          <XIcon />
        </div>
      </div>

      <div className="h-72 py-4 px-6 border-t border-b overflow-y-auto">
        <div className="flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`rounded-xl py-2 px-4 max-w-xs ${
                msg.role === "user"
                  ? "self-end bg-blue-600 text-white"
                  : "self-start bg-black/90 text-white"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div className="self-start text-sm text-gray-400">typing...</div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="py-2 px-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="w-75 h-10 py-2 px-3 border rounded-lg"
        />
        <div
          onClick={handleSend}
          className="bg-black w-10 h-10 flex items-center justify-center rounded-full cursor-pointer"
        >
          <SendIcon />
        </div>
      </div>
    </div>
  );
}
