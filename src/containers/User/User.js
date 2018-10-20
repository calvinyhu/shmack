import React, { Component } from 'react';
import { connect } from 'react-redux';

import styles from './User.module.scss';
import * as actions from '../../store/actions/userActions';
import { FIELDS } from '../../utilities/database';
import { updateObject } from '../../utilities/utilities';
import EditUser from './EditUser/EditUser';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Button from '../../components/UI/Button/Button';

const mapStateToProps = state => {
  return {
    isAuth: state.auth.isAuth,
    userInfo: state.user.userInfo,
    posting: state.user.posting,
    postSuccess: state.user.postSuccess,
    getting: state.user.getting,
    error: state.user.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onGetUserInfo: () => dispatch(actions.getUserInfo()),
    onPostUserInfo: info => dispatch(actions.postUserInfo(info)),
    onCloseEditUser: () => dispatch(actions.closeEditUser())
  };
};

class User extends Component {
  state = {
    isEditing: false,
    userInfo: null
  };

  componentDidMount() {
    if (this.props.userInfo) {
      this.setState({
        userInfo: this.props.userInfo
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextUserInfo = nextProps.userInfo;
    if (!nextUserInfo) return;

    const userInfo = {};
    Object.values(FIELDS).forEach(val => {
      userInfo[val] = nextUserInfo[val] ? nextUserInfo[val] : '';
    });

    if (!this.state.userInfo) {
      this.setState({ userInfo: userInfo });
      return;
    }

    Object.keys(userInfo).forEach(key => {
      if (userInfo[key] !== this.props.userInfo[key]) {
        this.setState({ userInfo: userInfo });
        return;
      }
    });
  }

  openEditHandler = () => {
    this.setState({ isEditing: true });
  };

  closeEditUserHandler = () => {
    this.setState({ isEditing: false });
    this.props.onCloseEditUser();
  };

  userInfoChangeHandler = event => {
    const updatedUserInfo = updateObject(this.state.userInfo, {
      [event.target.name]: event.target.value
    });
    this.setState({
      userInfo: updatedUserInfo
    });
  };

  postUserInfoHandler = event => {
    event.preventDefault();
    this.props.onPostUserInfo(this.state.userInfo);
  };

  render() {
    if (!this.props.isAuth) return null;

    let user = null;

    if (this.props.getting) {
      user = (
        <div className={styles.User}>
          <p>Loading...</p>
        </div>
      );
      return user;
    }

    if (this.state.isEditing) {
      let postStatus = null;
      if (this.props.posting) postStatus = <p>Saving!</p>;
      else if (this.props.postSuccess) postStatus = <p>Saved!</p>;

      user = (
        <EditUser
          values={this.state.userInfo}
          change={this.userInfoChangeHandler}
          submit={this.postUserInfoHandler}
          back={this.closeEditUserHandler}
        >
          {postStatus}
        </EditUser>
      );
      return user;
    }

    if (this.state.userInfo) {
      const userInfo = (
        <Aux>
          <div className={styles.PictureContainer}>
            <img
              src={this.props.userInfo[FIELDS.PROFILE_PICTURE]}
              alt="Profile"
            />
          </div>
          <div className={styles.Name}>
            {this.props.userInfo[FIELDS.FIRST_NAME]}{' '}
            {this.props.userInfo[FIELDS.LAST_NAME]}
          </div>
          <div className={styles.Email}>
            {this.props.userInfo[FIELDS.EMAIL]}
          </div>
          <div className={styles.Location}>
            {this.props.userInfo[FIELDS.LOCATION]}
          </div>
        </Aux>
      );
      const editUserInfoButton = (
        <Button link click={this.openEditHandler}>
          Edit Profile
        </Button>
      );
      user = (
        <div className={styles.User}>
          {userInfo}
          {editUserInfoButton}
        </div>
      );
      return user;
    }

    return user;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
