import React, { Component } from 'react'

import Auxiliary from '../Auxiliary/Auxiliary'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'

// @Layout holds the different pages or views of the app and will keep either a 
// persistent toolbar or sidedrawer for user navigation.
class Layout extends Component {
    state = {
        showSideDrawer: false,
    }

    sideDrawerToggleHandler = () => {
        this.setState(prevState => {
            return { showSideDrawer: !prevState.showSideDrawer }
        })
    }

    render() {
        return (
            <Auxiliary>
                <Toolbar toggleSideDrawer={this.sideDrawerToggleHandler} />
                <main>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

export default Layout