import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './User.css'
import * as actions from '../../store/actions/userActions'
import * as db from '../../utilities/database'
import { updateObject } from '../../utilities/utilities';
import EditUser from './EditUser/EditUser'
import Auxiliary from '../../hoc/Auxiliary/Auxiliary';

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        error: state.user.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetUserInfo: () => dispatch(actions.getUserInfo()),
        onPostUserInfo: (data) => dispatch(actions.postUserInfo(data))
    }
}

class User extends Component {
    state = {
        isEditing: false,
        userInfo: null
    }

    componentDidMount() {
        console.log('[ User ] componentDidMount')
        this.props.onGetUserInfo()
    }

    componentWillReceiveProps(nextProps) {
        console.log('[ User ] componentWillReceiveProps')
        const userInfo = nextProps.userInfo
        if (userInfo) {
            const fields = {
                [db.PROFILE_PICTURE]: userInfo[db.PROFILE_PICTURE] ? userInfo[db.PROFILE_PICTURE] : '',
                [db.FIRST_NAME]: userInfo[db.FIRST_NAME] ? userInfo[db.FIRST_NAME] : '',
                [db.LAST_NAME]: userInfo[db.LAST_NAME] ? userInfo[db.LAST_NAME] : '',
                [db.EMAIL]: userInfo[db.EMAIL] ? userInfo[db.EMAIL] : '',
                [db.LOCATION]: userInfo[db.LOCATION] ? userInfo[db.LOCATION] : ''
            }
            this.setState({
                userInfo: fields
            })
        }
    }

    componentDidUpdate() {
        console.log('[ User ] componentDidUpdate')
    }

    toggleEditHandler = () => {
        this.setState(prevState => {
            return { isEditing: !prevState.isEditing }
        })
    }

    userInfoChangeHandler = (event) => {
        const updatedUserInfo = updateObject(this.state.userInfo, {
            [event.target.name]: event.target.value
        })
        this.setState({
            userInfo: updatedUserInfo
        })
    }

    postUserInfoHandler = (event) => {
        event.preventDefault()
        this.props.onPostUserInfo(this.state.userInfo)
    }

    render() {
        let user = null
        let userInfo = null
        let editUserInfo = (
            <button
                className={classes.EditProfile}
                onClick={this.toggleEditHandler}>Edit Profile</button>
        )
        if (this.state.isEditing) {
            user = (
                <EditUser
                    values={this.state.userInfo}
                    change={this.userInfoChangeHandler}
                    submit={this.postUserInfoHandler}
                    cancel={this.toggleEditHandler} />
            )
            return user
        }
        if (this.props.userInfo) {
            userInfo = (
                <Auxiliary>
                    <div className={classes.PictureContainer}>
                        <img src={this.props.userInfo[db.PROFILE_PICTURE]} alt='Profile' />
                    </div>
                    <div className={classes.Name}>
                        {this.props.userInfo[db.FIRST_NAME]} {this.props.userInfo[db.LAST_NAME]}
                    </div>
                    <div className={classes.Email}>
                        {this.props.userInfo[db.EMAIL]}
                    </div>
                    <div className={classes.Location}>
                        {this.props.userInfo[db.LOCATION]}
                    </div>
                </Auxiliary>
            )
            user = (
                <div className={classes.User}>
                    {userInfo}
                    {editUserInfo}
                </div>
            )
            return user
        }

        user = (
            <div className={classes.User}>
                {editUserInfo}
            </div>
        )

        return user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User)
