import { closestElement } from './closestElement';

// Elements layout:
//  (*  0  )(*   1    )(* 2 )
//  (* 3 )(*   4   )(*  5   )
//  (*  6  )[*      7       ]
// start indicates the x,y coordinate of the element
// all elements are of height 10
// and each element has margin of 1 at the top and bottom
const positions = [
  { x: 0, y: 1, height: 10 },
  { x: 6, y: 1, height: 10 },
  { x: 15, y: 1, height: 10 },
  { x: 0, y: 13, height: 10 },
  { x: 4, y: 13, height: 10 },
  { x: 12, y: 13, height: 10 },
  { x: 0, y: 25, height: 10 },
  { x: 6, y: 25, height: 10 }
];

test('should return closest element in the "up" direction', () => {
  const elements = positions.map(
    (pos) =>
      ({
        getBoundingClientRect: () => pos as DOMRect
      } as HTMLElement)
  );

  const closest = closestElement(elements, 4, 'up', 2);
  expect(closest.getBoundingClientRect()).toBe(
    elements[1].getBoundingClientRect()
  );
});

test('should return the same element if no elements in the "up" direction', () => {
  const elements = positions.map(
    (pos) =>
      ({
        getBoundingClientRect: () => pos as DOMRect
      } as HTMLElement)
  );

  const closest = closestElement(elements, 1, 'up', 2);
  expect(closest.getBoundingClientRect()).toBe(
    elements[1].getBoundingClientRect()
  );
});

test('should return closest element in the "down" direction', () => {
  const elements = positions.map(
    (pos) =>
      ({
        getBoundingClientRect: () => pos as DOMRect
      } as HTMLElement)
  );

  const closest = closestElement(elements, 4, 'down', 2);
  expect(closest.getBoundingClientRect()).toBe(
    elements[7].getBoundingClientRect()
  );
});

test('should return the same element if no elements in the "down" direction', () => {
  const elements = positions.map(
    (pos) =>
      ({
        getBoundingClientRect: () => pos as DOMRect
      } as HTMLElement)
  );

  const closest = closestElement(elements, 6, 'down', 2);
  expect(closest.getBoundingClientRect()).toBe(
    elements[6].getBoundingClientRect()
  );
});
