import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from './store/actions/authActions'
import * as paths from './utilities/paths'
import Layout from './hoc/Layout/Layout'
import User from './containers/User/User'
import About from './containers/About/About'
import Auth from './containers/Auth/Auth'
import LogOut from './containers/Auth/LogOut/LogOut'
import Restaurants from './containers/Restaurants/Restaurants'

const mapStateToProps = (state) => {
    return {
        isAuth: state.authReducer.token !== ''
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
                    <Route exact path={paths.USER} component={User} />
                    <Route exact path={paths.ABOUT} component={About} />
                    <Route exact path={paths.LOGOUT} component={LogOut} />
                    <Route exact path={paths.ROOT} component={Restaurants} />
                    <Route path={paths.AUTH} component={Auth} />
                    <Redirect to={paths.ROOT} />
                </Switch>
            )
        } else {
            routes = (
                <Switch>
                    <Route exact path={paths.ABOUT} component={About} />
                    <Route exact path={paths.AUTH_SIGNUP} component={Auth} />
                    <Route exact path={paths.AUTH_LOGIN} component={Auth} />
                    <Route exact path={paths.ROOT} component={Restaurants} />
                    <Redirect to={paths.ROOT} />
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
