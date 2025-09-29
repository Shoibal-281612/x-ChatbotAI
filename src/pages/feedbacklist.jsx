import React, { useState } from 'react';
import { loadConversations } from '../utils/storage';
import stubs from '../data/stubs.json';

export default function FeedbackOverview() {
  const stored = loadConversations() || stubs;
  const convos = stored.conversations || [];
  const [filterRating, setFilterRating] = useState(null);

  const filtered = convos.filter((c) =>
    filterRating ? c.feedback?.rating === filterRating : true
  );

  return (
    <div className="page-wrapper">
      <h1>All Feedback</h1>
      <div style={{ margin: '10px 0' }}>
        <label>Filter by rating: </label>
        <select onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}>
          <option value="">All</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      {filtered.map((c) => (
        <div key={c.id} className="history-item">
          <div className="meta">
            <div>
              <strong>{c.title}</strong>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {new Date(c.createdAt).toLocaleString()}
              </div>
              <div style={{ marginTop: '4px', fontSize: '0.9em' }}>
                {c.feedback?.comment || '-'}
              </div>
            </div>
            <div>Rating: {c.feedback?.rating || 0}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
