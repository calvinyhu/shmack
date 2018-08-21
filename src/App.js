import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Layout from './hoc/Layout/Layout'
import Restaurants from './containers/Restaurants/Restaurants'
import Auth from './containers/Auth/Auth'
import About from './containers/About/About'

class App extends Component {
    render() {
        let routes = (
            <Switch>
                <Route exact path='/about' component={About} />
                <Route exact path='/auth/signup' component={Auth} />
                <Route exact path='/auth/login' component={Auth} />
                <Route exact path='/' component={Restaurants} />
                <Redirect to='/' />
            </Switch>
        )

        return (
            <Layout>
                {routes}
            </Layout>
        )
    }
}

export default App
