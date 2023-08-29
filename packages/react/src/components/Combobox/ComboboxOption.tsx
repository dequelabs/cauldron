import React, { forwardRef, useEffect, useLayoutEffect } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import Icon from '../Icon';
import useSharedRef from '../../utils/useSharedRef';
import type { ListboxValue } from '../Listbox/ListboxOption';
import type { ContentNode } from '../../types';
import { ListboxOption, useListboxContext } from '../Listbox';
import { useComboboxContext } from './ComboboxContext';
import useIntersectionRef from '../../utils/useIntersectionRef';

export type ComboboxValue = Exclude<ListboxValue, number>;

interface ComboboxOptionProps extends React.HTMLAttributes<HTMLLIElement> {
  disabled?: boolean;
  value?: ComboboxValue;
  description?: ContentNode;
  children: string;
}

const ComboboxMatch = ({
  children: text
}: {
  children: string;
}): JSX.Element => {
  const { inputValue } = useComboboxContext();

  if (!inputValue?.length) {
    return <span>{text}</span>;
  }

  const matchStart = text.toLowerCase().indexOf(inputValue?.toLowerCase());

  if (matchStart === -1) {
    return <span>{text}</span>;
  }

  const matchLength = inputValue.length;
  const matchBefore = text.substring(0, matchStart);
  const match = text.substring(matchStart, matchLength + matchStart);
  const matchAfter = text.substring(matchStart + matchLength);

  return (
    <>
      <span>{matchBefore}</span>
      <em className="ComboboxOption__match">{match}</em>
      <span>{matchAfter}</span>
    </>
  );
};

const ComboboxOption = forwardRef<HTMLLIElement, ComboboxOptionProps>(
  (
    {
      className,
      children,
      disabled,
      id: propId,
      description,
      value: propValue,
      ...props
    },
    ref
  ): JSX.Element | null => {
    const [id] = propId ? [propId] : useId(1, 'combobox-option');
    const { selected, active } = useListboxContext();
    const { matches, setMatchingOptions } = useComboboxContext();
    const comboboxOptionRef = useSharedRef<HTMLElement>(ref);
    const intersectionRef = useIntersectionRef<HTMLElement>(comboboxOptionRef, {
      root: null,
      threshold: 1.0
    });
    const isActive =
      !!active?.element && active.element === comboboxOptionRef.current;
    const isSelected =
      !!selected?.element && selected.element === comboboxOptionRef.current;
    const isMatching =
      (typeof matches === 'boolean' && matches) ||
      (typeof matches === 'function' && matches(children));

    useLayoutEffect(() => {
      const intersectionEntry = intersectionRef.current;
      if (!intersectionEntry || !isActive) {
        return;
      }

      if (!intersectionEntry.isIntersecting) {
        comboboxOptionRef.current.scrollIntoView({
          inline: 'nearest',
          block: intersectionEntry.intersectionRect.y <= 0 ? 'end' : 'nearest'
        });
      }
    }, [isActive]);

    useEffect(() => {
      if (isMatching) {
        setMatchingOptions((options) => {
          return new Map(
            options.set(comboboxOptionRef.current, {
              value: children as string,
              selected: isSelected
            })
          );
        });
      }

      return () => {
        setMatchingOptions((options) => {
          options.forEach((_value, element) => {
            if (!element.isConnected) {
              options.delete(element);
            }
          });
          return new Map(options);
        });
      };
    }, [isMatching, isSelected]);

    if (!isMatching) {
      return null;
    }

    return (
      <ListboxOption
        as="li"
        className={classnames('ComboboxOption', className, {
          'ComboboxOption--disabled': disabled
        })}
        activeClass="ComboboxOption--active"
        ref={comboboxOptionRef}
        disabled={disabled}
        id={id}
        value={propValue}
        {...props}
      >
        <span>
          <ComboboxMatch>{children}</ComboboxMatch>
          {description && (
            <div className="ComboboxOption__description">{description}</div>
          )}
        </span>
        {isSelected ? <Icon type="check-solid" /> : null}
      </ListboxOption>
    );
  }
);

ComboboxOption.displayName = 'ComboboxOption';

export default ComboboxOption;
