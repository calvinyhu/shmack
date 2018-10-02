import React from 'react';

import classes from './Input.css';

const input = props => {
  let inputGroupClasses = classes.InputGroup;
  let inputClasses = classes.Input;

  // Style
  if (props.line) inputClasses += ' ' + classes.Line;

  // Padding
  if (props.small) inputClasses += ' ' + classes.Small;
  if (props.medium) inputClasses += ' ' + classes.Medium;

  // Margin
  if (props.margin) inputGroupClasses += ' ' + classes.Margin;

  // Color
  if (props.transparent) inputClasses += ' ' + classes.Transparent;

  // Label
  let label = null;
  if (props.floatText) {
    label = (
      <label className={classes.InputPlaceholder} htmlFor="food">
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
