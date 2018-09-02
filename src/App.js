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
        const routes = [
            <Route exact path={paths.HOME} component={Home} key={paths.HOME} />,
            <Route exact path={paths.SEARCH} component={Restaurants} key={paths.SEARCH} />,
            <Route exact path={paths.ABOUT} component={About} key={paths.ABOUT} />
        ]

        if (this.props.isAuth) {
            routes.push(<Route exact path={paths.MORE} component={More} key={paths.MORE} />)
            routes.push(<Route exact path={paths.USER} component={User} key={paths.USER} />)
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
