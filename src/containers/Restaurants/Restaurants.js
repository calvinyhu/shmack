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
import { MAT_ICONS } from '../../utilities/styles';

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
    restaurant: null,
    src: null,
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

  handlePageClose = () => this.setState({ isPageOpen: false });

  getRestaurantClickHandler = (id, res, src) => {
    if (!this.restaurantClickHandlers[id]) {
      this.restaurantClickHandlers[id] = () =>
        this.setState({ isPageOpen: true, restaurant: res, src: src });
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

  renderRestaurants = () => {
    const restaurants = [...this.restaurants];
    const resNames = { ...this.restaurantNames };

    if (!this.isYelpRendered && this.props.yelpRestaurants) {
      this.props.yelpRestaurants.forEach(res => {
        if (res.image_url && !resNames[res.name]) {
          restaurants.push(
            <Restaurant
              key={res.id}
              click={this.getRestaurantClickHandler(res.id, res, SOURCE.YELP)}
              img={res.image_url}
            >
              <h5>{res.name}</h5>
            </Restaurant>
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
            <Restaurant
              key={res.place_id}
              click={this.getRestaurantClickHandler(res.id, res, SOURCE.GOOGLE)}
              img={imgUrl}
            >
              <h5>{res.name}</h5>
            </Restaurant>
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

    // let yourPlaces = null;
    // let yourCuisines = null;
    // let background = (
    //   <div className={classes.Background}>
    //     <p className={classes.Separator}>Your Places</p>
    //     <div className={classes.Content}>{yourPlaces}</div>
    //     <p className={classes.Separator}>Places Near You</p>
    //     <div className={classes.Content}>{yourCuisines}</div>
    //   </div>
    // );

    let restaurantsGrid = (
      <div className={classes.RestaurantsGrid}>{this.renderRestaurants()}</div>
    );

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
          <div className={classes.SearchInputs}>
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
          <div className={classes.SearchButton}>
            <Button main>Go</Button>
          </div>
        </form>
      </div>
    );

    let pageContent = null;
    if (this.state.restaurant) {
      const res = this.state.restaurant;

      if (this.state.src === SOURCE.YELP) {
        pageContent = (
          <main>
            <div className={classes.ImgContainer}>
              <header>
                <div className={classes.BackButton}>
                  <Button translucent circle click={this.handlePageClose}>
                    <div className={MAT_ICONS}>arrow_back</div>
                  </Button>
                </div>
              </header>
              <img src={res.image_url} alt="restaurant" />
              <h5>{res.name}</h5>
            </div>
            <div className={classes.Details}>
              <p>{res.location.display_address[0]}</p>
              <p>{res.location.display_address[1]}</p>
              <p>{res.location.display_address[2]}</p>
              <p>{res.display_phone}</p>
              <h6>What's Good?</h6>
            </div>
          </main>
        );
      } else {
        const imgUrl = createGooglePlacePhotoQuery(
          res.photos[0].photo_reference,
          res.photos[0].width
        );
        pageContent = (
          <main>
            <div className={classes.ImgContainer}>
              <header>
                <div className={classes.BackButton}>
                  <Button translucent circle click={this.handlePageClose}>
                    <div className={MAT_ICONS}>arrow_back</div>
                  </Button>
                </div>
              </header>
              <img src={imgUrl} alt="restaurant" />
              <h5>{res.name}</h5>
            </div>
            <div className={classes.Details}>
              <p>{res.vicinity}</p>
              <h6>What's Good?</h6>
            </div>
          </main>
        );
      }
    }
    let pageClasses = classes.Page;
    if (this.state.isPageOpen) pageClasses += ' ' + classes.OpenPage;
    let page = <div className={pageClasses}>{pageContent}</div>;

    return (
      <div className={classes.Restaurants} onScroll={this.handleScroll}>
        {loadingMessage}
        {errorMessage}
        {backdrop}
        {locationRequestModal}
        {/* {background} */}
        {restaurantsGrid}
        {searchBar}
        {page}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
