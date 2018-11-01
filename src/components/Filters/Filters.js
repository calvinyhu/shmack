import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './Filters.module.scss';
import Filter from '../Filter/Filter';
import Button from '../UI/Button/Button';

const filters = props => {
  filters.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isLifted: PropTypes.bool.isRequired,
    selectedOptions: PropTypes.object.isRequired,
    apply: PropTypes.func.isRequired,
    changeRadius: PropTypes.func.isRequired
  };

  const filtersClasses = classnames({
    [styles.Filters]: true,
    [styles.SlideYFilters]: props.isOpen,
    [styles.LiftFilters]: props.isLifted
  });

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
      <Filter
        name="Radius (mi)"
        options={[1, 5, 10]}
        selectedOption={props.selectedOptions.radius}
        click={props.changeRadius}
      />
    </div>
  );

  return filtersContainer;
};

export default filters;
