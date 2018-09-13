import React from 'react';

import classes from './Layout.css';
import Aux from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Nav/Toolbar/Toolbar';

const layout = props => {
  return (
    <Aux>
      <main className={classes.Main}>{props.children}</main>
      <Toolbar isAuth={props.isAuth} />
    </Aux>
  );
};

export default layout;
