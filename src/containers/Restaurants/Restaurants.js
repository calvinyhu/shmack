import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import throttle from 'raf-throttle';
import Fade from 'react-reveal/Fade';

import classes from './Restaurants.css';
import * as actions from '../../store/actions/restaurantsActions';
import * as paths from '../../utilities/paths';
import { getItems } from '../../store/actions/resPageActions';
import {
  clearDeferredPrompt,
  setRedirectPath
} from '../../store/actions/appActions';
import { handleYelpError } from '../../utilities/yelp';
import {
  createGooglePlacePhotoQuery,
  convertPrice
} from '../../utilities/google';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import ResPage from '../../components/ResPage/ResPage';
import { MAT_ICONS } from '../../utilities/styles';

export const SOURCE = {
  YELP: 1,
  GOOGLE: 2
};

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    hasGeoLocatePermission: state.app.hasGeoLocatePermission,
    food: state.restaurants.food,
    location: state.restaurants.location,
    isYelpLoading: state.restaurants.isYelpLoading,
    yelpRestaurants: state.restaurants.yelpRestaurants,
    yelpError: state.restaurants.yelpError,
    isGoogleLoading: state.restaurants.isGoogleLoading,
    googleRestaurants: state.restaurants.googleRestaurants,
    googleError: state.restaurants.googleError,
    deferredPrompt: state.app.deferredPrompt,
    redirectPath: state.app.redirectPath
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRestaurantInputChange: (name, value) =>
      dispatch(actions.restaurantInputChange(name, value)),
    onRestaurantSearch: (food, location, radius) =>
      dispatch(actions.restaurantSearch(food, location, radius)),
    onGetPopularItems: id => dispatch(getItems(id)),
    onClearDeferredPrompt: () => dispatch(clearDeferredPrompt()),
    onSetRedirectPath: path => dispatch(setRedirectPath(path))
  };
};

class Restaurants extends Component {
  restaurants = [];
  restaurantNames = {};
  isYelpRendered = false;
  isGoogleRendered = false;
  restaurantClickHandlers = {};
  radiusHandlers = {};

