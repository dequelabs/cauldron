import React, {
  InputHTMLAttributes,
  forwardRef,
  Ref,
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react';
import classNames from 'classnames';
import nextId from 'react-id-generator';
import Icon from '../Icon';
import tokenList from '../../utils/token-list';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: React.ReactNode;
  error?: React.ReactNode;
  customIcon?: React.ReactNode;
  checkboxRef?: Ref<HTMLInputElement>;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      error,
      checkboxRef,
      className,
      onChange,
      'aria-describedby': ariaDescribedby,
      disabled = false,
      checked = false,
      ...other
    }: CheckboxProps,
    ref
  ): JSX.Element => {
    const [isChecked, setIsChecked] = useState(checked);
    const [focused, setFocused] = useState(false);
    const checkRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setIsChecked(checked);
    }, [checked]);

    const refProp = ref || checkboxRef;
    if (typeof refProp === 'function') {
      refProp(checkRef.current);
    }

    const errorId = useMemo(() => nextId(), []);

    const ariaDescribedbyId = error
      ? tokenList(errorId, ariaDescribedby)
      : ariaDescribedby;

    return (
      <>
        <div className={classNames('Checkbox is--flex-row', className)}>
          <input
            id={id}
            ref={typeof refProp === 'function' || !refProp ? checkRef : refProp}
            type="checkbox"
            checked={isChecked}
            disabled={disabled}
            onFocus={(): void => setFocused(true)}
            onBlur={(): void => setFocused(false)}
            aria-describedby={ariaDescribedbyId}
            onChange={(e): void => {
              setIsChecked(e.target.checked);
              if (onChange) {
                onChange(e);
              }
            }}
            {...other}
          />
          <Icon
            className={classNames('Checkbox__overlay', {
              'Checkbox__overlay--disabled': disabled,
              'Checkbox__overlay--focused': focused,
              'Field--has-error': error
            })}
            type={isChecked ? 'checkbox-checked' : 'checkbox-unchecked'}
            aria-hidden="true"
            onClick={(): void => {
              if (refProp && typeof refProp !== 'function') {
                refProp?.current?.click();
              } else {
                checkRef.current?.click();
              }
            }}
          />
          <label
            className={classNames('Field__label', {
              'Field__label--disabled': disabled
            })}
            htmlFor={id}
          >
            {label}
          </label>
        </div>
        <div id={errorId} className="Error">
          {error}
        </div>
      </>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
