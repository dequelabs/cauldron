import React from 'react';
import { shallow, mount } from 'enzyme';
import Pointout from 'src/components/Pointout';
import axe from '../../../axe';

const defaults = {};

test('handles "noArrow" prop properly', () => {
  expect.assertions(1);
  const ftpo = shallow(
    <Pointout noArrow={true} {...defaults}>
      {'hello'}
    </Pointout>
  );

  expect(ftpo.hasClass('Pointout--no-arrow')).toBeTruthy();
});

test('handles "arrowPosition" prop', () => {
  const ftpo = shallow(
    <Pointout arrowPosition="top-right" {...defaults}>
      {'hello'}
    </Pointout>
  );

  expect(ftpo.find('.Pointout__arrow.Pointout__arrow--top-right')).toBeTruthy();
});

test('returns null given a falsey "show" state', () => {
  expect.assertions(1);
  const ftpo = mount(<Pointout {...defaults}>{'hello'}</Pointout>);

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
    <Pointout {...defaults} onClose={onClose}>
      {'hello'}
    </Pointout>
  );

  ftpo.find('.Pointout__dismiss').simulate('click');
  expect(called).toBe(true);
});

test('accepts the dismissText prop', () => {
  expect.assertions(1);
  const ftpo = mount(
    <Pointout {...defaults} dismissText={'Fred'}>
      {'hello'}
    </Pointout>
  );

  expect(
    ftpo.find('.Pointout__dismiss[aria-label="Fred"]').exists()
  ).toBeTruthy();
});

test('accepts className prop', () => {
  const ftpo = mount(
    <Pointout {...defaults} dismissText={'Fred'} className="foo">
      {'hello'}
    </Pointout>
  );

  expect(ftpo.find('.Pointout.foo').exists()).toBeTruthy();
});

test('renders to portal when using a target', () => {
  const ftpo = mount(
    <Pointout
      {...defaults}
      target={{
        getBoundingClientRect() {
          return { top: 0, left: 0, height: 0, width: 0 };
        }
      }}
    >
      {'hello'}
    </Pointout>
  );
  expect(ftpo.find('Portal').exists()).toBeTruthy();
});

test('should be positioned relative to target', () => {
  const ftpo = mount(
    <Pointout
      {...defaults}
      arrowPosition="top-left"
      target={{
        getBoundingClientRect() {
          return { top: 123, left: 456, height: 200, width: 100 };
        }
      }}
    >
      {'hello'}
    </Pointout>
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
    <Pointout heading={<h4>heading</h4>} {...defaults}>
      {'hello'}
    </Pointout>
  );
  ftpo.update();

  const heading = ftpo.find('h4');
  const wrap = ftpo.find('.Pointout');

  expect(typeof heading.prop('id') === 'string').toBeTruthy();
  expect(heading.prop('id')).toEqual(wrap.prop('aria-labelledby'));
});

test('should mirror focus to visual FTPO', () => {
  const ftpo = mount(
    <Pointout
      {...defaults}
      arrowPosition="top-left"
      target={{
        getBoundingClientRect() {
          return { top: 0, left: 0, height: 0, width: 0 };
        }
      }}
    >
      Hello <a href="#foo">Cruel World</a>
    </Pointout>
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
    <Pointout
      {...defaults}
      arrowPosition="top-left"
      target={{
        getBoundingClientRect() {
          return { top: 0, left: 0, height: 0, width: 0 };
        }
      }}
    >
      Hello <a href="#foo">Cruel World</a>
    </Pointout>
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
        <Pointout
          {...defaults}
          heading={<h4>heading</h4>}
          target={elementRef}
          dismissText={'Dismiss'}
        >
          Body
          <p id="foo" />
        </Pointout>
      </React.Fragment>
    );
  };
  const ftpo = mount(<FTPOWithTarget />);
  const offscreenFtpo = ftpo.find('.Offscreen .Pointout__content');
  const portalFtpo = ftpo.find('Portal .Pointout__content');

  expect(offscreenFtpo.exists('#foo')).toBeTruthy();
  expect(portalFtpo.exists('#foo')).toBeFalsy();
});

test('should show next button when `showNext` prop is truthy', () => {
  const ftpo = mount(
    <Pointout {...defaults} showNext={true}>
      {'hello'}
    </Pointout>
  );
  expect(ftpo.find('.Pointout__next').exists()).toBeTruthy();
});

test('should show previous button when `showPrevious` prop is truthy', () => {
  const ftpo = mount(
    <Pointout {...defaults} showPrevious={true}>
      {'hello'}
    </Pointout>
  );
  expect(ftpo.find('.Pointout__previous').exists()).toBeTruthy();
});

test('should pass props to next button', () => {
  let called = false;
  const handleNext = () => (called = true);
  const ftpo = mount(
    <Pointout
      {...defaults}
      showNext={true}
      nextButtonProps={{ onClick: handleNext }}
    >
      {'hello'}
    </Pointout>
  );
  ftpo.find('.Pointout__next').simulate('click');
  expect(called).toBeTruthy();
});

test('should pass props to previous button', () => {
  let called = false;
  const handlePrevious = () => (called = true);
  const ftpo = mount(
    <Pointout
      {...defaults}
      showPrevious={true}
      previousButtonProps={{ onClick: handlePrevious }}
    >
      {'hello'}
    </Pointout>
  );
  ftpo.find('.Pointout__previous').simulate('click');
  expect(called).toBeTruthy();
});

test('should return no axe violations', async () => {
  const ftpo = mount(
    <Pointout {...defaults} heading={<h4>heading</h4>} dismissText={'Dismiss'}>
      Body
    </Pointout>
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
        <Pointout
          {...defaults}
          heading={<h4>heading</h4>}
          target={elementRef}
          dismissText={'Dismiss'}
        >
          Body
        </Pointout>
      </React.Fragment>
    );
  };
  const ftpo = mount(<FTPOWithTarget />);
  expect(await axe(ftpo.html())).toHaveNoViolations();
});
