import React, { Ref, useEffect, useState } from 'react';
import classnames from 'classnames';
import useSharedRef from '../../utils/useSharedRef';
import Tooltip, { type TooltipProps } from '../Tooltip';

interface TextEllipsisProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  maxLines?: number;
  as?: React.ElementType;
  tooltipProps?: Omit<TooltipProps, 'target' | 'association'>;
}

const TextEllipsis = React.forwardRef(
  (
    {
      className,
      children,
      maxLines,
      as,
      tooltipProps,
      ...props
    }: TextEllipsisProps,
    ref: Ref<HTMLDivElement>
  ) => {
    let Element: React.ElementType<any> = 'div';
    const sharedRef = useSharedRef<HTMLElement>(ref);
    const [showTooltip, setShowTooltip] = useState(false);

    if (as) {
      Element = as;
    } else if (showTooltip) {
      props = Object.assign(
        {
          role: 'button',
          'aria-disabled': true,
          tabIndex: 0
        },
        props
      );
    }

    if (typeof maxLines === 'number') {
      props.style = {
        WebkitLineClamp: maxLines || 2,
        ...props.style
      };
    }

    useEffect(() => {
      const listener: ResizeObserverCallback = () => {
        requestAnimationFrame(() => {
          const { current: overflowElement } = sharedRef;
          if (!overflowElement) {
            return;
          }

          setShowTooltip((overflow) => {
            const hasOverflow =
              typeof maxLines === 'number'
                ? overflowElement.clientHeight < overflowElement.scrollHeight
                : overflowElement.offsetWidth < overflowElement.scrollWidth;
            return overflow !== hasOverflow ? hasOverflow : overflow;
          });
        });
      };

      const observer = new ResizeObserver(listener);
      observer.observe(sharedRef.current);

      return () => {
        observer?.disconnect();
      };
    }, []);

    return (
      <>
        <Element
          className={classnames('TextEllipsis', className, {
            'TextEllipsis--multiline': !!maxLines
          })}
          ref={sharedRef}
          {...props}
        >
          {children}
        </Element>
        {showTooltip && (
          <Tooltip
            target={sharedRef}
            association="aria-labelledby"
            {...tooltipProps}
          >
            {children}
          </Tooltip>
        )}
      </>
    );
  }
);

TextEllipsis.displayName = 'TextEllipsis';

export default TextEllipsis;
