import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Home.css';
import { createGooglePlacePhotoQuery } from '../../utilities/google';
import Restaurant from '../../components/Restaurant/Restaurant';
import { SOURCE } from '../Restaurants/Restaurants';
import Card from '../../components/UI/Card/Card';
import { checkGeoLocatePermission } from '../../store/actions/appActions';
import {
  getYourCuisines,
  getDefaultCuisines
} from '../../store/actions/homeActions';

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    isGettingYourPlaces: state.home.getting,
    isGettingYourCuisines: state.home.gettingCuisines,
    yourPlaces: state.home.yourPlaces,
    yourCuisineCategories: state.home.yourCuisineCategories,
    yourCuisines: state.home.yourCuisines,
    hasGeoLocatePermission: state.app.hasGeoLocatePermission
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheckGeoLocatePermission: () => dispatch(checkGeoLocatePermission()),
    onGetYourCuisines: () => dispatch(getYourCuisines()),
    onGetDefaultCuisines: () => dispatch(getDefaultCuisines())
  };
};

class Home extends Component {
  state = {
    isAtTop: true,
    isCardOpen: false,
    isCardTurned: false,
    card: null,
    cardSrc: null,
    yourPlaces: null,
    yourCuisines: null,
    img: null
  };

  componentDidMount() {
    if (!this.props.yourCuisines) {
      if (this.props.hasGeoLocatePermission) {
        if (this.props.isAuth) this.props.onGetYourCuisines();
        else this.props.onGetDefaultCuisines();
      }
    }

    this.setState({
      yourPlaces: this.displayYourPlaces(this.props.yourPlaces),
      yourCuisines: this.displayYourCuisines(
        this.props.yourCuisineCategories,
        this.props.yourCuisines
      )
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      yourPlaces: this.displayYourPlaces(nextProps.yourPlaces),
      yourCuisines: this.displayYourCuisines(
        nextProps.yourCuisineCategories,
        nextProps.yourCuisines
      )
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.yourPlaces &&
      this.props.yourPlaces &&
      nextProps.yourPlaces.length !== this.props.yourPlaces.length
    )
      return true;
    else if (nextProps.isGettingYourPlaces !== this.props.isGettingYourPlaces)
      return true;
    else if (
      nextProps.isGettingYourCuisines !== this.props.isGettingYourCuisines
    )
      return true;
    else if (nextState !== this.state) {
      if (
        nextState.yourPlaces !== this.state.yourPlaces ||
        nextState.yourCuisines !== this.state.yourCuisines ||
        nextState.isAtTop !== this.state.isAtTop ||
        nextState.isCardOpen !== this.state.isCardOpen ||
        nextState.isCardTurned !== this.state.isCardTurned
      )
        return true;
      else return false;
    } else return false;
  }

  mainScrollHandler = event => {
    const targetId = event.target.id;
    const scrollTop = event.target.scrollTop;

    if (targetId === 'main') {
      this.setState({
        isAtTop: scrollTop === 0
      });
    }
  };

  restaurantClicked = (data, src) => {
    this.setState({
      isCardOpen: true,
      card: data,
      cardSrc: src
    });
  };

  turnCardHandler = () =>
    this.setState(prevState => {
      return { isCardTurned: !prevState.isCardTurned };
    });

  closeModalHandler = () =>
    this.setState({
      isCardOpen: false,
      isCardTurned: false
    });

  displayYourPlaces = yourPlaces => {
    if (!yourPlaces) return null;

    const places = [];
    for (let placeId in yourPlaces) {
      let place = yourPlaces[placeId];
      if (!place) continue;
      let id = place.id;
      let src = SOURCE.YELP;
      let imgUrl = place.image_url;
      let name = place.name;
      let rating = place.rating;

      if (place.place_id) {
        id = place.place_id;
        src = SOURCE.GOOGLE;
        if (place.photos) {
          imgUrl = createGooglePlacePhotoQuery(
            place.photos[0].photo_reference,
            place.photos[0].width
          );
        }
        name = place.name;
        rating = place.rating;
      }

      places.push(
        <div key={id} className={classes.Item}>
          <Restaurant
            id={id}
            click={() => this.restaurantClicked(place, src)}
            img={imgUrl}
          >
            {name}
            {rating}
          </Restaurant>
        </div>
      );
    }
    return places;
  };

  displayYourCuisines = (yourCuisineCategories, yourCuisines) => {
    if (!yourCuisines) return null;

    const cuisines = [];
    const cuisineRestaurants = {};

    yourCuisines.forEach((cuisine, index) => {
      const restaurants = cuisine.data.businesses;
      const category = Object.keys(yourCuisineCategories)[index];
      cuisineRestaurants[category] = [];
      restaurants.forEach(res => {
        cuisineRestaurants[category].push(
          <div key={res.id} className={classes.Item}>
            <Restaurant
              touchStart={this.touchStart}
              touchMove={this.touchMove}
              touchEnd={this.touchEnd}
              click={() => this.restaurantClicked(res, SOURCE.YELP)}
              img={res.image_url}
            >
              {res.name}
            </Restaurant>
          </div>
        );
      });
    });

    Object.keys(cuisineRestaurants).forEach((cuisine, index) => {
      cuisines.push(
        <section key={index}>
          <div className={classes.Category}>{cuisine}</div>
          <div className={classes.List}>{cuisineRestaurants[cuisine]}</div>
        </section>
      );
    });

    return cuisines;
  };

  render() {
    let headerClasses = classes.Header;
    if (this.state.isAtTop) headerClasses += ' ' + classes.AtTop;

    let yourPlaces = null;
    if (this.props.isGettingYourPlaces)
      yourPlaces = <p>Getting your places...</p>;
    else if (
      this.state.yourPlaces &&
      Object.keys(this.state.yourPlaces).length > 0
    )
      yourPlaces = <div className={classes.List}>{this.state.yourPlaces}</div>;
    else if (this.props.isAuth) yourPlaces = <p>You don't have any places!</p>;
    else yourPlaces = <p>Login to get your places.</p>;

    let yourCuisines = null;
    if (this.props.isGettingYourCuisines)
      yourCuisines = <p>Getting cuisines near you...</p>;
    else if (this.state.yourCuisines) yourCuisines = this.state.yourCuisines;
    else
      yourCuisines = <p>Turn on location sharing to get cuisines near you.</p>;

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

    return (
      <div className={classes.Home}>
        <header className={headerClasses}>shmack</header>
        <main id="main" onScroll={this.mainScrollHandler}>
          <p className={classes.Separator}>Your Places</p>
          <div className={classes.Content}>{yourPlaces}</div>
          <p className={classes.Separator}>Near You</p>
          <div className={classes.Content}>{yourCuisines}</div>
        </main>
        {card}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
