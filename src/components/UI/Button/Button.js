import React from 'react';

import classes from './Button.css';

const button = props => {
  let buttonClasses = classes.Button;

  if (props.link) buttonClasses = classes.PlaceholderLink;
  if (props.small) buttonClasses += ' ' + classes.Small;
  if (props.circle) buttonClasses += ' ' + classes.Circle;
  if (props.main) buttonClasses += ' ' + classes.Main;
  if (props.clear) buttonClasses += ' ' + classes.Clear;
  if (props.translucent) buttonClasses += ' ' + classes.Translucent;

  return (
    <button className={buttonClasses} onClick={props.click}>
      {props.children}
    </button>
  );
};

export default button;
