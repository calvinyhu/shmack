import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './Home.module.scss';
import * as restaurantActions from 'store/actions/restaurantsActions';
import * as appActions from 'store/actions/appActions';
import * as resPageActions from 'store/actions/resPageActions';
import NearBy from 'components/NearBy/NearBy';
import ResPage from 'components/ResPage/ResPage';
import Button from 'components/UI/Button/Button';
import { NEAR_BY_RADIUS } from 'utilities/google';
import * as paths from 'utilities/paths';

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  isNearByLoading: state.restaurants.isNearByLoading,
  nearByRestaurants: state.restaurants.nearByRestaurants,
  error: state.restaurants.error
});

const mapDispatchToProps = {
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
      this.props.nearByRestaurants.length === 0 &&
      !this.props.isNearByLoading &&
      !this.props.error.message
    )
      this.props.onGetNearBy('', '', NEAR_BY_RADIUS);
  }

  componentWillUnmount() {
    this.props.onClearError();
  }

  handleRedirect = () => {
    this.props.onSetRedirectParent(paths.HOME);
    this.props.onRequestLocation(false);
    this.setState({ isRedirectingToSettings: true });
  };

  handleRefresh = () => {
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

    let nearBy;
    let errorMessage = null;
    let loadingMessage = null;

    if (this.props.isNearByLoading) {
      loadingMessage = (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader}>Searching...</div>
        </div>
      );
    } else if (this.props.error.message) {
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
      nearBy = (
        <NearBy
          isLoading={this.props.isNearByLoading}
          error={this.props.error}
          nearByRestaurants={this.props.nearByRestaurants}
          getRestaurantClickHandler={(place_id, res) =>
            this.getRestaurantClickHandler(place_id, res)
          }
          handleRedirect={this.handleRedirect}
          handleRefresh={this.handleRefresh}
        />
      );
    }

    return (
      <div className={styles.Home}>
        {nearBy}
        {loadingMessage}
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
