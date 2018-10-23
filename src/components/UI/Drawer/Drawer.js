import React from 'react';
import PropTypes from 'prop-types';

import styles from './Drawer.module.scss';

const drawer = props => {
  let drawerClasses = null;

  if (props.left) {
    drawerClasses = styles.LeftDrawer;
    if (props.isOpen) drawerClasses += ' ' + styles.OpenDrawer;
    else drawerClasses += ' ' + styles.CloseLeftDrawer;
  }

  if (props.right) {
    drawerClasses = styles.RightDrawer;
    if (props.isOpen) drawerClasses += ' ' + styles.OpenDrawer;
    else drawerClasses += ' ' + styles.CloseRightDrawer;
  }

  return <div className={drawerClasses}>{props.children}</div>;
};

drawer.propTypes = {
  left: PropTypes.bool,
  right: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
};

export default drawer;
