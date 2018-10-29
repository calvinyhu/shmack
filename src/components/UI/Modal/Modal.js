import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Modal.module.scss';
import Button from 'components/UI/Button/Button';

const modal = props => {
  modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.string.isRequired,
    btnMsg: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired
  };

  const modalClasses = classnames({
    [styles.Modal]: true,
    [styles.OpenModal]: props.isOpen,
    [styles.CloseModal]: !props.isOpen
  });

  return (
    <div className={modalClasses}>
      <p>{props.children}</p>
      <div className={styles.ModalButton}>
        <Button main bold click={props.click}>
          {props.btnMsg}
        </Button>
      </div>
    </div>
  );
};

export default modal;
