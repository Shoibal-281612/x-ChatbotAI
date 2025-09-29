import React from 'react';

export default function ConversationList({ conversations, onSelect }) {
  return (
    <div className="sidebar">
      <h3>Past Conversations</h3>
      {conversations.map((c) => (
        <button
          key={c.id}
          className="conv-button"
          onClick={() => onSelect(c)}
        >
          <div>{c.title}</div>
          <div style={{ fontSize: '0.8em', color: '#666' }}>
            {new Date(c.createdAt).toLocaleString()}
          </div>
        </button>
      ))}
    </div>
  );
}
