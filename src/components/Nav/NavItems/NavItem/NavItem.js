import React from 'react'
import { NavLink } from 'react-router-dom'

import classes from './NavItem.css'

const navItem = (props) => {
    let classNames = classes.NavItem

    if (props.logo)
        classNames = [classNames, classes.Logo].join(' ')
    if (props.placeholderLink)
        classNames = [classNames, classes.PlaceholderLink].join(' ')

    return (
        <NavLink
            className={classNames}
            activeClassName='active'
            to={props.link}
            onClick={props.click}>{props.children}
        </NavLink>
    )
}

export default navItem
