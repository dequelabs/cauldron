import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Toast, { type ToastProps } from './';
import axe from '../../axe';
import userEvent from '@testing-library/user-event';

const testString = 'a simple paragraph';

const toastTypes: Record<ToastProps['type'], string> = {
  confirmation: 'success',
  'action-needed': 'error',
  error: 'error',
  info: 'info',
  caution: 'warning'
};

afterEach(() => {
  jest.restoreAllMocks();
});

Object.entries(toastTypes).forEach(([key, value]) => {
  test(`should render toast with type="${value}" correctly`, async () => {
    const toast = React.createRef<HTMLDivElement>();
    render(
      <Toast toastRef={toast} type={key as keyof typeof toastTypes}>
        {testString}
      </Toast>
    );

    expect(toast.current).toBeInTheDocument();
    expect(toast.current).toHaveClass(`Toast Toast--${value} is--hidden`);
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

  test(`type="${value}" toast has no accessibility issues`, async () => {
    const toast = React.createRef<HTMLDivElement>();
    render(
      <Toast toastRef={toast} type={key as keyof typeof toastTypes}>
        {testString}
      </Toast>
    );

    const results = await axe(toast.current as HTMLElement);
    expect(results).toHaveNoViolations();
  });
});

test('should render toast with more than a string as children', async () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Toast toastRef={ref} type="info">
      <a href="https://someurl.com">Link to some website</a>
    </Toast>
  );

  expect(ref.current).toBeInTheDocument();
  await waitFor(() => {
    expect(ref.current).toHaveTextContent('Link to some website');
  });
});

test('should render toast with focus', async () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Toast toastRef={ref} show type="info" focus>
      {testString}
    </Toast>
  );

  expect(ref.current).toBeInTheDocument();
  await waitFor(() => {
    expect(ref.current).toHaveFocus();
  });
});

test('should render toast with dismiss button', async () => {
  const ref = React.createRef<HTMLDivElement>();
  const setState = jest.fn();
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(
      () => [undefined, setState] as [unknown, React.Dispatch<unknown>]
    );
  render(
    <Toast
      toastRef={ref}
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      onDismiss={() => setState(false)}
    >
      {testString}
    </Toast>
  );

  expect(ref.current).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

test('should render a non-dismissable toast when dismissible is false', async () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Toast toastRef={ref} show type="info" dismissible={false}>
      {testString}
    </Toast>
  );

  expect(ref.current).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

test('should dismiss toast when dismiss button is clicked', async () => {
  const ref = React.createRef<HTMLDivElement>();
  const user = userEvent.setup();
  const setState = jest.fn();
  jest
    .spyOn(React, 'useState')
    .mockImplementationOnce(
      () => [undefined, setState] as [unknown, React.Dispatch<unknown>]
    );
  render(
    <Toast
      toastRef={ref}
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      onDismiss={() => setState(false)}
    >
      {testString}
    </Toast>
  );

  expect(ref.current).toBeInTheDocument();
  await user.click(screen.getByRole('button'));
  await waitFor(() => {
    screen.getByRole('button').click();
    expect(setState).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith(false);
  });
});

test('non-dismissible toast has no accessibility issues', async () => {
  const ref = React.createRef<HTMLDivElement>();
  render(
    <Toast toastRef={ref} show type="info" dismissible={false}>
      {testString}
    </Toast>
  );

  const results = await axe(ref.current as HTMLElement);
  expect(results).toHaveNoViolations();
});
