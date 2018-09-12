import React from 'react';

import classes from './Drawer.css';

const drawer = props => {
  let classNames = null;

  if (props.top) {
    classNames = classes.TopDrawer;
    if (props.isOpen)
      classNames = [classNames, classes.OpenTopDrawer].join(' ');
    else classNames = [classNames, classes.CloseTopDrawer].join(' ');
  }

  if (props.right) {
    classNames = classes.RightDrawer;
    if (props.isOpen)
      classNames = [classNames, classes.OpenRightDrawer].join(' ');
    else classNames = [classNames, classes.CloseRightDrawer].join(' ');
  }

  return <div className={classNames}>{props.children}</div>;
};

export default drawer;
