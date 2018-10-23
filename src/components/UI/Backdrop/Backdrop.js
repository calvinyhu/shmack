import React from 'react';
import PropTypes from 'prop-types';

import styles from './Backdrop.module.scss';

const backdrop = props => {
  let backdropClasses = styles.Backdrop;

  if (props.isOpen) backdropClasses += ' ' + styles.OpenBackdrop;
  else backdropClasses += ' ' + styles.CloseBackdrop;

  return <div className={backdropClasses} onClick={props.click} />;
};

backdrop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  click: PropTypes.func.isRequired
};

export default backdrop;
