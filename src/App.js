import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from './store/actions/authActions'
import * as paths from './utilities/paths'
import Layout from './hoc/Layout/Layout'
import Home from './containers/Home/Home'
import User from './containers/User/User'
import About from './containers/About/About'
import Auth from './containers/Auth/Auth'
import LogOut from './containers/Auth/LogOut/LogOut'
import Restaurants from './containers/Restaurants/Restaurants'
import More from './components/More/More'

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
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
                    <Route exact path={paths.HOME} component={Home} />
                    <Route exact path={paths.SEARCH} component={Restaurants} />
                    <Route exact path={paths.MORE} component={More} />
                    <Route exact path={paths.USER} component={User} />
                    <Route exact path={paths.ABOUT} component={About} />
                    <Route exact path={paths.LOGOUT} component={LogOut} />
                    <Route path={paths.AUTH} component={Auth} />
                    <Redirect to={paths.HOME} />
                </Switch>
            )
        } else {
            routes = (
                <Switch>
                    <Route exact path={paths.HOME} component={Home} />
                    <Route exact path={paths.SEARCH} component={Restaurants} />
                    <Route exact path={paths.AUTH_SIGNUP} component={Auth} />
                    <Route exact path={paths.AUTH_LOGIN} component={Auth} />
                    <Route exact path={paths.ABOUT} component={About} />
                    <Redirect to={paths.HOME} />
                </Switch>
            )
        }
        return (
            <Layout isAuth={this.props.isAuth}>
                {routes}
            </Layout>
        )
    }
}

// Need @withRouter to wrap App if connecting App to store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
