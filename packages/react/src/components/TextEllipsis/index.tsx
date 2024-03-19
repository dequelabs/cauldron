import React, { type Ref, useEffect, useState } from 'react';
import classnames from 'classnames';
import useSharedRef from '../../utils/useSharedRef';
import Tooltip, { type TooltipProps } from '../Tooltip';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';

interface TextEllipsisProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  children: string;
  maxLines?: number;
  refProp?: string;
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
    ref: Ref<HTMLElement>
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

          const hasOverflow =
            typeof maxLines === 'number'
              ? overflowElement.clientHeight < overflowElement.scrollHeight
              : overflowElement.clientWidth < overflowElement.scrollWidth;

          setShowTooltip(hasOverflow);
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
          <Tooltip target={sharedRef} association="none" {...tooltipProps}>
            {children}
          </Tooltip>
        )}
      </>
    );
  }
) as PolymorphicComponent<TextEllipsisProps>;

TextEllipsis.displayName = 'TextEllipsis';

export default TextEllipsis;
