import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Toast, { type ToastProps } from './';
import axe from '../../axe';
import userEvent from '@testing-library/user-event';
import AriaIsolate from '../../utils/aria-isolate';

const testString = 'a simple paragraph';

const toastTypes: Record<ToastProps['type'], string> = {
  confirmation: 'success',
  'action-needed': 'error',
  error: 'error',
  info: 'info',
  caution: 'warning'
};

const toastIcons: Record<ToastProps['type'], string> = {
  confirmation: 'check-circle',
  'action-needed': 'no',
  error: 'caution',
  info: 'info-circle-alt',
  caution: 'caution'
};

afterEach(() => {
  jest.restoreAllMocks();
});

Object.entries(toastTypes).forEach(([key, value]) => {
  test(`should correctly render toast with type="${value}" when dismissed, but mounted`, async () => {
    const toast = React.createRef<HTMLDivElement>();

    render(
      <Toast
        toastRef={toast}
        show={false}
        type={key as keyof typeof toastTypes}
      >
        {testString}
      </Toast>
    );

    expect(toast.current).toHaveClass(`Toast Toast--${value} is--hidden`);
    expect(toast.current).toHaveTextContent(testString);
  });

  test(`should include the correct classes with a type="${value}" toast and show is true`, async () => {
    const toast = React.createRef<HTMLDivElement>();

    render(
      <Toast toastRef={toast} type={key as keyof typeof toastTypes} show>
        {testString}
      </Toast>
    );

    expect(toast.current).toBeInTheDocument();
    expect(toast.current).toHaveClass(`Toast Toast--${value} FadeIn--flex`);
  });

  test('should transition from hidden to shown', async () => {
    const toast = React.createRef<HTMLDivElement>();
    let show = false;

    render(
      <Toast toastRef={toast} type="info" show={show}>
        {testString}
      </Toast>
    );

    expect(toast.current).toHaveClass('Toast Toast--info is--hidden');
    show = true;
    setTimeout(() => {
      expect(toast.current).toHaveClass('Toast Toast--info FadeIn--flex');
    }, 300);
  });

  test(`type="${value}" toast should transition from shown to hidden`, async () => {
    const toast = React.createRef<HTMLDivElement>();
    let show = true;

    render(
      <Toast toastRef={toast} type="info" show={show}>
        {testString}
      </Toast>
    );

    expect(toast.current).toHaveClass('Toast Toast--info FadeIn--flex');
    show = false;
    setTimeout(() => {
      expect(toast.current).toHaveClass('Toast Toast--info is--hidden');
    }, 300);
  });

  test(`renders the correct icon for toast type="${value}"`, async () => {
    const toast = React.createRef<HTMLDivElement>();

    render(
      <Toast toastRef={toast} type={key as keyof typeof toastTypes} show>
        {testString}
      </Toast>
    );

    expect(toast.current).toBeInTheDocument();
    expect(toast.current?.childNodes[0].firstChild).toHaveClass(
      `Icon Icon--${toastIcons[key as keyof typeof toastTypes]}`
    );
  });

  test(`type="${value}" toast has no accessibility issues`, async () => {
    const { container } = render(
      <Toast type={key as keyof typeof toastTypes}>{testString}</Toast>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

test('should render toast with more than a string as children', async () => {
  const toast = React.createRef<HTMLDivElement>();

  render(
    <Toast toastRef={toast} type="info">
      <a href="https://someurl.com">Link to some website</a>
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();
  await waitFor(() => {
    expect(toast.current).toHaveTextContent('Link to some website');
  });
});

test('should render toast with focus when `focus` prop is `true`', async () => {
  const toast = React.createRef<HTMLDivElement>();

  render(
    <Toast toastRef={toast} show type="info" focus>
      {testString}
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();
  await waitFor(() => {
    expect(toast.current).toHaveFocus();
  });
});

test('should render toast without focus and role="alert" when `focus` prop is `false`', async () => {
  const toast = React.createRef<HTMLDivElement>();

  render(
    <Toast toastRef={toast} show type="info" focus={false}>
      {testString}
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();

  await waitFor(() => {
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).not.toHaveFocus();
  });
});

test('should render toast with dismiss button', async () => {
  const toast = React.createRef<HTMLDivElement>();
  const setState = jest.fn();
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(
      () => [undefined, setState] as [unknown, React.Dispatch<unknown>]
    );
  render(
    <Toast
      toastRef={toast}
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      onDismiss={() => setState(false)}
    >
      {testString}
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

test('should render a non-dismissable toast when dismissible is false', async () => {
  const toast = React.createRef<HTMLDivElement>();

  render(
    <Toast toastRef={toast} show type="info" dismissible={false}>
      {testString}
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

test('should dismiss toast when dismiss button is clicked', async () => {
  const toast = React.createRef<HTMLDivElement>();

  const user = userEvent.setup();
  const setState = jest.fn();
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(
      () => [undefined, setState] as [unknown, React.Dispatch<unknown>]
    );
  render(
    <Toast
      toastRef={toast}
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      onDismiss={() => setState(false)}
    >
      {testString}
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();
  expect(setState).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith(false);
  });
});

test('non-dismissible toast has no accessibility issues', async () => {
  const toast = React.createRef<HTMLDivElement>();

  render(
    <Toast toastRef={toast} show type="info" dismissible={false}>
      {testString}
    </Toast>
  );

  const results = await axe(toast.current as HTMLElement);
  expect(results).toHaveNoViolations();
});

test('deactivates aria isolate on unmount', async () => {
  const toast = React.createRef<HTMLDivElement>();

  const setState = jest.fn();

  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(
      () => [undefined, setState] as [unknown, React.Dispatch<unknown>]
    );
  const isolator = jest.spyOn(AriaIsolate.prototype, 'deactivate');
  render(
    <Toast
      toastRef={toast}
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      onDismiss={() => setState(false)}
    >
      {testString}
    </Toast>
  );

  expect(toast.current).toBeInTheDocument();

  const user = userEvent.setup();

  expect(isolator).not.toHaveBeenCalled();
  expect(setState).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button'));

  setTimeout(() => {
    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith(false);
    expect(isolator).toHaveBeenCalledTimes(1);
    expect(isolator).toHaveBeenCalledWith(false);
  }, 100);
});

test('renders children within the "Toast__message-content" div', async () => {
  const { container } = render(
    <Toast show type="info">
      {testString}
    </Toast>
  );

  const elements = container.querySelectorAll('.Toast__message-content');
  expect(elements).toHaveLength(1);
});
