import React from 'react'

import classes from './Toolbar.css'
import DrawerToggle from '../Drawer/DrawerToggle/DrawerToggle'
import NavItems from '../NavItems/NavItems';
import NavItem from '../NavItems/NavItem/NavItem';

const toolbar = (props) => {
    return (
        <div className={classes.Toolbar}>
            <nav>
                <NavItems isAuth={props.isAuth} />
            </nav>
        </div>
    )
}

export default toolbar
