import React, { useMemo } from 'react';

import './Colors.css';
import classNames from 'classnames';
import { useThemeContext } from '../../packages/react/lib';

interface ColorsProps extends React.HTMLAttributes<HTMLDivElement> {
  colorGroup: string;
  colorNames: string[];
}

interface ColorProps {
  name: string;
  value: string;
}

const LUMINANCE_TEXT_DIFFERENTIAL = 0.7;
const LUMINANCE_FRAME_DIFFERENTIAL = 0.95;

const GRAY = 'gray-80';
const WHITE = 'white';

function calculateLuminance(hexColor: string) {
  // Remove the "#" character if it exists
  hexColor = hexColor.replace(/^#/, '');

  // Convert the hex color to RGB
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calculate the relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance;
}

const getColorValueByName = (color: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${color}`);
const normalizeVarValue = (color: string) => {
  const isVar = color.includes('var');

  if (isVar) {
    const varName = color.match(/var\(([^)]+)\)/); // get real color variable

    return varName ? getColorValueByName(varName[1]) : '';
  }

  return getColorValueByName(color);
};
const isNeedFrame = (color: string) => {
  const luminance = calculateLuminance(color);

  return luminance > LUMINANCE_FRAME_DIFFERENTIAL;
};

const Color = ({ name, value }: ColorProps) => {
  const { theme } = useThemeContext();

  const textColor = useMemo(
    () =>
      calculateLuminance(value) > LUMINANCE_TEXT_DIFFERENTIAL ? GRAY : WHITE,
    [value]
  );

  const needToAddFrame = useMemo(
    () => isNeedFrame(value) && theme === 'light',
    [value]
  );

  return (
    <div className={'Color'}>
      <div
        className={classNames(
          'Color__bg',
          needToAddFrame ? 'Color__bg--border' : ''
        )}
        style={{ background: value }}
      >
        <span className={'Color__hex'} style={{ color: textColor }}>
          {value.toUpperCase()}
        </span>
      </div>
      <div className={'Color__title'}>{name}</div>
    </div>
  );
};

export default function Colors({ colorGroup, colorNames }: ColorsProps) {
  const colors: ColorProps[] = colorNames.map((color: string) => ({
    name: color,
    value: normalizeVarValue(color)
  }));

  return (
    <section className={`Colors Colors--${colorGroup}`}>
      {colors.map((color: ColorProps, index: number) => (
        <Color key={index} name={color.name} value={color.value} />
      ))}
    </section>
  );
}
