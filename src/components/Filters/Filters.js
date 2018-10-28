import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Filters.module.scss';
import Button from 'components/UI/Button/Button';

const RADIUS = {
  ONE: 1,
  FIVE: 5,
  TEN: 10
};

const filters = props => {
  const filtersClasses = classnames({
    [styles.Filters]: true,
    [styles.SlideYFilters]: props.isOpen,
    [styles.LiftFilters]: props.isLifted
  });

  const radiusClasses = {};
  radiusClasses[props.options.radius] = styles.ActiveRadius;

  let filtersContainer = (
    <div className={filtersClasses}>
      <header>
        <p>Filters</p>
        <div className={styles.FiltersApplyContainer}>
          <Button main small click={props.apply}>
            Apply
          </Button>
        </div>
      </header>
      <div className={styles.Filter}>
        <p>Radius (mi)</p>
        <div className={styles.FilterOptions}>
          <p
            id={RADIUS.ONE}
            className={radiusClasses[RADIUS.ONE]}
            onClick={props.changeRadius}
          >
            {RADIUS.ONE}
          </p>
          <p
            id={RADIUS.FIVE}
            className={radiusClasses[RADIUS.FIVE]}
            onClick={props.changeRadius}
          >
            {RADIUS.FIVE}
          </p>
          <p
            id={RADIUS.TEN}
            className={radiusClasses[RADIUS.TEN]}
            onClick={props.changeRadius}
          >
            {RADIUS.TEN}
          </p>
        </div>
      </div>
    </div>
  );

  return filtersContainer;
};

filters.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isLifted: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  apply: PropTypes.func.isRequired,
  changeRadius: PropTypes.func.isRequired
};

export default filters;
