import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-axe/extend-expect';

configure({ adapter: new Adapter() });
