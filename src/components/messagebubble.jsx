import React from 'react';
import FeedbackFloating from './feedbackfloating';

export default function MessageBubble({ msg, onThumbs }) {
  const isAI = msg.from === 'ai';
  const cls = `message-bubble ${isAI ? 'ai' : 'user'}`;
  return (
    <div className={cls}>
      {isAI && <div className="sender-label"><span>BOT AI</span></div>}
      <p>{msg.text}</p>
      {isAI && (
        <FeedbackFloating onThumbs={onThumbs} />
      )}
    </div>
  );
}
