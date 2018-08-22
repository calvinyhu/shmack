import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from './store/actions/authActions'
import Layout from './hoc/Layout/Layout'
import About from './containers/About/About'
import Auth from './containers/Auth/Auth'
import LogOut from './containers/Auth/LogOut/LogOut'
import Restaurants from './containers/Restaurants/Restaurants'

const mapStateToProps = (state) => {
    return {
        isAuth: state.authReducer.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuthTryAutoLogIn: () => dispatch(actions.authTryAutoLogIn())
    }
}

class App extends Component {
    componentDidMount() {
        this.props.onAuthTryAutoLogIn()
    }

    render() {
        let routes = null

        if (this.props.isAuth) {
            routes = (
                <Switch>
                    <Route exact path='/about' component={About} />
                    <Route exact path='/logout' component={LogOut} />
                    <Route exact path='/' component={Restaurants} />
                    <Redirect to='/' />
                </Switch>
            )
        } else {
            routes = (
                <Switch>
                    <Route exact path='/about' component={About} />
                    <Route exact path='/auth/signup' component={Auth} />
                    <Route exact path='/auth/login' component={Auth} />
                    <Route exact path='/' component={Restaurants} />
                    <Redirect to='/' />
                </Switch>
            )
        }

        return (
            <Layout>
                {routes}
            </Layout>
        )
    }
}

// Need @withRouter to wrap App if connecting App to store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
