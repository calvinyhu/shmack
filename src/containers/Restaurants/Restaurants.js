import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import classes from './Restaurants.css';
import * as actions from '../../store/actions/restaurantsActions';
import * as paths from '../../utilities/paths';
import { postYourPlaces } from '../../store/actions/homeActions';
import { handleYelpError } from '../../utilities/yelp';
import { createGooglePlacePhotoQuery } from '../../utilities/google';
import Restaurant from '../../components/Restaurant/Restaurant';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Backdrop from '../../components/UI/Backdrop/Backdrop';

export const SOURCE = {
  YELP: 1,
  GOOGLE: 2
};

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    hasGeoLocatePermission: state.app.hasGeoLocatePermission,
    yourPlaces: state.home.yourPlaces,
    food: state.restaurants.food,
    location: state.restaurants.location,
    isYelpLoading: state.restaurants.isYelpLoading,
    yelpRestaurants: state.restaurants.yelpRestaurants,
    yelpError: state.restaurants.yelpError,
    isGoogleLoading: state.restaurants.isGoogleLoading,
    googleRestaurants: state.restaurants.googleRestaurants,
    googleError: state.restaurants.googleError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRestaurantInputChange: (name, value) =>
      dispatch(actions.restaurantInputChange(name, value)),
    onRestaurantSearch: (food, location) =>
      dispatch(actions.restaurantSearch(food, location)),
    onPostYourPlaces: places => dispatch(postYourPlaces(places))
  };
};

class Restaurants extends Component {
  state = {
    isRedirecting: false,
    isRequestingLocation: false,
    isScrollingDown: false,
    prevScrollTop: 0
  };

  handleRedirect = () => this.setState({ isRedirecting: true });

  handleInputChange = event => {
    this.props.onRestaurantInputChange(event.target.name, event.target.value);
  };

  handleScroll = event => {
    this.setState({
      isScrollingDown: event.target.scrollTop > this.state.prevScrollTop,
      prevScrollTop: event.target.scrollTop
    });
  };

  handleCloseLocationRequest = () => {
    this.setState({ isRequestingLocation: false });
  };

  handleRestaurantClick = (res, src, id) => {
    if (this.state.isMultiSelectActive) {
      const selectedIds = { ...this.state.selectedIds };
      selectedIds[id] = selectedIds[id] ? null : res;

      if (!selectedIds[id]) delete selectedIds[id];

      const selectedIdsLength = Object.keys(selectedIds).length;
      if (selectedIdsLength === 0 && !this.state.isSelectingYourPlaces) {
        this.setState({
          isMultiSelectActive: false,
          selectedIds: {}
        });
      } else this.setState({ selectedIds: selectedIds });
    } else {
      this.setState({
        isCardOpen: true,
        card: res,
        cardSrc: src
      });
    }
  };

  handleSearch = event => {
    event.preventDefault();
    if (this.props.location) {
      console.log('[ Restaurants ] Using typed in location');
      this.props.onRestaurantSearch(this.props.food, this.props.location);
    } else if (this.props.hasGeoLocatePermission) {
      console.log('[ Restaurants ] Using current location');
      this.props.onRestaurantSearch(this.props.food, this.props.location);
    } else this.setState({ isRequestingLocation: true });
  };

  renderRestaurants = () => {
    const restaurants = [];
    const resNames = {};
    if (this.props.yelpRestaurants) {
      this.props.yelpRestaurants.forEach(res => {
        if (res.image_url && !resNames[res.name]) {
          restaurants.push(
            <Restaurant
              isSelected={
                this.state.isMultiSelectActive && this.state.selectedIds[res.id]
              }
              id={res.id}
              click={() => this.handleRestaurantClick(res, SOURCE.YELP, res.id)}
              key={res.id}
              img={res.image_url}
            >
              {res.name}
              {res.rating}
              {res.review_count}
            </Restaurant>
          );
          resNames[res.name] = 1;
        }
      });
    }
    if (this.props.googleRestaurants) {
      this.props.googleRestaurants.forEach(res => {
        if (res.photos && !resNames[res.name]) {
          const photo = res.photos[0];
          const imgUrl = createGooglePlacePhotoQuery(
            photo.photo_reference,
            photo.width
          );
          restaurants.push(
            <Restaurant
              isSelected={
                this.state.isMultiSelectActive &&
                this.state.selectedIds[res.place_id]
              }
              id={res.place_id}
              click={() =>
                this.handleRestaurantClick(res, SOURCE.GOOGLE, res.place_id)
              }
              key={res.place_id}
              img={imgUrl}
            >
              {res.name}
              {res.rating}
            </Restaurant>
          );
          resNames[res.name] = 1;
        }
      });
    }
    return restaurants;
  };

  render() {
    if (this.state.isRedirecting) return <Redirect to={paths.SETTINGS} />;

    let loadingMessage = null;
    if (this.props.isYelpLoading || this.props.isGoogleLoading) {
      loadingMessage = (
        <p className={classes.Message}>
          Getting
          {this.props.food ? ` ${this.props.food}` : ' food '}
          {this.props.location
            ? ` in ${this.props.location} `
            : ' at your current location '}
          for you...
        </p>
      );
    }

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
        btnMsg={'Take me there'}
      >
        To use current location, please allow location sharing in app settings.
      </Modal>
    );

    let yourPlaces = null;
    let yourCuisines = null;
    let background = (
      <div className={classes.Background}>
        <p className={classes.Separator}>Your Places</p>
        <div className={classes.Content}>{yourPlaces}</div>
        <p className={classes.Separator}>Places Near You</p>
        <div className={classes.Content}>{yourCuisines}</div>
      </div>
    );

    let restaurantsGrid = null;
    if (this.props.yelpRestaurants || this.props.googleRestaurants) {
      restaurantsGrid = (
        <div className={classes.RestaurantsGrid}>
          {this.renderRestaurants()}
        </div>
      );
    }

    let searchBarClasses = classes.SearchBar;
    if (
      this.state.isScrollingDown ||
      this.props.isYelpLoading ||
      this.props.isGoogleLoading
    )
      searchBarClasses += ' ' + classes.HideSearchBar;
    let searchBar = (
      <div className={searchBarClasses}>
        <form onSubmit={this.handleSearch}>
          <div>
            <Input
              wide
              center
              accented
              type="text"
              name="food"
              placeholder="Food"
              value={this.props.food}
              change={this.handleInputChange}
            />
            <Input
              wide
              center
              accented
              type="text"
              name="location"
              placeholder="Current Location"
              value={this.props.location}
              change={this.handleInputChange}
            />
          </div>
          <Button thin>Go</Button>
        </form>
      </div>
    );

    return (
      <div className={classes.Restaurants} onScroll={this.handleScroll}>
        {loadingMessage}
        {errorMessage}
        {backdrop}
        {locationRequestModal}
        {background}
        {restaurantsGrid}
        {searchBar}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
