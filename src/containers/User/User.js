import React, { Component } from 'react'

import classes from './User.css'
import { firestore } from '../../utilities/firebase'
import EditUser from './EditUser/EditUser'

class User extends Component {
    // state will initally show data from firebase from start as well
    state = {
        isEditing: false,
        firstName: 'Calvin',
        lastName: 'Hu',
        email: 'calvinhu9@gmail.com',
        location: 'San Francisco, CA'
    }

    toggleEditHandler = () => {
        this.setState(prevState => {
            return { isEditing: !prevState.isEditing }
        })
    }

    userInfoChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    postUserInfoHandler = (event) => {
        event.preventDefault()
        const users = 'users'
        const uid = 'rf3k5DHgszRLhoMGbgIrlkbPGad2'
        firestore.collection(users).doc(uid).set({
            firstName: 'Calvin',
            lastName: 'Hu'
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.error(error)
        });
    }

    render() {
        let user = null

        if (this.state.isEditing) {
            user = (
                <EditUser
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    email={this.state.email}
                    location={this.state.location}
                    changeHandler={this.userInfoChangeHandler}
                    submit={this.postUserInfoHandler}
                    cancel={this.toggleEditHandler} />
            )
        } else {
            // Content below will be displaying info from firebase not current state
            user = (
                <div className={classes.User}>
                    <div className={classes.PictureContainer}>
                        <img src={this.props.profilePicture} alt='Profile' />
                    </div>
                    <div className={classes.Name}>
                        {this.state.firstName} {this.state.lastName}
                    </div>
                    <div className={classes.Email}>
                        {this.state.email}
                    </div>
                    <div className={classes.Location}>
                        {this.state.location}
                    </div>
                    <button
                        className={classes.EditProfile}
                        onClick={this.toggleEditHandler}>Edit Profile</button>
                </div>
            )
        }

        return user
    }
}

export default User
