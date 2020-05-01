import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-axe/extend-expect';

configure({ adapter: new Adapter() });
