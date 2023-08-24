import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-axe/extend-expect';

configure({ adapter: new Adapter() });

if (
  !Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerText')
) {
  // JSDOM doesn't fully support innerText, but we can fall back to
  // using textContent for now until this gets patched
  Object.defineProperty(window.HTMLElement.prototype, 'innerText', {
    get() {
      return this.textContent;
    },
  });
}
