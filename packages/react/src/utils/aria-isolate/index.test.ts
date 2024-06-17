import { screen } from '@testing-library/react';
import AriaIsolate from '../aria-isolate';

describe('AriaIsolate', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <div id="one">hello worlds</div>
      <div data-testid="parent">
        <div data-testid="isolate-me"></div>
      </div>
      <div data-testid="already-hidden" aria-hidden="true"></div>
      <span id="two">Fred</span>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('activate: isolates the target by applying aria-hidden="true" to expected nodes', () => {
    const target = screen.getByTestId(/isolate-me/i);
    const isolator = new AriaIsolate(target);

    isolator.activate();
    expect(isolator['affectedElements'].length).toBe(2);
    expect(isolator['affectedElements']).not.toContain(
      screen.getByTestId(/parent/i)
    );
    expect(isolator['affectedElements']).not.toContain(target);
    expect(isolator['affectedElements']).not.toContain(
      screen.getByTestId(/already-hidden/i)
    );

    isolator.deactivate();
  });

  test('deactivate: properly removes aria-hidden from each of the affectedElements', () => {
    const target = screen.getByTestId(/isolate-me/i);
    const isolator = new AriaIsolate(target);

    isolator.activate();
    expect(isolator['affectedElements'].length).toBe(2);

    isolator.deactivate();
    expect(isolator['affectedElements'].length).toBe(0);

    expect(document.querySelectorAll('[aria-hidden="true"]').length).toBe(1);
  });
});
