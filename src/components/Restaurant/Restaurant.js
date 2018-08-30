import React from 'react'

import classes from './Restaurant.css'

const restaurant = (props) => {
    return (
        <div className={classes.Restaurant} onClick={props.click}>
            <div className={classes.RestaurantImgContainer}>
                <img src={props.img} alt='Restaurant'/>
            </div>
            <div className={classes.RestaurantInfo}>{props.children}</div>
        </div>
    )
}

export default restaurant
