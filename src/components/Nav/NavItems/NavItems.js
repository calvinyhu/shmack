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
