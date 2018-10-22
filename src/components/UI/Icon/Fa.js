import React from 'react';

import styles from './Fa.module.scss';

const Fa = props => {
  let faClasses = styles.Fa + ' ' + props.children;

  if (props.regular) faClasses += ' far';
  else faClasses += ' fas';

  if (props.small) faClasses += ' fa-sm';
  else faClasses += ' fa-lg';
  return <div className={faClasses} />;
};

export default Fa;
