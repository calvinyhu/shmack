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
import Button from 'components/UI/Button/Button';
import Backdrop from 'components/UI/Backdrop/Backdrop';
import ResPage from 'components/ResPage/ResPage';
import Filters from 'components/Filters/Filters';
import SearchBar from 'components/SearchBar/SearchBar';
import NearBy from 'components/NearBy/NearBy';
import * as paths from 'utilities/paths';
import { MAT_ICONS } from 'utilities/styles';
import {
  createGooglePlacePhotoQuery,
  convertPrice,
  NEAR_BY_RADIUS
} from 'utilities/google';

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
  isNearByLoading: state.restaurants.isNearByLoading,
  food: state.restaurants.food,
  location: state.restaurants.location,
  googleRestaurants: state.restaurants.googleRestaurants,
  nearByRestaurants: state.restaurants.nearByRestaurants,
  error: state.restaurants.error
});

const mapDispatchToProps = {
  onRestaurantInputChange: restaurantActions.restaurantInputChange,
  onRestaurantSearch: restaurantActions.restaurantSearch,
  onRequestLocation: restaurantActions.requestLocation,
  onGetNearBy: restaurantActions.restaurantSearch,
  onToggleGrid: restaurantActions.toggleGrid,
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
    prevScrollTop: 0,
    radius: 5
  };

  componentDidMount() {
    if (
      !this.props.nearByRestaurants &&
      !this.props.isNearByLoading &&
      !this.props.error
    )
      this.props.onGetNearBy('', '', NEAR_BY_RADIUS);

    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
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
        this.handleHideLocationInput();
        this.handleHideFilters();
      };
    }
    return this.restaurantClickHandlers[id];
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
            <h6>{res.rating ? res.rating.toFixed(1) : null}</h6>
          </Thumbnail>
        );
      });
    }
    return restaurants;
  };

  // NearBy
  handleRefresh = () => this.props.onGetNearBy('', '', NEAR_BY_RADIUS);

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
    if (this.props.error) {
      let grantButton = null;
      if (this.props.error === 'Your location is unknown. Grant location.') {
        grantButton = (
          <div className={styles.GrantButton}>
            <Button main click={this.handleRedirect}>
              Grant
            </Button>
          </div>
        );
      }
      errorMessage = (
        <div className={styles.Message}>
          {this.props.error}
          {grantButton}
        </div>
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
        Turn on location sharing in app settings
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
    let gridContainer = (
      <div className={gridClasses} onScroll={this.handleScroll}>
        {restaurantsGrid}
      </div>
    );

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

    let nearBy = (
      <NearBy
        isLoading={this.props.isNearByLoading || this.props.isGoogleLoading}
        error={this.props.error}
        nearByRestaurants={this.props.nearByRestaurants}
        getRestaurantClickHandler={(place_id, res) =>
          this.getRestaurantClickHandler(place_id, res)
        }
        handleRedirect={this.handleRedirect}
        handleRefresh={this.handleRefresh}
      />
    );

    return (
      <div className={styles.Restaurants}>
        {nearBy}
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
