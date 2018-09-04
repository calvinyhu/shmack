import React, { Component } from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from './store/actions/authActions'
import * as paths from './utilities/paths'
import { getYourPlaces } from './store/actions/homeActions'
import Layout from './hoc/Layout/Layout'
import Home from './containers/Home/Home'
import About from './components/About/About'
import Auth from './containers/Auth/Auth'
import LogOut from './containers/Auth/LogOut/LogOut'
import Restaurants from './containers/Restaurants/Restaurants'
import More from './containers/More/More'
import Settings from './components/Settings/Settings'
import { auth } from './utilities/firebase'

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuthTryAutoLogIn: () => dispatch(actions.authTryAutoLogIn()),
        onGetYourPlaces: () => dispatch(getYourPlaces())
    }
}

class App extends Component {
    componentDidMount() {
        this.props.onAuthTryAutoLogIn()

        auth.onAuthStateChanged(user => {
            if (user)
                this.props.onGetYourPlaces()
        })
    }

    render() {
        const routes = [
            <Route exact path={paths.HOME} component={Home} key={paths.HOME} />,
            <Route exact path={paths.SEARCH} component={Restaurants} key={paths.SEARCH} />,
            <Route exact path={paths.MORE} component={More} key={paths.MORE} />,
            <Route exact path={paths.ABOUT} component={About} key={paths.ABOUT} />,
            <Route exact path={paths.SETTINGS} component={Settings} key={paths.SETTINGS} />
        ]

        if (this.props.isAuth) {
            routes.push(<Route exact path={paths.LOGOUT} component={LogOut} key={paths.LOGOUT} />)
            routes.push(<Route path={paths.AUTH} component={Auth} key={paths.AUTH} />)
        } else {
            routes.push(<Route exact path={paths.AUTH_SIGNUP} component={Auth} key={paths.AUTH_SIGNUP} />)
            routes.push(<Route exact path={paths.AUTH_LOGIN} component={Auth} key={paths.AUTH_LOGIN} />)
        }

        routes.push(<Redirect to={paths.HOME} key={'Redirect'} />)

        return (
            <Layout isAuth={this.props.isAuth}>
                <Switch>{routes}</Switch>
            </Layout>
        )
    }
}

// Need @withRouter to wrap App if connecting App to store
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
