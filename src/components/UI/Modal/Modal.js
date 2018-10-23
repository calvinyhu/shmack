import React from 'react';
import PropTypes from 'prop-types';

import styles from './Modal.module.scss';
import Button from 'components/UI/Button/Button';

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

modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.string.isRequired,
  btnMsg: PropTypes.string.isRequired,
  click: PropTypes.func.isRequired
};

export default modal;
