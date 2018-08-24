import React from 'react'

import classes from './NavigationItems.css'
import NavigationItem from './NavigationItem/NavigationItem'
import Auxiliary from '../../../hoc/Auxiliary/Auxiliary';

const navigationItems = (props) => {
    let dynamicNavItems = (
        <Auxiliary>
            <NavigationItem 
                clicked={props.closeSideDrawer}
                link='/auth/signup'>Sign Up</NavigationItem>
            <NavigationItem
                clicked={props.closeSideDrawer}
                link='/auth/login'>Log In</NavigationItem>
        </Auxiliary>
    )

    if (props.isAuth) {
        dynamicNavItems = (
            <Auxiliary>
                <NavigationItem
                    clicked={props.closeSideDrawer}
                    link='/user'>Profile</NavigationItem>
                <NavigationItem
                    clicked={props.closeSideDrawer}
                    link='/logout'>Log Out</NavigationItem>
            </Auxiliary>
        )
    }

    return (
        <ul className={classes.NavigationItems}>
            <NavigationItem
                clicked={props.closeSideDrawer}
                link='/about'>About</NavigationItem>
            {dynamicNavItems}
        </ul>
    )
}

export default navigationItems
