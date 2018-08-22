import React from 'react'

import classes from './SideDrawer.css'
import NavigationItems from '../NavigationItems/NavigationItems'

const sideDrawer = (props) => {
    let sideDrawerClasses = ''
    let drawer = null

    if (props.isOpen) {
        sideDrawerClasses = classes.SideDrawer
        drawer = (
            <div className={sideDrawerClasses}>
                <nav>
                    <NavigationItems closeSideDrawer={props.closeSelf} isAuth={props.isAuth}/>
                </nav>
            </div>
        )
    }

    return drawer
}

export default sideDrawer
