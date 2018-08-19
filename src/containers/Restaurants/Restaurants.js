import React, { Component } from 'react'
import axios from '../../axios'
import { connect } from 'react-redux'

import classes from './Restaurants.css'
import * as actions from '../../store/actions/restaurantsActions'
import Restaurant from '../../components/Restaurant/Restaurant'
import SideDrawerToggle from '../../components/Navigation/SideDrawer/SideDrawerToggle/SideDrawerToggle'

const mapStateToProps = (state) => {
    return {
        food: state.food,
        location: state.location,
        restaurants: state.restaurants,
        loading: state.loading,
        error: state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFoodChange: (payload) => dispatch(actions.foodChange(payload)),
        onLocationChange: (payload) => dispatch(actions.locationChange(payload)),
        onSearchStart: (payload) => dispatch(actions.searchStart(payload)),
        onSearchEnd: (payload) => dispatch(actions.searchEnd(payload)),
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

    searchHandler = () => {
        this.props.onSearchStart({ loading: true })

        const query = `/businesses/search?term=${this.props.food}&location=${this.props.location}`
        axios.get(query)
            .then(response => {
                this.props.onSearchEnd({
                    restaurants: response.data.businesses,
                    loading: false,
                    error: false
                })
            })
            .catch(error => {
                this.props.onSearchEnd({
                    restaurants: null,
                    loading: false,
                    error: true
                })
            })
    }

    render() {
        let callToAction = <p className={classes.CTA}>Let's Eat!</p>
        let restaurantsGrid = null
        
        if (this.props.restaurants && !this.props.loading && !this.props.error) {
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
            callToAction = null
        }

        if (this.props.loading) {
            callToAction = (
                <p className={classes.CTA}>
                    Getting {this.props.food ? this.props.food : 'food'} in {this.props.location} for you...
                </p>
            )
        }

        if (this.props.error) {
            callToAction = (
                <div className={classes.CTA}>
                    <p>:(</p>
                    <p>There was an error.</p>
                    <p>Please try again later!</p>
                </div>
            )
        }

        let goButton = null
        if (this.props.location) {
            goButton = <button type='text' className={classes.SearchButton} onClick={this.searchHandler}>Go</button>
        }

        return (
            <div className={classes.Restaurants}>
                {callToAction}
                {restaurantsGrid}
                <div className={classes.SearchBar}>
                    <div className={classes.SideDrawerToggleContainer}>
                        <SideDrawerToggle toggleSideDrawer={this.toggleFiltersHandler} showSideDrawer={this.state.showFilters} />
                    </div>
                    <input 
                        type='text'
                        placeholder='Food'
                        value={this.props.food}
                        onChange={(event) => this.props.onFoodChange({food: event.target.value})}/>
                    <input
                        type='text'
                        placeholder='Location'
                        value={this.props.location}
                        onChange={(event) => this.props.onLocationChange({location: event.target.value})}/>
                    {goButton}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants)
