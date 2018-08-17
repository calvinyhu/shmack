import React from 'react'

import classes from './Toolbar.css'
import SideDrawerToggle from '../SideDrawer/SideDrawerToggle/SideDrawerToggle'
import NavigationItems from '../NavigationItems/NavigationItems';
import NavigationItem from '../NavigationItems/NavigationItem/NavigationItem';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <NavigationItem id={classes.Logo} link='/'>3FINITY</NavigationItem>
            <div className={classes.ToolbarSearch} >
                <input type='text' placeholder='Search' />
                <input type='text' placeholder='Location' />
            </div>
            <SideDrawerToggle toggleSideDrawer={props.toggleSideDrawer} showSideDrawer={props.showSideDrawer} />
            <nav>
                <NavigationItems />
            </nav>
        </header>
    )
}

export default toolbar
