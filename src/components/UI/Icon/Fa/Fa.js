import React from 'react';
import PropTypes from 'prop-types';

import styles from './Fa.module.scss';

const Fa = props => {
  let faClasses = props.children;

  if (props.bare) faClasses += ' ' + styles.Bare;
  else faClasses += ' ' + styles.Fa;
  if (props.lg) faClasses += ' fa-lg';

  return <div className={faClasses} />;
};

Fa.propTypes = {
  bare: PropTypes.bool,
  lg: PropTypes.bool,
  children: PropTypes.string.isRequired
};

export default Fa;
