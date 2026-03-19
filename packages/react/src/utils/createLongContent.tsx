import React from 'react';

export default function LongContent() {
  return (
    <>
      {Array.from({ length: 50 }, (_, i) => (
        <p key={i}>Modal content here, get your modal content here!</p>
      ))}
    </>
  );
}
