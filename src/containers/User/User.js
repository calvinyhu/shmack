import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './User.module.scss';
import { auth } from '../../utilities/firebase';
import * as authActions from '../../store/actions/authActions';
import * as userActions from '../../store/actions/userActions';
import Profile from '../../components/Profile/Profile';
import ProfileEditor from '../../components/ProfileEditor/ProfileEditor';
import profile_placeholder from '../../assets/images/profile_placeholder.jpeg';

const mapStateToProps = state => ({
  firstName: state.user.firstName,
  lastName: state.user.lastName
});

const mapDispatchToProps = {
  onPostUserInfo: userActions.postUserInfo,
  onVerifyEmail: authActions.verifyEmail
};

class User extends Component {
  static propTypes = {
    onPostUserInfo: PropTypes.func.isRequired,
    onVerifyEmail: PropTypes.func.isRequired
  };

  state = {
    isEditingProfile: false,
    isSaving: false,
    isEmailVerified: auth.currentUser ? auth.currentUser.emailVerified : false,
    profile: {
      photoURL:
        auth.currentUser && auth.currentUser.photoURL
          ? auth.currentUser.photoURL
          : profile_placeholder,
      displayName: auth.currentUser ? auth.currentUser.displayName : '',
      email: auth.currentUser ? auth.currentUser.email : '',
      firstName: this.props.firstName,
      lastName: this.props.lastName
    }
  };

  prevProfile = {
    photoURL:
      auth.currentUser && auth.currentUser.photoURL
        ? auth.currentUser.photoURL
        : profile_placeholder,
    displayName: auth.currentUser ? auth.currentUser.displayName : '',
    email: auth.currentUser ? auth.currentUser.email : '',
    firstName: this.props.firstName,
    lastName: this.props.lastName
  };

  handleToggleEditProfile = () => {
    this.setState(prevState => {
      return { isEditingProfile: !prevState.isEditingProfile };
    });
  };

  handleInputChange = event => {
    const profile = { ...this.state.profile };
    profile[event.target.name] = event.target.value;
    this.setState({ profile });
  };

  handleSave = () => {
    if (!auth.currentUser) {
      this.handleCancel();
      return;
    }

    this.setState({ isSaving: true });

    const newInfo = {
      firstName: this.state.profile.firstName,
      lastName: this.state.profile.lastName
    };
    this.props.onPostUserInfo(newInfo);

    const newProfile = {
      displayName:
        this.state.profile.firstName + ' ' + this.state.profile.lastName
    };
    auth.currentUser
      .updateProfile(newProfile)
      .then(_ => {
        const profile = { ...this.state.profile };
        profile.displayName = auth.currentUser.displayName;
        this.setState({ isSaving: false, profile });
        this.prevProfile = profile;
        this.handleToggleEditProfile();
      })
      .catch(_ => {
        this.setState({ isSaving: false });
        this.handleCancel();
      });
  };

  handleCancel = () => {
    this.setState({ ...this.state, profile: this.prevProfile });
    this.handleToggleEditProfile();
  };

  render() {
    const profile = (
      <Profile
        isEmailVerified={this.state.isEmailVerified}
        photoURL={this.state.profile.photoURL}
        displayName={this.state.profile.displayName}
        email={this.state.profile.email}
        handleToggleEditProfile={this.handleToggleEditProfile}
        onVerifyEmail={this.props.onVerifyEmail}
      />
    );

    const profileEditor = (
      <ProfileEditor
        isEditingProfile={this.state.isEditingProfile}
        isSaving={this.state.isSaving}
        firstName={this.state.profile.firstName}
        lastName={this.state.profile.lastName}
        email={this.state.profile.email}
        handleInputChange={this.handleInputChange}
        handleSave={this.handleSave}
        handleCancel={this.handleCancel}
      />
    );

    return (
      <div className={styles.User}>
        {profile}
        {profileEditor}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
