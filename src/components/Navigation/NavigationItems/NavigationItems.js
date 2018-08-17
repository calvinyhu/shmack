import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = () => (
    <ul className={classes.NavigationItems}>
        <NavigationItem link='/login'>Login</NavigationItem>
        <NavigationItem link='/about'>About</NavigationItem>
    </ul>
)

export default navigationItems
