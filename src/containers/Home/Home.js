import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './Home.module.scss';
import * as restaurantActions from 'store/actions/restaurantsActions';
import * as appActions from 'store/actions/appActions';
import * as resPageActions from 'store/actions/resPageActions';
import * as userActions from 'store/actions/userActions';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import ResPage from 'components/ResPage/ResPage';
import Button from 'components/UI/Button/Button';
import Rf from 'components/UI/Icon/Rf/Rf';
import {
  AT_RADIUS,
  NEAR_BY_RADIUS,
  createGooglePlacePhotoQuery
} from 'utilities/google';
import * as paths from 'utilities/paths';

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  isAtLoading: state.restaurants.isAtLoading,
  isNearByLoading: state.restaurants.isNearByLoading,
  atRestaurants: state.restaurants.atRestaurants,
  nearByRestaurants: state.restaurants.nearByRestaurants,
  error: state.restaurants.error
});

const mapDispatchToProps = {
  onGetAt: restaurantActions.restaurantSearch,
  onGetNearBy: restaurantActions.restaurantSearch,
  onClearError: restaurantActions.clearError,
  onRequestLocation: restaurantActions.requestLocation,
  onGetPopularItems: resPageActions.getItems,
  onClearResPageError: resPageActions.clearError,
  onSetRedirectParent: appActions.setRedirectParent,
  onGetUserVotes: userActions.getUserVotes
};

class Home extends Component {
  static propTypes = {
    isAuth: PropTypes.bool.isRequired,
    isNearByLoading: PropTypes.bool.isRequired,
    error: PropTypes.object.isRequired,
    nearByRestaurants: PropTypes.array.isRequired,
    onClearError: PropTypes.func.isRequired,
    onSetRedirectParent: PropTypes.func.isRequired,
    onRequestLocation: PropTypes.func.isRequired,
    onGetNearBy: PropTypes.func.isRequired,
    onGetPopularItems: PropTypes.func.isRequired,
    onGetUserVotes: PropTypes.func.isRequired
  };

  state = {
    isRedirectingToSettings: false,
    isScrollingDown: false,
    isPageOpen: false,
    restaurant: null
  };

  componentDidMount() {
    if (
      this.props.atRestaurants.length === 0 &&
      !this.props.isAtLoading &&
      !this.props.error.message
    ) {
      this.props.onGetAt('', '', AT_RADIUS);
    }

    if (
      this.props.nearByRestaurants.length === 0 &&
      !this.props.isNearByLoading &&
      !this.props.error.message
    ) {
      this.props.onGetNearBy('', '', NEAR_BY_RADIUS);
    }
  }

  componentWillUnmount() {
    this.props.onClearError();
  }

  handleRedirect = () => {
    this.props.onSetRedirectParent(paths.HOME);
    this.props.onRequestLocation(false);
    this.setState({ isRedirectingToSettings: true });
  };

  handleAtRefresh = () => {
    if (!this.props.isAtLoading) this.props.onGetAt('', '', AT_RADIUS);
  };

  handleNearByRefresh = () => {
    if (!this.props.isNearByLoading)
      this.props.onGetNearBy('', '', NEAR_BY_RADIUS);
  };

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
      };
    }
    return this.restaurantClickHandlers[restaurant.place_id];
  };

  renderThumbnails = restaurants => {
    let thumbanils = [];
    if (restaurants) {
      restaurants.forEach(restaurant => {
        if (restaurant.photos) {
          const photo = restaurant.photos[0];
          const imgUrl = createGooglePlacePhotoQuery(
            photo.photo_reference,
            photo.width
          );
          thumbanils.push(
            <div key={restaurant.place_id} className={styles.NearByRestaurant}>
              <Thumbnail
                click={this.getRestaurantClickHandler(restaurant)}
                img={imgUrl}
                price={restaurant.price_level}
                name={restaurant.name}
                rating={restaurant.rating}
              />
            </div>
          );
        }
      });
    }
    return thumbanils;
  };

  render() {
    if (this.state.isRedirectingToSettings)
      return <Redirect to={paths.SETTINGS} />;

    const resPage = (
      <ResPage
        isOpen={this.state.isPageOpen}
        restaurant={this.state.restaurant}
        close={this.handlePageClose}
      />
    );

    let at = null;
    let nearBy = null;
    let errorMessage = null;

    if (this.props.error.message) {
      let grantButton = null;
      if (this.props.error.code === 'locationOff') {
        grantButton = (
          <div className={styles.GrantButton}>
            <Button bold main click={this.handleRedirect}>
              Take me there
            </Button>
          </div>
        );
      }
      errorMessage = (
        <div className={styles.Message}>
          To see popular foods nearby, turn on location.
          {grantButton}
        </div>
      );
    } else {
      let atRestaurants = null;
      if (this.props.isAtLoading) {
        atRestaurants = (
          <div className={styles.LoaderContainer}>
            <div className={styles.Loader}>Searching...</div>
          </div>
        );
      } else if (!this.props.error.message) {
        atRestaurants = this.renderThumbnails(this.props.atRestaurants);
        if (atRestaurants.length === 0) {
          atRestaurants = (
            <div className={styles.NearByMessage}>
              <p>
                There are no restaurants at your current location. Refresh or
                search.
              </p>
            </div>
          );
        }
      }

      at = (
        <div className={styles.NearByContainer}>
          <div className={styles.NearBy}>
            <div className={styles.NearByHeader}>
              <h5>Are you at...</h5>
              <div className={styles.NearByRefresh}>
                <Button clear circle small click={this.handleAtRefresh}>
                  <Rf sm>refresh</Rf>
                </Button>
              </div>
            </div>
            {atRestaurants}
          </div>
        </div>
      );

      let nearByRestaurants = null;
      if (this.props.isNearByLoading) {
        nearByRestaurants = (
          <div className={styles.LoaderContainer}>
            <div className={styles.Loader}>Searching...</div>
          </div>
        );
      } else if (!this.props.error.message) {
        nearByRestaurants = this.renderThumbnails(this.props.nearByRestaurants);
        if (nearByRestaurants.length === 0) {
          nearByRestaurants = (
            <div className={styles.NearByMessage}>
              <p>
                There are no restaurants near your current location. Refresh or
                search.
              </p>
            </div>
          );
        }
      }

      nearBy = (
        <div className={styles.NearByContainer}>
          <div className={styles.NearBy}>
            <div className={styles.NearByHeader}>
              <h5>Near You</h5>
              <div className={styles.NearByRefresh}>
                <Button clear circle small click={this.handleNearByRefresh}>
                  <Rf sm>refresh</Rf>
                </Button>
              </div>
            </div>
            {nearByRestaurants}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.Home}>
        {at}
        {nearBy}
        {errorMessage}
        {resPage}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
