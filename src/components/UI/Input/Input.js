import React from 'react';

import styles from './Input.module.scss';

const input = props => {
  let inputGroupClasses = styles.InputGroup;
  let inputClasses = styles.Input;

  // Style
  if (props.line) inputClasses += ' ' + styles.Line;

  // Padding
  if (props.small) inputClasses += ' ' + styles.Small;
  if (props.medium) inputClasses += ' ' + styles.Medium;

  // Margin
  if (props.margin) inputGroupClasses += ' ' + styles.Margin;

  // Color
  if (props.transparent) inputClasses += ' ' + styles.Transparent;

  // Label
  let label = null;
  if (props.floatText) {
    label = (
      <label className={styles.InputPlaceholder} htmlFor={props.name}>
        {props.placeholder}
      </label>
    );
  }

  let error = <p className={styles.Error}>{props.error}</p>;
  if (props.error) inputClasses += ' ' + styles.ErrorOutline;

  return (
    <div className={inputGroupClasses}>
      <input
        required={props.required}
        className={inputClasses}
        type={props.type}
        name={props.name}
        placeholder={!props.floatText ? props.placeholder : null}
        value={props.value}
        onChange={props.change}
      />
      {label}
      {error}
    </div>
  );
};

export default input;
