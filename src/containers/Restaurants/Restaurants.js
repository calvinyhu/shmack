import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import throttle from 'raf-throttle';
import Fade from 'react-reveal/Fade';

import styles from './Restaurants.module.scss';
import * as actions from 'store/actions/restaurantsActions';
import * as paths from 'utilities/paths';
import { getItems } from 'store/actions/resPageActions';
import { setRedirectParent } from 'store/actions/appActions';
import { createGooglePlacePhotoQuery, convertPrice } from 'utilities/google';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import Modal from 'components/UI/Modal/Modal';
import Button from 'components/UI/Button/Button';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import ResPage from 'components/ResPage/ResPage';
import Filters from 'components/Filters/Filters';
import SearchBar from 'components/SearchBar/SearchBar';
import { MAT_ICONS } from 'utilities/styles';

// 0.5 mile
export const NEAR_BY_RADIUS = 400;

const mapStateToProps = state => {
  return {
    hasGeoLocatePermission: state.app.hasGeoLocatePermission,
    redirectParent: state.app.redirectParent,

    isAuth: state.auth.isAuth,

    isRequestingLocation: state.restaurants.isRequestingLocation,
    isShowGrid: state.restaurants.isShowGrid,
    food: state.restaurants.food,
    location: state.restaurants.location,
    isSearchSuccess: state.restaurants.isSearchSuccess,
    isGoogleLoading: state.restaurants.isGoogleLoading,
    googleRestaurants: state.restaurants.googleRestaurants,
    googleError: state.restaurants.googleError,
    isNearByLoading: state.restaurants.isNearByLoading,
    nearByRestaurants: state.restaurants.nearByRestaurants,
    nearByError: state.restaurants.nearByError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRestaurantInputChange: (name, value) =>
      dispatch(actions.restaurantInputChange(name, value)),
    onRestaurantSearch: (food, location, radius) =>
      dispatch(actions.restaurantSearch(food, location, radius)),
    onGetPopularItems: id => dispatch(getItems(id)),
    onRequestLocation: value => dispatch(actions.requestLocation(value)),
    onSetRedirectParent: parent => dispatch(setRedirectParent(parent)),
    onGetNearBy: () =>
      dispatch(actions.restaurantSearch('', '', NEAR_BY_RADIUS)),
    onToggleGrid: isShowGrid => dispatch(actions.toggleGrid(isShowGrid))
  };
};

class Restaurants extends Component {
  restaurants = [];
  restaurantNames = {};
  isGoogleRendered = false;
  restaurantClickHandlers = {};

  state = {
    isRedirectingToSettings: false,
    isScrollingDown: false,
    isPageOpen: false,
    isShowLocationInput: false,
    isShowFilters: false,
    id: null,
    restaurant: null,
    prevScrollTop: 0,
    radius: 5
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps !== this.props ||
      nextState.isRedirectingToSettings !==
        this.state.isRedirectingToSettings ||
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
    this.props.onSetRedirectParent(paths.HOME);
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

  handleHideLocationInput = () => {
    if (this.state.isShowLocationInput)
      this.setState({ isShowLocationInput: false });
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

  handleToggleFilters = () => {
    this.setState(prevState => {
      return { isShowFilters: !prevState.isShowFilters };
    });
  };

  handleHideFilters = () => {
    if (this.state.isShowFilters) this.setState({ isShowFilters: false });
  };

  handleClickRadius = event => this.setState({ radius: event.target.id });

  handleSearch = event => {
    if (event) event.preventDefault();

    // Reset search state
    this.restaurants = null;
    this.restaurantNames = null;
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
    } else this.props.onRequestLocation(true);
  };

  handleToggleGrid = () => {
    this.setState({ isScrollingDown: false });
    this.props.onToggleGrid(this.props.isShowGrid);
  };

  // Geolocation Handles
  handleCloseLocationRequest = () => this.props.onRequestLocation(false);

  // Restaurant Page Handles
  handlePageClose = () =>
    this.setState({ isPageOpen: false, isScrollingDown: false });

  // Restaurant Grid Thumbnail Handles
  getRestaurantClickHandler = (id, res) => {
    if (!this.restaurantClickHandlers[id]) {
      this.restaurantClickHandlers[id] = () => {
        this.setState({ isPageOpen: true, id: id, restaurant: res });
        this.props.onGetPopularItems(id);
        this.handleHideLocationInput();
        this.handleHideFilters();
      };
    }
    return this.restaurantClickHandlers[id];
  };

  renderThumbnails = () => {
    let restaurants = [];
    let resNames = {};

    if (this.restaurants) restaurants = [...this.restaurants];
    if (this.restaurantNames) resNames = { ...this.restaurantNames };

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
              click={this.getRestaurantClickHandler(res.place_id, res)}
              img={imgUrl}
            >
              <h6>{convertPrice(res.price_level)}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating ? res.rating.toFixed(1) : null}</h6>
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

  // NearBy

  handleRefresh = () => this.props.onGetNearBy();

  renderNearByThumbnails = () => {
    let nearByThumbnails = [];
    if (this.props.nearByRestaurants) {
      this.props.nearByRestaurants.forEach(res => {
        if (res.photos) {
          const photo = res.photos[0];
          const imgUrl = createGooglePlacePhotoQuery(
            photo.photo_reference,
            photo.width
          );
          nearByThumbnails.push(
            <div key={res.place_id} className={styles.NearByRestaurant}>
              <Thumbnail
                click={this.getRestaurantClickHandler(res.place_id, res)}
                img={imgUrl}
              >
                <h6>{convertPrice(res.price_level)}</h6>
                <h6>{res.name}</h6>
                <h6>{res.rating ? res.rating.toFixed(1) : null}</h6>
              </Thumbnail>
            </div>
          );
        }
      });
    }
    return nearByThumbnails;
  };

  render() {
    if (this.state.isRedirectingToSettings)
      return <Redirect to={paths.SETTINGS} />;

    let loadingMessage = null;
    if (this.props.isGoogleLoading || this.props.isNearByLoading)
      loadingMessage = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>Searching...</div>
        </div>
      );

    let errorMessage = null;
    if (this.props.googleError && this.props.googleError !== -1) {
      errorMessage = (
        <div className={styles.Message}>{this.props.googleError}</div>
      );
    }

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
        btnMsg={'Take me there!'}
      >
        To use current location, <strong>turn on location sharing</strong> in
        app settings.
      </Modal>
    );

