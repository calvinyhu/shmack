import React from 'react';

import classes from './Filters.css';
import Button from '../UI/Button/Button';

const RADIUS = {
  ONE: 1,
  THREE: 3,
  FIVE: 5,
  TEN: 10
};

const filters = props => {
  let filtersClasses = classes.Filters;

  if (props.isOpen) {
    filtersClasses += ' ' + classes.SlideYFilters;

    if (props.isLifted) filtersClasses += ' ' + classes.LiftFilters;
  }

  let radiusClasses = {};
  radiusClasses[props.options.radius] = classes.ActiveRadius;

  let filtersContainer = (
    <div className={filtersClasses}>
      <header>
        <p>Filters</p>
        <div className={classes.FiltersApplyContainer}>
          <Button main small click={props.search}>
            Apply
          </Button>
        </div>
      </header>
      <div className={classes.Filter}>
        <p>Radius (mi)</p>
        <div className={classes.FilterOptions}>
          <p
            id={RADIUS.ONE}
            className={radiusClasses[RADIUS.ONE]}
            onClick={props.clickRadius}
          >
            {RADIUS.ONE}
          </p>
          <p
            id={RADIUS.THREE}
            className={radiusClasses[RADIUS.THREE]}
            onClick={props.clickRadius}
          >
            {RADIUS.THREE}
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
