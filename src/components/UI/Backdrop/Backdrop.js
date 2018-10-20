import React from 'react';

import styles from './Backdrop.module.scss';

const backdrop = props => {
  let backdropClasses = styles.Backdrop;

  if (props.isOpen) backdropClasses += ' ' + styles.OpenBackdrop;
  else backdropClasses += ' ' + styles.CloseBackdrop;

  return <div className={backdropClasses} onClick={props.click} />;
};

export default backdrop;
