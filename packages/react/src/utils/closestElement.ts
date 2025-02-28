type GraphElement = {
  element: HTMLElement;
  x: number;
  y: number;
  height: number;
  dx: number;
  dy: number;
};

function elementsGraph(elements: HTMLElement[], idx: number): GraphElement[] {
  const { x, y } = elements[idx].getBoundingClientRect();
  return elements.map((element) => {
    const { x: eX, y: eY, height: eHeight } = element.getBoundingClientRect();
    return {
      element,
      x: eX,
      y: eY,
      height: eHeight,
      dx: x - eX,
      dy: y - eY
    };
  });
}

type Dir = 'up' | 'down';

/**
 * Perform search for the closest element in the array of elements relative to the currently selected element.
 * Searches for the elements in the direction `dir`.
 * If the element couldn't be found, returns currenly selected element.
 * @param elements array of elements to search closest for
 * @param idx index of the currently selected element
 * @param dir direction of search
 * @param margin element margin value
 * @returns
 */
export function closestElement(
  elements: HTMLElement[],
  idx: number,
  dir: Dir,
  margin = 8
): HTMLElement {
  const mult = dir === 'up' ? -1 : 1;
  const graph = elementsGraph(elements, idx);
  const { height } = graph[idx];
  let min = Infinity,
    next = undefined;
  for (const { element, dx, dy } of graph) {
    if (Math.abs(dy + mult * height) <= margin) {
      const dxAbs = Math.abs(dx);
      // search closest element by absolute value of dx
      if (dxAbs < min) {
        min = dxAbs;
        next = element;
      }
    }
  }
  return next ?? elements[idx];
}
