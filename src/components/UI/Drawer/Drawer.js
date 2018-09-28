import React from 'react';

import classes from './Drawer.css';

const drawer = props => {
  let drawerClasses = null;

  if (props.left) {
    drawerClasses = classes.LeftDrawer;
    if (props.isOpen) drawerClasses += ' ' + classes.OpenDrawer;
    else drawerClasses += ' ' + classes.CloseLeftDrawer;
  }

  if (props.right) {
    drawerClasses = classes.RightDrawer;
    if (props.isOpen) drawerClasses += ' ' + classes.OpenDrawer;
    else drawerClasses += ' ' + classes.CloseRightDrawer;
  }

  return <div className={drawerClasses}>{props.children}</div>;
};

export default drawer;
