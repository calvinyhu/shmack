import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import classes from './Auth.css'
import * as actions from '../../store/actions/authActions'
import * as paths from '../../utilities/paths'
import NavItem from '../../components/Nav/NavItems/NavItem/NavItem'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        redirectPath: state.auth.redirectPath
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, signingUp) => dispatch(actions.authenticate(email, password, signingUp)),
    }
}

class Auth extends Component {
    state = {
        signingUp: this.props.location.pathname === paths.AUTH_SIGNUP,
        email: '',
        password: ''
    }

    componentWillReceiveProps(nextProps) {
        const nextPath = nextProps.location.pathname
        this.setState({ signingUp: nextPath === paths.AUTH_SIGNUP })
    }

    shouldComponentUpdate(nextProps, _) {
        const nextPath = nextProps.location.pathname
        return (
            nextPath !== this.props.location.pathname
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
        this.props.onAuth(this.state.email, this.state.password, this.state.signingUp)
    }

    authChangeHandler = () => {
        this.setState(prevState => {
            return { signingUp: !prevState.signingUp }
        })
    }

    render() {
        let authRedirect = null
        let loadingPrompt = null
        let form = null
        let formSwitch = null
        let errorMessage = null
        
        if (this.props.loading) {
            loadingPrompt = (
                <p className={classes.Message}>
                    {this.state.signingUp ? 'Signing Up...' : 'Logging In...'}
                </p>
            )
        } else if (this.props.error) {
            errorMessage = (
                <div className={classes.Message}>
                    {this.props.error.message}
                </div>
            )
        } else {
            let formButtonName = 'Log In'
            let switchCTA = 'Not shmackin\' ?'
            let switchLink = paths.AUTH_SIGNUP
            let switchName = 'Sign Up'
    
            if (this.state.signingUp) {
                formButtonName = 'Sign Up'
                switchCTA = 'Already shmackin\' ?'
                switchLink = paths.AUTH_LOGIN
                switchName = 'Log In'
            }

            form = (
                <form onSubmit={this.formSubmitHandler}>
                    <Input
                        wide
                        type='email'
                        placeholder='Email'
                        change={this.emailChangeHandler} />
                    <Input
                        wide
                        type='password'
                        placeholder='Password'
                        change={this.passwordChangeHandler} />
                    <Button wide>{formButtonName}</Button>
                </form>
            )

            formSwitch = (
                <div className={classes.Switch}>
                    <p>{switchCTA}</p>
                    <NavItem
                        placeholderLink
                        click={this.authChangeHandler}
                        link={switchLink}>{switchName}</NavItem>
                </div>
            )
        }

        if (this.props.redirectPath)
            authRedirect = <Redirect to={this.props.redirectPath} />

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {loadingPrompt}
                {form}
                {formSwitch}
                {errorMessage}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
