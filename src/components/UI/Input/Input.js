import React from 'react';

import classes from './Input.css';

const input = props => {
  let inputClasses = classes.Input;

  // Style
  if (props.line) inputClasses += ' ' + classes.Line;

  // Padding
  if (props.small) inputClasses += ' ' + classes.Small;
  if (props.medium) inputClasses += ' ' + classes.Medium;

  // Color
  if (props.transparent) inputClasses += ' ' + classes.Transparent;

  return (
    <input
      className={inputClasses}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.change}
    />
  );
};

export default input;
