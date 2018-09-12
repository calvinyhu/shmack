import React from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavItem.css';

const navItem = props => {
  let classNames = classes.NavItem;

  if (props.icon) classNames = [classNames, classes.Icon].join(' ');
  else if (props.link) classNames = [classNames, classes.Link].join(' ');

  if (props.wide) classNames = [classNames, classes.Wide].join(' ');
  if (props.tall) classNames = [classNames, classes.Tall].join(' ');
  if (props.left) classNames = [classNames, classes.Left].join(' ');

  return (
    <NavLink
      className={classNames}
      activeClassName={classes.active}
      to={props.to}
      onClick={props.click}
    >
      {props.children}
    </NavLink>
  );
};

export default navItem;
