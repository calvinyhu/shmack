import React from 'react'

import classes from './Toolbar.css'
import SideDrawerToggle from '../SideDrawer/SideDrawerToggle/SideDrawerToggle'
import NavItems from '../NavItems/NavItems';
import NavItem from '../NavItems/NavItem/NavItem';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <NavItem
                logo
                link='/'
                click={props.closeSideDrawer}>shmack</NavItem>
            <div className={classes.SideDrawerToggleContainer}>
                <SideDrawerToggle toggleSideDrawer={props.toggleSideDrawer} showSideDrawer={props.showSideDrawer} />
            </div>
            <nav>
                <NavItems isAuth={props.isAuth} />
            </nav>
        </header>
    )
}

export default toolbar
