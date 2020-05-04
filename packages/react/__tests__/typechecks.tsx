import * as React from 'react';

import {
  Alert,
  AlertActions,
  Button,
  Checkbox,
  FirstTimePointOut,
  Icon,
  Link,
  Loader,
  MenuItem,
  Modal,
  ModalContent,
  ModalFooter,
  Offscreen,
  OptionsMenu,
  OptionsMenuItem,
  OptionsMenuTrigger,
  OptionsMenuWrapper,
  RadioGroup,
  Scrim,
  Select,
  Sidebar,
  SkipLink,
  Toast,
  TopBar,
  TopBarTrigger,
  Workspace,
  AriaIsolate,
  focusableSelector,
  TextField,
  ClickOutsideListener,
  ExpandCollapsePanel,
  PanelTrigger,
  TopBarMenu
} from '../src';

const noop = () => {};
const noopEventHandler = (e: any) => {};
const noopRef = (ref: any) => {};

const alert = () => {
  const alertRef = React.useRef<HTMLDivElement>(null);
  return (
    <Alert
      alertRef={alertRef}
      className="hello"
      contentRef={noopRef}
      show={false}
      forceAction={true}
    >
      Hello!
    </Alert>
  );
};

const alertActions = () => <AlertActions>Hi</AlertActions>;

const buttons = () => (
  <React.Fragment>
    <Button buttonRef={noopRef} className="7">
      button
    </Button>
    <Button>button</Button>
    <Button variant="primary">button</Button>
    <Button variant="secondary">button</Button>
    <Button variant="error">button</Button>
    <Button variant="link">button</Button>
    <Button disabled>button</Button>
  </React.Fragment>
);

const checkbox = () => (
  <Checkbox
    checkboxRef={noopRef}
    id="id"
    name="name"
    label="label"
    value="tacos"
    checked
    disabled
    className="hi"
    onChange={noopEventHandler}
    autoFocus
  >
    checkbox
  </Checkbox>
);

const ftpo = () => (
  <FirstTimePointOut
    dismissText="dismiss"
    ftpRef={noopRef}
    headerId="id"
    noArrow
    onClose={noop}
    target={document.body}
    portal={document.body}
  >
    hi
  </FirstTimePointOut>
);

const icon = () => <Icon label="icon" type="type" />;

const link = () => (
  <>
    <Link>link</Link>
    <Link href="hi">link</Link>
    <Link download="hi">link</Link>
    <Link rel="hi">link</Link>
    <Link variant="button">link</Link>
  </>
);

const loader = () => <Loader label="loader" />;

const items = () => (
  <React.Fragment>
    <MenuItem menuItemRef={noopRef} onClick={noop} onKeyDown={noopEventHandler}>
      hi
    </MenuItem>
    <MenuItem>hi</MenuItem>
  </React.Fragment>
);

const modal = () => (
  <Modal
    className="hi"
    forceAction
    closeButtonText="close"
    heading={{ text: 'hello' }}
    modalRef={noopRef}
    onClose={noop}
    show
  >
    <ModalContent>content</ModalContent>
    <ModalFooter>footer</ModalFooter>
  </Modal>
);

const offscreen = () => <Offscreen className="bananas">offscreen</Offscreen>;

const optionsWrapper = () => {
  <OptionsMenuWrapper align="left">
    <div />
  </OptionsMenuWrapper>;
};

const optionsTrigger = () => {
  <OptionsMenuTrigger>hi</OptionsMenuTrigger>;
};

const options = () => (
  <OptionsMenu
    trigger={() => optionsTrigger}
    align="left"
    onClose={noop}
    onSelect={noop}
    closeOnSelect
  >
    <OptionsMenuItem onSelect={noop} disabled className="hi">
      hi
    </OptionsMenuItem>
  </OptionsMenu>
);

const radio = () => (
  <RadioGroup
    name="hi"
    aria-labelledby="hello"
    defaultValue="banana"
    radios={[{ id: 'id', label: 'label', value: 'value' }]}
    onChange={noopEventHandler}
  />
);

const scrim = () => <Scrim show>hi</Scrim>;

const select = () => (
  <Select
    className="hi"
    label="7"
    onKeyDown={noopEventHandler}
    onSelect={noopEventHandler}
    required
    value="6"
    options={[
      { value: 'Monday' },
      { value: 'Tuesday' },
      { value: 'Wednesday' },
      { value: 'Thursday', label: <span /> },
      { value: 'Friday' },
      { value: 'Saturday', disabled: true },
      { value: 'Sunday', label: 'hi' }
    ]}
  />
);

const sidebar = () => (
  <Sidebar onDismiss={noop} className="hi" show>
    hello
  </Sidebar>
);

const skiplink = () => (
  <SkipLink skipText="hi" target="hello" targetText="bye">
    banana
  </SkipLink>
);

const toast = () => (
  <Toast
    autoHide={12}
    dismissText="hi"
    onDismiss={noop}
    toastRef={noopRef}
    show
    type="confirmation"
  >
    hi
  </Toast>
);

const topbar = () => (
  <TopBar hasTrigger>
    <TopBarTrigger onClick={noopEventHandler} onKeyDown={noopEventHandler}>
      hi
    </TopBarTrigger>
  </TopBar>
);

const workspace = () => <Workspace workspaceRef={noopRef}>hi</Workspace>;

const ariaIsolate = () => {
  const el = document.getElementById('foo');
  if (!el) return;
  const ai = new AriaIsolate(el);
  ai.activate();
  // @ts-ignore
  // TODO: why?
  ai.affectedElements.length;
  // @ts-ignore
  // TODO: why?
  ai.element.nodeName;
  ai.deactivate();
};

document.querySelectorAll(focusableSelector);

const textField = () => (
  <>
    <TextField
      label={<span>Email</span>}
      id="email"
      error={<span>invalid email</span>}
      defaultValue="foo@bar.io"
      onChange={noop}
      fieldRef={noop}
      required
      requiredText="Required"
      aria-describedby="help-text"
    />
    <TextField name="url" type="url" label="URL" required />
    <TextField
      disabled
      aria-label="foo"
      label="banana"
      id="potato"
      value="sharks"
      multiline
    />
  </>
);

const clickOutside = () => {
  <ClickOutsideListener
    onClickOutside={noopEventHandler}
    mouseEvent="click"
    touchEvent="touchend"
  >
    <div>foo</div>
  </ClickOutsideListener>;
};

const expandCollapse = () => {
  <ExpandCollapsePanel
    id="expand-collapse-panel"
    animationTiming={0}
    onToggle={noopEventHandler}
  >
    <div>foo</div>
  </ExpandCollapsePanel>;
};

const expandCollapseTrigger = () => {
  <>
    <PanelTrigger
      id="expand-collapse-trigger"
      open={true}
      onClick={noopEventHandler}
    >
      <div>foo</div>
    </PanelTrigger>
    <PanelTrigger
      id="expand-collapse-trigger2"
      open={true}
      onClick={noopEventHandler}
    >
      {({ open }: any) => (open ? 'Open' : 'Closed')}
    </PanelTrigger>
  </>;
};

const topBarMenu = () => {
  <TopBarMenu id="top-bar-menu">foo</TopBarMenu>;
};
