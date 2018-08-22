import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Restaurants.css'
import * as actions from '../../store/actions/restaurantsActions'
import { handleYelpError } from '../../utilities/yelp'
import SideDrawerToggle from '../../components/Navigation/SideDrawer/SideDrawerToggle/SideDrawerToggle'
import Restaurant from '../../components/Restaurant/Restaurant'

const mapStateToProps = (state) => {
    return {
        food: state.restaurantsReducer.food,
        location: state.restaurantsReducer.location,
        restaurants: state.restaurantsReducer.restaurants,
        loading: state.restaurantsReducer.loading,
        error: state.restaurantsReducer.error
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

    render() {
        let callToAction = null
        let restaurantsGrid = null

        let goButton = null
        if (this.props.location) {
            goButton = <button type='text' className={classes.SearchButton} onClick={this.searchHandler}>Go</button>
        }
        let searchBar = (
            <div className={classes.SearchBar}>
                <div className={classes.SideDrawerToggleContainer}>
                    <SideDrawerToggle toggleSideDrawer={this.toggleFiltersHandler} showSideDrawer={this.state.showFilters} />
                </div>
                <input
                    type='text'
                    placeholder='Food'
                    value={this.props.food}
                    onChange={this.foodChangeHandler} />
                <input
                    type='text'
                    placeholder='Location'
                    value={this.props.location}
                    onChange={this.locationChangeHandler} />
                {goButton}
            </div>
        )

        if (this.props.loading) {
            callToAction = (
                <p className={classes.CTA}>
                    Getting {this.props.food ? this.props.food : 'food'} in {this.props.location} for you...
                </p>
            )
            searchBar = null
        } else if (this.props.error) {
            callToAction = (
                <div className={classes.CTA}>
                    {handleYelpError(this.props.error.data.error.code)}
                </div>
            )
        } else if (this.props.restaurants) {
            let restaurants = []
            this.props.restaurants.forEach(restaurant => {
                if (restaurant.image_url) {
                    restaurants.push(
                        <Restaurant key={restaurant.id} img={restaurant.image_url}>{restaurant.name}</Restaurant>
                    );
                }
            })
            restaurantsGrid = (
                <div className={classes.RestaurantsGrid}>
                    {restaurants}
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
