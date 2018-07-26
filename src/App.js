import React, { Component } from 'react'

import './App.css'
import Layout from './hoc/Layout/Layout'
import Restaurants from './containers/Restaurants/Restaurants'

class App extends Component {
    render() {
        return (
            <div className="App">
                <Layout>
                    <Restaurants />
                </Layout>
      		</div>
        )
    }
}

export default App
