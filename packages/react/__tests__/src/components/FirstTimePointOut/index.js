import React from 'react';
import { shallow, mount } from 'enzyme';
import FirstTimePointOut from 'src/components/FirstTimePointOut';
import axe from '../../../axe';

const defaults = {};

test('handles "noArrow" prop properly', () => {
  expect.assertions(1);
  const ftpo = shallow(
    <FirstTimePointOut noArrow={true} {...defaults}>
      {'hello'}
    </FirstTimePointOut>
  );

  expect(ftpo.hasClass('Pointout--no-arrow')).toBeTruthy();
});

test('handles "arrowPosition" prop', () => {
  const ftpo = shallow(
    <FirstTimePointOut arrowPosition="top-right" {...defaults}>
      {'hello'}
    </FirstTimePointOut>
  );

  expect(ftpo.find('.Pointout__arrow.Pointout__arrow--top-right')).toBeTruthy();
});

test('returns null given a falsey "show" state', () => {
  expect.assertions(1);
  const ftpo = mount(
    <FirstTimePointOut {...defaults}>{'hello'}</FirstTimePointOut>
  );

  ftpo.setState(
    {
      show: false
    },
    () => {
      expect(ftpo.html()).toBe(null);
    }
  );
});

test('calls onClose prop when close is clicked', () => {
  let called = false;
  const onClose = () => (called = true);
  const ftpo = mount(
    <FirstTimePointOut {...defaults} onClose={onClose}>
      {'hello'}
    </FirstTimePointOut>
  );

  ftpo.find('.Pointout__dismiss').simulate('click');
  expect(called).toBe(true);
});

test('accepts the dismissText prop', () => {
  expect.assertions(1);
  const ftpo = mount(
    <FirstTimePointOut {...defaults} dismissText={'Fred'}>
      {'hello'}
    </FirstTimePointOut>
  );

  expect(
    ftpo.find('.Pointout__dismiss[aria-label="Fred"]').exists()
  ).toBeTruthy();
});

test('accepts className prop', () => {
  const ftpo = mount(
    <FirstTimePointOut {...defaults} dismissText={'Fred'} className="foo">
      {'hello'}
    </FirstTimePointOut>
  );

  expect(ftpo.find('.Pointout.foo').exists()).toBeTruthy();
});

test('renders to portal when using a target', () => {
  const ftpo = mount(
    <FirstTimePointOut
      {...defaults}
      target={{
        getBoundingClientRect() {
          return { top: 0, left: 0, height: 0, width: 0 };
        }
      }}
    >
      {'hello'}
    </FirstTimePointOut>
  );
  expect(ftpo.find('Portal').exists()).toBeTruthy();
});

test('should be positioned relative to target', () => {
  const ftpo = mount(
    <FirstTimePointOut
      {...defaults}
      arrowPosition="top-left"
      target={{
        getBoundingClientRect() {
          return { top: 123, left: 456, height: 200, width: 100 };
        }
      }}
    >
      {'hello'}
    </FirstTimePointOut>
  );
  const { top, left } = ftpo
    .find('Portal')
    .find('.Pointout')
    .prop('style');
  expect(top).toEqual('323px');
  expect(left).toEqual('506px');
});

test('should associate FTPO with heading id', () => {
  const ftpo = mount(
    <FirstTimePointOut heading={<h4>heading</h4>} {...defaults}>
      {'hello'}
    </FirstTimePointOut>
  );
  ftpo.update();

  const heading = ftpo.find('h4');
  const wrap = ftpo.find('.Pointout');

  expect(typeof heading.prop('id') === 'string').toBeTruthy();
  expect(heading.prop('id')).toEqual(wrap.prop('aria-labelledby'));
});

