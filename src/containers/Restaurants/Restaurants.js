import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import throttle from 'raf-throttle';

import classes from './Restaurants.css';
import * as actions from '../../store/actions/restaurantsActions';
import * as paths from '../../utilities/paths';
import { postYourPlaces } from '../../store/actions/homeActions';
import { handleYelpError } from '../../utilities/yelp';
import {
  createGooglePlacePhotoQuery,
  convertPrice
} from '../../utilities/google';
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
              <h6>{res.price}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating}</h6>
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
              <h6>{convertPrice(res.price_level)}</h6>
              <h6>{res.name}</h6>
              <h6>{res.rating}</h6>
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

    let restaurantsGrid = (
      <div className={classes.RestaurantsGrid}>{this.renderRestaurants()}</div>
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
      let imgSrc,
        name,
        price,
        rating,
        open,
        resOpenClasses,
        address1,
        address2,
        address3,
        phone;

      if (this.state.src === SOURCE.YELP) {
        imgSrc = res.image_url;
        name = res.name;
        price = res.price;
        rating = res.rating;
        // open = !res.is_closed ? 'Open' : 'Closed';
        resOpenClasses = !res.is_closed
          ? classes.ResIsOpen
          : classes.ResIsClosed;
        address1 = res.location.display_address[0];
        address2 = res.location.display_address[1];
        address3 = res.location.display_address[2];
        phone = res.display_phone;
      } else {
        imgSrc = createGooglePlacePhotoQuery(
          res.photos[0].photo_reference,
          res.photos[0].width
        );
        name = res.name;
        price = convertPrice(res.price_level);
        rating = res.rating;
        open = res.opening_hours.open_now ? 'Open' : 'Closed';
        resOpenClasses = res.opening_hours.open_now
          ? classes.ResIsOpen
          : classes.ResIsClosed;
        address1 = res.vicinity;
        address2 = null;
        address3 = null;
        phone = '';
      }

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
            <img src={imgSrc} alt="restaurant" />
          </div>
          <div className={classes.Info}>
            <div className={classes.Details}>
              <div className={classes.RO}>
                <h5>{name}</h5>
                <p className={resOpenClasses}>{open}</p>
              </div>
              <div className={classes.PR}>
                <p>{price}</p>
                <p>{rating}</p>
              </div>
              <p>{address1}</p>
              <p>{address2}</p>
              <p>{address3}</p>
              <p>{phone}</p>
            </div>
            <div className={classes.Popular}>
              <h6>What's Good?</h6>
              <ul>
                <li>
                  <p>Item</p>
                  <div className={classes.Vote}>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_up_alt</div>
                    </Button>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_down_alt</div>
                    </Button>
                  </div>
                </li>
                <li>
                  <p>Item</p>
                  <div className={classes.Vote}>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_up_alt</div>
                    </Button>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_down_alt</div>
                    </Button>
                  </div>
                </li>
                <li>
                  <p>Item</p>
                  <div className={classes.Vote}>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_up_alt</div>
                    </Button>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_down_alt</div>
                    </Button>
                  </div>
                </li>
                <li>
                  <p>Item</p>
                  <div className={classes.Vote}>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_up_alt</div>
                    </Button>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_down_alt</div>
                    </Button>
                  </div>
                </li>
                <li>
                  <p>Item</p>
                  <div className={classes.Vote}>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_up_alt</div>
                    </Button>
                    <Button clear>
                      <div className={MAT_ICONS}>thumb_down_alt</div>
                    </Button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>
      );
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
