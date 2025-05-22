import React, { type Ref, useEffect, useState } from 'react';
import classnames from 'classnames';
import useSharedRef from '../../utils/useSharedRef';
import Tooltip, { type TooltipProps } from '../Tooltip';
import type {
  PolymorphicProps,
  PolymorphicComponent
} from '../../utils/polymorphicComponent';

interface TextEllipsisBaseProps
  extends PolymorphicProps<React.HTMLAttributes<HTMLElement>> {
  children: string;
  maxLines?: number;
  refProp?: string;
  /**
   * Using this prop may introduce accessibility issues by hiding content from the user.
   * Only use this prop if you have an alternative way to make the full text accessible.
   */
  hideTooltip?: boolean;
  /* Callback function when overflow state has changed. */
  onOverflowChange?: (hasOverflow: boolean) => void;
}

interface TextEllipsisWithTooltipProps extends TextEllipsisBaseProps {
  tooltipProps?: Omit<TooltipProps, 'target' | 'association' | 'children'>;
}

interface TextEllipsisWithoutTooltipProps extends TextEllipsisBaseProps {
  tooltipProps: never;
  /** Prevent TextEllipsis from showing a tooltip when the text is ellipsized. */
  hideTooltip: true;
}

const TextEllipsis = React.forwardRef(
  (
    {
      className,
      children,
      maxLines,
      as,
      tooltipProps,
      hideTooltip,
      onOverflowChange,
      ...props
    }: TextEllipsisWithTooltipProps | TextEllipsisWithoutTooltipProps,
    ref: Ref<HTMLElement>
  ) => {
    let Element: React.ElementType<any> = 'div';
    const sharedRef = useSharedRef<HTMLElement>(ref);
    const [hasOverflow, setHasOverflow] = useState(false);
    const showTooltip = hasOverflow && !hideTooltip;

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
      if (hideTooltip) {
        return;
      }

      const listener: ResizeObserverCallback = () => {
        requestAnimationFrame(() => {
          const { current: overflowElement } = sharedRef;
          if (!overflowElement) {
            return;
          }

          setHasOverflow(
            typeof maxLines === 'number'
              ? overflowElement.clientHeight < overflowElement.scrollHeight
              : overflowElement.clientWidth < overflowElement.scrollWidth
          );
        });
      };

      const observer = new ResizeObserver(listener);
      observer.observe(sharedRef.current);

      return () => {
        observer?.disconnect();
      };
    }, [hideTooltip]);

    useEffect(() => {
      if (typeof onOverflowChange === 'function') {
        onOverflowChange(hasOverflow);
      }
    }, [hasOverflow]);

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
) as PolymorphicComponent<
  TextEllipsisWithTooltipProps | TextEllipsisWithoutTooltipProps
>;

TextEllipsis.displayName = 'TextEllipsis';

export default TextEllipsis;
