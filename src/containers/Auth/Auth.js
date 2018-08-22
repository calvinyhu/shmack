import React, { Component } from 'react'

import classes from './Auth.css'
import NavigationItem from '../../components/Navigation/NavigationItems/NavigationItem/NavigationItem'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary'

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
        if (nextProps.location.pathname !== this.props.location.pathname || nextState.signup !== this.state.signup)
            return true
        return false
    }

    emailChangeHandler = (event) => {
        this.setState({ email: event.target.value })
    }

    passwordChangeHandler = (event) => {
        this.setState({ password: event.target.value })
    }

    formSubmitHandler = () => {

    }

    authChangeHandler = () => {
        this.setState(prevState => {
            return { signup: !prevState.signup }
        })
    }

    render() {
        let formSignUpInputs = null
        let formButtonName = 'Log In'
        let switchCTA = 'Not shmackin\' ?'
        let switchLink = '/auth/signup'
        let switchName = 'Sign Up'

        if (this.state.signup) {
            formSignUpInputs = (
                <Auxiliary>
                    <input
                        type='text'
                        placeholder='First Name'
                        onChange={this.firstNameChangeHandler} />
                    <input
                        type='text'
                        placeholder='Last Name'
                        onChange={this.lastNameChangeHandler} />
                </Auxiliary>
            )
            formButtonName = 'Sign Up'
            switchCTA = 'Already shmackin\' ?'
            switchLink = '/auth/login'
            switchName = 'Log In'
        }

        return (
            <div className={classes.Auth}>
                <form onSubmit={this.formSubmitHandler}>
                    {formSignUpInputs}
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
            </div>
        )
    }
}

export default Auth