  state = {
    isRedirectingToSettings: false,
    isRequestingLocation: false,
    isScrollingDown: false,
    isPageOpen: false,
    isShowLocationInput: false,
    isShowFilters: false,
    id: null,
    restaurant: null,
    src: null,
    prevScrollTop: 0,
    radius: 1
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps !== this.props ||
      nextState.isRedirectingToSettings !==
        this.state.isRedirectingToSettings ||
      nextState.isRequestingLocation !== this.state.isRequestingLocation ||
      nextState.isScrollingDown !== this.state.isScrollingDown ||
      nextState.isPageOpen !== this.state.isPageOpen ||
      nextState.isShowLocationInput !== this.state.isShowLocationInput ||
      nextState.isShowFilters !== this.state.isShowFilters ||
      nextState.radius !== this.state.radius ||
      nextState.id !== this.state.id
    )
      return true;
    return false;
  }

  handleRedirect = () => {
    this.props.onSetRedirectPath(paths.HOME);
    this.setState({ isRedirectingToSettings: true });
  };

  handleShowLocationInput = () => {
    if (!this.state.isShowLocationInput)
      this.setState({ isShowLocationInput: true });
  };

  handleHideLocationInput = () => {
    if (this.state.isShowLocationInput)
      this.setState({ isShowLocationInput: false });
  };

  handleHideFilters = () => {
    if (this.state.isShowFilters) this.setState({ isShowFilters: false });
  };

  handleInputChange = event => {
    this.props.onRestaurantInputChange(event.target.name, event.target.value);
  };

  handleScroll = event => {
    throttle(this.animateSearchBar(event.target.scrollTop));
  };

  animateSearchBar = scrollTop => {
    this.setState({
      isScrollingDown: scrollTop > this.state.prevScrollTop,
      prevScrollTop: scrollTop
    });
    this.handleHideLocationInput();
    this.handleHideFilters();
  };

  handleCloseLocationRequest = () => {
    this.setState({ isRequestingLocation: false });
  };

  handlePageClose = () => {
    if (this.props.deferredPrompt) {
      this.props.deferredPrompt.prompt();
      this.props.onClearDeferredPrompt();
    }
    this.setState({ isPageOpen: false });
  };

  getRestaurantClickHandler = (id, res, src) => {
    if (!this.restaurantClickHandlers[id]) {
      this.restaurantClickHandlers[id] = () => {
        this.setState({ isPageOpen: true, id: id, restaurant: res, src: src });
        this.props.onGetPopularItems(id);
        this.handleHideLocationInput();
        this.handleHideFilters();
      };
    }
    return this.restaurantClickHandlers[id];
  };

  handleFilter = () => {
    this.setState(prevState => {
      return { isShowFilters: !prevState.isShowFilters };
    });
  };

  getSetRadiusHandler = radius => {
    if (!this.radiusHandlers[radius])
      this.radiusHandlers[radius] = () => this.setState({ radius: radius });
    return this.radiusHandlers[radius];
  };

  handleSearch = event => {
    if (event) event.preventDefault();
    // Reset search state
    this.restaurants = null;
    this.restaurantNames = null;
    this.isYelpRendered = false;
    this.isGoogleRendered = false;

    // Search
    if (this.props.location || this.props.hasGeoLocatePermission) {
      this.props.onRestaurantSearch(
        this.props.food,
        this.props.location,
        this.state.radius * 1609
      );
      this.handleHideLocationInput();
      this.handleHideFilters();
    } else this.setState({ isRequestingLocation: true });
  };

  renderThumbnails = () => {
    let restaurants = [];
    let resNames = {};

    if (this.restaurants) restaurants = [...this.restaurants];
    if (this.restaurantNames) resNames = { ...this.restaurantNames };

    if (!this.isYelpRendered && this.props.yelpRestaurants) {
      this.props.yelpRestaurants.forEach(res => {
        if (res.image_url && !resNames[res.name]) {
          restaurants.push(
            <Thumbnail
              key={res.id}
              click={this.getRestaurantClickHandler(res.id, res, SOURCE.YELP)}
              img={res.image_url}
            >
              <h6>{res.price}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating}</h6>
            </Thumbnail>
          );
          resNames[res.name] = 1;
        }
      });
      this.isYelpRendered = true;
    }

    if (!this.isGoogleRendered && this.props.googleRestaurants) {
      this.props.googleRestaurants.forEach(res => {
        if (res.photos && !resNames[res.name]) {
          const photo = res.photos[0];
          const imgUrl = createGooglePlacePhotoQuery(
            photo.photo_reference,
            photo.width
          );
          restaurants.push(
            <Thumbnail
              key={res.place_id}
              click={this.getRestaurantClickHandler(
                res.place_id,
                res,
                SOURCE.GOOGLE
              )}
              img={imgUrl}
            >
              <h6>{convertPrice(res.price_level)}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating}</h6>
            </Thumbnail>
          );
          resNames[res.name] = 1;
        }
      });
      this.isGoogleRendered = true;
    }

    this.restaurants = restaurants;
    this.restaurantNames = resNames;
    return restaurants;
  };

  render() {
    if (this.state.isRedirectingToSettings)
      return <Redirect to={paths.SETTINGS} />;

    let loadingMessage = null;
    if (this.props.isYelpLoading || this.props.isGoogleLoading)
      loadingMessage = (
        <div className={classes.LoaderContainer}>
          <div className={classes.Loader}>Searching...</div>
        </div>
      );

    let errorMessage = null;
    if (this.props.yelpError || this.props.googleError) {
      errorMessage = (
        <div className={classes.Message}>
          {handleYelpError(this.props.yelpError.data.error.code)}
        </div>
      );
    }

    const backdrop = (
      <Backdrop
        isOpen={this.state.isRequestingLocation}
        click={this.handleCloseLocationRequest}
      />
    );

    const locationRequestModal = (
      <Modal
        isOpen={this.state.isRequestingLocation}
        click={this.handleRedirect}
        close={this.handleCloseLocationRequest}
        btnMsg={'Take me there!'}
      >
        Turn on location sharing, in app settings, to use current location.
      </Modal>
    );

    let restaurantsGrid = (
      <div className={classes.RestaurantsGrid}>{this.renderThumbnails()}</div>
    );

    let filtersClasses = classes.Filters;
    let searchBarClasses = classes.SearchBar;

    if (this.state.isShowFilters) {
      filtersClasses += ' ' + classes.SlideYFilters;
      searchBarClasses += ' ' + classes.SearchBarBoxShadow;
    }
    if (
      this.state.isScrollingDown ||
      this.props.isYelpLoading ||
      this.props.isGoogleLoading
    )
      searchBarClasses += ' ' + classes.HideSearchBar;

    let foodInputContainerClasses = classes.FoodInputContainer;
    let locationInputContainerClasses = classes.LocationInputContainer;
    let searchButtonClasses = classes.SearchButton;
    let foodInputPlaceholder = this.state.isShowLocationInput
      ? 'Food'
      : 'Food in Your Location';
    if (this.state.isShowLocationInput || this.props.location) {
      searchBarClasses += ' ' + classes.ExtendSearchBar;
      foodInputContainerClasses += ' ' + classes.SlideYFoodInput;
      locationInputContainerClasses += ' ' + classes.Show;
      searchButtonClasses += ' ' + classes.ExtendSearchButton;
      if (this.state.isShowFilters) filtersClasses += ' ' + classes.LiftFilters;
    }

    let radiusClasses = {};
    radiusClasses[this.state.radius] = classes.ActiveRadius;

    let filters = (
      <div className={filtersClasses}>
        <header>
          <p>Filters</p>
          <div className={classes.FiltersApplyContainer}>
            <Button main small click={this.handleSearch}>
              Apply
            </Button>
          </div>
        </header>
        <div className={classes.Filter}>
          <p>Radius (mi)</p>
          <div className={classes.FilterOptions}>
            <p
              className={radiusClasses[1]}
              onClick={this.getSetRadiusHandler(1)}
            >
              1
            </p>
            <p
              className={radiusClasses[3]}
              onClick={this.getSetRadiusHandler(3)}
            >
              3
            </p>
            <p
              className={radiusClasses[5]}
              onClick={this.getSetRadiusHandler(5)}
            >
              5
            </p>
            <p
              className={radiusClasses[10]}
              onClick={this.getSetRadiusHandler(10)}
            >
              10
            </p>
            <p
              className={radiusClasses[20]}
              onClick={this.getSetRadiusHandler(20)}
            >
              20
            </p>
            <p
              className={radiusClasses[30]}
              onClick={this.getSetRadiusHandler(30)}
            >
              30
            </p>
          </div>
        </div>
      </div>
    );

    let searchBar = (
      <div className={searchBarClasses}>
        <Fade>
          <form onSubmit={this.handleSearch}>
            <div className={classes.SearchInputs}>
              <div
                className={foodInputContainerClasses}
                onClick={this.handleShowLocationInput}
              >
                <Input
                  small
                  id="food"
                  type="text"
                  name="food"
                  placeholder={foodInputPlaceholder}
                  value={this.props.food}
                  change={this.handleInputChange}
                  click={this.handleClick}
                />
              </div>
              <div className={locationInputContainerClasses}>
                <Input
                  small
                  id="location"
                  type="text"
                  name="location"
                  placeholder="Your Location"
                  value={this.props.location}
                  change={this.handleInputChange}
                />
              </div>
            </div>
            <div className={searchButtonClasses}>
              <Button main>Go</Button>
            </div>
          </form>
          <div className={searchButtonClasses}>
            <Button main click={this.handleFilter}>
              <div className={MAT_ICONS}>filter_list</div>
            </Button>
          </div>
        </Fade>
      </div>
    );

    const resPage = (
      <ResPage
        isOpen={this.state.isPageOpen}
        id={this.state.id}
        restaurant={this.state.restaurant}
        src={this.state.src}
        close={this.handlePageClose}
      />
    );

    return (
      <div className={classes.Restaurants} onScroll={this.handleScroll}>
        {loadingMessage}
        {errorMessage}
        {backdrop}
        {locationRequestModal}
        {restaurantsGrid}
        {filters}
        {searchBar}
        {resPage}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
