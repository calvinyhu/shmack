import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

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
      !this.props.nearByRestaurants &&
      !this.props.isNearByLoading &&
      !this.props.error
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
    } else if (this.props.error) {
      let grantButton = null;
      if (this.props.error === 'Your location is unknown. Grant location.') {
        grantButton = (
          <div className={styles.GrantButton}>
            <Button bold main click={this.handleRedirect}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
