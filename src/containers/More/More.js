import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './More.css'
import * as paths from '../../utilities/paths'
import NavItem from '../../components/Nav/NavItems/NavItem/NavItem';
import User from '../User/User'

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
    }
}

class More extends Component {
    render() {
        let links = null

        if (this.props.isAuth) {
            links = (
                <li>
                    <NavItem link wide tall
                        to={paths.LOGOUT}>
                        Log Out
                    </NavItem>
                </li>
            )
        }

        return (
            <div className={classes.More}>
                <div className={classes.User}>
                    <User />
                </div>
                <ul>
                    <li>
                        <NavItem link wide tall
                            to={paths.ABOUT}>
                            About
                        </NavItem>
                    </li>
                    {links}
                </ul>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(More)
