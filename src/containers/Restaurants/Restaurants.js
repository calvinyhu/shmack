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
import Fab from '../../components/UI/Fab/Fab';
import Modal from '../../components/UI/Modal/Modal';
import Card from '../../components/UI/Card/Card';

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
    shouldRedirect: false,
    isSelectingYourPlaces: false,
    isRequestingGeoLocation: false,
    isYourPlacesModalOpen: false,
    isCardOpen: false,
    isCardTurned: false,
    isMultiSelectActive: false,
    isScrollingDown: false,
    touchStartTimeStamp: null,
    selectedIds: {},
    timer: null,
    card: null,
    cardSrc: null,
    prevScrollTop: 0
  };

  componentDidMount() {
    if (this.props.yourPlaces) {
      this.setState({ selectedIds: this.props.yourPlaces });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.yourPlaces) {
      this.setState({ selectedIds: nextProps.yourPlaces });
    }
  }

  inputChangeHandler = event => {
    this.props.onRestaurantInputChange(event.target.name, event.target.value);
  };

  turnCardHandler = () =>
    this.setState(prevState => {
      return { isCardTurned: !prevState.isCardTurned };
    });

  closeModalHandler = () =>
    this.setState({
      isRequestingGeoLocation: false,
      isYourPlacesModalOpen: false,
      isCardOpen: false,
      isCardTurned: false
    });

  shouldRedirectHandler = () => this.setState({ shouldRedirect: true });

  touchStartHandler = (id, src) => {
    const timer = setTimeout(() => this.multiSelectStart(id, src), 400);
    this.setState({ timer: timer });
  };
  touchEndHandler = () => {
    if (this.state.timer) {
      clearTimeout(this.state.timer);
      this.setState({ timer: null });
    }
  };

  restaurantClicked = (res, src, id) => {
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

  searchHandler = event => {
    event.preventDefault();
    if (this.props.location) {
      console.log('[ Restaurants ] Using typed in location');
      this.props.onRestaurantSearch(this.props.food, this.props.location);
    } else if (this.props.hasGeoLocatePermission) {
      console.log('[ Restaurants ] Using current location');
      this.props.onRestaurantSearch(this.props.food, this.props.location);
    } else this.setState({ isRequestingGeoLocation: true });
  };

  multiSelectStart = (res, id) => {
    const selectedIds = { ...this.state.selectedIds };
    selectedIds[id] = selectedIds[id] ? null : res;
    this.setState({
      isMultiSelectActive: true,
      selectedIds: selectedIds
    });
  };
  multiSelectEnd = () => {
    this.setState({
      isMultiSelectActive: false,
      selectedIds: { ...this.props.yourPlaces }
    });
  };
  addToYourPlacesHandler = () => {
    if (Object.keys(this.state.selectedIds).length >= 0) {
      this.props.onPostYourPlaces(this.state.selectedIds);
      this.setState({
        isSelectingYourPlaces: false,
        isMultiSelectActive: false,
        selectedIds: {}
      });
    }
  };

  scrollHandler = event => {
    this.setState({
      isScrollingDown: event.target.scrollTop > this.state.prevScrollTop,
      prevScrollTop: event.target.scrollTop
    });
  };

  displayRestaurants = () => {
    const restaurants = [];
    const resNames = {};
    if (this.props.yelpRestaurants) {
      this.props.yelpRestaurants.forEach(res => {
        if (res.image_url && !resNames[res.name]) {
          restaurants.push(
            <Restaurant
              touchStart={() => this.touchStartHandler(res, res.id)}
              touchMove={this.touchEndHandler}
              touchEnd={this.touchEndHandler}
              isSelected={
                this.state.isMultiSelectActive && this.state.selectedIds[res.id]
              }
              id={res.id}
              click={() => this.restaurantClicked(res, SOURCE.YELP, res.id)}
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
              touchStart={() => this.touchStartHandler(res, res.place_id)}
              touchMove={this.touchEndHandler}
              touchEnd={this.touchEndHandler}
              isSelected={
                this.state.isMultiSelectActive &&
                this.state.selectedIds[res.place_id]
              }
              id={res.place_id}
              click={() =>
                this.restaurantClicked(res, SOURCE.GOOGLE, res.place_id)
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
    let redirect = null;
    if (this.state.shouldRedirect) redirect = <Redirect to={paths.SETTINGS} />;

    let geoLocReqModal = (
      <Modal
        isOpen={this.state.isRequestingGeoLocation}
        click={this.shouldRedirectHandler}
        close={this.closeModalHandler}
        btnMsg={'Take me there'}
      >
        To use current location, please allow location sharing in app settings.
      </Modal>
    );

    let yourPlacesModal = (
      <Modal
        isOpen={this.state.isYourPlacesModalOpen}
        click={this.closeModalHandler}
        close={this.closeModalHandler}
        btnMsg={'Okay!'}
      >
        Please select places you have been to.
      </Modal>
    );

    let card = (
      <Card
        restaurant
        click={this.turnCardHandler}
        close={this.closeModalHandler}
        cardSrc={this.state.cardSrc}
        isTurned={this.state.isCardTurned}
        isOpen={this.state.isCardOpen}
      >
        {this.state.card}
      </Card>
    );

    let doneButton = (
      <Fab
        isOpen={this.state.isSelectingYourPlaces}
        click={this.addToYourPlacesHandler}
      >
        done
      </Fab>
    );

    let cancelButton = (
      <Fab
        isOpen={
          this.state.isMultiSelectActive && !this.state.isSelectingYourPlaces
        }
        click={this.multiSelectEnd}
      >
        close
      </Fab>
    );

    let addToYourPlacesFab = (
      <Fab
        mini
        action
        secondaryColor
        isOpen={
          this.state.isMultiSelectActive &&
          !this.state.isSelectingYourPlaces &&
          this.props.isAuth
        }
        click={this.addToYourPlacesHandler}
      >
        add_location
      </Fab>
    );

    let searchBarClasses = classes.SearchBar;
    if (this.state.isMultiSelectActive || this.state.isScrollingDown)
      searchBarClasses += ' ' + classes.HideSearchBar;
    let searchBar = (
      <div className={searchBarClasses}>
        <form onSubmit={this.searchHandler}>
          <div>
            <Input
              wide
              center
              accented
              type="text"
              name="food"
              placeholder="Food"
              value={this.props.food}
              change={this.inputChangeHandler}
            />
            <Input
              wide
              center
              accented
              type="text"
              name="location"
              placeholder="Current Location"
              value={this.props.location}
              change={this.inputChangeHandler}
            />
          </div>
          <Button thin>Go</Button>
        </form>
      </div>
    );

    let callToAction = null;
    let restaurantsGrid = null;
    if (this.props.yelpRestaurants || this.props.googleRestaurants) {
      restaurantsGrid = (
        <div className={classes.RestaurantsGrid} onScroll={this.scrollHandler}>
          {this.displayRestaurants()}
        </div>
      );
    } else if (this.props.isYelpLoading || this.props.isGoogleLoading) {
      callToAction = (
        <p className={classes.CTA}>
          Getting
          {this.props.food ? ` ${this.props.food}` : ' food '}
          {this.props.location
            ? ` in ${this.props.location} `
            : ' at your current location '}
          for you...
        </p>
      );
      searchBar = null;
    } else if (this.props.yelpError || this.props.googleError) {
      callToAction = (
        <div className={classes.CTA}>
          {handleYelpError(this.props.yelpError.data.error.code)}
        </div>
      );
    } else callToAction = <p className={classes.CTA}>Shmackin!</p>;

    return (
      <div className={classes.Restaurants}>
        {redirect}
        {callToAction}
        {card}
        {restaurantsGrid}
        {addToYourPlacesFab}
        {cancelButton}
        {doneButton}
        {searchBar}
        {yourPlacesModal}
        {geoLocReqModal}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Restaurants);
