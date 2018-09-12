import React from 'react';

import classes from './Input.css';

const input = props => {
  let classNames = classes.Input;

  if (props.wide) classNames += ' ' + classes.Wide;
  if (props.thin) classNames += ' ' + classes.Thin;
  if (props.transparent) classNames += ' ' + classes.Transparent;
  if (props.center) classNames += ' ' + classes.TextCenter;
  if (props.onMain) classNames += ' ' + classes.OnMain;
  if (props.onOppAdj) classNames += ' ' + classes.OnOppAdj;
  if (props.accented) classNames += ' ' + classes.Accented;

  return (
    <input
      className={classNames}
      type={props.type}
      name={props.name}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.change}
    />
  );
};

export default input;
