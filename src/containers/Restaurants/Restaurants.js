import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Restaurants.css'
import * as actions from '../../store/actions/restaurantsActions'
import { geoLocate } from '../../store/actions/appActions'
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
        hasGeoLocatePermission: state.app.hasGeoLocatePermission,
        geoLocation: state.app.geoLocation,
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
        onGeoLocate: () => dispatch(geoLocate())
    }
}

class Restaurants extends Component {
    state = {
        showFilters: false,
        showCard: false,
        turnCard: false,
        card: null,
        cardSrc: null,
        touchStartTimeStamp: null,
        multiSelect: false,
        selectedIds: {},
        timer: null,
        hasGeoLocatePermission: false
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
        if (this.props.location)
            this.props.onRestaurantSearch(this.props.food, this.props.location)
        else if (this.props.geoLocation)
            this.props.onRestaurantSearch(this.props.food, this.props.geoLocation)
        else
            this.props.onGeoLocate()
    }

    restaurantClicked = (res, src, id) => {
        if (this.state.multiSelect) {
            const selectedIds = { ...this.state.selectedIds }
            selectedIds[id] = !selectedIds[id]

            if (!selectedIds[id])
                delete selectedIds[id]
                
            if (Object.keys(selectedIds).length === 0) {
                this.setState({
                    multiSelect: false,
                    selectedIds: {}
                })
            } else
                this.setState({ selectedIds: selectedIds })
        } else {
            this.setState({
                showCard: true,
                card: res,
                cardSrc: src
            })
        }
    }

    closeCard = () => this.setState({ showCard: false, turnCard: false })
    turnCard = () => this.setState(prevState => {
        return { turnCard: !prevState.turnCard }
    })

    touchStartHandler = (id) => {
        const timer = setTimeout(
            () => this.multiSelectStartHandler(id),
            400
        )
        this.setState({ timer: timer })
    }
    touchEndHandler = () => {
        if (this.state.timer) {
            clearTimeout(this.state.timer)
            this.setState({ timer: null })
        }
    }

    multiSelectStartHandler = (id) => {
        const selectedIds = { ...this.state.selectedIds }
        selectedIds[id] = !selectedIds[id]
        this.setState({
            multiSelect: true,
            selectedIds: selectedIds
        })
    }
    multiSelectEndHandler = () => {
        this.setState({
            multiSelect: false,
            selectedIds: {}
        })
    }

    displayRestaurants = () => {
        const restaurants = []
        const resNames = {}
        if (this.props.yelpRestaurants) {
            this.props.yelpRestaurants.forEach(res => {
                if (res.image_url && (!resNames[res.name])) {
                    restaurants.push(
                        <Restaurant
                            touchStart={(id) => this.touchStartHandler(id)}
                            touchMove={this.touchEndHandler}
                            touchEnd={this.touchEndHandler}
                            isSelected={this.state.selectedIds[res.id]}
                            id={res.id}
                            click={(id) => this.restaurantClicked(res, SOURCE.YELP, id)}
                            key={res.id}
                            img={res.image_url}>{res.name}{res.rating}{res.review_count}</Restaurant>
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
                            touchStart={this.touchStartHandler}
                            touchMove={this.touchEndHandler}
                            touchEnd={this.touchEndHandler}
                            isSelected={this.state.selectedIds[res.id]}
                            id={res.id}
                            click={(id) => this.restaurantClicked(res, SOURCE.GOOGLE, id)}
                            key={res.id}
                            img={imgUrl}>{res.name}</Restaurant>
                    );
                    resNames[res.name] = 1
                }
            })
        }
        return restaurants
    }

    render() {
        let backdrop = (
            <Backdrop restaurant
                click={this.closeCard}
                isOpen={this.state.showCard}></Backdrop>
        )
        let card = (
            <Card restaurant
                click={this.turnCard}
                cardSrc={this.state.cardSrc}
                isTurned={this.state.turnCard}
                isOpen={this.state.showCard}>{this.state.card}</Card>
        )

        let cancelClasses = classes.CancelMultiSelect
        let searchBarClasses = classes.SearchBar
        if (this.state.multiSelect) {
            cancelClasses = [cancelClasses, classes.ShowCancelMultiSelect].join(' ')
            searchBarClasses = [searchBarClasses, classes.HideSearchBar].join(' ')
        }

        let cancelMultiSelectButton = (
            <div className={cancelClasses} onClick={this.multiSelectEndHandler}>
                <Button circle>
                    <i className='material-icons'>close</i>
                </Button>
            </div>
        )

        let searchBar = (
            <div className={searchBarClasses}>
                <div className={classes.DrawerToggleContainer}>
                    <DrawerToggle
                        toggleDrawer={this.toggleFiltersHandler}
                        showDrawer={this.state.showFilters} />
                </div>
                <form onSubmit={this.searchHandler}>
                    <Input wide center thin transparent
                        type='text'
                        name='food'
                        placeholder='Food'
                        value={this.props.food}
                        change={this.inputChangeHandler} />
                    <Input wide center transparent
                        type='text'
                        name='location'
                        placeholder='Current Location'
                        value={this.props.location}
                        change={this.inputChangeHandler} />
                    <Button thin>Go</Button>
                </form>
            </div>
        )

        let callToAction = null
        let restaurantsGrid = null
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
            callToAction = <p className={classes.CTA}>Shmackin!</p>

        return (
            <div className={classes.Restaurants}>
                {callToAction}
                {restaurantsGrid}
                {cancelMultiSelectButton}
                {searchBar}
                {card}
                {backdrop}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants)
