import React from 'react'

import classes from './More.css'
import * as paths from '../../utilities/paths'
import NavItem from '../Nav/NavItems/NavItem/NavItem';
import User from '../../containers/User/User'

const more = (props) => {
    return (
        <div className={classes.More}>
            <div className={classes.User}>
                <User/>
            </div>
            <ul>
                <li>
                    <NavItem link wide tall
                        to={paths.ABOUT}>
                        About
                    </NavItem>
                </li>
                <li>
                    <NavItem link wide tall
                        to={paths.LOGOUT}>
                        Log Out
                    </NavItem>
                </li>
            </ul>
        </div>
    )
}

export default more
