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
      <label className={styles.InputPlaceholder} htmlFor="food">
        {props.placeholder}
      </label>
    );
  }

  return (
    <div className={inputGroupClasses}>
      <input
        className={inputClasses}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.change}
      />
      {label}
    </div>
  );
};

export default input;
