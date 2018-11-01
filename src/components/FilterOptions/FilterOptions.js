import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './FilterOptions.module.scss';
import Button from 'components/UI/Button/Button';

const filterOptions = props => {
  filterOptions.propTypes = {
    options: PropTypes.array.isRequired,
    selectedOption: PropTypes.any.isRequired,
    click: PropTypes.func.isRequired
  };

  let options = [];
  if (props.options) {
    options = props.options.map(option => {
      const optionClasses = classnames({
        [styles.OptionContainer]: true,
        [styles.SelectedOption]: Number(props.selectedOption) === option
      });

      return (
        <div key={option} className={optionClasses}>
          <Button clear id={option} name={props.name} click={props.click}>
            {option}
          </Button>
        </div>
      );
    });
  }

  return <div className={styles.FilterOptions}>{options}</div>;
};

export default filterOptions;
