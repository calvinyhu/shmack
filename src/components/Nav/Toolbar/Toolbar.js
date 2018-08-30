import React from 'react'

import classes from './Toolbar.css'
import DrawerToggle from '../Drawer/DrawerToggle/DrawerToggle'
import NavItems from '../NavItems/NavItems';
import NavItem from '../NavItems/NavItem/NavItem';

const toolbar = (props) => {
    return (
        <header className={classes.Toolbar}>
            <NavItem
                logo
                link='/'
                click={props.closeDrawer}>shmack</NavItem>
            <div className={classes.DrawerToggleContainer}>
                <DrawerToggle toggleDrawer={props.toggleDrawer} showDrawer={props.showDrawer} />
            </div>
            <nav>
                <NavItems isAuth={props.isAuth} />
            </nav>
        </header>
    )
}

export default toolbar
