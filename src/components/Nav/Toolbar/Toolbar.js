import React from 'react'

import classes from './Toolbar.css'
import NavItems from '../NavItems/NavItems';

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
