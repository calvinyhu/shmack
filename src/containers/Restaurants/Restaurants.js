import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import classes from './Restaurants.css'
import * as actions from '../../store/actions/restaurantsActions'
import * as paths from '../../utilities/paths'
import { postYourPlaces } from '../../store/actions/homeActions'
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
        isAuth: state.auth.isAuth,
        hasGeoLocatePermission: state.app.hasGeoLocatePermission,
        yourPlaces: state.home.yourPlaces,
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
        onPostYourPlaces: (places) => dispatch(postYourPlaces(places))
    }
}

class Restaurants extends Component {
    state = {
        isSelectingYourPlaces: false,
        showFilters: false,
        showCard: false,
        turnCard: false,
        card: null,
        cardSrc: null,
        touchStartTimeStamp: null,
        multiSelect: false,
        selectedIds: {},
        timer: null,
        showGeoLocRequest: false,
        redirectToSettings: false,
        closeModal: false
    }

    componentDidMount() {
        if (this.props.isAuth && !this.props.yourPlaces) {
            this.props.onRestaurantSearch(this.props.food, this.props.location)
            this.setState({ isSelectingYourPlaces: true, multiSelect: true })
        }
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
        if (this.props.location) {
            console.log('[ Restaurants ] Using typed in location')
            this.props.onRestaurantSearch(this.props.food, this.props.location)
        }
        else if (this.props.hasGeoLocatePermission) {
            console.log('[ Restaurants ] Using current location')
            this.props.onRestaurantSearch(this.props.food, this.props.location)
        }
        else
            this.toggleGeoLocRequest()
    }

    toggleGeoLocRequest = () => {
        this.setState(prevState => {
            return { showGeoLocRequest: !prevState.showGeoLocRequest }
        })
    }

    redirectToSettings = () => {
        this.setState({ redirectToSettings: true })
    }

    restaurantClicked = (res, src, id) => {
        if (this.state.multiSelect) {
            const selectedIds = { ...this.state.selectedIds }
            selectedIds[id] = selectedIds[id] ? null : src

            if (!selectedIds[id])
                delete selectedIds[id]

            const selectedIdsLength = Object.keys(selectedIds).length
            if (selectedIdsLength === 0 && !this.state.isSelectingYourPlaces) {
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

    close = () => this.setState({
        showCard: false,
        turnCard: false,
        showGeoLocRequest: false
    })
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
    doneHandler = () => {
        if (Object.keys(this.state.selectedIds).length >= 0) {
            this.props.onPostYourPlaces(this.state.selectedIds)
            this.setState({
                isSelectingYourPlaces: false,
                multiSelect: false,
                selectedIds: {}
            })
        }
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

    closeModalHandler = () => {
        this.setState({ closeModal: true })
    }

    render() {
        let redirect = null
        if (this.state.redirectToSettings)
            redirect = <Redirect to={paths.SETTINGS} />

        let geoLocReqClasses = classes.GeoLocReq
        if (this.state.showGeoLocRequest)
            geoLocReqClasses = [geoLocReqClasses, classes.GeoLocReqOpen].join(' ')
        let geoLocReq = (
            <div className={geoLocReqClasses}>
                <div>
                    To use current location, please allow location sharing in app settings.
                </div>
                <div>
                    <Button wide
                        click={this.redirectToSettings}>Take me there
                    </Button>
                </div>
            </div>
        )

        let backdrop = (
            <Backdrop restaurant
                click={this.close}
                isOpen={this.state.showCard || this.state.showGeoLocRequest}></Backdrop>
        )
        let card = (
            <Card restaurant
                click={this.turnCard}
                cardSrc={this.state.cardSrc}
                isTurned={this.state.turnCard}
                isOpen={this.state.showCard}>{this.state.card}</Card>
        )

        let yourPlacesCTAClassnames = classes.YourPlacesCTA
        if (this.state.closeModal)
            yourPlacesCTAClassnames = [yourPlacesCTAClassnames, classes.CloseModal].join(' ')

        let yourPlacesCTA = null
        if (this.state.isSelectingYourPlaces) {
            yourPlacesCTA = (
                <div className={yourPlacesCTAClassnames}>
                    <p>
                        Please select places you have been to.
                    </p>
                    <Button wide click={this.closeModalHandler}>Okay!</Button>
                </div>
            )
        }
        
        let doneButtonClasses = classes.Done
        if (this.state.isSelectingYourPlaces)
            doneButtonClasses = [doneButtonClasses, classes.GeoLocReqOpen].join(' ')
        let doneButton = (
            <div className={doneButtonClasses} onClick={this.doneHandler}>
                <Button circle>
                    <div className='material-icons'>done</div>
                </Button>
            </div>
        )

        let cancelClasses = classes.CancelMultiSelect
        let searchBarClasses = classes.SearchBar
        if (this.state.multiSelect) {
            if (!this.state.isSelectingYourPlaces)
                cancelClasses = [cancelClasses, classes.ShowCancelMultiSelect].join(' ')
            searchBarClasses = [searchBarClasses, classes.HideSearchBar].join(' ')
        }

        let cancelMultiSelectButton = (
            <div className={cancelClasses} onClick={this.multiSelectEndHandler}>
                <Button circle>
                    <div className='material-icons'>close</div>
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
                    Getting
                    {this.props.food ? ` ${this.props.food}` : ' food '}
                    {this.props.location ? ` in ${this.props.location} ` : ' at your current location '}
                    for you...
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
                {redirect}
                {yourPlacesCTA}
                {callToAction}
                {restaurantsGrid}
                {cancelMultiSelectButton}
                {doneButton}
                {searchBar}
                {card}
                {backdrop}
                {geoLocReq}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants)
