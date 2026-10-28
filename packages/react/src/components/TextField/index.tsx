import React, { forwardRef, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useId } from 'react-id-generator';
import setRef from '../../utils/setRef';
import { addIdRef } from '../../utils/idRefs';
import Icon from '../Icon';

export interface TextFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  defaultValue?: string;
  onChange?: (
    value: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /**
   * @deprecated Use the forwarded `ref` instead. Will be removed in the next major version.
   */
  fieldRef?: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
  requiredText?: string;
  multiline?: boolean;
}

const TextField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldProps
>(
  (
    {
      id,
      label,
      fieldRef,
      value,
      description,
      onChange,
      defaultValue,
      error = null,
      required = false,
      requiredText = 'Required',
      multiline = false,
      'aria-describedby': ariaDescribedby,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      children,
      className,
      ...other
    }: TextFieldProps,
    ref
  ) => {
    const [generatedInputId, errorId, descriptionId] = useId(3, 'textfield');
    const inputId = id || generatedInputId;
    const isControlled = typeof value !== 'undefined';
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | number | readonly string[] | undefined
    >(isControlled ? value : defaultValue || '');

    const setFieldRef = useCallback(
      (field: HTMLInputElement | HTMLTextAreaElement | null) => {
        setRef(ref, field);
        setRef(fieldRef, field);
      },
      [ref, fieldRef]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange?.(e.target.value, e);

        if (isControlled) {
          return;
        }

        setUncontrolledValue(e.target.value);
      },
      [onChange, isControlled]
    );

    // typescript can't infer the type so it's complaining about
    // textarea and input props being incompatible
    // we should probably fix this
    const Field: any = multiline ? 'textarea' : 'input';
    const describedby = description
      ? addIdRef(ariaDescribedby, descriptionId)
      : ariaDescribedby;

    const inputProps = {
      'aria-describedby': error ? addIdRef(describedby, errorId) : describedby
    };

    return (
      <div className="Field">
        <label
          className={classNames('Field__label', {
            'Field__label--is-required': required,
            'Field__label--has-error': error
          })}
          htmlFor={inputId}
        >
          <span>{label}</span>
          {required && (
            <span className="Field__required-text" aria-hidden="true">
              {requiredText}
            </span>
          )}
        </label>
        {description && (
          <div className="Field__description" id={descriptionId}>
            {description}
          </div>
        )}
        {error && (
          <div className="Field__error" id={errorId}>
            <Icon type="caution" />
            {error}
          </div>
        )}
        <Field
          className={classNames(className, {
            'Field__text-input': !multiline,
            Field__textarea: multiline,
            'Field--has-error': error
          })}
          id={inputId}
          value={isControlled ? value : uncontrolledValue}
          onChange={handleChange}
          aria-invalid={!!error}
          required={required}
          ref={setFieldRef}
          {...other}
          {...inputProps}
        />
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;
