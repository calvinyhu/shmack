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
import Backdrop from '../../components/UI/Backdrop/Backdrop'
import Card from '../../components/UI/Card/Card'

export const SOURCE = {
    YELP: 1,
    GOOGLE: 2
}

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
        onRestaurantInputChange: (name, value) => dispatch(actions.restaurantInputChange(name, value)),
        onRestaurantSearch: (food, location) => dispatch(actions.restaurantSearch(food, location)),
    }
}

class Restaurants extends Component {
    state = {
        showFilters: false,
        showCard: false,
        card: null,
        cardSrc: null
    }

    toggleFiltersHandler = () => {
        this.setState(prevState => {
            return { showFilters: !prevState.showFilters }
        })
    }

    inputChangeHandler = (event) => {
        this.props.onRestaurantInputChange(
            event.target.name,
            event.target.value
        )
    }

    searchHandler = (event) => {
        event.preventDefault()
        this.props.onRestaurantSearch(this.props.food, this.props.location)
    }

    restaurantClicked = (res, src) => {
        console.log(res)
        this.setState({
            showCard: true,
            card: res,
            cardSrc: src
        })
    }

    closeCard = () => this.setState({ showCard: false })

    displayRestaurants = () => {
        const restaurants = []
        const resNames = {}
        if (this.props.yelpRestaurants) {
            this.props.yelpRestaurants.forEach(res => {
                if (res.image_url && (!resNames[res.name])) {
                    restaurants.push(
                        <Restaurant
                            click={() => this.restaurantClicked(res, SOURCE.YELP)}
                            key={res.id}
                            img={res.image_url}>{res.name}</Restaurant>
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
                            click={() => this.restaurantClicked(res, SOURCE.GOOGLE)}
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
        let backdrop = (
            <Backdrop restaurant
                click={this.closeCard}
                isOpen={this.state.showCard}></Backdrop>
        )
        let card = (
            <Card restaurant
                cardSrc={this.state.cardSrc}
                isOpen={this.state.showCard}>{this.state.card}</Card>
        )

        const goButton = this.props.location ? <Button>Go</Button> : null

        let searchBar = (
            <div className={classes.SearchBar}>
                <div className={classes.DrawerToggleContainer}>
                    <DrawerToggle
                        toggleDrawer={this.toggleFiltersHandler}
                        showDrawer={this.state.showFilters} />
                </div>
                <form onSubmit={this.searchHandler}>
                    <Input wide center
                        type='text'
                        name='food'
                        placeholder='Food'
                        value={this.props.food}
                        change={this.inputChangeHandler} />
                    <Input wide center
                        type='text'
                        name='location'
                        placeholder='Location'
                        value={this.props.location}
                        change={this.inputChangeHandler} />
                    {goButton}
                </form>
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
                {card}
                {backdrop}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants)
