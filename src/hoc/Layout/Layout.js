import React, { Component } from 'react'

import Auxiliary from '../Auxiliary/Auxiliary'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'

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

    sideDrawerCloseHandler = () => {
        this.setState({ showSideDrawer: false })
    }

    render() {
        return (
            <Auxiliary>
                <Toolbar 
                    toggleSideDrawer={this.sideDrawerToggleHandler} 
                    showSideDrawer={this.state.showSideDrawer}
                    closeSideDrawer={this.sideDrawerCloseHandler}/>
                <SideDrawer 
                    isOpen={this.state.showSideDrawer}
                    closeSelf={this.sideDrawerCloseHandler}/>
                <main>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

export default Layout
