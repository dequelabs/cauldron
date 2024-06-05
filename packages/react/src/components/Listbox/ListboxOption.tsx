import React, { forwardRef, useEffect, useCallback } from 'react';
import classnames from 'classnames';
import { useId } from 'react-id-generator';
import { useListboxContext } from './ListboxContext';
import useSharedRef from '../../utils/useSharedRef';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';

export type ListboxValue = Readonly<string | number | undefined>;

interface ListboxOptionProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  value?: ListboxValue;
  disabled?: boolean;
  activeClass?: string;
}

function isElementPreceding(a?: Element, b?: Element) {
  if (!a || !b) return false;
  return !!(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING);
}

const ListboxOption = forwardRef<HTMLElement, ListboxOptionProps>(
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
    const isActive = active && active.element === listboxOptionRef.current;
    const isSelected =
      selected &&
      (Array.isArray(selected)
        ? selected.findIndex(
            (sel) => sel.element === listboxOptionRef.current
          ) !== -1
        : selected.element === listboxOptionRef.current);
    const optionValue =
      typeof value !== 'undefined'
        ? value
        : listboxOptionRef.current?.innerText;

    useEffect(() => {
      const element = listboxOptionRef.current;

      setOptions((options) => {
        // istanbul ignore next
        if (!element) return options;

        const option = {
          element,
          value: typeof value !== 'undefined' ? value : element.innerText
        };

        // Elements are frequently appended, so check to see if the newly rendered
        // element follows the last element first before any other checks
        if (
          !options.length ||
          isElementPreceding(
            options[options.length - 1].element,
            option.element
          )
        ) {
          return [...options, option];
        }

        for (let i = 0; i < options.length; i++) {
          const opt = options[i];

          if (isElementPreceding(element, opt.element)) {
            return [...options.slice(0, i), option, ...options.slice(i)];
          }
        }

        // istanbul ignore next
        // this should never happen, but just in case fall back to options
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
      [optionValue, onSelect]
    );

    return (
      <Component
        id={id}
        className={classnames(className, {
          [activeClass]: isActive
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
) as PolymorphicComponent<ListboxOptionProps>;

ListboxOption.displayName = 'ListboxOption';

export default ListboxOption;