    const options = { radius: this.state.radius };
    const filters = (
      <Filters
        isOpen={this.state.isShowFilters}
        isLifted={
          this.state.isShowFilters &&
          (this.state.isShowLocationInput || this.props.location)
        }
        clickRadius={this.handleClickRadius}
        search={this.handleSearch}
        options={options}
      />
    );

    const searchBar = (
      <SearchBar
        isScrollingDown={this.state.isScrollingDown}
        isGoogleLoading={this.state.isGoogleLoading}
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
        id={this.state.id}
        restaurant={this.state.restaurant}
        close={this.handlePageClose}
      />
    );

    let restaurantsGrid = null;
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
    }

    let gridClasses = styles.GridContainer;
    if (this.props.isShowGrid) gridClasses += ' ' + styles.SlideIn;
    let gridContainer = <div className={gridClasses}>{restaurantsGrid}</div>;

    let toggleGridClasses = styles.ToggleGridButton;
    if (this.props.isSearchSuccess) {
      toggleGridClasses += ' ' + styles.Show;
      if (this.props.isShowGrid) toggleGridClasses += ' ' + styles.Rotate;
    }
    let toggleGridButton = (
      <div className={toggleGridClasses}>
        <Button circle main noShadow click={this.handleToggleGrid}>
          <div className={MAT_ICONS}>chevron_left</div>
        </Button>
      </div>
    );

    let nearByRestaurants = null;
    if (this.props.nearByError) {
      nearByRestaurants = (
        <div className={styles.NearByMessage}>
          <p>{this.props.nearByError}</p>
          <div className={styles.GrantButton}>
            <Button main click={this.handleRedirect}>
              Grant
            </Button>
          </div>
        </div>
      );
    } else if (!this.props.isNearByLoading) {
      nearByRestaurants = this.renderNearByThumbnails();
      if (nearByRestaurants.length === 0) {
        nearByRestaurants = (
          <div className={styles.NearByMessage}>
            <p>
              There are no restaurants near your current location. Try again or
              search below.
            </p>
          </div>
        );
      }
    }

    let nearBy = (
      <Fade>
        <div className={styles.NearBy}>
          <div className={styles.NearByHeader}>
            <h4>Near You</h4>
            <div className={styles.NearByRefresh}>
              <Button clear click={this.handleRefresh}>
                <div className={MAT_ICONS}>refresh</div>
              </Button>
            </div>
          </div>
          {nearByRestaurants}
        </div>
      </Fade>
    );

    let nearByContainer = (
      <div className={styles.NearByContainer}>{nearBy}</div>
    );

    return (
      <div className={styles.Restaurants} onScroll={this.handleScroll}>
        {nearByContainer}
        {gridContainer}
        {toggleGridButton}
        {filters}
        {searchBar}
        {loadingMessage}
        {errorMessage}
        {backdrop}
        {locationRequestModal}
        {resPage}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
