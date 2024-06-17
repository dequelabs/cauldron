import { screen } from '@testing-library/react';
import AriaIsolate from '../aria-isolate';

describe('AriaIsolate', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <div id="one">hello worlds</div>
      <div id="parent"><div id="isolate-me"></div></div>
      <div id="already-hidden" aria-hidden="true"></div>
      <span id="two">Fred</span>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('activate: isolates the target by applying aria-hidden="true" to expected nodes', () => {
    const target = screen.getByText(/isolate-me/i);
    const isolator = new AriaIsolate(target);

    isolator.activate();
    expect(isolator['affectedElements'].length).toBe(2);
    expect(isolator['affectedElements']).not.toContain(
      screen.getByText(/parent/i)
    );
    expect(isolator['affectedElements']).not.toContain(target);
    expect(isolator['affectedElements']).not.toContain(
      screen.getByText(/already-hidden/i)
    );

    isolator.deactivate();
  });

  test('deactivate: properly removes aria-hidden from each of the affectedElements', () => {
    const target = screen.getByText(/isolate-me/i);
    const isolator = new AriaIsolate(target);

    isolator.activate();
    expect(isolator['affectedElements'].length).toBe(2);

    isolator.deactivate();
    expect(screen.queryAllByLabelText(/true/).length).toBe(1);
  });
});
