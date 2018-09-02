import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import classes from './Auth.css'
import * as actions from '../../store/actions/authActions'
import * as paths from '../../utilities/paths'
import NavItem from '../../components/Nav/NavItems/NavItem/NavItem'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Aux from '../../hoc/Auxiliary/Auxiliary';

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        redirectPath: state.auth.redirectPath
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (userInfo, signingUp) => dispatch(actions.authenticate(userInfo, signingUp)),
    }
}

class Auth extends Component {
    state = {
        signingUp: this.props.location.pathname === paths.AUTH_SIGNUP,
        firstName: '',
        lastName: '',
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

    inputChangeHandler = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    formSubmitHandler = (event) => {
        event.preventDefault()
        const userInfo = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
        }
        this.props.onAuth(userInfo, this.state.signingUp)
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
            let signingUpInputs = null
            let formButtonName = 'Log In'
            let switchCTA = 'Not shmackin\' ?'
            let switchLink = paths.AUTH_SIGNUP
            let switchName = 'Sign Up'

            if (this.state.signingUp) {
                signingUpInputs = (
                    <Aux>
                        <Input
                            wide
                            type='text'
                            name='firstName'
                            placeholder='First Name'
                            change={this.inputChangeHandler} />
                        <Input
                            wide
                            type='text'
                            name='lastName'
                            placeholder='Last Name'
                            change={this.inputChangeHandler} />
                    </Aux>
                )
                formButtonName = 'Sign Up'
                switchCTA = 'Already shmackin\' ?'
                switchLink = paths.AUTH_LOGIN
                switchName = 'Log In'
            }

            form = (
                <form onSubmit={this.formSubmitHandler}>
                    {signingUpInputs}
                    <Input
                        wide
                        type='email'
                        name='email'
                        placeholder='Email'
                        change={this.inputChangeHandler} />
                    <Input
                        wide
                        type='password'
                        name='password'
                        placeholder='Password'
                        change={this.inputChangeHandler} />
                    <Button wide>{formButtonName}</Button>
                </form>
            )

            formSwitch = (
                <div className={classes.Switch}>
                    <p>{switchCTA}</p>
                    <NavItem
                        link
                        click={this.authChangeHandler}
                        to={switchLink}>{switchName}</NavItem>
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
