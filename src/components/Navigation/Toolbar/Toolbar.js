import React from 'react'

import classes from './Toolbar.css'
import SideDrawerToggle from '../SideDrawer/SideDrawerToggle/SideDrawerToggle'
import NavigationItems from '../NavigationItems/NavigationItems';
import NavigationItem from '../NavigationItems/NavigationItem/NavigationItem';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <NavigationItem 
                id={classes.Logo}
                clicked={props.closeSideDrawer}
                link='/'>shmack</NavigationItem>
            <div className={classes.SideDrawerToggleContainer}>
                <SideDrawerToggle toggleSideDrawer={props.toggleSideDrawer} showSideDrawer={props.showSideDrawer} />
            </div>
            <nav>
                <NavigationItems />
            </nav>
        </header>
    )
}

export default toolbar
