import React, { Component } from 'react'

import './Layout.css'
import Aux from '../Auxiliary/Auxiliary'
import Toolbar from '../../components/Nav/Toolbar/Toolbar'
import Drawer from '../../components/Nav/Drawer/Drawer'
import NavItems from '../../components/Nav/NavItems/NavItems'
import Backdrop from '../../components/UI/Backdrop/Backdrop'

class Layout extends Component {
    state = {
        showDrawer: false,
    }

    drawerToggleHandler = () => {
        this.setState(prevState => {
            return { showDrawer: !prevState.showDrawer }
        })
    }

    drawerCloseHandler = () => {
        this.setState({ showDrawer: false })
    }

    render() {
        const nav = (
            <nav>
                <NavItems
                    wide
                    left
                    closeDrawer={this.drawerCloseHandler}
                    isAuth={this.props.isAuth} />
            </nav>
        )
        return (
            <Aux>
                <main>
                    {this.props.children}
                </main>
                <Toolbar
                    isAuth={this.props.isAuth} />
            </Aux>
        )
    }
}

export default Layout
