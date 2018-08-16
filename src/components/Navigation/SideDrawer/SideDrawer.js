import React from 'react'

import classes from './SideDrawer.css'
import NavigationItems from '../NavigationItems/NavigationItems'

const sideDrawer = (props) => {
    let sideDrawer = null;
    if (props.isOpen) {
        sideDrawer = (
            <div className={classes.SideDrawer}>
                {/* <Backdrop /> */}
                <nav>
                    <NavigationItems />
                </nav>
            </div>
        )
    }

    return sideDrawer
}

export default sideDrawer