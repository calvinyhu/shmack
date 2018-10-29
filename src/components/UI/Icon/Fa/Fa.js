import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Fa.module.scss';

const Fa = props => {
  Fa.propTypes = {
    bare: PropTypes.bool,
    lg: PropTypes.bool,
    children: PropTypes.string.isRequired
  };

  const faClasses = classnames({
    [props.children]: true,
    [styles.Bare]: props.bare,
    [styles.Fa]: !props.bare,
    'fa-lg': props.lg
  });

  return <div className={faClasses} />;
};

export default Fa;
