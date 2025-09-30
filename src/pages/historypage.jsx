import React from 'react';
import { loadConversations } from '../utils/storage';
import stubs from '../data/stubs.json';

export default function HistoryPage() {
  const stored = loadConversations() || stubs;
  const convos = stored.conversations || [];

  return (
    <div className="page-wrapper">
      <h1>Past Conversations</h1>
      {convos.map((c) => (
        <div key={c.id} className="history-item">
          <div className="meta">
            <div>
              <strong>{c.title}</strong>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
            <div>Rating: {c.feedback?.rating || 0}/5</div>
          </div>
          <div style={{ marginTop: '8px' }}>
            {(c.messages || []).map((m, i) => (
              <div
                key={i}
                style={{
                  background: m.from === 'ai' ? '#f0f0f0' : '#d0e7ff',
                  padding: '6px',
                  borderRadius: '4px',
                  marginBottom: '4px',
                }}
              >
                <div style={{ fontSize: '0.8em', color: '#444' }}>
                  {m.from === 'ai' ? <span>Soul AI</span> : 'You'}
                </div>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '8px', borderTop: '1px solid #ccc', paddingTop: '6px', fontSize: '0.9em' }}>
            <div><strong>Thumbs UP:</strong> {c.feedback?.thumbsUp ? 'Yes' : 'No'}</div>
            <div><strong>Thumbs DOWN:</strong> {c.feedback?.thumbsDown ? 'Yes' : 'No'}</div>
            <div><strong>Rating:</strong> {c.feedback?.rating || 0}</div>
            <div><strong>Comment:</strong> {c.feedback?.comment || '-'}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
