import React, { Component } from 'react'

import Auxiliary from '../Auxiliary/Auxiliary'

// @Layout holds the different pages or views of the app and will keep either a 
// persistent toolbar or sidedrawer for user navigation.
class Layout extends Component {
    render() {
        return (
            <Auxiliary>
                {/* Toolbar */}
                <main>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

export default Layout