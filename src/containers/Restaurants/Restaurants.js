import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Restaurants.css'
import * as actions from '../../store/actions/restaurantsActions'
import { handleYelpError } from '../../utilities/yelp'
import { createGooglePlacePhotoQuery } from '../../utilities/google'
import DrawerToggle from '../../components/Nav/Drawer/DrawerToggle/DrawerToggle'
import Restaurant from '../../components/Restaurant/Restaurant'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'

const mapStateToProps = (state) => {
    return {
        food: state.restaurants.food,
        location: state.restaurants.location,
        yelpRestaurants: state.restaurants.yelpRestaurants,
        yelpLoading: state.restaurants.yelpLoading,
        yelpError: state.restaurants.yelpError,
        googleRestaurants: state.restaurants.googleRestaurants,
        googleLoading: state.restaurants.googleLoading,
        googleError: state.restaurants.googleError
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRestaurantFoodChange: (food) => dispatch(actions.restaurantFoodChange(food)),
        onRestaurantLocationChange: (location) => dispatch(actions.restaurantLocationChange(location)),
        onRestaurantSearch: (food, location) => dispatch(actions.restaurantSearch(food, location)),
    }
}

class Restaurants extends Component {
    state = {
        showFilters: false
    }

    toggleFiltersHandler = () => {
        this.setState(prevState => {
            return { showFilters: !prevState.showFilters }
        })
    }

    foodChangeHandler = (event) => this.props.onRestaurantFoodChange(event.target.value)
    locationChangeHandler = (event) => this.props.onRestaurantLocationChange(event.target.value)
    searchHandler = () => this.props.onRestaurantSearch(this.props.food, this.props.location)

    displayRestaurants = () => {
        const restaurants = []
        const resNames = {}
        if (this.props.yelpRestaurants) {
            this.props.yelpRestaurants.forEach(res => {
                if (res.image_url && (!resNames[res.name])) {
                    restaurants.push(
                        <Restaurant
                            key={res.id}
                            img={res.image_url}>{res.name}
                        </Restaurant>
                    );
                    resNames[res.name] = 1
                }
            })
        }
        if (this.props.googleRestaurants) {
            this.props.googleRestaurants.forEach(res => {
                if (res.photos && !resNames[res.name]) {
                    const photo = res.photos[0]
                    const imgUrl = createGooglePlacePhotoQuery(photo.photo_reference, photo.width)
                    restaurants.push(
                        <Restaurant
                            key={res.id}
                            img={imgUrl}>{res.name}</Restaurant>
                    );
                }
            })
        }
        return restaurants
    }

    render() {
        let callToAction = null
        let restaurantsGrid = null

        let goButton = null
        if (this.props.location) {
            goButton = <Button click={this.searchHandler}>Go</Button>
        }
        let searchBar = (
            <div className={classes.SearchBar}>
                <div className={classes.SideDrawerToggleContainer}>
                    <DrawerToggle
                        toggleSideDrawer={this.toggleFiltersHandler}
                        showSideDrawer={this.state.showFilters} />
                </div>
                <Input
                    wide
                    center
                    type='text'
                    placeholder='Food'
                    value={this.props.food}
                    change={this.foodChangeHandler} />
                <Input
                    wide
                    center
                    type='text'
                    placeholder='Location'
                    value={this.props.location}
                    change={this.locationChangeHandler} />
                {goButton}
            </div>
        )

        if (this.props.yelpRestaurants || this.props.googleRestaurants) {
            restaurantsGrid = (
                <div className={classes.RestaurantsGrid}>
                    {this.displayRestaurants()}
                </div>
            )
        } else if (this.props.yelpLoading || this.props.googleLoading) {
            callToAction = (
                <p className={classes.CTA}>
                    Getting {this.props.food ? this.props.food : 'food'} in {this.props.location} for you...
                </p>
            )
            searchBar = null
        } else if (this.props.yelpError || this.props.googleError) {
            callToAction = (
                <div className={classes.CTA}>
                    {handleYelpError(this.props.yelpError.data.error.code)}
                </div>
            )
        } else
            callToAction = <p className={classes.CTA}>Let's Eat!</p>

        return (
            <div className={classes.Restaurants}>
                {callToAction}
                {restaurantsGrid}
                {searchBar}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants)
