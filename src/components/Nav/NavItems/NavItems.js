import React from 'react'

import classes from './NavItems.css'
import NavItem from './NavItem/NavItem'
import Aux from '../../../hoc/Auxiliary/Auxiliary';

const navItems = (props) => {
    const persisentListItems = (
        <li>
            <NavItem
                click={props.closeSideDrawer}
                link='/about'>About</NavItem>
        </li>
    )
    let dynamicListItems = (
        <Aux>
            <li>
                <NavItem
                    click={props.closeSideDrawer}
                    link='/auth/signup'>Sign Up</NavItem>
            </li>
            <li>
                <NavItem
                    click={props.closeSideDrawer}
                    link='/auth/login'>Log In</NavItem>
            </li>
        </Aux>
    )
    if (props.isAuth) {
        dynamicListItems = (
            <Aux>
                <li>
                    <NavItem
                        click={props.closeSideDrawer}
                        link='/user'>Profile</NavItem>
                </li>
                <li>
                    <NavItem
                        click={props.closeSideDrawer}
                        link='/logout'>Log Out</NavItem>
                </li>
            </Aux>
        )
    }
    return (
        <ul className={classes.NavItems}>
            {persisentListItems}
            {dynamicListItems}
        </ul>
    )
}

export default navItems
