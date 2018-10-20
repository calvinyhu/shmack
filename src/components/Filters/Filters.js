import React from 'react';

import styles from './Filters.module.scss';
import Button from 'components/UI/Button/Button';

const RADIUS = {
  ONE: 1,
  FIVE: 5,
  TEN: 10
};

const filters = props => {
  let filtersClasses = styles.Filters;

  if (props.isOpen) {
    filtersClasses += ' ' + styles.SlideYFilters;

    if (props.isLifted) filtersClasses += ' ' + styles.LiftFilters;
  }

  let radiusClasses = {};
  radiusClasses[props.options.radius] = styles.ActiveRadius;

  let filtersContainer = (
    <div className={filtersClasses}>
      <header>
        <p>Filters</p>
        <div className={styles.FiltersApplyContainer}>
          <Button main small click={props.search}>
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
            onClick={props.clickRadius}
          >
            {RADIUS.ONE}
          </p>
          <p
            id={RADIUS.FIVE}
            className={radiusClasses[RADIUS.FIVE]}
            onClick={props.clickRadius}
          >
            {RADIUS.FIVE}
          </p>
          <p
            id={RADIUS.TEN}
            className={radiusClasses[RADIUS.TEN]}
            onClick={props.clickRadius}
          >
            {RADIUS.TEN}
          </p>
        </div>
      </div>
    </div>
  );

  return filtersContainer;
};

export default filters;
