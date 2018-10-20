import React from 'react';

import styles from './Modal.module.scss';
import Button from '../Button/Button';

const modal = props => {
  let modalClasses = styles.Modal;
  if (props.isOpen) modalClasses += ' ' + styles.OpenModal;
  else modalClasses += ' ' + styles.CloseModal;

  return (
    <div className={modalClasses}>
      <p>{props.children}</p>
      <div className={styles.ModalButton}>
        <Button main click={props.click}>
          {props.btnMsg}
        </Button>
      </div>
    </div>
  );
};

export default modal;
