import React from 'react'

import classes from './Backdrop.css'

const backdrop = (props) => {
    let classNames = classes.Backdrop

    if (props.isOpen) {
        if (props.layout)
            classNames = [classNames, classes.LayoutOpen].join(' ')
        if (props.restaurant)
            classNames = [classNames, classes.RestaurantOpen].join(' ')
    }

    return <div className={classNames} onClick={props.click}></div>
}

export default backdrop
