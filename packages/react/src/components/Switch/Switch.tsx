import React, {
  InputHTMLAttributes,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react';
import classNames from 'classnames';
import nextId from 'react-id-generator';
import Icon from '../Icon';
import { addIdRef } from '../../utils/idRefs';

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  id: string;
  label: React.ReactNode;
  labelDescription?: React.ReactNode;
  error?: React.ReactNode;
  switchRef?: React.ForwardedRef<HTMLInputElement>;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      id,
      label,
      labelDescription,
      error,
      switchRef,
      className,
      onChange,
      onFocus,
      onBlur,
      'aria-describedby': ariaDescribedby,
      disabled = false,
      checked = false,
      ...other
    }: SwitchProps,
    ref
  ): React.JSX.Element => {
    const [isChecked, setIsChecked] = useState(checked);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const refProp = ref || switchRef;

    if (typeof refProp === 'function') {
      refProp(inputRef.current);
    }

    const { errorId, labelDescriptionId } = useMemo(() => {
      return {
        labelDescriptionId: nextId(),
        errorId: nextId()
      };
    }, []);

    let ariaDescribedbyId = ariaDescribedby;

    if (error) {
      ariaDescribedbyId = addIdRef(ariaDescribedbyId, errorId);
    }

    if (labelDescription) {
      ariaDescribedbyId = addIdRef(ariaDescribedbyId, labelDescriptionId);
    }

    return (
      <div className="Switch__wrap">
        <div
          className={classNames('Switch', className, {
            'Switch--checked': isChecked,
            'Switch--disabled': disabled
          })}
        >
          <input
            id={id}
            ref={typeof refProp === 'function' || !refProp ? inputRef : refProp}
            type="checkbox"
            role="switch"
            checked={isChecked}
            disabled={disabled}
            aria-describedby={ariaDescribedbyId}
            onFocus={(e): void => {
              setFocused(true);
              if (typeof onFocus === 'function') {
                onFocus(e);
              }
            }}
            onBlur={(e): void => {
              setFocused(false);
              if (typeof onBlur === 'function') {
                onBlur(e);
              }
            }}
            onChange={(e): void => {
              setIsChecked(e.target.checked);
              if (onChange) {
                onChange(e);
              }
            }}
            {...other}
          />
          <span
            className={classNames('Switch__track', {
              'Switch__track--focused': focused
            })}
            aria-hidden="true"
            onClick={(): void => {
              if (refProp && typeof refProp !== 'function') {
                refProp.current?.click();
              } else {
                inputRef.current?.click();
              }
            }}
          >
            <span className="Switch__handle">
              {isChecked && (
                <Icon
                  type="check-circle"
                  className="Switch__icon"
                  aria-hidden="true"
                />
              )}
            </span>
          </span>
          <label
            className={classNames('Switch__label', {
              'Field__label--disabled': disabled
            })}
            htmlFor={id}
          >
            {label}
          </label>
        </div>
        {labelDescription && (
          <span id={labelDescriptionId} className="Field__labelDescription">
            {labelDescription}
          </span>
        )}
        {error && (
          <div id={errorId} className="Error">
            {error}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
export { Switch };
