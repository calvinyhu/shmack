import React from 'react'
import { NavLink } from 'react-router-dom'

import classes from './NavigationItem.css'

const navigationItem = (props) => {
    return (
        <li id={props.id} className={classes.NavigationItem}>
            <NavLink to={props.link} onClick={props.clicked}>{props.children}</NavLink>
        </li>
    )
}

export default navigationItem
