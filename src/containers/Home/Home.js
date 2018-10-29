import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';

import styles from './Home.module.scss';
import * as restaurantActions from 'store/actions/restaurantsActions';
import * as appActions from 'store/actions/appActions';
import * as resPageActions from 'store/actions/resPageActions';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import ResPage from 'components/ResPage/ResPage';
import Button from 'components/UI/Button/Button';
import Rf from 'components/UI/Icon/Rf/Rf';
import Fa from 'components/UI/Icon/Fa/Fa';
import {
  AT_RADIUS,
  NEAR_BY_RADIUS,
  createGooglePlacePhotoQuery,
  convertPrice,
  convertRating
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
  onSetRedirectParent: appActions.setRedirectParent
};

class Home extends Component {
  state = {
    isRedirectingToSettings: false,
    isScrollingDown: false,
    isPageOpen: false,
    id: null,
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
        this.props.onClearResPageError();
      };
    }
    return this.restaurantClickHandlers[id];
  };

  getPrice = price => {
    return (
      <div className={styles.PriceLevel}>
        {convertPrice(price).map((sign, index) => (
          <Rf key={index} white sm>
            {sign}
          </Rf>
        ))}
      </div>
    );
  };

  getStars = rating => {
    const stars = convertRating(rating).map((star, index) => (
      <Fa key={index}>{star}</Fa>
    ));

    return <div className={styles.Stars}>{rating ? stars : null}</div>;
  };

  renderThumbnails = restaurants => {
    let thumbanils = [];
    if (restaurants) {
      restaurants.forEach(res => {
        if (res.photos) {
          const photo = res.photos[0];
          const imgUrl = createGooglePlacePhotoQuery(
            photo.photo_reference,
            photo.width
          );
          thumbanils.push(
            <div key={res.place_id} className={styles.NearByRestaurant}>
              <Thumbnail
                click={this.getRestaurantClickHandler(res.place_id, res)}
                img={imgUrl}
              >
                <h6>{this.getPrice(res.price_level)}</h6>
                <h6>{res.name}</h6>
                <h6>{res.rating ? this.getStars(res.rating) : null}</h6>
              </Thumbnail>
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
        id={this.state.id}
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
                There are no restaurants at your current location. Try again or
                manually search.
              </p>
            </div>
          );
        }
      }

      at = (
        <div className={styles.NearByContainer}>
          <div className={styles.NearBy}>
            <div className={styles.NearByHeader}>
              <h5>Are you at?</h5>
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
                There are no restaurants near your current location. Try again
                or manually search.
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

Home.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  isNearByLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  nearByRestaurants: PropTypes.array.isRequired,
  onClearError: PropTypes.func.isRequired,
  onSetRedirectParent: PropTypes.func.isRequired,
  onRequestLocation: PropTypes.func.isRequired,
  onGetNearBy: PropTypes.func.isRequired,
  onGetPopularItems: PropTypes.func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
