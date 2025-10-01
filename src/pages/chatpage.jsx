"use client";
import { useState, useEffect, useRef } from "react";
import { saveConversations, loadConversations } from "../utils/storage";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [qa, setQa] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  // Load conversations + QA
  useEffect(() => {
    const saved = loadConversations();
    if (saved) {
      setConversations(saved.conversations || []);
      setQa(saved.qa || {});
    } else {
      fetch("/stubs.json")
        .then((res) => res.json())
        .then((data) => {
          setQa(data.qa || {});
          saveConversations({ conversations: [], qa: data.qa || {} });
        });
    }
  }, []);

  // Default active conversation
  useEffect(() => {
    if (!activeConv) {
      setActiveConv(
        conversations[0] || {
          id: "default",
          title: "How Can I Help You Today?",
          createdAt: new Date().toISOString(),
          messages: [],
          feedback: { thumbsUp: false, thumbsDown: false, rating: 0, comment: "" },
        }
      );
    }
  }, [conversations, activeConv]);

  // Scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  // --- fix lookup ---
  const findAnswer = (q) => {
    const lowerQ = q.toLowerCase();
    const match = Object.keys(qa).find((k) =>
      lowerQ.includes(k.toLowerCase())
    );
    return match ? qa[match] : "Sorry, Did not understand your query!";
  };

  // --- fix addMessage persistence ---
  const addMessage = (from, text) => {
    const newMsg = { from, text, ts: new Date().toISOString() };
    const updated = {
      ...activeConv,
      messages: [...(activeConv.messages || []), newMsg],
    };
    const newConvs = conversations.map((c) =>
      c.id === updated.id ? updated : c
    );
    setConversations(newConvs);
    setActiveConv(updated);
    saveConversations({ conversations: newConvs, qa }); // persist
  };

  const handleAsk = (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    addMessage("user", question);
    const answer = findAnswer(question);

    setIsLoading(true);
    setTimeout(() => {
      addMessage("ai", answer);
      setIsLoading(false);
    }, 300);

    setInput("");
  };

  // --- fix New Chat button ---
  const createNewConversation = () => {
    const newConv = {
      id: Date.now().toString(),
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      messages: [],
      feedback: { thumbsUp: false, thumbsDown: false, rating: 0, comment: "" },
    };
    setConversations([newConv, ...conversations]);
    setActiveConv(newConv);
    saveConversations({ conversations: [newConv, ...conversations], qa });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">Bot AI</h1>
        <nav className="flex gap-4">
          {/* --- fixed New Chat button --- */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              createNewConversation();
            }}
          >
            New Chat
          </a>
          <a href="/history">Past Conversations</a>
        </nav>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        {activeConv?.messages?.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${msg.from === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.from === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {isLoading && <span className="text-gray-500">Soul AI is typing...</span>}
        <div ref={endRef} />
      </main>

      {/* Input */}
      <form onSubmit={handleAsk} className="p-4 bg-white border-t flex">
        <input
          type="text"
          placeholder="Message Bot AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
