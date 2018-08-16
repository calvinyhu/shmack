import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'

const navigationItems = (props) => (
    <ul className={classes.NavigationItems}>
        <NavigationItem className={classes.NavigationItemDefault} name='Login'/>
        <NavigationItem className={classes.NavigationItemDefault} name='About'/>
    </ul>
)

export default navigationItems
