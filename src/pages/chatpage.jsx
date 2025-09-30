import React, { useEffect, useState, useRef } from 'react';
import ConversationList from '../components/conversationlist';
import MessageBubble from '../components/messagebubble';
import RatingStars from '../components/ratingstar';
import { ensureSeed, loadConversations, saveConversations } from '../utils/storage';
import stubs from '../data/stubs.json';

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const stored = loadConversations() || stubs;
  const [conversations, setConversations] = useState(stored.conversations);
  const [qa] = useState(stored.qa || {});
  const [activeConv, setActiveConv] = useState(conversations[0] || {
  id: 'default',
  title: 'How Can I  Help You Today?',
  messages: [],
  feedback: { thumbsUp: false, thumbsDown: false, rating: 0, comment: '' },
});
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    ensureSeed(stubs);
  }, []);

  useEffect(() => {
    saveConversations({ conversations, qa });
  }, [conversations]);

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
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleAsk = (e) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return; // Prevent input if already processing

    addMessage('user', question);
    const key = question.toLowerCase();
    const answer = qa[key] || 'Sorry, I did not understand your query.';

    setIsLoading(true); // Start loading state

    setTimeout(() => {
      addMessage('ai', answer);
      setIsLoading(false); // End loading state
    }, 300);

    setInput('');
  };

  const createNewConversation = () => {
    const newConv = {
      id: `conv-${Date.now()}`,
      title: 'New conversation',
      createdAt: new Date().toISOString(),
      messages: [],
      feedback: { thumbsUp: false, thumbsDown: false, rating: 0, comment: '' },
    };
    setConversations([newConv, ...conversations]);
    setActiveConv(newConv);
  };

  const saveConversation = () => {
    saveConversations({ conversations, qa });
    alert('Saved locally');
  };

  const handleThumbs = (type) => {
    const updated = {
      ...activeConv,
      feedback: {
        ...activeConv.feedback,
        thumbsUp: type === 'up',
        thumbsDown: type === 'down',
      },
    };
    const newConvs = conversations.map((c) =>
      c.id === updated.id ? updated : c
    );
    setConversations(newConvs);
    setActiveConv(updated);
  };

  const handleEndConversation = () => {
    const ratingStr = prompt('Please give a rating (1-5):');
    const rating = Math.min(5, Math.max(0, Number(ratingStr || 0)));
    const comment = prompt('Any subjective feedback (optional):') || '';
    const updated = {
      ...activeConv,
      feedback: { ...activeConv.feedback, rating, comment },
    };
    const newConvs = conversations.map((c) =>
      c.id === updated.id ? updated : c
    );
    setConversations(newConvs);
    setActiveConv(updated);
    saveConversations({ conversations: newConvs, qa });
  };

  const onSelectConversation = (c) => {
    setActiveConv(c);
  };

  return (
    <div className="main-container">
      <ConversationList
        conversations={conversations}
        onSelect={onSelectConversation}
      />
      <div className="chat-area">
        <div className="chat-header">
          <button onClick={createNewConversation}>Ask</button>
          <h2>{activeConv?.title || 'Start a conversation'}</h2>
          <div>
            <button type="button" onClick={saveConversation}>
              Save
            </button>
            <button onClick={handleEndConversation}>End & Rate</button>
          </div>
        </div>
        <div className="chat-body">
          {(activeConv?.messages || []).map((m, i) => (
            <MessageBubble key={i} msg={m} onThumbs={handleThumbs} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-form" onSubmit={handleAsk}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Bot AI…"
            disabled={isLoading} // Disable input when loading
          />
          <button type="submit" disabled={isLoading}>Ask</button>
        </form>
        {isLoading && <div className="typing-indicator">AI is typing...</div>}
      </div>
    </div>
  );
}
