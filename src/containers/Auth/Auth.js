import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './Auth.css'
import * as actions from '../../store/actions/authActions'
import NavigationItem from '../../components/Navigation/NavigationItems/NavigationItem/NavigationItem'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

const mapStateToProps = (state) => {
    return {
        token: state.authReducer.token,
        userId: state.authReducer.userId,
        loading: state.authReducer.loading,
        error: state.authReducer.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, signup) => dispatch(actions.auth(email, password, signup))
    }
}

class Auth extends Component {
    state = {
        signup: this.props.location.pathname === '/auth/signup',
        email: '',
        password: ''
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname === '/auth/signup' && this.state.signup === false) {
            this.setState({
                signup: true
            })
        } else if (nextProps.location.pathname === '/auth/login' && this.state.signup === true) {
            this.setState({
                signup: false
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.location.pathname !== this.props.location.pathname 
            || nextState.signup !== this.state.signup 
            || nextProps.loading !== this.props.loading
        )
    }

    emailChangeHandler = (event) => {
        this.setState({ email: event.target.value })
    }

    passwordChangeHandler = (event) => {
        this.setState({ password: event.target.value })
    }

    formSubmitHandler = (event) => {
        event.preventDefault()
        this.props.onAuth(this.state.email, this.state.password, this.state.signup)
    }

    authChangeHandler = () => {
        this.setState(prevState => {
            return { signup: !prevState.signup }
        })
    }

    render() {
        let form = null
        let formButtonName = 'Log In'
        let switchCTA = 'Not shmackin\' ?'
        let switchLink = '/auth/signup'
        let switchName = 'Sign Up'

        if (this.state.signup) {
            formButtonName = 'Sign Up'
            switchCTA = 'Already shmackin\' ?'
            switchLink = '/auth/login'
            switchName = 'Log In'
        }

        form = (
            <Auxiliary>
                <form onSubmit={this.formSubmitHandler}>
                    <input
                        type='email'
                        placeholder='Email'
                        onChange={this.emailChangeHandler} />
                    <input
                        type='password'
                        placeholder='Password'
                        onChange={this.passwordChangeHandler} />
                    <button>{formButtonName}</button>
                </form>
                <div className={classes.Switch}>
                    <p>{switchCTA}</p>
                    <NavigationItem
                        id={classes.LogIn}
                        clicked={this.authChangeHandler}
                        link={switchLink}>{switchName}</NavigationItem>
                </div>
            </Auxiliary>
        )

        let loadingPrompt = null
        if (this.props.loading) {
            loadingPrompt = <p className={classes.LoadingPrompt}>{this.state.signup ? 'Signing Up...' : 'Logging In...'}</p>
            form = null
        }

        return (
            <div className={classes.Auth}>
                {loadingPrompt}
                {form}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
