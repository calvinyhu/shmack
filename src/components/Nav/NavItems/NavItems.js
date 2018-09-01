import React from 'react'

import classes from './NavItems.css'
import * as paths from '../../../utilities/paths'
import NavItem from './NavItem/NavItem'
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const navItems = (props) => {
    const persisentListItems = (
        <Aux>
            <li>
                <NavItem link='/home'>
                    <Aux>
                        <i className="material-icons">home</i>
                        <div>Home</div>
                    </Aux>
                </NavItem>
            </li>
            <li>
                <NavItem link='/search'>
                    <Aux>
                        <i className="material-icons">search</i>
                        <div>Search</div>
                    </Aux>
                </NavItem>
            </li>
        </Aux>
    )
    let dynamicListItems = (
        <Aux>
            <li>
                <NavItem link={paths.AUTH_SIGNUP}>
                    <Aux>
                        <i className="material-icons">create</i>
                        <div>Sign Up</div>
                    </Aux>
                </NavItem>
            </li>
        </Aux>
    )
    if (props.isAuth) {
        dynamicListItems = (
            <Aux>
                <li>
                    <NavItem link={paths.MORE}>
                        <Aux>
                            <i className="material-icons">menu</i>
                            <div>More</div>
                        </Aux>
                    </NavItem>
                </li>
            </Aux>
        )
    }

    let classNames = classes.NavItems
    if (props.left)
        classNames = [classNames, classes.Left].join(' ')
    if (props.right)
        classNames = [classNames, classes.Right].join(' ')
    if (props.center)
        classNames = [classNames, classes.Center].join(' ')
    if (props.wide)
        classNames = [classNames, classes.Wide].join(' ')

    return (
        <ul className={classNames}>
            {persisentListItems}
            {dynamicListItems}
        </ul>
    )
}

export default navItems
