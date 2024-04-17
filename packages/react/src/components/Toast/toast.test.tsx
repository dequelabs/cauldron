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
    render(
      <Toast
        show={false}
        type={key as keyof typeof toastTypes}
        data-testid="toast"
      >
        {testString}
      </Toast>
    );
    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass(`Toast Toast--${value} is--hidden`);
    expect(toast).toHaveTextContent(testString);
  });

  test(`should include the correct classes with a type="${value}" toast and show is true`, async () => {
    render(
      <Toast type={key as keyof typeof toastTypes} show data-testid="toast">
        {testString}
      </Toast>
    );
    const toast = screen.getByTestId('toast');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveClass(`Toast Toast--${value} FadeIn--flex`);
  });

  test('should transition from hidden to shown', async () => {
    let show = false;

    render(
      <Toast type="info" show={show} data-testid="toast">
        {testString}
      </Toast>
    );
    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('Toast Toast--info is--hidden');
    show = true;
    setTimeout(() => {
      expect(toast).toHaveClass('Toast Toast--info FadeIn--flex');
    }, 300);
  });

  test(`type="${value}" toast should transition from shown to hidden`, async () => {
    let show = true;

    render(
      <Toast type="info" show={show} data-testid="toast">
        {testString}
      </Toast>
    );

    const toast = screen.getByTestId('toast');
    expect(toast).toHaveClass('Toast Toast--info FadeIn--flex');
    show = false;
    setTimeout(() => {
      expect(toast).toHaveClass('Toast Toast--info is--hidden');
    }, 300);
  });

  test(`renders the correct icon for toast type="${value}"`, async () => {
    render(
      <Toast type={key as keyof typeof toastTypes} show data-testid="toast">
        {testString}
      </Toast>
    );
    const toast = screen.getByTestId('toast');
    expect(toast).toBeInTheDocument();
    expect(toast.childNodes[0].firstChild).toHaveClass(
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
  render(
    <Toast type="info" data-testid="toast">
      <a href="https://someurl.com">Link to some website</a>
    </Toast>
  );

  const toast = screen.getByTestId('toast');
  expect(toast).toBeInTheDocument();
  await waitFor(() => {
    expect(toast).toHaveTextContent('Link to some website');
  });
});

test('should render toast with focus when `focus` prop is `true`', async () => {
  render(
    <Toast show type="info" focus data-testid="toast">
      {testString}
    </Toast>
  );
  const toast = screen.getByTestId('toast');
  expect(toast).toBeInTheDocument();
  await waitFor(() => {
    expect(toast).toHaveFocus();
  });
});

test('should render toast without focus and role="alert" when `focus` prop is `false`', async () => {
  render(
    <Toast show type="info" focus={false}>
      {testString}
    </Toast>
  );

  const toast = screen.getByRole('alert');

  await waitFor(() => {
    expect(toast).toBeInTheDocument();
    expect(toast).not.toHaveFocus();
  });
});

test('should render toast with dismiss button', async () => {
  render(
    <Toast
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      data-testid="toast"
    >
      {testString}
    </Toast>
  );
  const toast = screen.getByTestId('toast');
  expect(toast).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

test('should render a non-dismissable toast when dismissible is false', async () => {
  render(
    <Toast show type="info" dismissible={false} data-testid="toast">
      {testString}
    </Toast>
  );

  const toast = screen.getByTestId('toast');
  expect(toast).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

test('should dismiss toast when dismiss button is clicked', async () => {
  const user = userEvent.setup();
  const onDismiss = jest.fn();
  render(
    <Toast
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      onDismiss={onDismiss}
      data-testid="toast"
    >
      {testString}
    </Toast>
  );
  const toast = screen.getByTestId('toast');
  expect(toast).toBeInTheDocument();
  expect(onDismiss).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

test('non-dismissible toast has no accessibility issues', async () => {
  const { container } = render(
    <Toast show type="info" dismissible={false}>
      {testString}
    </Toast>
  );

  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('deactivates aria isolate on unmount', async () => {
  const isolator = jest.spyOn(AriaIsolate.prototype, 'deactivate');
  render(
    <Toast
      show={true}
      type="info"
      dismissible={true}
      dismissText="dismiss"
      data-testid="toast"
    >
      {testString}
    </Toast>
  );

  const toast = screen.getByTestId('toast');
  expect(toast).toBeInTheDocument();

  const user = userEvent.setup();

  expect(isolator).not.toHaveBeenCalled();

  await user.click(screen.getByRole('button'));

  setTimeout(() => {
    expect(isolator).toHaveBeenCalledTimes(1);
    expect(isolator).toHaveBeenCalledWith(false);
  }, 100);
});

test('renders children within the "Toast__message-content" div', async () => {
  const { container } = render(
    <Toast show type="info" data-testid="toast">
      {testString}
    </Toast>
  );

  const elements = container.querySelectorAll('.Toast__message-content');
  expect(elements).toHaveLength(1);
});
