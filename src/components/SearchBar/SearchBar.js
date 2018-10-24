import React from 'react';
import Fade from 'react-reveal/Fade';
import PropTypes from 'prop-types';

import styles from './SearchBar.module.scss';
import Input from 'components/UI/Input/Input';
import Button from 'components/UI/Button/Button';
import Rf from '../UI/Icon/Rf/Rf';

const searchBar = props => {
  let searchBarClasses = styles.SearchBar;

  if (props.isScrollingDown || props.isGoogleLoading)
    searchBarClasses += ' ' + styles.HideSearchBar;

  if (props.isShowFilters) searchBarClasses += ' ' + styles.SearchBarBoxShadow;

  let foodInputContainerClasses = styles.FoodInputContainer;
  let locationInputContainerClasses = styles.LocationInputContainer;
  let searchButtonClasses = styles.SearchButton;
  let foodInputPlaceholder = props.isShowLocationInput
    ? 'Food'
    : 'Food at Your Location';

  if (props.isShowLocationInput || props.location) {
    searchBarClasses += ' ' + styles.ExtendSearchBar;
    foodInputContainerClasses += ' ' + styles.SlideYFoodInput;
    locationInputContainerClasses += ' ' + styles.Show;
    searchButtonClasses += ' ' + styles.ExtendSearchButton;
  }

  let bar = (
    <div className={searchBarClasses}>
      <Fade>
        <form onSubmit={props.handleSearch}>
          <div className={styles.SearchInputs}>
            <div
              className={foodInputContainerClasses}
              onClick={props.handleShowLocationInput}
            >
              <Input
                required={false}
                small
                id="food"
                type="text"
                name="food"
                placeholder={foodInputPlaceholder}
                value={props.food}
                change={props.handleInputChange}
                noError
              />
            </div>
            <div className={locationInputContainerClasses}>
              <Input
                required={false}
                small
                id="location"
                type="text"
                name="location"
                placeholder="Your Location"
                value={props.location}
                change={props.handleInputChange}
                noError
              />
            </div>
          </div>
          <div className={searchButtonClasses}>
            <Button main click={props.handleSearch}>
              <Rf sm>search</Rf>
            </Button>
          </div>
        </form>
        <div className={searchButtonClasses}>
          <Button main click={props.handleToggleFilters}>
            <Rf sm>filter</Rf>
          </Button>
        </div>
      </Fade>
    </div>
  );

  return bar;
};

searchBar.propTypes = {
  isScrollingDown: PropTypes.bool.isRequired,
  isGoogleLoading: PropTypes.bool.isRequired,
  isShowFilters: PropTypes.bool.isRequired,
  isShowLocationInput: PropTypes.bool.isRequired,
  food: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleShowLocationInput: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleToggleFilters: PropTypes.func.isRequired
};

export default searchBar;
