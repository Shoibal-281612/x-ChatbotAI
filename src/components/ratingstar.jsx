import React from 'react';

export default function RatingStars({ value = 0, onChange }) {
  return (
    <div className="rating-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={i <= value ? 'selected' : ''}
          onClick={() => onChange(i)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
