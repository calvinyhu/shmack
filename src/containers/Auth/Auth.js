import React, { Component } from 'react'

import classes from './Auth.css'
import NavigationItem from '../../components/Navigation/NavigationItems/NavigationItem/NavigationItem'

class Auth extends Component {
    state = {
        signup: true,
        email: '',
        password: ''
    }

    emailChangeHandler = (event) => {
        this.setState({ email: event.target.value })
    }

    passwordChangeHandler = (event) => {
        this.setState({ password: event.target.value })
    }

    render() {
        return (
            <div className={classes.Auth}>
                <form onSubmit={this.submitHandler}>
                    <input
                        type='email'
                        placeholder='Email'
                        onChange={this.emailChangeHandler} />
                    <input
                        type='password'
                        placeholder='Password'
                        onChange={this.passwordChangeHandler} />
                    <button>Sign up</button>
                </form>
                <p>Already have a shmack account?</p>
                <NavigationItem id={classes.Login}link='/login'>Log in</NavigationItem>
            </div>
        )
    }
}

export default Auth
