import React from 'react'

import classes from './Toolbar.css'
import SideDrawerToggle from '../SideDrawer/SideDrawerToggle/SideDrawerToggle'
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <p><strong>3FINITY</strong></p>
            <SideDrawerToggle toggleSideDrawer={props.toggleSideDrawer} />
            <nav>
                <NavigationItems />
            </nav>
        </header>
    )
}

export default toolbar
