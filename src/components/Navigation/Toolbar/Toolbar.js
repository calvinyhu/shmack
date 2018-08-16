import React from 'react'

import classes from './Toolbar.css'
import SideDrawer from '../SideDrawer/SideDrawer'
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <SideDrawer toggleSideDrawer={props.toggleSideDrawer} />
            <p><strong>3FINITY</strong></p>
            <nav>
                <NavigationItems />
            </nav>
        </header>
    )
}

export default toolbar
