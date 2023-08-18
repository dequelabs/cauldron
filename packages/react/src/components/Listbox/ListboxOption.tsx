import React, { forwardRef, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import { useListboxContext } from './ListboxContext';
import useSharedRef from '../../utils/useSharedRef';

export type ListboxValue = Readonly<string | number | undefined>;

interface ListboxOptionsProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType | string;
  value?: ListboxValue;
  disabled?: boolean;
  activeClass?: string;
}

function isElementPreceding(a: Element, b: Element) {
  return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}

const ListboxOption = forwardRef<HTMLElement, ListboxOptionsProps>(
  (
    {
      id: propId,
      className,
      as: Component = 'li',
      children,
      value,
      disabled,
      activeClass = 'ListboxOption--active',
      onClick,
      ...props
    },
    ref
  ): JSX.Element => {
    const { active, selected, setOptions, onSelect } = useListboxContext();
    const listboxOptionRef = useSharedRef<HTMLElement>(ref);
    const [id] = propId ? [propId] : useId(1, 'listbox-option');
    const isActive = active?.element === listboxOptionRef.current;
    const isSelected = selected?.element === listboxOptionRef.current;
    const optionValue =
      typeof value !== 'undefined'
        ? value
        : listboxOptionRef.current?.innerText;

    useEffect(() => {
      const element = listboxOptionRef.current;

      setOptions((options) => {
        const option = { element, value: optionValue };
        if (!element) return options;

        // Elements are frequently appended, so check to see if the newly rendered
        // element follows the last element element first before any other checks
        if (
          !options.length ||
          isElementPreceding(
            options[options.length - 1].element,
            option.element
          )
        ) {
          return [...options, option];
        }

        for (const opt of options) {
          if (isElementPreceding(element, opt.element)) {
            const index = options.indexOf(opt);
            return [
              ...options.slice(0, index),
              option,
              ...options.slice(index),
            ];
          }
        }

        return options;
      });

      return () => {
        setOptions((opts) => opts.filter((opt) => opt.element !== element));
      };
    }, [optionValue]);

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
          return;
        }

        onSelect({ element: listboxOptionRef.current, value: optionValue });
        onClick?.(event);
      },
      [optionValue]
    );

    return (
      <Component
        id={id}
        className={classnames(className, {
          [activeClass]: isActive,
        })}
        role="option"
        ref={listboxOptionRef}
        aria-disabled={typeof disabled === 'boolean' ? disabled : undefined}
        aria-selected={isSelected}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ListboxOption.displayName = 'ListboxOption';

export default ListboxOption;
