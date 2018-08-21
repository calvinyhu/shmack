import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem clicked={props.closeSideDrawer} link='/about'>About</NavigationItem>
        <NavigationItem clicked={props.closeSideDrawer} link='/auth/signup'>Sign Up</NavigationItem>
        <NavigationItem clicked={props.closeSideDrawer} link='/auth/login'>Log In</NavigationItem>
    </ul>
)

export default navigationItems
