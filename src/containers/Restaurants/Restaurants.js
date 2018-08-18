import React, { Component } from 'react'
import axios from 'axios'

import classes from './Restaurants.css'

class Restaurants extends Component {
    state = {
        food: '',
        location: '',
        restaurants: {
            count: 50
        }
    }

    foodChangeHandler = (event) => {
        this.setState({ food: event.target.value })
    }

    locationChangeHandler = (event) => {
        this.setState({ location: event.target.value })
    }

    searchHandler = (event) => {
        const cors = 'https://cors-anywhere.herokuapp.com/'
        const query = `https://api.yelp.com/v3/businesses/search?term=${this.state.food}&location=${this.state.location}`
        const apiKey = 'Xj6GzMkzzzCUC5j_494Gyv40BfT0xBzaGIxvPGwGkiiUp1qFYEyNEG9Xnfxr9t-v33TTWPn-kGypQy_ZAN1tScZk7jDUYKHLObbjDdR0TqtEHQqWAwUtlHTkzIB3W3Yx'
        const config = {
            headers: {
                Authorization: 'Bearer: ' + apiKey
            }
        }

        axios.get(cors + query, config)
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

        event.preventDefault();
    }

    render() {
        let restaurants = [];
        for (let i = 1; i <= this.state.restaurants.count; i = i + 1) {
            restaurants.push(
                <div key={i}className={classes.RestaurantsGridItem}>{i}</div>
            );
        }

        return (
            <div className={classes.Restaurants}>
                <div className={classes.RestaurantsGrid}>
                    {restaurants}
                </div>
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
