/**
 * Adds an id to a token list attribute if its not already present in the list
 */
const tokenList = (id: string, currentVal = '') => {
  const values = currentVal.split(' ');
  if (values.includes(id)) {
    return currentVal;
  }

  values.push(id);
  return values.join(' ');
};

export default tokenList;
