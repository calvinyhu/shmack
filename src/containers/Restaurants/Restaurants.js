import React, { Component } from 'react'
import axios from '../../axios'

import classes from './Restaurants.css'
import Restaurant from '../../components/Restaurant/Restaurant'

class Restaurants extends Component {
    state = {
        food: '',
        location: '',
        restaurants: null,
        loading: false,
        error: false
    }

    foodChangeHandler = (event) => {
        this.setState({ food: event.target.value })
    }

    locationChangeHandler = (event) => {
        this.setState({ location: event.target.value })
    }

    searchHandler = () => {
        const query = `/businesses/search?term=${this.state.food}&location=${this.state.location}`
        this.setState({ loading: true })

        axios.get(query)
            .then(response => {
                this.setState({
                    restaurants: response.data.businesses,
                    loading: false
                })
            })
            .catch(error => {
                this.setState({ 
                    error: true,
                    loading: false
                })
            })
    }

    render() {
        let callToAction = <p className={classes.CTA}>Let's Eat!</p>

        let restaurantsGrid = null
        if (this.state.restaurants && !this.state.loading && !this.state.error) {
            let restaurants = []
            this.state.restaurants.forEach(restaurant => {
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

        if (this.state.loading) {
            callToAction = <p className={classes.CTA}>Getting {this.state.food} in {this.state.location} for you...</p>
        }

        if (this.state.error) {
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
                    <input type='text' placeholder='Food' onChange={this.foodChangeHandler}/>
                    <input type='text' placeholder='Location' onChange={this.locationChangeHandler}/>
                    <button type='text' className={classes.SearchButton} onClick={this.searchHandler}>Go</button>
                </div>
            </div>
        )
    }
}

export default Restaurants
