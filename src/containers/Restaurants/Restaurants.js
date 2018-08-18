import React, { Component } from 'react'

import classes from './Restaurants.css'

class Restaurants extends Component {
    state = {
        restaurants: {
            count: 50
        }
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
                <div className={classes.Search}>
                    <input type='text' placeholder='Search' />
                    <input type='text' placeholder='Location' />
                </div>
            </div>
        )
    }
}

export default Restaurants
