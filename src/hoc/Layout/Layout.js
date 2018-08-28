import React, { Component } from 'react'

import Aux from '../Auxiliary/Auxiliary'
import Toolbar from '../../components/Nav/Toolbar/Toolbar'
import SideDrawer from '../../components/Nav/SideDrawer/SideDrawer'

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
        return (
            <Aux>
                <Toolbar
                    toggleSideDrawer={this.sideDrawerToggleHandler}
                    showSideDrawer={this.state.showSideDrawer}
                    closeSideDrawer={this.sideDrawerCloseHandler}
                    isAuth={this.props.isAuth}
                />
                <SideDrawer
                    isOpen={this.state.showSideDrawer}
                    closeSelf={this.sideDrawerCloseHandler}
                    isAuth={this.props.isAuth}
                />
                <main>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}

export default Layout
