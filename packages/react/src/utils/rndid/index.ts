let i = 0;

const randomId = () => {
  const num = Math.floor(Math.random() * 10000) + 1;
  return `x_${i++}_${num}`;
};

export default randomId;
