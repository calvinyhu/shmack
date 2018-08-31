import React from 'react'

import classes from './Restaurant.css'

const restaurant = (props) => {
    let classNames = classes.Restaurant
    if (props.isSelected)
        classNames = [classNames, classes.Selected].join(' ')

    return (
        <div
            className={classNames}
            onClick={() => props.click(props.id)}
            onTouchStart={() => props.touchStart(props.id)}
            onTouchMove={props.touchEnd}
            onTouchEnd={props.touchEnd} >
            <div className={classes.RestaurantImgContainer}>
                <img src={props.img} alt='Restaurant'/>
            </div>
            <div className={classes.RestaurantInfo}>{props.children}</div>
        </div>
    )
}

export default restaurant