test('should mirror focus to visual FTPO', () => {
  const ftpo = mount(
    <FirstTimePointOut
      {...defaults}
      arrowPosition="top-left"
      target={{
        getBoundingClientRect() {
          return { top: 0, left: 0, height: 0, width: 0 };
        }
      }}
    >
      Hello <a href="#foo">Cruel World</a>
    </FirstTimePointOut>
  );

  const offscreenFTPO = ftpo.find('.Offscreen');
  const visibleFTPO = ftpo.find('.Pointout');
  const [
    offscreenFocusableButton,
    offscreenFocusableAnchor
  ] = ftpo.instance().getFocusableElements(offscreenFTPO.getDOMNode());
  ftpo.instance().handleOffscreenFocusIn({ target: offscreenFocusableButton });
  ftpo.instance().handleOffscreenFocusIn({ target: offscreenFocusableAnchor });

  expect(
    visibleFTPO
      .getDOMNode()
      .querySelector('button')
      .classList.contains('Pointout--focus-active')
  ).toBeTruthy();
  expect(
    visibleFTPO
      .getDOMNode()
      .querySelector('a')
      .classList.contains('Pointout--focus-active')
  ).toBeTruthy();

  const hiddenContent = ftpo.find('.Pointout__content').at(0);
  hiddenContent.getDOMNode().dispatchEvent(new Event('focusin'));
  ftpo.update();
  expect(
    ftpo
      .find('.Pointout__content')
      .at(1)
      .hasClass('Pointout__content--focus-active')
  ).toBeTruthy();
});

test('should remove tabindex from focusable elements on visual FTPO with target', () => {
  const ftpo = mount(
    <FirstTimePointOut
      {...defaults}
      arrowPosition="top-left"
      target={{
        getBoundingClientRect() {
          return { top: 0, left: 0, height: 0, width: 0 };
        }
      }}
    >
      Hello <a href="#foo">Cruel World</a>
    </FirstTimePointOut>
  );

  const offscreenFTPO = ftpo.find('.Offscreen');
  const visibleFTPO = ftpo.find('.Pointout');
  const [
    offscreenFocusableButton,
    offscreenFocusableAnchor
  ] = ftpo.instance().getFocusableElements(offscreenFTPO.getDOMNode());
  ftpo.instance().handleOffscreenFocusIn({ target: offscreenFocusableButton });
  ftpo.instance().handleOffscreenFocusIn({ target: offscreenFocusableAnchor });

  expect(
    visibleFTPO
      .getDOMNode()
      .querySelector('button')
      .getAttribute('tabindex')
  ).toEqual('-1');
  expect(
    visibleFTPO
      .getDOMNode()
      .querySelector('a')
      .getAttribute('tabindex')
  ).toEqual('-1');
});

test('should clean ids from portal FTPO', () => {
  const FTPOWithTarget = () => {
    const elementRef = React.createRef();
    return (
      <React.Fragment>
        <button type="button" ref={elementRef}>
          Button
        </button>
        <FirstTimePointOut
          {...defaults}
          heading={<h4>heading</h4>}
          target={elementRef}
          dismissText={'Dismiss'}
        >
          Body
          <p id="foo" />
        </FirstTimePointOut>
      </React.Fragment>
    );
  };
  const ftpo = mount(<FTPOWithTarget />);
  const offscreenFtpo = ftpo.find('.Offscreen .Pointout__content');
  const portalFtpo = ftpo.find('Portal .Pointout__content');

  expect(offscreenFtpo.exists('#foo')).toBeTruthy();
  expect(portalFtpo.exists('#foo')).toBeFalsy();
});

test('should return no axe violations', async () => {
  const ftpo = mount(
    <FirstTimePointOut
      {...defaults}
      heading={<h4>heading</h4>}
      dismissText={'Dismiss'}
    >
      Body
    </FirstTimePointOut>
  );

  expect(await axe(ftpo.html())).toHaveNoViolations();
});

test('should return no axe violations when rendering via a portal', async () => {
  const FTPOWithTarget = () => {
    const elementRef = React.createRef();
    return (
      <React.Fragment>
        <button type="button" ref={elementRef}>
          Button
        </button>
        <FirstTimePointOut
          {...defaults}
          heading={<h4>heading</h4>}
          target={elementRef}
          dismissText={'Dismiss'}
        >
          Body
        </FirstTimePointOut>
      </React.Fragment>
    );
  };
  const ftpo = mount(<FTPOWithTarget />);
  expect(await axe(ftpo.html())).toHaveNoViolations();
});
