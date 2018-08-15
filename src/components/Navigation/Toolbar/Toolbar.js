import React from 'react'

import classes from './Toolbar.css'
import NavigationItems from '../NavigationItems/NavigationItems';

const toolbar = () => {
    return (
        <header className={classes.Toolbar}>
            <p><strong>3FINITY</strong></p>
            <nav>
                <NavigationItems />
            </nav>
        </header>
    )
}

export default toolbar
