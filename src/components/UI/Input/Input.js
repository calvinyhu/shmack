import React from 'react';
import PropTypes from 'prop-types';

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

  let error = null;
  if (!props.noError) error = <p className={styles.Error}>{props.error}</p>;
  if (props.error) inputClasses += ' ' + styles.ErrorOutline;

  return (
    <div className={inputGroupClasses}>
      {error}
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
    </div>
  );
};

input.propTypes = {
  line: PropTypes.bool,
  small: PropTypes.bool,
  medium: PropTypes.bool,
  margin: PropTypes.bool,
  transparent: PropTypes.bool,
  noError: PropTypes.bool,
  floatText: PropTypes.bool,
  required: PropTypes.bool.isRequired,
  error: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired
};

export default input;
