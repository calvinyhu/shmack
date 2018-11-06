import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Backdrop.module.scss';

const backdrop = props => {
  backdrop.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    click: PropTypes.func.isRequired,
    percent: PropTypes.number
  };

  const backdropClasses = classnames({
    [styles.Backdrop]: true,
    [styles.OpenBackdrop]: props.isOpen,
    [styles.CloseBackdrop]: !props.isOpen
  });

  let style = null;
  if (props.percent) {
    style = { opacity: props.percent, zIndex: 2, transition: 'none' };

    if (props.percent === 0) {
      style.opacity = 0;
      style.zIndex = -1;
      style.transition =
        'opacity 0.5s cubic-bezier(0.26, 0.94, 0.58, 1), z-index 0s 0.5s cubic-bezier(0.26, 0.94, 0.58, 1)';
    }
    if (props.percent === 1) {
      style.opacity = 1;
      style.zIndex = 2;
      style.transition = 'opacity 0.5s cubic-bezier(0.26, 0.94, 0.58, 1)';
    }
  }

  return (
    <div style={style} className={backdropClasses} onClick={props.click} />
  );
};

export default backdrop;
