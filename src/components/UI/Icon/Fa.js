import React from 'react';

import styles from './Fa.module.scss';

const Fa = props => {
  let faClasses = props.children;

  if (props.bare) faClasses += ' ' + styles.Bare;
  else faClasses += ' ' + styles.Fa;
  if (props.lg) faClasses += ' fa-lg';

  return <div className={faClasses} />;
};

export default Fa;
