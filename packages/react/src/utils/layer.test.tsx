import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { render, screen } from '@testing-library/react';
import { useLayer, LayerProvider, type Layer } from './layer';

let outerLayer: Layer;

const Portaled = ({ label }: { label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const layer = useLayer(ref);
  return createPortal(
    <LayerProvider layer={layer}>
      <div ref={ref}>{label}</div>
    </LayerProvider>,
    document.body
  );
};

const Outer = ({ showNested = true }: { showNested?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  outerLayer = useLayer(ref);
  return (
    <LayerProvider layer={outerLayer}>
      <div ref={ref}>
        outer
        {showNested && <Nested />}
      </div>
    </LayerProvider>
  );
};

const Nested = () => {
  const ref = useRef<HTMLDivElement>(null);
  const layer = useLayer(ref);
  const [deep] = useState(true);
  return createPortal(
    <LayerProvider layer={layer}>
      <div ref={ref}>
        nested
        {deep && <Portaled label="deep" />}
      </div>
    </LayerProvider>,
    document.body
  );
};

test('contains its own element and nested layers, however deeply portaled', () => {
  render(<Outer />);

  expect(outerLayer.contains(screen.getByText('outer'))).toBe(true);
  expect(outerLayer.contains(screen.getByText('nested'))).toBe(true);
  expect(outerLayer.contains(screen.getByText('deep'))).toBe(true);
  expect(outerLayer.contains(document.body)).toBe(false);
  expect(outerLayer.contains(null)).toBe(false);
  expect(outerLayer.elements()).toHaveLength(3);
});

test('unregisters nested layers when they unmount', () => {
  const { rerender } = render(<Outer />);
  const nested = screen.getByText('nested');

  rerender(<Outer showNested={false} />);
  expect(outerLayer.contains(nested)).toBe(false);
  expect(outerLayer.elements()).toHaveLength(1);
});

test('works without a surrounding layer', () => {
  render(<Portaled label="alone" />);
  expect(screen.getByText('alone')).toBeInTheDocument();
});
