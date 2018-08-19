import React, { Component } from 'react'
import axios from '../../axios'

import classes from './Restaurants.css'
import Restaurant from '../../components/Restaurant/Restaurant'

class Restaurants extends Component {
    state = {
        food: '',
        location: '',
        restaurants: null
    }

    foodChangeHandler = (event) => {
        this.setState({ food: event.target.value })
    }

    locationChangeHandler = (event) => {
        this.setState({ location: event.target.value })
    }

    searchHandler = () => {
        const query = `/businesses/search?term=${this.state.food}&location=${this.state.location}`

        axios.get(query)
            .then(response => {
                this.setState({
                    restaurants: response.data.businesses
                })
            })
            .catch(error => {
                console.log('LOGGING ERROR...\n', error)
            })
    }

    render() {
        let callToAction = <p className={classes.CTA}>Let's Eat!</p>

        let restaurantsGrid = null
        if (this.state.restaurants) {
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
