import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import throttle from 'raf-throttle';
import PropTypes from 'prop-types';

import styles from './Search.module.scss';
import * as restaurantActions from 'store/actions/restaurantsActions';
import * as appActions from 'store/actions/appActions';
import * as resPageActions from 'store/actions/resPageActions';
import * as userActions from 'store/actions/userActions';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import Modal from 'components/UI/Modal/Modal';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import ResPage from 'components/ResPage/ResPage';
import Filters from 'components/Filters/Filters';
import SearchBar from 'components/SearchBar/SearchBar';
import * as paths from 'utilities/paths';
import { createGooglePlacePhotoQuery } from 'utilities/google';

const mapStateToProps = state => ({
  // App
  hasGeoLocatePermission: state.app.hasGeoLocatePermission,
  redirectParent: state.app.redirectParent,

  // Auth
  isAuth: state.auth.isAuth,

  // Restaurants
  isRequestingLocation: state.restaurants.isRequestingLocation,
  isShowGrid: state.restaurants.isShowGrid,
  isSearchLoading: state.restaurants.isSearchLoading,
  isSearchSuccess: state.restaurants.isSearchSuccess,
  food: state.restaurants.food,
  location: state.restaurants.location,
  searchRestaurants: state.restaurants.searchRestaurants,
  error: state.restaurants.error
});

const mapDispatchToProps = {
  onRestaurantInputChange: restaurantActions.restaurantInputChange,
  onRestaurantSearch: restaurantActions.restaurantSearch,
  onRequestLocation: restaurantActions.requestLocation,
  onClearError: restaurantActions.clearError,
  onClearResPageError: resPageActions.clearError,
  onGetPopularItems: resPageActions.getItems,
  onSetRedirectParent: appActions.setRedirectParent,
  onGetUserVotes: userActions.getUserVotes
};

class Search extends Component {
  static propTypes = {
    isRequestingLocation: PropTypes.bool.isRequired,
    isSearchLoading: PropTypes.bool.isRequired,
    isSearchSuccess: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
    hasGeoLocatePermission: PropTypes.bool.isRequired,
    food: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    searchRestaurants: PropTypes.array.isRequired,
    error: PropTypes.object.isRequired,
    onRestaurantSearch: PropTypes.func.isRequired,
    onGetPopularItems: PropTypes.func.isRequired,
    onGetUserVotes: PropTypes.func.isRequired,
    onClearResPageError: PropTypes.func.isRequired,
    onClearError: PropTypes.func.isRequired,
    onSetRedirectParent: PropTypes.func.isRequired,
    onRequestLocation: PropTypes.func.isRequired,
    onRestaurantInputChange: PropTypes.func.isRequired
  };

