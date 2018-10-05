import React from 'react';
import Fade from 'react-reveal/Fade';

import classes from './SearchBar.css';
import Input from '../UI/Input/Input';
import Button from '../UI/Button/Button';
import { MAT_ICONS } from '../../utilities/styles';

const searchBar = props => {
  let searchBarClasses = classes.SearchBar;

  if (props.isScrollingDown || props.isGoogleLoading)
    searchBarClasses += ' ' + classes.HideSearchBar;

  if (props.isShowFilters) searchBarClasses += ' ' + classes.SearchBarBoxShadow;

  let foodInputContainerClasses = classes.FoodInputContainer;
  let locationInputContainerClasses = classes.LocationInputContainer;
  let searchButtonClasses = classes.SearchButton;
  let foodInputPlaceholder = props.isShowLocationInput
    ? 'Food'
    : 'Food at Your Location';

  if (props.isShowLocationInput || props.location) {
    searchBarClasses += ' ' + classes.ExtendSearchBar;
    foodInputContainerClasses += ' ' + classes.SlideYFoodInput;
    locationInputContainerClasses += ' ' + classes.Show;
    searchButtonClasses += ' ' + classes.ExtendSearchButton;
  }

  let bar = (
    <div className={searchBarClasses}>
      <Fade>
        <form onSubmit={props.handleSearch}>
          <div className={classes.SearchInputs}>
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
              Go
            </Button>
          </div>
        </form>
        <div className={searchButtonClasses}>
          <Button main click={props.handleToggleFilters}>
            <div className={MAT_ICONS}>filter_list</div>
          </Button>
        </div>
      </Fade>
    </div>
  );

  return bar;
};

export default searchBar;
