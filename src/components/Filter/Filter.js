import React from 'react';

import styles from './Filter.module.scss';
import FilterOptions from '../FilterOptions/FilterOptions';

const filter = props => {
  return (
    <div className={styles.Filter}>
      <p>{props.label}</p>
      <FilterOptions
        name={props.name}
        options={props.options}
        selectedOption={props.selectedOption}
        click={props.click}
      />
    </div>
  );
};

export default filter;
