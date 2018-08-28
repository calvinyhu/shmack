import React, { Component } from 'react'

import './Layout.css'
import Aux from '../Auxiliary/Auxiliary'
import Toolbar from '../../components/Nav/Toolbar/Toolbar'
import Drawer from '../../components/Nav/Drawer/Drawer'
import NavItems from '../../components/Nav/NavItems/NavItems'

// @Layout holds the different pages or views of the app and will keep either a 
// persistent toolbar or sidedrawer for user Nav.
class Layout extends Component {
    state = {
        showSideDrawer: false,
    }

    sideDrawerToggleHandler = () => {
        this.setState(prevState => {
            return { showSideDrawer: !prevState.showSideDrawer }
        })
    }

    sideDrawerCloseHandler = () => {
        this.setState({ showSideDrawer: false })
    }

    render() {
        const nav = (
            <nav>
                <NavItems
                    wide
                    left
                    closeSideDrawer={this.sideDrawerCloseHandler}
                    isAuth={this.props.isAuth} />
            </nav>
        )
        return (
            <Aux>
                <Toolbar
                    toggleSideDrawer={this.sideDrawerToggleHandler}
                    showSideDrawer={this.state.showSideDrawer}
                    closeSideDrawer={this.sideDrawerCloseHandler}
                    isAuth={this.props.isAuth} />
                <Drawer
                    top
                    isOpen={this.state.showSideDrawer}>{nav}</Drawer>
                <main>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout
