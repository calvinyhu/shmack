import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import throttle from 'raf-throttle';

import styles from './Restaurants.module.scss';
import * as restaurantActions from 'store/actions/restaurantsActions';
import * as appActions from 'store/actions/appActions';
import * as resPageActions from 'store/actions/resPageActions';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import Modal from 'components/UI/Modal/Modal';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import ResPage from 'components/ResPage/ResPage';
import Filters from 'components/Filters/Filters';
import SearchBar from 'components/SearchBar/SearchBar';
import { MAT_ICONS } from 'utilities/styles';
import * as paths from 'utilities/paths';
import { createGooglePlacePhotoQuery, convertPrice } from 'utilities/google';

const mapStateToProps = state => ({
  // App
  hasGeoLocatePermission: state.app.hasGeoLocatePermission,
  redirectParent: state.app.redirectParent,

  // Auth
  isAuth: state.auth.isAuth,

  // Restaurants
  isRequestingLocation: state.restaurants.isRequestingLocation,
  isShowGrid: state.restaurants.isShowGrid,
  isSearchSuccess: state.restaurants.isSearchSuccess,
  isGoogleLoading: state.restaurants.isGoogleLoading,
  food: state.restaurants.food,
  location: state.restaurants.location,
  googleRestaurants: state.restaurants.googleRestaurants,
  error: state.restaurants.error
});

const mapDispatchToProps = {
  onRestaurantInputChange: restaurantActions.restaurantInputChange,
  onRestaurantSearch: restaurantActions.restaurantSearch,
  onRequestLocation: restaurantActions.requestLocation,
  onClearError: restaurantActions.clearError,
  onGetPopularItems: resPageActions.getItems,
  onSetRedirectParent: appActions.setRedirectParent
};

class Restaurants extends Component {
  state = {
    isRedirectingToSettings: false,
    isScrollingDown: false,
    isPageOpen: false,
    isShowLocationInput: false,
    isShowFilters: false,
    id: null,
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

  componentDidUpdate() {
    console.log('componentDidUpdate');
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

  handleClickRadius = event => this.setState({ radius: event.target.id });

  handleSearch = event => {
    if (event) event.preventDefault();

    // Search
    if (
      (this.props.location || this.props.hasGeoLocatePermission) &&
      !this.props.isGoogleLoading
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
  handlePageOpen = (id, res) =>
    this.setState({ isPageOpen: true, id: id, restaurant: res });
  handlePageClose = () =>
    this.setState({ isPageOpen: false, isScrollingDown: false });

  // Restaurant Grid Thumbnail Handles
  restaurantClickHandlers = {};
  getRestaurantClickHandler = (id, res) => {
    if (!this.restaurantClickHandlers[id]) {
      this.restaurantClickHandlers[id] = () => {
        this.handlePageOpen(id, res);
        if (this.props.isAuth) this.props.onGetPopularItems(id);
        this.hideLocationInput();
        this.hideFilters();
      };
    }
    return this.restaurantClickHandlers[id];
  };

  convertRating = rating => {
    if (rating > 5) rating = 5;
    if (rating < 0) rating = 0;

    let stars = [];
    let filled;
    for (filled = 0; filled < rating - 1; filled++) {
      stars.push(
        <div key={filled} className={MAT_ICONS}>
          star
        </div>
      );
    }

    let remainder = rating - filled;
    remainder = remainder.toFixed(1);
    if (remainder >= 0.8) {
      stars.push(
        <div key={remainder} className={MAT_ICONS}>
          star
        </div>
      );
    } else if (remainder >= 0.3) {
      stars.push(
        <div key={remainder} className={MAT_ICONS}>
          star_half
        </div>
      );
    }

    for (let empty = stars.length; empty < 5; empty++) {
      stars.push(
        <div key={empty} className={MAT_ICONS}>
          star_border
        </div>
      );
    }

    return (
      <div className={styles.RatingContainer}>
        <p>{rating ? rating.toFixed(1) : null}</p>
        <div className={styles.Stars}>{rating ? stars : null}</div>
      </div>
    );
  };

  renderThumbnails = () => {
    let restaurants = [];
    if (this.props.googleRestaurants) {
      this.props.googleRestaurants.forEach(res => {
        if (!res.photos) return;

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
            <h6>{res.rating ? this.convertRating(res.rating) : null}</h6>
          </Thumbnail>
        );
      });
    }
    return restaurants;
  };

  render() {
    if (this.state.isRedirectingToSettings)
      return <Redirect to={paths.SETTINGS} />;

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
        Turn on location sharing in app settings
      </Modal>
    );

    let loadingMessage = null;
    let errorMessage = null;
    let restaurantsGrid = null;
    let gridContainer = null;

    if (this.props.isGoogleLoading) {
      loadingMessage = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>Searching...</div>
        </div>
      );
    } else if (this.props.error) {
      errorMessage = <div className={styles.Message}>{this.props.error}</div>;
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
)(Restaurants);
