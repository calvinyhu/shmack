import React, { Component } from 'react'

import Layout from './hoc/Layout/Layout'
import Restaurants from './containers/Restaurants/Restaurants'

class App extends Component {
    render() {
        return (
            <Layout>
                <Restaurants />
            </Layout>
        )
    }
}

export default App
