import React, { forwardRef, useCallback } from 'react';
import { useId } from 'react-id-generator';
import classnames from 'classnames';
import Drawer from '../Drawer';
import IconButton from '../IconButton';
import { ContentNode } from '../../types';
import useSharedRef from '../../utils/useSharedRef';

type BottomSheetProps = {
  label: ContentNode;
  closeButtonText?: ContentNode;
  open?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  Pick<
    React.ComponentProps<typeof Drawer>,
    'open' | 'onClose' | 'focusOptions' | 'portal'
  >;

const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      label,
      children,
      className,
      closeButtonText = 'Close',
      open = false,
      onClose,
      focusOptions,
      ...props
    },
    ref
  ) => {
    const bottomSheetRef = useSharedRef(ref);
    const [labelId] = useId(1, 'bottom-sheet-label');

    const handleClose = useCallback(() => {
      if (typeof onClose === 'function') {
        onClose();
      }
    }, [onClose]);

    return (
      <Drawer
        open={open}
        onClose={handleClose}
        focusOptions={{
          initialFocus: bottomSheetRef,
          ...focusOptions
        }}
        {...props}
        behavior="modal"
        position="bottom"
      >
        <div
          ref={bottomSheetRef}
          className={classnames('BottomSheet', className)}
          tabIndex={-1}
          role="dialog"
          aria-labelledby={labelId}
        >
          <div className="BottomSheet__header">
            <div id={labelId} className="BottomSheet__title">
              {label}
            </div>
            <IconButton
              icon="close"
              label={closeButtonText}
              aria-label={`${closeButtonText}`}
              onClick={handleClose}
              tooltipProps={{
                show: false,
                association: 'none'
              }}
            />
          </div>
          <div className="BottomSheet__contents">{children}</div>
        </div>
      </Drawer>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

export default BottomSheet;
