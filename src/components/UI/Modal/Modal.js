import React from 'react';

import classes from './Modal.css';
import Button from '../Button/Button';

const modal = props => {
  let modalClasses = classes.Modal;
  if (props.isOpen) modalClasses += ' ' + classes.OpenModal;
  else modalClasses += ' ' + classes.CloseModal;

  return (
    <div className={modalClasses}>
      <p>{props.children}</p>
      <Button wide click={props.click}>
        {props.btnMsg}
      </Button>
    </div>
  );
};

export default modal;
