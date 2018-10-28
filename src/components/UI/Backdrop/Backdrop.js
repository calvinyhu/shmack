import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Backdrop.module.scss';

const backdrop = props => {
  const backdropClasses = classnames({
    [styles.Backdrop]: true,
    [styles.OpenBackdrop]: props.isOpen,
    [styles.CloseBackdrop]: !props.isOpen
  });

  return <div className={backdropClasses} onClick={props.click} />;
};

backdrop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default backdrop;
