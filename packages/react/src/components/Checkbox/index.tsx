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
import Icon, { type IconType } from '../Icon';
import { addIdRef } from '../../utils/idRefs';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: React.ReactNode;
  labelDescription?: React.ReactNode;
  error?: React.ReactNode;
  customIcon?: React.ReactNode;
  checkboxRef?: React.ForwardedRef<HTMLInputElement>;
  indeterminate?: boolean;
  onChangeToggle?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      labelDescription,
      error,
      checkboxRef,
      className,
      onChange,
      onChangeToggle = true,
      onFocus,
      onBlur,
      'aria-describedby': ariaDescribedby,
      disabled = false,
      checked = false,
      indeterminate = false,
      children,
      ...other
    }: CheckboxProps,
    ref
  ): React.JSX.Element => {
    const [isChecked, setIsChecked] = useState(checked);
    const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);
    const [focused, setFocused] = useState(false);
    const checkRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    useEffect(() => {
      setIsIndeterminate(indeterminate);
    }, [indeterminate]);

    const refProp = ref || checkboxRef;

    if (typeof refProp === 'function') {
      refProp(checkRef.current);
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

    const iconType: IconType = isChecked
      ? 'checkbox-checked'
      : 'checkbox-unchecked';

    useEffect(() => {
      let input: HTMLInputElement | null;
      if (refProp && typeof refProp !== 'function') {
        input = refProp.current;
      } else {
        input = checkRef.current;
      }

      if (input) {
        input.indeterminate = isIndeterminate;
      }
    }, [isIndeterminate, refProp, checkRef]);

    return (
      <div className="Checkbox__wrap">
        <div className={classNames('Checkbox is--flex-row', className)}>
          <input
            id={id}
            ref={typeof refProp === 'function' || !refProp ? checkRef : refProp}
            type="checkbox"
            checked={isChecked}
            disabled={disabled}
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
            aria-describedby={ariaDescribedbyId}
            onChange={(e): void => {
              if (isIndeterminate) {
                setIsIndeterminate(false);
              }
              if (onChangeToggle) {
                setIsChecked(e.target.checked);
              }
              if (onChange) {
                onChange(e);
              }
            }}
            {...other}
          />
          <label
            className={classNames('Field__label Checkbox__label', {
              'Field__label--disabled': disabled
            })}
            htmlFor={id}
          >
            {label}
          </label>
          <Icon
            className={classNames('Checkbox__overlay', {
              'Checkbox__overlay--disabled': disabled,
              'Checkbox__overlay--focused': focused,
              'Field--has-error': error
            })}
            type={iconType}
            aria-hidden="true"
            onClick={(): void => {
              if (refProp && typeof refProp !== 'function') {
                refProp.current?.click();
              } else {
                checkRef.current?.click();
              }
            }}
          />
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

Checkbox.displayName = 'Checkbox';

export default Checkbox;
