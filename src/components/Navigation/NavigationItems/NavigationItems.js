import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        {/* <NavigationItem name="Profile"/> */}
        <NavigationItem name="Login"/>
    </ul>
)

export default navigationItems
