import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import throttle from 'raf-throttle';

import classes from './Restaurants.css';
import * as actions from '../../store/actions/restaurantsActions';
import * as paths from '../../utilities/paths';
import { getItems } from '../../store/actions/resPageActions';
import { handleYelpError } from '../../utilities/yelp';
import {
  createGooglePlacePhotoQuery,
  convertPrice
} from '../../utilities/google';
import Thumbnail from '../../components/Thumbnail/Thumbnail';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import ResPage from '../../components/ResPage/ResPage';

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
    onGetPopularItems: id => dispatch(getItems(id))
  };
};

class Restaurants extends Component {
  restaurants = [];
  restaurantNames = {};
  isYelpRendered = false;
  isGoogleRendered = false;
  restaurantClickHandlers = {};

  state = {
    isRedirecting: false,
    isRequestingLocation: false,
    isScrollingDown: false,
    isPageOpen: false,
    id: null,
    restaurant: null,
    src: null,
    prevScrollTop: 0
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps !== this.props ||
      nextState.isRedirecting !== this.state.isRedirecting ||
      nextState.isRequestingLocation !== this.state.isRequestingLocation ||
      nextState.isScrollingDown !== this.state.isScrollingDown ||
      nextState.isPageOpen !== this.state.isPageOpen
    )
      return true;
    return false;
  }

  handleRedirect = () => this.setState({ isRedirecting: true });

  handleInputChange = event => {
    this.props.onRestaurantInputChange(event.target.name, event.target.value);
  };

  handleScroll = event => {
    throttle(this.animateSearchBar(event.target.scrollTop));
  };

  animateSearchBar = scrollTop => {
    this.setState({
      isScrollingDown: scrollTop > this.state.prevScrollTop,
      prevScrollTop: scrollTop
    });
  };

  handleCloseLocationRequest = () => {
    this.setState({ isRequestingLocation: false });
  };

  handlePageClose = () => this.setState({ isPageOpen: false });

  getRestaurantClickHandler = (id, res, src) => {
    if (!this.restaurantClickHandlers[id]) {
      this.restaurantClickHandlers[id] = () => {
        this.setState({ isPageOpen: true, id: id, restaurant: res, src: src });
        this.props.onGetPopularItems(id);
      };
    }
    return this.restaurantClickHandlers[id];
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

  renderThumbnails = () => {
    const restaurants = [...this.restaurants];
    const resNames = { ...this.restaurantNames };

    if (!this.isYelpRendered && this.props.yelpRestaurants) {
      this.props.yelpRestaurants.forEach(res => {
        if (res.image_url && !resNames[res.name]) {
          restaurants.push(
            <Thumbnail
              key={res.id}
              click={this.getRestaurantClickHandler(res.id, res, SOURCE.YELP)}
              img={res.image_url}
            >
              <h6>{res.price}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating}</h6>
            </Thumbnail>
          );
          resNames[res.name] = 1;
        }
      });
      this.isYelpRendered = true;
    }

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
              click={this.getRestaurantClickHandler(
                res.place_id,
                res,
                SOURCE.GOOGLE
              )}
              img={imgUrl}
            >
              <h6>{convertPrice(res.price_level)}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating}</h6>
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
        Please turn on location sharing in app settings to use current location.
      </Modal>
    );

    let restaurantsGrid = (
      <div className={classes.RestaurantsGrid}>{this.renderThumbnails()}</div>
    );

    let searchBarClasses = classes.SearchBar;
    if (
      this.state.isScrollingDown ||
      (this.props.isYelpLoading && this.props.isGoogleLoading)
    )
      searchBarClasses += ' ' + classes.HideSearchBar;
    let searchBar = (
      <div className={searchBarClasses}>
        <form onSubmit={this.handleSearch}>
          <div className={classes.SearchInputs}>
            <Input
              small
              type="text"
              name="food"
              placeholder="Food"
              value={this.props.food}
              change={this.handleInputChange}
            />
            <Input
              small
              type="text"
              name="location"
              placeholder="Current Location"
              value={this.props.location}
              change={this.handleInputChange}
            />
          </div>
          <div className={classes.SearchButton}>
            <Button main>Go</Button>
          </div>
        </form>
      </div>
    );

    const resPage = (
      <ResPage
        isOpen={this.state.isPageOpen}
        id={this.state.id}
        restaurant={this.state.restaurant}
        src={this.state.src}
        close={this.handlePageClose}
      />
    );

    return (
      <div className={classes.Restaurants} onScroll={this.handleScroll}>
        {loadingMessage}
        {errorMessage}
        {backdrop}
        {locationRequestModal}
        {/* {background} */}
        {restaurantsGrid}
        {searchBar}
        {resPage}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
