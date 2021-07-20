const cauldronEvent = (type: string, details?: EventInit) => {
  return new Event(`cauldron:${type}`, {
    bubbles: true,
    ...details
  });
};

export default cauldronEvent;
