import React, { Component } from 'react'
import { connect } from 'react-redux'

import classes from './User.css'
import * as actions from '../../store/actions/userActions'
import * as db from '../../utilities/database'
import { updateObject } from '../../utilities/utilities';
import EditUser from './EditUser/EditUser'
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Button from '../../components/UI/Button/Button';

const mapStateToProps = state => {
    return {
        userInfo: state.user.userInfo,
        submitSuccess: state.user.submitSuccess,
        loading: state.user.loading,
        error: state.user.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetUserInfo: () => dispatch(actions.getUserInfo()),
        onPostUserInfo: (info) => dispatch(actions.postUserInfo(info)),
        onCloseEditUser: () => dispatch(actions.closeEditUser())
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

    openEditHandler = () => {
        this.setState({ isEditing: true })
    }

    closeEditUserHandler = () => {
        this.setState({ isEditing: false })
        this.props.onCloseEditUser()
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
        const editUserInfoButton = (
            <Button
                placeholderLink
                click={this.openEditHandler}>Edit Profile</Button>
        )

        if (this.props.loading) {
            user = (
                <div className={classes.User}>
                    <p>Loading...</p>
                </div>
            )
            return user
        } 
        
        if (this.state.isEditing) {
            const submittedText = (
                this.props.submitSuccess ? <p>Saved!</p> : null
            )
            user = (
                <EditUser
                    values={this.state.userInfo}
                    change={this.userInfoChangeHandler}
                    submit={this.postUserInfoHandler}
                    back={this.closeEditUserHandler}>{submittedText}
                </EditUser>
            )
            return user
        }

        if (this.props.userInfo) {
            userInfo = (
                <Aux>
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
                </Aux>
            )
            user = (
                <div className={classes.User}>
                    {userInfo}
                    {editUserInfoButton}
                </div>
            )
            return user
        }

        return user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(User)
