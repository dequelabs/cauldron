import React, {
  InputHTMLAttributes,
  forwardRef,
  Ref,
  useState,
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
      checked,
      ...other
    }: CheckboxProps,
    ref
  ): JSX.Element => {
    const [isChecked, setIsChecked] = useState(checked);
    const [focused, setFocused] = useState(false);
    const checkRef = useRef<HTMLInputElement>(null);

    const refProp = ref || checkboxRef;
    const errorId = useMemo(() => nextId(), []);

    const ariaDescribedbyId = error
      ? tokenList(errorId, ariaDescribedby)
      : ariaDescribedby;

    if (checkboxRef) {
      console.warn(
        "%c Warning: 'checkboxRef' prop is deprecated, please use 'ref'. ",
        'background: #222; color: #bada44'
      );
    }

    return (
      <>
        <div className={classNames('Checkbox is--flex-row', className)}>
          <input
            id={id}
            ref={typeof refProp === 'function' || !refProp ? checkRef : refProp}
            type="checkbox"
            checked={isChecked}
            onFocus={(): void => setFocused(true)}
            onBlur={(): void => setFocused(false)}
            aria-describedby={ariaDescribedbyId}
            onChange={(e): void => {
              if (onChange) {
                onChange(e);
              }
              console.log('clicked check', e.target.checked);
              setIsChecked(e.target.checked);
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
              if (typeof refProp === 'function') {
                refProp(checkRef.current);
                checkRef.current?.click();
              } else if (refProp) {
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
