import React from 'react'

import classes from './SideDrawer.css'
import SideDrawerToggle from './SideDrawerToggle/SideDrawerToggle'
import NavigationItems from '../NavigationItems/NavigationItems'

const sideDrawer = (props) => {
    return (
        <div className={classes.SideDrawer}>
            <SideDrawerToggle toggleSideDrawer={props.toggleSideDrawer} />
            {/* <Backdrop /> */}
            <nav>
                <NavigationItems />
            </nav>
        </div>
    )
}

export default sideDrawer