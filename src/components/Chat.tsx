import React, { useState, useRef, useEffect } from "react";
import type { Message } from "../types";
import ReactMarkdown from "react-markdown";


const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "agent", content: "Namaste! How can I assist you today with your exploration of the Upanishads or Vedic philosophy?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ref to scroll to automatically scroll to bottom of chat.
  const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages, loading]);


  // Dynamically adjust textarea height based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "40px"; // Reset to initial height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Limit max height to 120px
    }
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { sender: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      console.log("Sending message to API:", import.meta.env.VITE_API_URL);
      const res = await fetch(import.meta.env.VITE_API_URL + "/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { sender: "agent", content: data.response },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { sender: "agent", content: "⚠️ Error communicating with the agent." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Placeholder for additional buttons (e.g., voice/mic)
  // const handleVoiceClick = () => {
  //   // Add voice functionality if needed
  //   console.log("Voice button clicked");
  // };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.sender === "user" ? "chat-bubble-user" : "chat-bubble-agent"
            }
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>

            <div ref={messagesEndRef} />
          </div>
        ))}
        {loading && (
          <div className="typing-indicator">
            Typing...
          </div>
        )}
      </div>
      <div className="input-container">
  <div className="input-wrapper">
    <textarea
      ref={textareaRef}
      className="input-field"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={handleKeyPress}
      placeholder="Ask something about the Upanishads..."
    />
    <button
      onClick={sendMessage}
      className="send-button"
      disabled={loading}
      title="Send"
    >
      ⬆
    </button>
  </div>
</div>

    </div>
  );
};

export default Chat;