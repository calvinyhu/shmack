import React from 'react';

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

export default drawer;
