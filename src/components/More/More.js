import React from 'react'

import classes from './More.css'
import * as paths from '../../utilities/paths'
import NavItem from '../Nav/NavItems/NavItem/NavItem';
import User from '../../containers/User/User'

const more = (props) => {
    return (
        <div className={classes.More}>
            <User/>
            <ul>
                <li>
                    <NavItem placeholderLink
                        link={paths.ABOUT}>
                        About
                    </NavItem>
                </li>
                <li>
                    <NavItem placeholderLink
                        link={paths.LOGOUT}>
                        Log Out
                    </NavItem>
                </li>
            </ul>
        </div>
    )
}

export default more
