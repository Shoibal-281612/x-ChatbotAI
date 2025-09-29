import React from 'react';

export default function FeedbackFloating({ onThumbs }) {
  return (
    <div className="feedback-floating">
      <button onClick={() => onThumbs('up')} aria-label="thumbs up">
        👍
      </button>
      <button onClick={() => onThumbs('down')} aria-label="thumbs down">
        👎
      </button>
    </div>
  );
}
