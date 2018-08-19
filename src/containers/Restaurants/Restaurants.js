import React, { Component } from 'react'
import axios from '../../axios'
import { connect } from 'react-redux'

import classes from './Restaurants.css'
import Restaurant from '../../components/Restaurant/Restaurant'
import * as actions from '../../store/actions/restaurantsActions'

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
            callToAction = <p className={classes.CTA}>Getting {this.props.food} in {this.props.location} for you...</p>
        }

        if (this.props.error) {
            callToAction = (
                <div className={classes.CTA}>
                    <p>:(</p>
                    <p>We can't access Yelp.</p>
                    <p>Please try again later!</p>
                </div>
            )
        }

        return (
            <div className={classes.Restaurants}>
                {callToAction}
                {restaurantsGrid}
                <div className={classes.SearchBar}>
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
                    <button type='text' className={classes.SearchButton} onClick={this.searchHandler}>Go</button>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Restaurants)
