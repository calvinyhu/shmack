import React from 'react';

import classes from './NavItems.css';
import { MAT_ICONS } from '../../../utilities/styles';
import * as paths from '../../../utilities/paths';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import NavItem from './NavItem/NavItem';

const navItems = props => {
  const listItems = [
    <li key={paths.HOME}>
      <NavItem icon wide tall to={paths.HOME}>
        <Aux>
          <div className={MAT_ICONS}>home</div>
          <div>Home</div>
        </Aux>
      </NavItem>
    </li>,
    <li key={paths.SEARCH}>
      <NavItem icon wide tall to={paths.SEARCH}>
        <Aux>
          <div className={MAT_ICONS}>search</div>
          <div>Search</div>
        </Aux>
      </NavItem>
    </li>
  ];

  if (!props.isAuth) {
    listItems.push(
      <li key={paths.AUTH_SIGNUP}>
        <NavItem icon wide tall to={paths.AUTH_SIGNUP}>
          <Aux>
            <div className={MAT_ICONS}>create</div>
            <div>Sign Up</div>
          </Aux>
        </NavItem>
      </li>
    );
  }

  listItems.push(
    <li key={paths.MORE}>
      <NavItem icon wide tall to={paths.MORE}>
        <Aux>
          <div className={MAT_ICONS}>menu</div>
          <div>More</div>
        </Aux>
      </NavItem>
    </li>
  );

  let classNames = classes.NavItems;

  if (props.wide) classNames = [classNames, classes.Wide].join(' ');

  if (props.left) classNames = [classNames, classes.Left].join(' ');
  else if (props.right) classNames = [classNames, classes.Right].join(' ');
  else if (props.center) classNames = [classNames, classes.Center].join(' ');

  return <ul className={classNames}>{listItems}</ul>;
};

export default navItems;
