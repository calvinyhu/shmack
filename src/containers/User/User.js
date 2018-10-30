import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './User.module.scss';
import * as userActions from 'store/actions/userActions';
import * as resPageActions from 'store/actions/resPageActions';
import { createGooglePlacePhotoQuery } from 'utilities/google';
import Thumbnail from 'components/Thumbnail/Thumbnail';
import ResPage from 'components/ResPage/ResPage';
import Button from 'components/UI/Button/Button';
import Rf from 'components/UI/Icon/Rf/Rf';

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth,
  isGettingPlaces: state.user.isGettingPlaces,
  places: state.user.places
});

const mapDispatchToProps = {
  onGetPlaces: userActions.getPlaces,
  onGetUserVotes: userActions.getUserVotes,
  onGetPopularItems: resPageActions.getItems,
  onClearResPageError: resPageActions.clearError
};

class User extends Component {
  static propTypes = {
    places: PropTypes.array,
    onClearResPageError: PropTypes.func.isRequired
  };

  state = {
    isPageOpen: false,
    restaurant: null
  };

  componentDidMount() {
    if (this.props.places.length === 0) this.props.onGetPlaces();
  }

  handleAtRefresh = () => {
    if (!this.props.isGettingPlaces) this.props.onGetPlaces();
  };

  // Restaurant Page Handles
  handlePageOpen = restaurant =>
    this.setState({ isPageOpen: true, restaurant });
  handlePageClose = () => this.setState({ isPageOpen: false });

  // Restaurant Grid Thumbnail Handles
  restaurantClickHandlers = {};
  getRestaurantClickHandler = place => {
    if (!this.restaurantClickHandlers[place.place_id]) {
      this.restaurantClickHandlers[place.place_id] = () => {
        if (this.props.isAuth) {
          this.props.onGetPopularItems(place.place_id);
          this.props.onGetUserVotes(place.place_id);
        }
        this.props.onClearResPageError();
        this.handlePageOpen(place);
      };
    }
    return this.restaurantClickHandlers[place.place_id];
  };

  renderThumbnails = places => {
    if (this.props.isGettingPlaces) {
      return (
        <div className={styles.LoaderContainer}>
          <div className={styles.Loader} />
        </div>
      );
    } else if (places.length <= 0) return [];

    const thumbnails = [];
    places.forEach(place => {
      if (!place.photos) return;
      const photo = place.photos[0];
      const imgUrl = createGooglePlacePhotoQuery(
        photo.photo_reference,
        photo.width
      );
      const thumbnail = (
        <div key={place.place_id} className={styles.ThumbnailContainer}>
          <Thumbnail
            click={this.getRestaurantClickHandler(place)}
            img={imgUrl}
            price={place.price_level}
            name={place.name}
            rating={place.rating}
          />
        </div>
      );
      thumbnails.push(thumbnail);
    });

    return thumbnails;
  };

  render() {
    const thumbnails = this.renderThumbnails(this.props.places);

    const resPage = (
      <ResPage
        isOpen={this.state.isPageOpen}
        restaurant={this.state.restaurant}
        close={this.handlePageClose}
      />
    );

    return (
      <div className={styles.User}>
        <div className={styles.Places}>
          <header>
            <h5>Your Places</h5>
            <div className={styles.Refresh}>
              <Button clear circle small click={this.handleAtRefresh}>
                <Rf sm>refresh</Rf>
              </Button>
            </div>
          </header>
          {thumbnails}
        </div>
        {resPage}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
