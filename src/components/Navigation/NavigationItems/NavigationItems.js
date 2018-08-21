import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem closeSideDrawer={props.closeSideDrawer} link='/login'>Login</NavigationItem>
        <NavigationItem closeSideDrawer={props.closeSideDrawer} link='/about'>About</NavigationItem>
    </ul>
)

export default navigationItems
