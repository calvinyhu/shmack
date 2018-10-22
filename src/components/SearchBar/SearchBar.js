import React from 'react';
import Fade from 'react-reveal/Fade';

import styles from './SearchBar.module.scss';
import Input from 'components/UI/Input/Input';
import Button from 'components/UI/Button/Button';
import Fa from 'components/UI/Icon/Fa';

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
                small
                id="food"
                type="text"
                name="food"
                placeholder={foodInputPlaceholder}
                value={props.food}
                change={props.handleInputChange}
              />
            </div>
            <div className={locationInputContainerClasses}>
              <Input
                small
                id="location"
                type="text"
                name="location"
                placeholder="Your Location"
                value={props.location}
                change={props.handleInputChange}
              />
            </div>
          </div>
          <div className={searchButtonClasses}>
            <Button main click={props.handleSearch}>
              <Fa>fas fa-search</Fa>
            </Button>
          </div>
        </form>
        <div className={searchButtonClasses}>
          <Button main click={props.handleToggleFilters}>
            <Fa>fas fa-filter</Fa>
          </Button>
        </div>
      </Fade>
    </div>
  );

  return bar;
};

export default searchBar;
