import clickLink from './click-link';

describe('clickLink function', () => {
  let fixture: HTMLElement;
  let one: HTMLElement | null;
  let two: HTMLElement | null;

  beforeEach(() => {
    fixture = document.createElement('div');
    fixture.innerHTML = `
      <a id="link-one"></a>
      <a id="link-two"></a>
    `;
    document.body.appendChild(fixture);
    one = document.getElementById('link-one');
    two = document.getElementById('link-two');
  });

  afterEach(() => {
    document.body.removeChild(fixture);
  });

  test('clicks the first link within the target', () => {
    let firstCalled = false,
      secondCalled = false;
    const onFirstClick = () => {
      firstCalled = true;
    };
    const onSecondClick = () => {
      secondCalled = true;
    };

    if (one && two) {
      one.addEventListener('click', onFirstClick);
      two.addEventListener('click', onSecondClick);

      clickLink(fixture, fixture);

      expect(firstCalled).toBeTruthy();
      expect(secondCalled).toBeFalsy();

      one.removeEventListener('click', onFirstClick);
      two.removeEventListener('click', onSecondClick);
    }
  });

  test('does nothing if the target is an anchor', () => {
    let firstCalled = false,
      secondCalled = false;
    const onFirstClick = () => {
      firstCalled = true;
    };
    const onSecondClick = () => {
      secondCalled = true;
    };

    if (one && two) {
      one.addEventListener('click', onFirstClick);
      two.addEventListener('click', onSecondClick);

      clickLink(one, one);

      expect(firstCalled).toBeFalsy();
      expect(secondCalled).toBeFalsy();

      one.removeEventListener('click', onFirstClick);
      two.removeEventListener('click', onSecondClick);
    }
  });

  test('does nothing if there are no links within the target', () => {
    const divWithoutLinks = document.createElement('div');
    document.body.appendChild(divWithoutLinks);

    let clickCalled = false;
    divWithoutLinks.addEventListener('click', () => {
      clickCalled = true;
    });

    clickLink(divWithoutLinks);

    expect(clickCalled).toBeFalsy();

    document.body.removeChild(divWithoutLinks);
  });
});