  state = {
    isRedirectingToSettings: false,
    isScrollingDown: false,
    isPageOpen: false,
    isShowLocationInput: false,
    isShowFilters: false,
    restaurant: null,
    radius: 5
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    this.props.onClearError();
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleRedirect = () => {
    this.props.onSetRedirectParent(paths.SEARCH);
    this.props.onRequestLocation(false);
    this.setState({ isRedirectingToSettings: true });
  };

  // SearchBar Handles
  handleInputChange = event => {
    this.props.onRestaurantInputChange(event.target.name, event.target.value);
  };

  handleShowLocationInput = () => {
    if (!this.state.isShowLocationInput)
      this.setState({ isShowLocationInput: true });
  };

  hideLocationInput = () => {
    if (this.state.isShowLocationInput)
      this.setState({ isShowLocationInput: false });
  };

  prevScrollTop = 0;
  setScrollDirection = scrollTop => {
    if (this.state.isScrollingDown && scrollTop <= this.prevScrollTop)
      this.setState({ isScrollingDown: false });
    else if (!this.state.isScrollingDown && scrollTop > this.prevScrollTop)
      this.setState({ isScrollingDown: true });
    this.prevScrollTop = scrollTop;
  };

  handleScroll = () => {
    throttle(this.animateSearchBar(window.scrollY));
  };

  animateSearchBar = scrollTop => {
    this.setScrollDirection(scrollTop);
    this.hideLocationInput();
    this.hideFilters();
  };

  handleToggleFilters = () => {
    this.setState(prevState => {
      return { isShowFilters: !prevState.isShowFilters };
    });
  };

  hideFilters = () => {
    if (this.state.isShowFilters) this.setState({ isShowFilters: false });
  };

  handleChangeRadius = event => {
    if (event) this.setState({ radius: event.target.id });
  };

  handleSearch = event => {
    if (event) event.preventDefault();

    // Search
    if (
      (this.props.location || this.props.hasGeoLocatePermission) &&
      !this.props.isSearchLoading
    ) {
      this.props.onRestaurantSearch(
        this.props.food,
        this.props.location,
        this.state.radius * 1609
      );
      this.hideLocationInput();
      this.hideFilters();
    } else this.props.onRequestLocation(true);
  };

  // Geolocation Handles
  handleCloseLocationRequest = () => this.props.onRequestLocation(false);

  // Restaurant Page Handles
  handlePageOpen = restaurant =>
    this.setState({ isPageOpen: true, restaurant });
  handlePageClose = () =>
    this.setState({ isPageOpen: false, isScrollingDown: false });

  // Restaurant Grid Thumbnail Handles
  restaurantClickHandlers = {};
  getRestaurantClickHandler = restaurant => {
    if (!this.restaurantClickHandlers[restaurant.place_id]) {
      this.restaurantClickHandlers[restaurant.place_id] = () => {
        if (this.props.isAuth) {
          this.props.onGetPopularItems(restaurant.place_id);
          this.props.onGetUserVotes(restaurant.place_id);
        }
        this.props.onClearResPageError();
        this.handlePageOpen(restaurant);
        this.hideLocationInput();
        this.hideFilters();
      };
    }
    return this.restaurantClickHandlers[restaurant.place_id];
  };

  renderThumbnails = () => {
    let restaurants = [];
    if (this.props.searchRestaurants) {
      this.props.searchRestaurants.forEach(res => {
        if (!res.photos) return;

        const photo = res.photos[0];
        const imgUrl = createGooglePlacePhotoQuery(
          photo.photo_reference,
          photo.width
        );
        restaurants.push(
          <Thumbnail
            key={res.place_id}
            click={this.getRestaurantClickHandler(res)}
            img={imgUrl}
            price={res.price_level}
            name={res.name}
            rating={res.rating}
          />
        );
      });
    }
    return restaurants;
  };

  render() {
    if (this.state.isRedirectingToSettings)
      return <Redirect to={paths.SETTINGS} />;

    const selectedOptions = { radius: this.state.radius };
    const filters = (
      <Filters
        isOpen={this.state.isShowFilters}
        isLifted={
          this.state.isShowFilters &&
          (this.state.isShowLocationInput || this.props.location.length > 0)
        }
        apply={this.handleSearch}
        changeRadius={this.handleChangeRadius}
        selectedOptions={selectedOptions}
      />
    );

    const searchBar = (
      <SearchBar
        isScrollingDown={this.state.isScrollingDown}
        isSearchLoading={this.props.isSearchLoading}
        isShowFilters={this.state.isShowFilters}
        isShowLocationInput={this.state.isShowLocationInput}
        food={this.props.food}
        location={this.props.location}
        handleInputChange={this.handleInputChange}
        handleShowLocationInput={this.handleShowLocationInput}
        handleToggleFilters={this.handleToggleFilters}
        handleSearch={this.handleSearch}
      />
    );

    const resPage = (
      <ResPage
        isOpen={this.state.isPageOpen}
        restaurant={this.state.restaurant}
        close={this.handlePageClose}
      />
    );

    const backdrop = (
      <Backdrop
        isOpen={this.props.isRequestingLocation}
        click={this.handleCloseLocationRequest}
      />
    );

    const locationRequestModal = (
      <Modal
        isOpen={this.props.isRequestingLocation}
        click={this.handleRedirect}
        close={this.handleCloseLocationRequest}
        btnMsg={'Take me there'}
      >
        To use your current location, turn on location sharing in app settings
      </Modal>
    );

    let loadingMessage = null;
    let errorMessage = null;
    let restaurantsGrid = null;
    let gridContainer = null;

    if (this.props.isSearchLoading) {
      loadingMessage = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>Searching...</div>
        </div>
      );
    } else if (this.props.error.message) {
      errorMessage = (
        <div className={styles.Message}>{this.props.error.message}</div>
      );
    } else {
      let restaurants = this.renderThumbnails();
      if (restaurants.length > 0) {
        restaurantsGrid = (
          <div className={styles.RestaurantsGrid}>{restaurants}</div>
        );
      } else if (this.props.isSearchSuccess) {
        restaurantsGrid = (
          <div className={styles.Message}>
            No results. Try readjusting the filters.
          </div>
        );
      } else {
        restaurantsGrid = (
          <div className={styles.Message}>What are you looking for?</div>
        );
      }
      gridContainer = (
        <div className={styles.GridContainer}>{restaurantsGrid}</div>
      );
    }

    return (
      <div className={styles.Restaurants}>
        {gridContainer}
        {filters}
        {searchBar}
        {loadingMessage}
        {errorMessage}
        {resPage}
        {backdrop}
        {locationRequestModal}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
